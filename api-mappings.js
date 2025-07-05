// Direct API Mappings for All Webhooks
// This file contains all the query mappings to replace N8N webhooks with direct Airtable API calls

const API_MAPPINGS = {
    // Base configuration
    BASE_URL: 'https://api.airtable.com/v0',
    BASE_ID: 'appZdp18sltDYOs4s',
    
    // Status value mappings based on actual Airtable data
    STATUS_VALUES: {
        ORDER_STATUS: {
            ACTIVE: ['New', 'In Review', 'On Hold', 'Processing'],
            READY_PICKUP: ['Ready for Pickup', 'Complete'],
            COMPLETED: ['Completed', 'Shipped', 'Cancelled']
        },
        PRODUCTION_STATUS: {
            ACTIVE: ['Pending', 'In Progress', 'Printing', 'Quality Check', 'Cutting'],
            COMPLETED: ['Complete', 'Shipped']
        },
        BATCH_STATUS: {
            QUEUE: ['Created', 'Queued', 'In Production', 'Printing'],
            COMPLETED: ['Complete', 'Shipped']
        },
        FULFILLMENT_OPTIONS: {
            PICKUP: 'Will Call',
            SHIPPING: 'Ship'
        }
    },
    
    // Query builders for each webhook replacement
    QUERIES: {
        // Dashboard Stats - Current working queries
        DASHBOARD_STATS: {
            activeOrders: "OR({Order Status} = 'New', {Order Status} = 'In Review', {Order Status} = 'On Hold', {Order Status} = 'Processing')",
            inProduction: (facility) => facility === 'ALL' 
                ? "OR({Production Status} = 'Pending', {Production Status} = 'In Progress', {Production Status} = 'Printing', {Production Status} = 'Quality Check', {Production Status} = 'Cutting')"
                : `AND(OR({Production Status} = 'Pending', {Production Status} = 'In Progress', {Production Status} = 'Printing', {Production Status} = 'Quality Check', {Production Status} = 'Cutting'), {Facility} = '${facility}')`,
            readyPickup: "AND({Fulfillment Option} = 'Will Call', {Pickup Confirmed} = BLANK())",
            queueItems: (facility) => facility === 'ALL'
                ? "OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'In Production', {Batch Status} = 'Printing')"
                : `AND(OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'In Production', {Batch Status} = 'Printing'), {Facility} = '${facility}')`
        },
        
        // Pickup Ready Orders
        PICKUP_LIST: {
            byOrderId: (orderId) => `{Order ID} = '${orderId}'`,
            byEmail: (email) => `{Email} = '${email}'`,
            byPhone: (phone) => `{Phone} = '${phone}'`,
            readyOnly: "AND({Fulfillment Option} = 'Will Call', OR({Order Status} = 'Ready for Pickup', {Production Status} = 'Complete'))"
        },
        
        // Order Status Lookup  
        STATUS_LOOKUP: {
            byOrderId: (orderId) => `{Order ID} = '${orderId}'`,
            byEmail: (email) => `{Email} = '${email}'`,
            byPhone: (phone) => `{Phone} = '${phone}'`,
            byProductionId: (prodId) => `{Production ID} = '${prodId}'`
        },
        
        // Production Queue
        QUEUE_STATUS: {
            activeBatches: (facility) => facility === 'ALL'
                ? "OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'Ready', {Batch Status} = 'In Production')"
                : `AND(OR({Batch Status} = 'Created', {Batch Status} = 'Queued', {Batch Status} = 'Ready', {Batch Status} = 'In Production'), {Facility} = '${facility}')`
        },
        
        // Shipping Ready
        SHIPPING_READY: {
            readyToShip: (facility) => facility === 'ALL'
                ? "AND({Fulfillment Option} = 'Ship', OR({Order Status} = 'Ready to Ship', {Production Status} = 'Complete'))"
                : `AND({Fulfillment Option} = 'Ship', OR({Order Status} = 'Ready to Ship', {Production Status} = 'Complete'), {Facility} = '${facility}')`
        },
        
        // Production Validation
        PRODUCTION_VALIDATE: {
            byProductionId: (prodId, facility) => `AND({Production ID} = '${prodId}', {Facility} = '${facility}')`
        }
    },
    
    // Field mappings for each table
    FIELDS: {
        ORDERS: [
            'Order ID', 'Customer Name', 'Customer Email', 'Phone',
            'Order Date', 'Order Status', 'Fulfillment Option', 
            'Pickup Confirmed', 'Total $', 'Item Count',
            'Shipping Address', 'Shipping Option',
            'Production Status', 'Estimated Completion',
            'Linked Order Items', 'Linked Production'
        ],
        PRODUCTIONS: [
            'Production ID', 'Production Status', 'Facility',
            'Print Started', 'Print Completed', 'QC Completed',
            'Cut Completed', 'Ship Completed', 'Quantity',
            'Item Description', 'Batch Name', 'Priority',
            'Linked Order', 'Order Item'
        ],
        BATCHES: [
            'Batch Name', 'Batch Status', 'Facility', 'Priority',
            'Queue Position', 'Total Items', 'Total Orders',
            'Estimated Start Time', 'Estimated Completion Time',
            'Operator', 'Printer Used', 'Created'
        ],
        ORDER_ITEMS: [
            'Item UID', 'Product Type', 'Quantity', 'Title',
            'Dimensions (in)', 'Item Status', 'Print Facility',
            'Linked Order', 'Linked Production'
        ],
        SHIPMENTS: [
            'Tracking Number', 'Carrier', 'Shipped Date',
            'Order ID', 'Delivery Status', 'Linked Order'
        ]
    },
    
    // API URL builders
    buildUrl(table, query = {}) {
        const baseUrl = `${this.BASE_URL}/${this.BASE_ID}/${table}`;
        const params = new URLSearchParams();
        
        if (query.filterByFormula) {
            params.append('filterByFormula', query.filterByFormula);
        }
        if (query.fields) {
            query.fields.forEach(field => params.append('fields[]', field));
        }
        if (query.maxRecords) {
            params.append('maxRecords', query.maxRecords);
        }
        if (query.sort) {
            query.sort.forEach((sort, index) => {
                params.append(`sort[${index}][field]`, sort.field);
                params.append(`sort[${index}][direction]`, sort.direction);
            });
        }
        
        return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    },
    
    // Headers builder
    getHeaders(apiKey) {
        return {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_MAPPINGS;
} else {
    window.API_MAPPINGS = API_MAPPINGS;
}