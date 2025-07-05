// Unified API Service to Replace All N8N Webhooks
// This service provides direct Airtable API calls for all Order Management functions

class OrderManagementAPI {
    constructor(apiKey, baseId = 'appZdp18sltDYOs4s') {
        this.apiKey = apiKey;
        this.baseId = baseId;
        this.baseUrl = 'https://api.airtable.com/v0';
    }
    
    // Helper method to make API calls
    async makeRequest(table, options = {}) {
        const url = this.buildUrl(table, options);
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
        
        const response = await fetch(url, { 
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    buildUrl(table, options = {}) {
        const baseUrl = `${this.baseUrl}/${this.baseId}/${table}`;
        const params = new URLSearchParams();
        
        if (options.filterByFormula) {
            params.append('filterByFormula', options.filterByFormula);
        }
        if (options.fields) {
            options.fields.forEach(field => params.append('fields[]', field));
        }
        if (options.maxRecords) {
            params.append('maxRecords', options.maxRecords);
        }
        if (options.sort) {
            options.sort.forEach((sort, index) => {
                params.append(`sort[${index}][field]`, sort.field);
                params.append(`sort[${index}][direction]`, sort.direction);
            });
        }
        
        return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    }
    
    // 1. DASHBOARD STATS - Replace /webhook/dashboard-stats
    async getDashboardStats(facility = 'ALL') {
        try {
            const queries = {
                // Active Orders: No facility filter needed - orders don't have facility, production does
                activeOrders: "OR({Order Status} = 'New', {Order Status} = 'In Review', {Order Status} = 'On Hold', {Order Status} = 'Processing')",
                
                // In Production: Filter by facility only if not ALL
                inProduction: facility === 'ALL' 
                    ? "OR({Production Status} = 'Pending', {Production Status} = 'In Progress', {Production Status} = 'Printing', {Production Status} = 'Quality Check', {Production Status} = 'Cutting')"
                    : `AND(OR({Production Status} = 'Pending', {Production Status} = 'In Progress', {Production Status} = 'Printing', {Production Status} = 'Quality Check', {Production Status} = 'Cutting'), {Facility} = '${facility}')`,
                
                // Ready for Pickup: No facility filter needed - pickup is centralized at CHICO
                readyPickup: "AND({Fulfillment Option} = 'Will Call', {Pickup Confirmed} = BLANK())",
                
                // Queue Items: Filter by facility only if not ALL  
                queueItems: facility === 'ALL'
                    ? "OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'In Production', {Batch Status} = 'Printing')"
                    : `AND(OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'In Production', {Batch Status} = 'Printing'), {Facility} = '${facility}')`
            };

            const [activeOrders, inProduction, readyPickup, queueItems] = await Promise.all([
                this.makeRequest('Orders', { filterByFormula: queries.activeOrders, fields: ['Order ID'] }),
                this.makeRequest('Productions', { filterByFormula: queries.inProduction, fields: ['Production ID'] }),
                this.makeRequest('Orders', { filterByFormula: queries.readyPickup, fields: ['Order ID'] }),
                this.makeRequest('Batches', { filterByFormula: queries.queueItems, fields: ['Batch Name'] })
            ]);

            return {
                success: true,
                stats: {
                    activeOrders: activeOrders.records.length,
                    inProduction: inProduction.records.length,
                    readyPickup: readyPickup.records.length,
                    queueItems: queueItems.records.length,
                    lastUpdated: new Date().toISOString(),
                    facility: facility
                }
            };
        } catch (error) {
            console.error('Dashboard stats error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 2. PICKUP LIST - Replace /webhook/get-pickup-ready
    async getPickupReady(searchTerm, searchType = 'orderId') {
        try {
            let filterFormula;
            const baseFilter = "AND({Fulfillment Option} = 'Will Call', {Pickup Confirmed} = BLANK())";
            
            switch (searchType) {
                case 'orderId':
                    filterFormula = `AND(${baseFilter}, {Order ID} = '${searchTerm}')`;
                    break;
                case 'email':
                    filterFormula = `AND(${baseFilter}, {Email} = '${searchTerm}')`;
                    break;
                case 'phone':
                    filterFormula = `AND(${baseFilter}, {Phone} = '${searchTerm}')`;
                    break;
                default:
                    filterFormula = baseFilter;
            }
            
            const response = await this.makeRequest('Orders', {
                filterByFormula: filterFormula,
                fields: ['Order ID', 'Customer Name', 'Email', 'Phone', 'Order Date', 
                        'Item Count', 'Total $', 'Shipping Address', 'Order Status', 
                        'Production Status', 'Linked Order Items']
            });
            
            return {
                success: true,
                orders: response.records.map(record => ({
                    orderId: record.fields['Order ID'],
                    customerName: record.fields['Customer Name'],
                    customerEmail: record.fields['Email'],
                    customerPhone: record.fields['Phone'],
                    orderDate: record.fields['Order Date'],
                    itemCount: record.fields['Item Count'],
                    total: record.fields['Total $'],
                    address: record.fields['Shipping Address'],
                    status: record.fields['Order Status']
                }))
            };
        } catch (error) {
            console.error('Pickup ready error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 3. PICKUP CONFIRM - Replace /webhook/confirm-pickup
    async confirmPickup(orderId, signature, customerName, timestamp) {
        try {
            // First find the order record
            const orderResponse = await this.makeRequest('Orders', {
                filterByFormula: `{Order ID} = '${orderId}'`,
                fields: ['Order ID']
            });
            
            if (orderResponse.records.length === 0) {
                throw new Error('Order not found');
            }
            
            const recordId = orderResponse.records[0].id;
            
            // Update the order with pickup confirmation
            const updateResponse = await this.makeRequest(`Orders/${recordId}`, {
                method: 'PATCH',
                body: {
                    fields: {
                        'Pickup Confirmed': timestamp,
                        'Order Status': 'Picked Up'
                        // Note: Airtable doesn't directly support file uploads via API
                        // Signature would need to be stored via attachment field or external storage
                    }
                }
            });
            
            return {
                success: true,
                message: 'Pickup confirmed successfully',
                orderId: orderId
            };
        } catch (error) {
            console.error('Pickup confirm error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 4. ORDER STATUS - Replace /webhook/get-order-status
    async getOrderStatus(searchTerm, searchType = 'orderId') {
        try {
            let filterFormula;
            
            switch (searchType) {
                case 'orderId':
                    filterFormula = `{Order ID} = '${searchTerm}'`;
                    break;
                case 'email':
                    filterFormula = `{Email} = '${searchTerm}'`;
                    break;
                case 'phone':
                    filterFormula = `{Phone} = '${searchTerm}'`;
                    break;
                case 'production':
                    // Search in Productions table instead
                    return await this.getProductionStatus(searchTerm);
            }
            
            const response = await this.makeRequest('Orders', {
                filterByFormula: filterFormula,
                fields: ['Order ID', 'Customer Name', 'Email', 'Order Date', 'Order Status',
                        'Production Status', 'Estimated Completion', 'Stage Progress',
                        'Linked Production', 'Linked Order Items']
            });
            
            if (response.records.length === 0) {
                return { success: false, message: 'Order not found' };
            }
            
            const order = response.records[0].fields;
            
            return {
                success: true,
                order: {
                    orderId: order['Order ID'],
                    customerName: order['Customer Name'],
                    customerEmail: order['Email'],
                    orderDate: order['Order Date'],
                    status: order['Order Status'],
                    progress: order['Stage Progress'] || 0,
                    estimatedCompletion: order['Estimated Completion']
                }
            };
        } catch (error) {
            console.error('Order status error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 5. PRODUCTION VALIDATION - Replace /webhook/batch-facility-validation
    async validateProduction(productionId, facility) {
        try {
            const response = await this.makeRequest('Productions', {
                filterByFormula: `AND({Production ID} = '${productionId}', {Facility} = '${facility}')`,
                fields: ['Production ID', 'Facility']
            });
            
            return {
                valid: response.records.length > 0,
                message: response.records.length > 0 
                    ? `Production ${productionId} is assigned to ${facility}`
                    : `Production ${productionId} is not assigned to ${facility}`
            };
        } catch (error) {
            console.error('Production validation error:', error);
            return { valid: false, message: error.message };
        }
    }
    
    // 6. PRODUCTION SCAN - Replace /webhook/production-stage-scan
    async updateProductionStage(productionId, stage, action, facility, printer = null) {
        try {
            // First find the production record
            const productionResponse = await this.makeRequest('Productions', {
                filterByFormula: `{Production ID} = '${productionId}'`,
                fields: ['Production ID', 'Production Status']
            });
            
            if (productionResponse.records.length === 0) {
                throw new Error('Production record not found');
            }
            
            const recordId = productionResponse.records[0].id;
            const timestamp = new Date().toISOString();
            
            // Build update fields based on stage and action
            const updateFields = {
                'Production Status': this.getStatusForStage(stage, action),
                'Last Modified': timestamp
            };
            
            // Add stage-specific timestamp fields
            if (action === 'start') {
                updateFields[`${stage.charAt(0).toUpperCase() + stage.slice(1)} Started`] = timestamp;
            } else if (action === 'complete') {
                updateFields[`${stage.charAt(0).toUpperCase() + stage.slice(1)} Completed`] = timestamp;
            }
            
            if (printer) {
                updateFields['Printer Used'] = printer;
            }
            
            const updateResponse = await this.makeRequest(`Productions/${recordId}`, {
                method: 'PATCH',
                body: { fields: updateFields }
            });
            
            return {
                success: true,
                message: `${stage} ${action} recorded successfully`,
                productionId: productionId
            };
        } catch (error) {
            console.error('Production scan error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Helper method to determine status based on stage and action
    getStatusForStage(stage, action) {
        const statusMap = {
            'print': { start: 'Printing', complete: 'Print Complete' },
            'qc': { start: 'Quality Check', complete: 'QC Complete' },
            'cut': { start: 'Cutting', complete: 'Cut Complete' },
            'ship': { start: 'Shipping', complete: 'Complete' }
        };
        
        return statusMap[stage]?.[action] || 'In Progress';
    }
    
    // 7. QUEUE STATUS - Replace /webhook/get-queue-status
    async getQueueStatus(facility = 'ALL') {
        try {
            const filterFormula = facility === 'ALL'
                ? "OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'Ready', {Batch Status} = 'In Production')"
                : `AND(OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'Ready', {Batch Status} = 'In Production'), {Facility} = '${facility}')`;
            
            const response = await this.makeRequest('Batches', {
                filterByFormula: filterFormula,
                fields: ['Batch Name', 'Batch Status', 'Priority', 'Queue Position', 
                        'Total Items', 'Total Orders', 'Facility', 'Printer Used',
                        'Estimated Start Time', 'Estimated Completion Time'],
                sort: [{ field: 'Queue Position', direction: 'asc' }]
            });
            
            return {
                success: true,
                queue: response.records.map(record => ({
                    batchName: record.fields['Batch Name'],
                    status: record.fields['Batch Status'],
                    priority: record.fields['Priority'],
                    queuePosition: record.fields['Queue Position'],
                    itemCount: record.fields['Total Items'],
                    orderCount: record.fields['Total Orders'],
                    facility: record.fields['Facility'],
                    printer: record.fields['Printer Used'],
                    estimatedStart: record.fields['Estimated Start Time'],
                    estimatedCompletion: record.fields['Estimated Completion Time']
                })),
                stats: {
                    totalBatches: response.records.length,
                    highPriorityCount: response.records.filter(r => r.fields['Priority'] === 'High').length,
                    inProgressCount: response.records.filter(r => r.fields['Batch Status'] === 'In Production').length
                }
            };
        } catch (error) {
            console.error('Queue status error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderManagementAPI;
} else {
    window.OrderManagementAPI = OrderManagementAPI;
}