# Tech Context: Production Apps Suite

## 🛠️ Technology Stack

### Frontend Technologies
- **HTML5**: Semantic markup with modern features
- **CSS3**: Custom properties (variables), Grid, Flexbox, responsive design
- **Vanilla JavaScript**: ES6+ features, async/await, fetch API
- **HTML5-QRCode Library**: Camera-based QR code scanning
- **Progressive Web App**: Service worker capabilities (planned)

### Backend Integration
- **N8N**: Workflow automation and webhook endpoints
- **Airtable**: Database and record management
- **REST APIs**: JSON-based communication
- **GitHub Pages**: Static site hosting and deployment

### Development Tools
- **Git**: Version control and collaboration
- **GitHub**: Repository hosting and CI/CD
- **VSCode/Cursor**: Development environment
- **Browser DevTools**: Testing and debugging

## 🏗️ Development Setup

### Prerequisites
```bash
# Required tools
- Git (version control)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VSCode recommended)
- Internet connection (for API testing)

# Optional tools
- Node.js (for future build tools)
- Live Server extension (for local development)
```

### Local Development
```bash
# Clone repository
git clone [repository-url]
cd production-apps

# Start development server
# Option 1: VSCode Live Server extension
# Option 2: Python simple server
python -m http.server 8000

# Option 3: Node.js http-server
npx http-server -p 8000
```

### Project Structure
```
production-apps/
├── index.html              # Entry point (dashboard)
├── config.js              # Configuration management
├── styles.css             # Shared stylesheet
├── scanner/               # Production scanner app
│   └── index.html
├── pickup/                # Pickup confirmation app (planned)
├── status/                # Order status lookup (planned)
├── reprint/               # Reprint requests (planned)
├── queue/                 # Queue monitor (planned)
├── shipping/              # Shipping preparation (planned)
├── metrics/               # Metrics dashboard (planned)
├── airtable/              # Database schema documentation
├── n8n/                   # Workflow configuration
├── memory-bank/           # Project documentation
└── README.md              # Project overview
```

## 🔧 Technical Constraints

### GitHub Pages Limitations
- **Static Site Only**: No server-side processing
- **File Size Limits**: 1GB repository limit, 100MB file limit
- **Custom Domains**: Support available but not required
- **HTTPS**: Automatically provided
- **Build Time**: Changes may take few minutes to deploy

### Browser Support
**Target Browsers**:
- Chrome 90+ (primary - production tablets)
- Safari 14+ (iOS devices)
- Firefox 88+ (desktop usage)
- Edge 90+ (desktop usage)

**Key Features Required**:
- ES6+ JavaScript support
- CSS Grid and Flexbox
- Local Storage API
- Fetch API
- Camera API (for QR scanning)

### Mobile Device Constraints
- **iOS Safari**: Minimum 16px font size to prevent zoom
- **Android Chrome**: Touch target minimum 44px
- **Network**: Must work on slower 3G connections
- **Memory**: Optimize for older tablet hardware

### API Limitations
- **CORS**: Cross-origin requests handled by N8N
- **Rate Limiting**: Must respect N8N webhook limits
- **Timeout**: 30-second maximum request timeout
- **Payload Size**: JSON payload limits

## 🔌 Integration Architecture

### N8N Webhook Integration
```javascript
// Configuration structure
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
    }
};

// Standard request pattern
async function makeRequest(endpoint, data) {
    const url = `${CONFIG.N8N_BASE}${CONFIG.WEBHOOKS[endpoint]}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

### Airtable Database Schema
**Tables and Relationships**:
```
Orders Table
├── Order ID (Primary)
├── Customer Information
├── Payment Status
├── Shipping Details
└── Linked Order Items →

Order Items Table
├── Item ID (Primary)
├── Order ID (Link to Orders)
├── Product Type
├── Quantity
├── Production Status
├── Batch Assignment
└── File Attachments

Production Table
├── Production ID (Primary)
├── Order Item ID (Link)
├── Facility Assignment
├── Stage Progress
├── Timestamps
└── QC Results

Batches Table
├── Batch ID (Primary)
├── Facility
├── Priority Level
├── Item Count
└── Status
```

## 🎨 Frontend Architecture

### CSS Architecture
**Design System Approach**:
```css
/* CSS Custom Properties (Variables) */
:root {
    /* Colors */
    --primary-color: #007bff;
    --success-color: #28a745;
    --error-color: #dc3545;
    --warning-color: #ffc107;
    
    /* Spacing */
    --spacing-xs: 8px;
    --spacing-sm: 16px;
    --spacing-md: 24px;
    --spacing-lg: 32px;
    
    /* Typography */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    
    /* Layout */
    --border-radius: 8px;
    --shadow: 0 2px 10px rgba(0,0,0,0.1);
    --max-width: 1200px;
}

/* Component-based CSS */
.btn { /* Button component */ }
.card { /* Card component */ }
.status { /* Status message component */ }
.form-input { /* Form input component */ }
```

### JavaScript Architecture
**Module Pattern**:
```javascript
// Configuration module
const CONFIG = { /* settings */ };
const CONFIG_UTILS = { /* utility functions */ };

// App-specific functionality
(function() {
    // Private variables
    let currentState = {};
    
    // Public functions
    function initApp() { /* initialization */ }
    function handleUserAction() { /* event handling */ }
    
    // Initialize on load
    window.onload = initApp;
})();
```

### Component Library
**Reusable UI Components**:
```html
<!-- Button variations -->
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-success">Success Action</button>
<button class="btn btn-danger">Danger Action</button>

<!-- Status messages -->
<div class="status status-success">Success message</div>
<div class="status status-error">Error message</div>

<!-- Form components -->
<div class="form-group">
    <label class="form-label">Label</label>
    <input class="form-input" type="text">
</div>

<!-- Layout components -->
<div class="grid grid-2">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
</div>
```

## 📱 Mobile Optimization

### Responsive Design Strategy
```css
/* Mobile-first approach */
.container {
    padding: 10px; /* Mobile default */
}

@media (min-width: 768px) {
    .container {
        padding: 20px; /* Tablet */
    }
}

@media (min-width: 1024px) {
    .container {
        padding: 30px; /* Desktop */
    }
}
```

### Touch Interface Optimization
```css
/* Touch-friendly controls */
.btn {
    min-width: 44px;
    min-height: 44px;
    padding: 12px 24px;
    font-size: 16px; /* Prevents zoom on iOS */
}

/* Production scanner specific */
.btn-scan {
    min-width: 140px;
    min-height: 48px;
    font-size: 18px;
}
```

### Performance Considerations
- **Image Optimization**: WebP format with PNG fallbacks
- **Font Loading**: System fonts to avoid FOUT
- **CSS Minification**: Production builds
- **JavaScript Modules**: Lazy loading for large features

## 🔒 Security Considerations

### Client-Side Security
- **Input Validation**: All user input validated before API calls
- **XSS Prevention**: Content sanitization
- **Local Storage**: Only non-sensitive data stored
- **HTTPS**: All API communications encrypted

### API Security
- **No API Keys**: Sensitive operations handled by N8N
- **CORS**: Cross-origin requests properly configured
- **Rate Limiting**: Requests throttled to prevent abuse
- **Payload Validation**: Server-side validation in N8N

## 🚀 Deployment Pipeline

### GitHub Pages Deployment
```yaml
# Automatic deployment on push to main
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Environment Configuration
```javascript
// Environment-specific config
const CONFIG = {
    N8N_BASE: process.env.NODE_ENV === 'production' 
        ? 'https://kureiji.app.n8n.cloud'
        : 'https://kureiji.app.n8n.cloud', // Same for now
    // ... other settings
};
```

## 📊 Performance Monitoring

### Key Performance Metrics
- **First Contentful Paint**: <1.5 seconds
- **Largest Contentful Paint**: <2.5 seconds
- **Time to Interactive**: <3 seconds
- **Cumulative Layout Shift**: <0.1

### Browser Performance Tools
```javascript
// Performance tracking
function measurePerformance(label, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label}: ${end - start}ms`);
    return result;
}

// Usage
measurePerformance('API Request', () => {
    return fetch(apiUrl, requestOptions);
});
```

## 🔧 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-app
git add .
git commit -m "feat: add pickup confirmation app"
git push origin feature/new-app

# Create pull request
# Review and merge to main
# Automatic deployment to GitHub Pages
```

### Testing Strategy
- **Manual Testing**: Cross-browser and device testing
- **User Acceptance**: Production floor feedback
- **Performance Testing**: Mobile device validation
- **Accessibility Testing**: Screen reader compatibility

### Code Standards
- **JavaScript**: ES6+ features, async/await pattern
- **CSS**: BEM methodology for class naming
- **HTML**: Semantic markup, accessibility attributes
- **Comments**: JSDoc for functions, CSS comments for sections

## 🔮 Future Technology Considerations

### Progressive Web App Features
```javascript
// Service Worker for offline capability
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

// Web App Manifest
{
    "name": "Production Apps Suite",
    "short_name": "Production Apps",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#007bff"
}
```

### Advanced Features (Planned)
- **WebSocket Integration**: Real-time updates
- **Push Notifications**: Browser notifications
- **Camera API**: Enhanced QR scanning
- **Web Assembly**: Performance-critical operations
- **IndexedDB**: Client-side data caching

### Build Tool Integration (Future)
```javascript
// Potential build system
{
    "scripts": {
        "build": "webpack --mode=production",
        "dev": "webpack-dev-server --mode=development",
        "test": "jest",
        "lint": "eslint src/"
    }
}
``` 