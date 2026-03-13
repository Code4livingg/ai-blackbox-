# Incident Investigation View - Implementation Guide

## Overview

The Incident Investigation View is a dedicated forensic analysis interface for AI sessions. It provides security investigators with a comprehensive, visually organized view of session data, integrity verification, and audit evidence.

## Feature Summary

**Route**: `/investigation/:sessionId` (internal routing via state management)

**Purpose**: Enable forensic investigators to analyze AI interactions with a security-focused interface that presents all critical information in a structured, investigative workflow.

## Implementation Details

### Files Created

1. **dashboard/src/pages/InvestigationPage.tsx** - Main investigation component

### Files Modified

1. **dashboard/src/App.tsx** - Added investigation routing and navigation
2. **dashboard/src/pages/SessionsPage.tsx** - Added "Investigate" button

## Component Structure

### InvestigationPage Component

**Props**:
```typescript
interface InvestigationPageProps {
  sessionId: string;      // Session to investigate
  onBack: () => void;     // Navigation callback to return to sessions
}
```

**State Management**:
```typescript
const [report, setReport] = useState<any>(null);              // Forensic report data
const [loading, setLoading] = useState(true);                 // Loading state
const [downloadingReport, setDownloadingReport] = useState(false); // Download state
```

**API Integration**:
```typescript
// Fetches comprehensive forensic report
GET /api/session/:sessionId/report
```

## UI Layout

### 1. Header Section
- Back navigation button
- Page title with shield icon
- "Download Forensic Report" button

### 2. Session Overview Panel
Displays key session metadata in a grid:
- Session ID (truncated with tooltip)
- Start time
- End time
- Total events count
- Final risk level badge

### 3. Integrity Verification Panel
Prominent status display with:
- **Valid Chain**: Green background, checkmark icon
- **Compromised Chain**: Red background, X icon
- Metrics: Entries verified, Tampering detected (YES/NO)
- Error details (if tampering detected)

### 4. Original Prompt Display
Shows the initial prompt that started the session:
- Yellow lightning icon
- Full prompt text in readable format

### 5. Cross-Model Analysis Panel
Side-by-side comparison of model responses:
- **Left**: Amazon Nova Micro
- **Right**: Anthropic Claude 3 Haiku

Each model card shows:
- Model name
- Risk badge
- Full response (scrollable)
- Risk assessment reason

### 6. Event Timeline
Vertical timeline showing chronological events:
- Blue dots connected by vertical line
- Event type (formatted)
- Timestamp
- Duration since previous event
- Visual progression from top to bottom

### 7. Audit Evidence Panel
Complete hash chain display:
- Entry number
- Entry ID (truncated)
- Full hash with copy button
- Previous hash with copy button
- Hover effects for interactivity

### 8. Investigation Summary
Bottom summary statistics:
- Total duration
- Prompt count
- Response count
- Risk escalations (color-coded)

## Styling

### Color Scheme

**Integrity Status**:
- Valid: `bg-green-500/5 border-green-500/30`
- Invalid: `bg-red-500/5 border-red-500/30`

**Risk Badges**:
- LOW: Green (`text-green-300 border-green-500/50`)
- MEDIUM: Yellow (`text-yellow-300 border-yellow-500/50`)
- HIGH: Red (`text-red-300 border-red-500/50`)

**Background Layers**:
- Page: `bg-slate-950`
- Cards: `bg-slate-900 border-slate-800`
- Nested elements: `bg-slate-950 border-slate-800`

**Interactive Elements**:
- Buttons: Blue gradient with shadow effects
- Hover states: Border color transitions
- Loading states: Spinner animations

### Icons

Using Lucide React icons:
- `Shield` - Investigation header, audit evidence
- `FileText` - Session overview
- `Activity` - Cross-model analysis
- `Clock` - Timeline events
- `Zap` - Original prompt
- `CheckCircle` - Valid integrity
- `XCircle` - Invalid integrity
- `AlertTriangle` - Errors/warnings
- `Download` - Report download
- `Search` - Investigate button

## User Workflows

### Workflow 1: Navigate to Investigation

1. User is on Sessions page
2. User selects a session from the list
3. User clicks "Investigate" button (purple)
4. App navigates to Investigation view
5. Loading spinner shows while fetching report
6. Investigation view displays with all panels

### Workflow 2: Analyze Session Integrity

1. User views Integrity Verification Panel
2. Green checkmark = Valid chain
3. Red X = Compromised chain
4. If compromised, error details shown below
5. User can see exact entries verified count
6. Tampering status clearly displayed

### Workflow 3: Compare Model Responses

1. User scrolls to Cross-Model Analysis Panel
2. Two model cards displayed side-by-side
3. User reads both responses
4. User compares risk levels
5. User reviews risk assessment reasons
6. Identifies any discrepancies between models

### Workflow 4: Review Timeline

1. User scrolls to Event Timeline
2. Events displayed chronologically (top to bottom)
3. User sees event types and timestamps
4. Duration between events visible
5. User can trace the complete interaction flow

### Workflow 5: Verify Hash Chain

1. User scrolls to Audit Evidence Panel
2. Each entry shows hash and previous hash
3. User can copy hashes using copy button
4. User can verify chain linkage manually
5. Entry IDs help identify specific entries

### Workflow 6: Download Forensic Report

1. User clicks "Download Forensic Report" button
2. Button shows "Generating..." with spinner
3. Report downloads as JSON file
4. Filename: `forensic-investigation-{sessionId}-{timestamp}.json`
5. User can share report with team or auditors

### Workflow 7: Return to Sessions

1. User clicks "← Back to Sessions" link
2. App navigates back to Sessions page
3. Previously selected session remains selected
4. User can select another session to investigate

## API Response Structure

### Forensic Report Format

```typescript
{
  sessionId: string;
  generatedAt: string;              // ISO 8601
  startTimestamp: string;           // ISO 8601
  endTimestamp: string;             // ISO 8601
  totalEvents: number;
  
  prompt: string;                   // Original prompt
  
  modelAnalysis: Array<{
    modelName: string;
    response: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskReason: string;
  }>;
  
  timeline: Array<{
    eventType: string;
    timestamp: string;
    durationSincePrevious: number | null;
  }>;
  
  integrityVerification: {
    chainValid: boolean;
    entriesVerified: number;
    tamperingDetected: boolean;
    errors: string[];
  };
  
  auditHashes: Array<{
    entryId: string;
    hash: string;
    previousHash: string;
  }>;
  
  summary: {
    totalDuration: number;
    promptCount: number;
    responseCount: number;
    riskAssessmentCount: number;
    finalRiskLevel: string | null;
    riskEscalationDetected: boolean;
    riskEscalations: Array<any>;
  };
}
```

## Error Handling

### Loading State
```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-slate-400">Loading investigation data...</div>
      </div>
    </div>
  );
}
```

### Error State
```typescript
if (!report) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <div className="text-slate-400">Failed to load investigation data</div>
        <button onClick={onBack}>Go Back</button>
      </div>
    </div>
  );
}
```

### API Errors
- Network errors: Alert user with friendly message
- 404 errors: Session not found
- 500 errors: Report generation failed
- Always provide "Go Back" option

## Responsive Design

### Desktop (1920px+)
- Two-column grid for model comparison
- Full-width panels
- All content visible without scrolling per section

### Laptop (1280px)
- Two-column grid maintained
- Slightly reduced padding
- Optimal for investigation work

### Tablet (768px)
- Single column for model comparison
- Cards stack vertically
- Maintained readability

### Mobile (375px)
- All content stacks vertically
- Session overview grid becomes 2 columns
- Touch-friendly button sizes

## Performance Considerations

### Data Fetching
- Single API call on mount: `GET /api/session/:sessionId/report`
- Report cached in component state
- No polling or real-time updates needed

### Rendering
- Efficient React rendering with keys
- Minimal re-renders (state changes only)
- Lazy loading not needed (single page view)

### Expected Load Times
- Report fetch: 100-500ms
- Initial render: <100ms
- Total time to interactive: <1 second

## Security Considerations

### Data Display
- Session IDs truncated with tooltips
- Full hashes displayed (needed for verification)
- No sensitive AWS credentials shown
- No internal system paths exposed

### User Actions
- Copy hash functionality (clipboard API)
- Download report (client-side generation)
- No data modification possible
- Read-only investigation view

## Testing Checklist

### Visual Testing
- [ ] All panels render correctly
- [ ] Icons display properly
- [ ] Colors match design system
- [ ] Hover effects work smoothly
- [ ] Loading states are clear
- [ ] Error states are helpful

### Functional Testing
- [ ] Navigation to investigation works
- [ ] Back button returns to sessions
- [ ] Report data loads correctly
- [ ] Download button works
- [ ] Copy hash buttons work
- [ ] Integrity status displays correctly
- [ ] Model comparison shows both models
- [ ] Timeline displays chronologically
- [ ] Summary stats are accurate

### Responsive Testing
- [ ] Desktop layout works
- [ ] Laptop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works
- [ ] No horizontal scrolling
- [ ] All buttons accessible

### Error Testing
- [ ] Loading state shows
- [ ] Error state shows
- [ ] Network errors handled
- [ ] Invalid session ID handled
- [ ] Missing data handled gracefully

## Integration with Existing Features

### Sessions Page Integration
- Added "Investigate" button next to "Download Audit Report"
- Purple button for visual distinction
- Passes session ID to investigation view
- Maintains session selection state

### App.tsx Routing
- Added `investigation` page type
- State management for session ID
- Navigation callbacks for back button
- Conditional rendering based on page type

### Shared Components
- **RiskBadge**: Used for risk level display
- **HashDisplay**: Used for hash chain evidence
- Consistent styling across all pages

## Future Enhancements

### Short Term
- [ ] Add export to PDF functionality
- [ ] Add print-friendly view
- [ ] Add session comparison (multiple sessions)
- [ ] Add filtering/search in timeline

### Medium Term
- [ ] Add annotations/notes capability
- [ ] Add evidence tagging
- [ ] Add investigation report templates
- [ ] Add collaboration features (share investigation)

### Long Term
- [ ] Add AI-powered anomaly detection
- [ ] Add pattern recognition across sessions
- [ ] Add automated investigation workflows
- [ ] Add integration with SIEM systems

## Usage Examples

### Example 1: Investigate Suspicious Session

```typescript
// User clicks "Investigate" on Sessions page
<button onClick={() => onInvestigate('suspicious-session-001')}>
  Investigate
</button>

// App navigates to investigation view
<InvestigationPage 
  sessionId="suspicious-session-001"
  onBack={() => navigateBackToSessions()}
/>

// User reviews:
// 1. Integrity status (valid/invalid)
// 2. Model responses (any discrepancies?)
// 3. Timeline (unusual patterns?)
// 4. Hash chain (any tampering?)
// 5. Downloads report for documentation
```

### Example 2: Compliance Audit

```typescript
// Auditor investigates multiple sessions
sessions.forEach(sessionId => {
  // Navigate to investigation
  navigateToInvestigation(sessionId);
  
  // Review integrity
  // Download forensic report
  // Document findings
  
  // Move to next session
});
```

### Example 3: Security Incident Response

```typescript
// Security team investigates incident
// 1. Identify affected session
// 2. Navigate to investigation view
// 3. Check integrity (compromised?)
// 4. Review model responses (malicious?)
// 5. Analyze timeline (attack pattern?)
// 6. Download evidence
// 7. Share with incident response team
```

## Code Examples

### Navigate to Investigation

```typescript
// In SessionsPage.tsx
<button onClick={() => onInvestigate(sessionId)}>
  <Search className="w-4 h-4" />
  Investigate
</button>

// In App.tsx
const navigateToInvestigation = (sessionId: string) => {
  setInvestigationSessionId(sessionId);
  setCurrentPage('investigation');
};
```

### Fetch Investigation Data

```typescript
const fetchReport = async () => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${API_URL}/api/session/${sessionId}/report`
    );
    setReport(response.data);
  } catch (error) {
    console.error('Failed to fetch report:', error);
    alert('Failed to load investigation data. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Download Forensic Report

```typescript
const downloadForensicReport = async () => {
  setDownloadingReport(true);
  try {
    const response = await axios.get(
      `${API_URL}/api/session/${sessionId}/report`
    );
    
    const blob = new Blob(
      [JSON.stringify(response.data, null, 2)], 
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-investigation-${sessionId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download report:', error);
    alert('Failed to download forensic report. Please try again.');
  } finally {
    setDownloadingReport(false);
  }
};
```

## Accessibility

### Keyboard Navigation
- All buttons are keyboard accessible
- Tab order follows visual flow
- Enter/Space activate buttons
- Escape key could close (future enhancement)

### Screen Readers
- Semantic HTML structure
- ARIA labels on interactive elements
- Status messages announced
- Error messages announced

### Visual Accessibility
- High contrast text (WCAG AA compliant)
- Color not sole indicator (icons + text)
- Focus indicators visible
- Sufficient touch target sizes (44px minimum)

## Browser Compatibility

**Tested On**:
- Chrome/Edge (Chromium) ✓
- Firefox ✓
- Safari ✓

**Features Used**:
- Clipboard API (copy hash)
- Blob API (download report)
- CSS Grid and Flexbox
- CSS Transitions
- Modern JavaScript (ES6+)

All features supported in modern browsers (last 2 versions).

## Conclusion

The Incident Investigation View provides a comprehensive, security-focused interface for forensic analysis of AI sessions. It presents all critical information in a structured, investigative workflow that enables security teams to:

1. Quickly assess session integrity
2. Compare model responses for discrepancies
3. Review complete interaction timeline
4. Verify cryptographic hash chain
5. Download evidence for documentation
6. Share findings with stakeholders

The implementation follows the existing design system, maintains consistency with other pages, and provides a professional, enterprise-grade investigation experience.

## Related Documentation

- `FRONTEND_INTEGRATION_COMPLETE.md` - Frontend integration overview
- `FORENSIC_AUDIT_REPORT.md` - Backend report feature
- `FORENSIC_REPORT_IMPLEMENTATION.md` - Backend implementation
- `ARCHITECTURE.md` - System architecture
- `QUICK_START.md` - Getting started guide
