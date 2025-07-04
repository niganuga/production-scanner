# System Patterns: Production Apps Suite

## 🏗️ Architecture Overview

### Multi-Page Application (MPA) Pattern
**Decision**: Chose MPA over Single Page Application (SPA)
**Rationale**: 
- Role-based access - different users need different interfaces
- Performance - each app loads only required resources
- Bookmarking - direct URLs for specific tools
- Scalability - easy to add new apps independently

### Static Site + API Integration Pattern
```
Frontend (GitHub Pages) ← → N8N Webhooks ← → Airtable Database
```

**Benefits**:
- No server maintenance
- Automatic scaling
- CDN distribution
- Version control deployment

## 🔧 Technical Architecture

### File Structure Pattern
```
production-apps/
├── index.html              # Main dashboard
├── config.js              # Shared configuration
├── styles.css             # Shared styles
├── {app-name}/
│   └── index.html         # App-specific functionality
└── memory-bank/           # Project documentation
```

### Shared Resources Pattern
**Configuration Management**:
```javascript
// config.js - Single source of truth
const CONFIG = {
    N8N_BASE: 'https://kureiji.app.n8n.cloud',
    WEBHOOKS: { /* endpoint mappings */ },
    FACILITIES: ['CHICO', 'OUTPOST'],
    PRINTERS: { /* facility-specific printers */ }
};
```

**Style System**:
```css
/* styles.css - Design system variables */
:root {
    --primary-color: #007bff;
    --success-color: #28a745;
    /* ... consistent design tokens */
}
```

## 🎯 Design Patterns

### Navigation Pattern
**Consistent Header**:
```html
<nav class="nav">
    <div class="nav-container">
        <a href="../index.html" class="nav-brand">Production Apps</a>
        <div class="nav-links">
            <a href="../index.html" class="nav-link">Dashboard</a>
            <a href="index.html" class="nav-link active">Current App</a>
        </div>
    </div>
</nav>
```

### Error Handling Pattern
**Status Messages**:
```javascript
function showStatus(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `status status-${type} show`;
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);
    setTimeout(() => statusDiv.remove(), 3000);
}
```

### Configuration Access Pattern
**Centralized Configuration**:
```javascript
// All apps use shared config
const webhookUrl = CONFIG_UTILS.getWebhookUrl('ENDPOINT_NAME');
const isValidFacility = CONFIG_UTILS.validateFacility(userInput);
```

## 📱 User Interface Patterns

### Responsive Design Pattern
**Mobile-First Approach**:
```css
/* Base styles for mobile */
.app-container { padding: 15px; }

/* Enhanced for larger screens */
@media (min-width: 768px) {
    .app-container { padding: 30px; }
}
```

### Component Library Pattern
**Reusable UI Components**:
```html
<!-- Standard button -->
<button class="btn btn-primary">Action</button>

<!-- Status messages -->
<div class="status status-success">Success message</div>

<!-- Info boxes -->
<div class="info-box">
    <div class="info-box-header">
        <div class="info-box-title">Title</div>
        <button class="btn btn-small">Action</button>
    </div>
</div>
```

### Grid System Pattern
**Flexible Layouts**:
```css
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
```

## 🔄 Data Flow Patterns

### API Integration Pattern
**Webhook Communication**:
```javascript
async function apiRequest(endpoint, data) {
    const url = CONFIG_UTILS.getWebhookUrl(endpoint);
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

### State Management Pattern
**Local Storage for Preferences**:
```javascript
// Facility preference persistence
function saveFacilityPreference(facility) {
    localStorage.setItem('facilityName', facility);
}

function loadFacilityPreference() {
    return localStorage.getItem('facilityName') || '';
}
```

### Real-Time Updates Pattern
**Polling for Live Data**:
```javascript
function startDataPolling() {
    setInterval(async () => {
        const data = await apiRequest('METRICS', { facility: currentFacility });
        updateDashboard(data);
    }, 30000); // 30 second intervals
}
```

## 🏭 Business Logic Patterns

### Facility Management Pattern
**Validation and Assignment**:
```javascript
function validateBatchAssignment(productionId, facility) {
    return apiRequest('VALIDATE', {
        productionId: productionId,
        facility: facility
    });
}
```

### Production Stage Pattern
**Stage Progression**:
```javascript
const PRODUCTION_STAGES = {
    'print': { name: 'Print', progress: 25 },
    'qc': { name: 'Quality Check', progress: 50 },
    'cut': { name: 'Cut', progress: 75 },
    'ship': { name: 'Ship', progress: 100 }
};
```

### QR Code Processing Pattern
**Unified Scanning Interface**:
```javascript
function onScanSuccess(decodedText) {
    // Stop scanning
    html5QrCode.stop();
    
    // Process production ID
    currentProductionId = decodedText;
    
    // Update UI
    showScanResult(decodedText);
    enableStageButtons();
}
```

## 🎨 Visual Design Patterns

### Color Coding Pattern
**Role-Based Visual Identity**:
```css
.app-card.production { border-color: var(--success-color); }
.app-card.customer { border-color: var(--primary-color); }
.app-card.operations { border-color: var(--warning-color); }
.app-card.management { border-color: var(--info-color); }
```

### Progressive Enhancement Pattern
**Graceful Degradation**:
```javascript
// Camera availability check
html5QrCode.start(/* config */)
    .catch(err => {
        console.error("Camera unavailable");
        showStatus("Camera not available. Use manual entry.", "error");
        enableManualEntry();
    });
```

### Touch-Friendly Pattern
**Production Floor Optimization**:
```css
.btn {
    min-width: 120px;
    padding: 12px 24px;
    font-size: 16px; /* Minimum 16px for iOS */
}

.btn-scan {
    min-width: 140px; /* Larger for production use */
}
```

## 📊 Performance Patterns

### Lazy Loading Pattern
**App-Specific Resource Loading**:
```html
<!-- Only load QR scanner library when needed -->
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
```

### Caching Pattern
**Static Resource Optimization**:
```html
<!-- Shared resources cached across apps -->
<link rel="stylesheet" href="../styles.css">
<script src="../config.js"></script>
```

### Error Boundary Pattern
**Graceful Error Handling**:
```javascript
function safeApiCall(endpoint, data) {
    return apiRequest(endpoint, data)
        .catch(error => {
            console.error('API Error:', error);
            showStatus('Connection error. Please try again.', 'error');
            return null;
        });
}
```

## 🔒 Security Patterns

### Input Validation Pattern
**Client-Side Validation**:
```javascript
function validateProductionId(id) {
    const pattern = /^[A-Z]\d{3,}$/; // P093 format
    return pattern.test(id);
}
```

### API Security Pattern
**No Sensitive Data Exposure**:
```javascript
// All sensitive operations handled by N8N
// Frontend only sends user input, receives results
const data = {
    qrCode: productionId,
    facility: facilityName,
    timestamp: new Date().toISOString()
};
```

## 🚀 Deployment Patterns

### GitHub Pages Pattern
**Static Site Deployment**:
```
1. Push to main branch
2. GitHub Actions builds site
3. Deploys to GitHub Pages
4. CDN distribution automatic
```

### Version Control Pattern
**Release Management**:
```javascript
const CONFIG = {
    VERSION: '1.0.0',
    // ... other config
};
```

## 🔧 Development Patterns

### Consistent Structure Pattern
**New App Template**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Name - Production Apps</title>
    <link rel="stylesheet" href="../styles.css">
    <script src="../config.js"></script>
</head>
<body>
    <nav class="nav"><!-- Standard navigation --></nav>
    <div class="container">
        <div class="app-container">
            <!-- App-specific content -->
        </div>
    </div>
</body>
</html>
```

### Configuration-Driven Pattern
**Easy Customization**:
```javascript
// Adding new facility
CONFIG.FACILITIES.push('NEW_FACILITY');
CONFIG.PRINTERS['NEW_FACILITY'] = ['P1', 'P2'];
```

## 🎯 Integration Patterns

### N8N Webhook Pattern
**Standardized API Calls**:
```javascript
// Consistent request structure
const requestData = {
    action: 'UPDATE_STAGE',
    payload: {
        productionId: id,
        stage: stage,
        facility: facility,
        timestamp: new Date().toISOString()
    }
};
```

### Airtable Data Pattern
**Structured Data Flow**:
```
Orders Table → Order Items Table → Production Table
     ↓              ↓                  ↓
  Customer Info → Item Details → Progress Tracking
```

## 📈 Monitoring Patterns

### Performance Tracking Pattern
**Key Metrics Collection**:
```javascript
function trackPerformance(action, duration) {
    console.log(`${action} completed in ${duration}ms`);
    // Could send to analytics service
}
```

### User Behavior Pattern
**Usage Analytics**:
```javascript
function trackUserAction(app, action) {
    const data = {
        app: app,
        action: action,
        facility: currentFacility,
        timestamp: new Date().toISOString()
    };
    // Send to analytics
}
```

## 🔄 Maintenance Patterns

### Documentation Pattern
**Memory Bank System**:
- `projectbrief.md` - Foundation and requirements
- `productContext.md` - Business context and user needs
- `activeContext.md` - Current work and next steps
- `systemPatterns.md` - Architecture and patterns
- `techContext.md` - Technology stack and setup
- `progress.md` - Status and completed work

### Code Organization Pattern
**Separation of Concerns**:
- **Presentation**: HTML structure and CSS styling
- **Behavior**: JavaScript functionality
- **Configuration**: Centralized settings
- **Documentation**: Comprehensive project memory 