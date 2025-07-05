const CONFIG = {
    N8N_BASE: 'https://kureiji.app.n8n.cloud',
    
    // Airtable Direct API configuration
    AIRTABLE: {
        ENABLED: true,
        API_KEY: 'patTu4cWc9psOwz2Z.be543da2a5eb41430b07de37d23491c6d485aaeaace27ba03f0b58dc1a3b92f6',
        BASE_ID: 'appZdp18sltDYOs4s', // Order Management base
        BASE_URL: 'https://api.airtable.com/v0'
    },
    
    // Test mode - can be enabled via browser console or URL parameter
    TEST_MODE: localStorage.getItem('testMode') === 'true' || 
               new URLSearchParams(window.location.search).get('test') === 'true',
    
    WEBHOOKS: {
        SCAN: '/webhook/production-stage-scan',
        VALIDATE: '/webhook/batch-facility-validation',
        STATUS: '/webhook/get-order-status',
        PICKUP_LIST: '/webhook/get-pickup-ready',
        PICKUP_CONFIRM: '/webhook/confirm-pickup',
        REPRINT: '/webhook/request-reprint',
        QUEUE: '/webhook/get-queue-status',
        SHIPPING: '/webhook/get-shipping-queue',
        METRICS: '/webhook/get-production-metrics',
        PRIORITY: '/webhook/update-priority',
        DASHBOARD_STATS: '/webhook/dashboard-stats'
    },
    FACILITIES: ['CHICO', 'OUTPOST'],
    PRINTERS: {
        'CHICO': ['C2'],
        'OUTPOST': ['D2', 'D6', 'U2', 'S2']
    },
    PRODUCTION_STAGES: {
        'print': { name: 'Print', progress: 25 },
        'qc': { name: 'Quality Check', progress: 50 },
        'cut': { name: 'Cut', progress: 75 },
        'ship': { name: 'Ship', progress: 100 }
    },
    VERSION: '1.0.0',
    APP_NAME: 'Production Apps Suite'
};

// Utility functions
const CONFIG_UTILS = {
    getWebhookUrl(endpoint) {
        return `${CONFIG.N8N_BASE}${CONFIG.WEBHOOKS[endpoint]}`;
    },
    
    getFacilityPrinters(facility) {
        return CONFIG.PRINTERS[facility] || [];
    },
    
    getProgressForStage(stage) {
        return CONFIG.PRODUCTION_STAGES[stage]?.progress || 0;
    },
    
    validateFacility(facility) {
        return CONFIG.FACILITIES.includes(facility?.toUpperCase());
    },
    
    validatePrinter(facility, printer) {
        const printers = this.getFacilityPrinters(facility);
        return printers.includes(printer);
    },
    
    // Test mode utilities
    isTestMode() {
        return CONFIG.TEST_MODE;
    },
    
    enableTestMode() {
        localStorage.setItem('testMode', 'true');
        console.log('🧪 Test mode enabled. Reload page to activate.');
        return 'Test mode will be active after page reload';
    },
    
    disableTestMode() {
        localStorage.removeItem('testMode');
        console.log('✅ Test mode disabled. Reload page to deactivate.');
        return 'Test mode will be disabled after page reload';
    },
    
    getTestStatus() {
        const isTest = this.isTestMode();
        console.log(`🔍 Test mode: ${isTest ? 'ENABLED' : 'DISABLED'}`);
        if (isTest) {
            console.log('📝 Webhooks will include testMode: true');
            console.log('🔧 To disable: CONFIG_UTILS.disableTestMode()');
        } else {
            console.log('🔧 To enable: CONFIG_UTILS.enableTestMode()');
        }
        return isTest;
    },
    
    addTestData(data) {
        if (this.isTestMode()) {
            return {
                ...data,
                testMode: true,
                testPrefix: 'TEST-',
                testTimestamp: new Date().toISOString()
            };
        }
        return data;
    }
};

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, CONFIG_UTILS };
} else {
    window.CONFIG = CONFIG;
    window.CONFIG_UTILS = CONFIG_UTILS;
} 