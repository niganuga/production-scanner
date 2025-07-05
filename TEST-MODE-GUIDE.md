# Test Mode Guide

## How to Enable Test Mode

### Method 1: Browser Console (Recommended)
1. Open your browser's Developer Console (F12)
2. Run: `CONFIG_UTILS.enableTestMode()`
3. Reload the page

### Method 2: URL Parameter
Add `?test=true` to any page URL:
- `https://niganuga.github.io/production-scanner/?test=true`
- `https://niganuga.github.io/production-scanner/scanner/?test=true`

## How to Use Test Mode

### Check Status
```javascript
CONFIG_UTILS.getTestStatus()
```

### Disable Test Mode
```javascript
CONFIG_UTILS.disableTestMode()
// Then reload the page
```

## What Test Mode Does

1. **Adds Test Flags** - All webhook calls include `testMode: true`
2. **Visual Indicators** - Yellow banner shows "TEST MODE ACTIVE"
3. **Console Logging** - Enhanced logging for debugging
4. **Safe Testing** - Your N8N webhooks can filter/handle test data separately

## Test Data Format

When test mode is active, all webhook calls include:
```json
{
  "qrCode": "P001",
  "stage": "print", 
  "action": "start",
  "facility": "CHICO",
  "testMode": true,
  "testPrefix": "TEST-",
  "testTimestamp": "2025-01-05T10:30:00.000Z"
}
```

## N8N Webhook Handling

Add this to your N8N Function nodes to handle test data:

```javascript
// In N8N Function node
const input = $input.first().json;

// Skip processing if test mode
if (input.testMode) {
    return [{
        json: {
            success: true,
            message: 'Test data acknowledged but not processed',
            testMode: true
        }
    }];
}

// Normal processing for real data
// ... your actual Airtable updates
```

## Testing Workflows

1. **Enable test mode** via console
2. **Use the apps normally** - scan QR codes, fill forms, etc.
3. **Check webhook responses** in browser console  
4. **Verify N8N workflows** receive test data properly
5. **Disable test mode** when done

## Tips

- Test mode persists across page reloads until disabled
- Each browser/device has independent test mode setting
- Use different browsers for simultaneous test/production use
- Check console for detailed test mode information