# Investigation View - Quick Reference

## Access the Feature

1. Start the dashboard: `cd dashboard && npm run dev`
2. Navigate to **Sessions** page
3. Click on any session
4. Click **"Investigate"** button (purple)
5. View comprehensive investigation interface

## What You'll See

### 8 Main Panels

1. **Session Overview** - ID, timestamps, events, risk level
2. **Integrity Verification** - Chain status (✓ valid / ✗ invalid)
3. **Original Prompt** - The prompt that started the session
4. **Cross-Model Analysis** - Side-by-side model comparison
5. **Event Timeline** - Chronological event flow
6. **Audit Evidence** - Complete hash chain
7. **Investigation Summary** - Key statistics
8. **Download Button** - Export forensic report

## Key Actions

| Action | Button | Result |
|--------|--------|--------|
| Navigate to investigation | Purple "Investigate" | Opens investigation view |
| Return to sessions | "← Back to Sessions" | Returns to sessions page |
| Download report | Blue "Download Forensic Report" | Downloads JSON file |
| Copy hash | "Copy" button next to hash | Copies to clipboard |

## Color Coding

| Color | Meaning |
|-------|---------|
| 🟢 Green | Valid integrity, LOW risk |
| 🟡 Yellow | MEDIUM risk |
| 🔴 Red | Invalid integrity, HIGH risk |
| 🔵 Blue | Primary actions |
| 🟣 Purple | Investigation action |

## API Endpoint

```bash
GET /api/session/:sessionId/report
```

Returns complete forensic report with:
- Session metadata
- Model analysis
- Timeline
- Integrity verification
- Audit hashes
- Summary statistics

## File Locations

- **Component**: `dashboard/src/pages/InvestigationPage.tsx`
- **Routing**: `dashboard/src/App.tsx`
- **Integration**: `dashboard/src/pages/SessionsPage.tsx`

## Documentation

- `INVESTIGATION_VIEW_IMPLEMENTATION.md` - Full documentation
- `INVESTIGATION_VIEW_LAYOUT.md` - Visual layout guide
- `INVESTIGATION_VIEW_SUMMARY.md` - Implementation summary
- `INVESTIGATION_VIEW_QUICK_REF.md` - This file

## Testing

```bash
# 1. Start API server
cd ~/ai-blackbox
npm run dev

# 2. Start dashboard
cd ~/ai-blackbox/dashboard
npm run dev

# 3. Create test session
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test investigation view", "sessionId": "test-investigation-001"}'

# 4. Open browser
# http://localhost:5174

# 5. Navigate: Sessions → Select session → Investigate
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Loading..." forever | Check API server is running on port 3001 |
| "Failed to load" | Verify session exists in DynamoDB |
| Download fails | Check browser console for errors |
| Back button doesn't work | Check App.tsx routing implementation |

## Quick Stats

- **Lines of Code**: 350+
- **Panels**: 8
- **API Calls**: 2 (fetch, download)
- **Icons**: 10+
- **Responsive**: ✓
- **TypeScript**: ✓
- **Accessible**: ✓

## Status

✅ **Complete** - Ready for production use

---

**Last Updated**: Session continuation (Investigation View implementation)
**Version**: 1.0.0
**Status**: Production Ready
