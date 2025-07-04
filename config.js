const CONFIG = {
    N8N_BASE: 'https://kureiji.app.n8n.cloud',
    WEBHOOKS: {
        SCAN: '/webhook-test/production-stage-scan',
        VALIDATE: '/webhook-test/batch-facility-validation',
        STATUS: '/webhook/get-order-status',
        PICKUP_LIST: '/webhook/get-pickup-ready',
        PICKUP_CONFIRM: '/webhook/confirm-pickup',
        REPRINT: '/webhook/request-reprint',
        QUEUE: '/webhook/get-queue-status',
        SHIPPING: '/webhook/get-shipping-queue',
        METRICS: '/webhook/get-production-metrics',
        PRIORITY: '/webhook/update-priority'
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
    }
};

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, CONFIG_UTILS };
} else {
    window.CONFIG = CONFIG;
    window.CONFIG_UTILS = CONFIG_UTILS;
} 