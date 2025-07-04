# Production Apps Suite

A comprehensive multi-page application suite for managing production workflows, built for deployment on GitHub Pages.

## 🏗️ Project Structure

```
production-apps/
├── index.html              # Main dashboard/menu
├── config.js              # Shared configuration
├── styles.css             # Shared styles
├── scanner/
│   └── index.html         # Production scanner (✅ Ready)
├── pickup/
│   └── index.html         # Pickup confirmation app
├── status/
│   └── index.html         # Order status lookup
├── reprint/
│   └── index.html         # Reprint request form
├── queue/
│   └── index.html         # Live queue monitor
├── shipping/
│   └── index.html         # Shipping preparation
├── metrics/
│   └── index.html         # Production metrics dashboard
├── airtable/
│   └── order_mgmt_database_schema.json
├── n8n/
│   ├── ts_order_batch.json
│   ├── ts_order_ingest.json
│   ├── ts_order_webhooks.json
│   └── workflow_notes.json
└── README.md
```

## 🚀 Features

### ✅ Implemented
- **Main Dashboard**: Central hub with app navigation and quick stats
- **Production Scanner**: QR code scanning for production stage tracking
- **Shared Configuration**: Centralized webhook and facility management
- **Responsive Design**: Mobile-first approach with modern UI
- **Role-Based Design**: Different apps for different user types

### 🔄 Coming Soon
- **Pickup Confirmation**: Order pickup management with signatures
- **Status Lookup**: Customer-facing order status checking
- **Reprint Requests**: Defect reporting and reprint management
- **Queue Monitor**: Live production queue with drag-to-reorder
- **Shipping Preparation**: Shipment organization and label creation
- **Metrics Dashboard**: Real-time KPIs and analytics

## 🎯 App Purposes

### **Production Scanner** (`scanner/`)
- **Users**: Production floor staff
- **Purpose**: Track production stages (print, QC, cut, ship)
- **Features**: QR code scanning, manual entry, facility/printer management
- **Deployment**: Optimized for tablets and mobile devices

### **Pickup Confirmation** (`pickup/`)
- **Users**: Front desk staff
- **Purpose**: Manage order pickups
- **Features**: Order lookup, signature capture, photo proof

### **Order Status Lookup** (`status/`)
- **Users**: Customers and support staff
- **Purpose**: Check order progress
- **Features**: Status tracking, estimated completion times

### **Reprint Requests** (`reprint/`)
- **Users**: QC and production staff
- **Purpose**: Report defects and request reprints
- **Features**: Photo documentation, defect categorization

### **Queue Monitor** (`queue/`)
- **Users**: Operations managers
- **Purpose**: Live production queue management
- **Features**: Drag-to-reorder, priority management, time estimates

### **Shipping Preparation** (`shipping/`)
- **Users**: Shipping department
- **Purpose**: Organize and prepare shipments
- **Features**: Label creation, packing verification

### **Production Metrics** (`metrics/`)
- **Users**: Management
- **Purpose**: Performance tracking and analysis
- **Features**: Real-time KPIs, facility comparison, trend analysis

## 🔧 Technical Implementation

### **Shared Configuration** (`config.js`)
```javascript
const CONFIG = {
    N8N_BASE: 'https://kureiji.app.n8n.cloud',
    WEBHOOKS: {
        SCAN: '/webhook-test/production-stage-scan',
        VALIDATE: '/webhook-test/batch-facility-validation',
        // ... other endpoints
    },
    FACILITIES: ['CHICO', 'OUTPOST'],
    PRINTERS: {
        'CHICO': ['C2'],
        'OUTPOST': ['D2', 'D6', 'U2', 'S2']
    }
};
```

### **N8N Integration**
- **Order Ingestion**: Shopify, Gmail/Jiffy, JotForm
- **Batch Processing**: Automated facility assignment
- **Production Tracking**: Real-time stage updates
- **Webhook Endpoints**: RESTful API for all app interactions

### **Airtable Database**
- **Orders**: Master order records
- **Order Items**: Individual line items with production status
- **Batches**: Production batch groupings
- **Production Status**: Stage tracking and timestamps

## 📱 Usage

### **Dashboard Access**
1. Navigate to the main dashboard
2. Set your facility (CHICO or OUTPOST)
3. Click any app card to access specific functionality

### **Production Scanner**
1. Select facility and printer
2. Scan QR codes or enter production IDs manually
3. Update production stages with button clicks
4. System validates batch assignments automatically

### **Facility Management**
- Each user can set their facility preference
- Settings persist across sessions
- Different facilities have different printer options
- Batch validation ensures items are processed at correct locations

## 🌐 Deployment

### **GitHub Pages**
```bash
# Enable GitHub Pages on your repository
# Select main branch as source
# Access via: https://[username].github.io/production-apps/
```

### **Direct URLs**
```
https://[username].github.io/production-apps/          # Dashboard
https://[username].github.io/production-apps/scanner/  # Scanner
https://[username].github.io/production-apps/pickup/   # Pickup
https://[username].github.io/production-apps/status/   # Status
# ... etc
```

### **Device Optimization**
- **Tablets**: Production scanner for floor use
- **Desktops**: Full dashboard and management apps
- **Mobile**: Responsive design for all apps
- **TV Displays**: Queue monitor for full-screen viewing

## 🔒 Security

- **No API Keys**: All sensitive data handled via N8N webhooks
- **Facility Validation**: Batch assignments verified server-side
- **Local Storage**: Only facility preferences stored locally
- **HTTPS**: All webhook communications encrypted

## 📊 Data Flow

```
Orders → N8N Ingestion → Airtable → Production Apps
   ↓
Batch Assignment → Facility Assignment → QR Code Generation
   ↓
Production Tracking → Stage Updates → Completion Status
```

## 🛠️ Development

### **Adding New Apps**
1. Create folder: `mkdir newapp`
2. Create `newapp/index.html`
3. Import shared resources: `../config.js` and `../styles.css`
4. Add navigation and webhook integration
5. Update dashboard links

### **Webhook Integration**
```javascript
// Use shared configuration
const webhookUrl = CONFIG_UTILS.getWebhookUrl('ENDPOINT_NAME');

// Make requests
fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

## 📈 Performance

- **Fast Loading**: Each app loads only required resources
- **Efficient Caching**: Shared CSS and JS files cached
- **Mobile Optimized**: Progressive web app features
- **Real-time Updates**: Live data from N8N webhooks

## 🎨 Design System

- **Modern UI**: Clean, professional interface
- **Consistent Branding**: Unified color scheme and typography
- **Accessibility**: WCAG 2.1 compliant
- **Responsive**: Mobile-first design approach
- **Dark Mode**: Available across all apps

## 🔄 Roadmap

### **Phase 1: Core Infrastructure** ✅
- [x] Main dashboard
- [x] Shared configuration
- [x] Production scanner
- [x] Responsive design

### **Phase 2: Customer-Facing**
- [ ] Order status lookup
- [ ] Pickup confirmation
- [ ] Customer notifications

### **Phase 3: Operations**
- [ ] Queue monitor
- [ ] Reprint requests
- [ ] Shipping preparation

### **Phase 4: Management**
- [ ] Metrics dashboard
- [ ] Reporting tools
- [ ] Analytics integration

## 📞 Support

For technical issues or feature requests:
1. Check the N8N workflow logs
2. Verify webhook endpoints are responding
3. Confirm facility and batch assignments
4. Review browser console for errors

## 🏷️ Version

Current Version: **1.0.0**
- Multi-page app structure
- Production scanner functionality
- Shared configuration system
- Responsive design implementation