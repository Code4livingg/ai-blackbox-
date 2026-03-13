# Forensic Audit Report Generator

## Overview

The Forensic Audit Report Generator provides investigators with a comprehensive, verified report for any AI session. The report includes the complete session timeline, risk analysis, cryptographic integrity proof, and all audit hashes.

## Endpoint

### GET /api/session/:sessionId/report

Generates a structured forensic audit report for the specified session.

**Parameters:**
- `sessionId` (path parameter, required): The session identifier
- `format` (query parameter, optional): Report format (`json` or `pdf`)
  - Default: `json`
  - `pdf`: Not yet implemented (returns 501)

**Example Request:**
```bash
curl http://localhost:3001/api/session/cross-model-demo-001/report
```

**Example Request with Format:**
```bash
curl http://localhost:3001/api/session/cross-model-demo-001/report?format=json
```

## Report Structure

### Complete Report Schema

```typescript
interface ForensicAuditReport {
  sessionId: string;
  generatedAt: string;              // ISO 8601 timestamp
  startTimestamp: string;           // ISO 8601 timestamp
  endTimestamp: string;             // ISO 8601 timestamp
  totalEvents: number;
  prompt: string;
  modelAnalysis: Array<{
    modelName: string;
    response: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskReason: string;
  }>;
  timeline: Array<{
    eventType: string;
    timestamp: string;              // ISO 8601 timestamp
    durationSincePrevious: number | null;  // milliseconds
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
    totalDuration: number;          // milliseconds
    promptCount: number;
    responseCount: number;
    riskAssessmentCount: number;
    finalRiskLevel: string | null;
    riskEscalationDetected: boolean;
    riskEscalations: Array<{
      from: string;
      to: string;
      timestamp: number;
    }>;
  };
}
```

## Example Report

### Cross-Model Analysis Session

```json
{
  "sessionId": "cross-model-demo-001",
  "generatedAt": "2026-03-12T18:39:25.243Z",
  "startTimestamp": "2026-03-12T18:30:14.166Z",
  "endTimestamp": "2026-03-12T18:30:14.166Z",
  "totalEvents": 1,
  "prompt": "What are the ethical considerations of AI in healthcare?",
  "modelAnalysis": [
    {
      "modelName": "Amazon Nova Micro",
      "response": "The ethical considerations of AI in healthcare are multifaceted...",
      "riskLevel": "MEDIUM",
      "riskReason": "Discusses sensitive healthcare topics including patient privacy, bias, and workforce impact"
    },
    {
      "modelName": "Anthropic Claude 3 Haiku",
      "response": "There are several important ethical considerations...",
      "riskLevel": "MEDIUM",
      "riskReason": "Addresses healthcare AI safety concerns and ethical considerations"
    }
  ],
  "timeline": [
    {
      "eventType": "cross_model_analysis",
      "timestamp": "2026-03-12T18:30:14.166Z",
      "durationSincePrevious": null
    }
  ],
  "integrityVerification": {
    "chainValid": true,
    "entriesVerified": 1,
    "tamperingDetected": false,
    "errors": []
  },
  "auditHashes": [
    {
      "entryId": "95513523-9a4e-45ba-8435-fe3dfd443720",
      "hash": "f61240b488b0631aaf792b16e4471337bc6929818e4af97c00601010e2be9b3a",
      "previousHash": "0"
    }
  ],
  "summary": {
    "totalDuration": 0,
    "promptCount": 0,
    "responseCount": 0,
    "riskAssessmentCount": 0,
    "finalRiskLevel": null,
    "riskEscalationDetected": false,
    "riskEscalations": []
  }
}
```

### Legacy Format Session

For sessions created before cross-model analysis:

```json
{
  "sessionId": "demo-session-001",
  "generatedAt": "2026-03-12T18:45:00.000Z",
  "startTimestamp": "2026-03-12T18:00:00.000Z",
  "endTimestamp": "2026-03-12T18:02:30.000Z",
  "totalEvents": 9,
  "prompt": "What is machine learning?",
  "modelAnalysis": [
    {
      "modelName": "amazon.nova-micro-v1:0",
      "response": "Machine learning is a subset of artificial intelligence...",
      "riskLevel": "LOW",
      "riskReason": "Educational content about machine learning"
    }
  ],
  "timeline": [
    {
      "eventType": "prompt",
      "timestamp": "2026-03-12T18:00:00.000Z",
      "durationSincePrevious": null
    },
    {
      "eventType": "response",
      "timestamp": "2026-03-12T18:00:02.500Z",
      "durationSincePrevious": 2500
    },
    {
      "eventType": "risk_assessment",
      "timestamp": "2026-03-12T18:00:03.200Z",
      "durationSincePrevious": 700
    }
  ],
  "integrityVerification": {
    "chainValid": true,
    "entriesVerified": 9,
    "tamperingDetected": false,
    "errors": []
  },
  "auditHashes": [
    {
      "entryId": "entry-1",
      "hash": "abc123...",
      "previousHash": "0"
    },
    {
      "entryId": "entry-2",
      "hash": "def456...",
      "previousHash": "abc123..."
    }
  ],
  "summary": {
    "totalDuration": 150000,
    "promptCount": 3,
    "responseCount": 3,
    "riskAssessmentCount": 3,
    "finalRiskLevel": "LOW",
    "riskEscalationDetected": false,
    "riskEscalations": []
  }
}
```

## Implementation Details

### Core Function: `generateAuditReport()`

```typescript
async function generateAuditReport(sessionId: string) {
  // 1. Retrieve all entries for the session
  const entries = await awsLogStore.getBySession(sessionId);
  
  if (entries.length === 0) {
    throw new Error('Session not found');
  }

  // 2. Reconstruct timeline using replay engine
  const timeline = reconstructTimeline(entries);

  // 3. Verify cryptographic chain integrity
  const integrityCheck = verifyChainIntegrity(entries);

  // 4. Extract prompt and model analysis
  // Supports both cross-model and legacy formats
  
  // 5. Build timeline summary
  
  // 6. Compile audit hashes
  
  // 7. Return comprehensive report
  return report;
}
```

### Data Sources

1. **Session Entries**: Retrieved from DynamoDB via `awsLogStore.getBySession()`
2. **Timeline**: Reconstructed using `reconstructTimeline()` from replay engine
3. **Integrity**: Verified using `verifyChainIntegrity()` from hash chain engine
4. **Model Analysis**: Extracted from audit entry data (supports both formats)

### Backward Compatibility

The report generator supports both:
- **New Format**: Cross-model analysis entries (`cross_model_analysis` event type)
- **Legacy Format**: Separate prompt/response/risk_assessment entries

## Use Cases

### 1. Incident Investigation

When an AI system produces problematic output:

```bash
# Generate report for investigation
curl http://localhost:3001/api/session/incident-session-123/report > incident-report.json

# Review integrity verification
cat incident-report.json | jq '.integrityVerification'

# Check risk escalation
cat incident-report.json | jq '.summary.riskEscalations'
```

### 2. Compliance Auditing

For regulatory compliance:

```bash
# Generate reports for all sessions
curl http://localhost:3001/api/sessions | jq -r '.sessions[]' | while read session; do
  curl http://localhost:3001/api/session/$session/report > "audit-$session.json"
done

# Verify all chains are valid
for file in audit-*.json; do
  echo "$file: $(jq -r '.integrityVerification.chainValid' $file)"
done
```

### 3. Security Analysis

Detect tampering attempts:

```bash
# Check for tampered sessions
curl http://localhost:3001/api/session/suspicious-session/report | \
  jq 'select(.integrityVerification.tamperingDetected == true)'
```

### 4. Risk Assessment Review

Analyze risk patterns:

```bash
# Extract all risk levels
curl http://localhost:3001/api/session/session-id/report | \
  jq '.modelAnalysis[].riskLevel'

# Check for risk escalation
curl http://localhost:3001/api/session/session-id/report | \
  jq '.summary.riskEscalationDetected'
```

## Security Considerations

### Data Sanitization

The report generator:
- ✅ Only includes session-specific data
- ✅ Does not expose AWS credentials
- ✅ Does not expose internal configuration
- ✅ Does not expose database connection strings
- ✅ Does not expose API keys

### Access Control

Recommendations for production:
1. **Authentication**: Require API key or JWT token
2. **Authorization**: Verify user has access to requested session
3. **Rate Limiting**: Prevent abuse of report generation
4. **Audit Logging**: Log all report generation requests

### Data Privacy

Consider:
- **PII Redaction**: Optionally redact personally identifiable information
- **Data Retention**: Implement report retention policies
- **Encryption**: Encrypt reports at rest and in transit

## Error Handling

### Session Not Found (404)

```json
{
  "error": "Session not found"
}
```

### Report Generation Failed (500)

```json
{
  "error": "Failed to generate report",
  "details": "Error message"
}
```

### PDF Format Not Implemented (501)

```json
{
  "error": "PDF export not yet implemented",
  "message": "Use format=json or omit format parameter for JSON report",
  "availableFormats": ["json"]
}
```

## PDF Export (Future Enhancement)

### Recommended Approach

Use a PDF generation library like:

1. **PDFKit** (Node.js native)
```typescript
import PDFDocument from 'pdfkit';

async function generatePDFReport(report: ForensicAuditReport): Promise<Buffer> {
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  
  doc.on('data', (chunk) => chunks.push(chunk));
  
  // Header
  doc.fontSize(20).text('Forensic Audit Report', { align: 'center' });
  doc.moveDown();
  
  // Session Info
  doc.fontSize(14).text(`Session ID: ${report.sessionId}`);
  doc.fontSize(12).text(`Generated: ${report.generatedAt}`);
  doc.moveDown();
  
  // Integrity Verification
  doc.fontSize(14).text('Integrity Verification');
  doc.fontSize(12).text(`Chain Valid: ${report.integrityVerification.chainValid}`);
  doc.text(`Entries Verified: ${report.integrityVerification.entriesVerified}`);
  doc.moveDown();
  
  // Model Analysis
  doc.fontSize(14).text('Model Analysis');
  report.modelAnalysis.forEach((model, i) => {
    doc.fontSize(12).text(`Model ${i + 1}: ${model.modelName}`);
    doc.fontSize(10).text(`Risk Level: ${model.riskLevel}`);
    doc.text(`Response: ${model.response.substring(0, 200)}...`);
    doc.moveDown();
  });
  
  // Timeline
  doc.fontSize(14).text('Timeline');
  report.timeline.forEach((event, i) => {
    doc.fontSize(10).text(`${i + 1}. ${event.eventType} at ${event.timestamp}`);
  });
  
  doc.end();
  
  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
```

2. **Puppeteer** (HTML to PDF)
```typescript
import puppeteer from 'puppeteer';

async function generatePDFReport(report: ForensicAuditReport): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Generate HTML from report
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { text-align: center; }
          .section { margin: 20px 0; }
          .valid { color: green; }
          .invalid { color: red; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Forensic Audit Report</h1>
          <p>Session: ${report.sessionId}</p>
        </div>
        <div class="section">
          <h2>Integrity Verification</h2>
          <p class="${report.integrityVerification.chainValid ? 'valid' : 'invalid'}">
            Chain Valid: ${report.integrityVerification.chainValid}
          </p>
        </div>
        <!-- Add more sections -->
      </body>
    </html>
  `;
  
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  
  await browser.close();
  return pdf;
}
```

3. **React-PDF** (React components to PDF)
```typescript
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View } from '@react-pdf/renderer';

const ReportDocument = ({ report }: { report: ForensicAuditReport }) => (
  <Document>
    <Page>
      <View>
        <Text>Forensic Audit Report</Text>
        <Text>Session: {report.sessionId}</Text>
      </View>
      <View>
        <Text>Integrity: {report.integrityVerification.chainValid ? 'Valid' : 'Invalid'}</Text>
      </View>
    </Page>
  </Document>
);

async function generatePDFReport(report: ForensicAuditReport): Promise<Buffer> {
  const stream = await renderToStream(<ReportDocument report={report} />);
  return streamToBuffer(stream);
}
```

### Implementation Steps

1. **Install PDF library**:
```bash
npm install pdfkit
npm install --save-dev @types/pdfkit
```

2. **Update endpoint handler**:
```typescript
if (format === 'pdf') {
  const pdfBuffer = await generatePDFReport(report);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="audit-${sessionId}.pdf"`);
  res.send(pdfBuffer);
  return;
}
```

3. **Add PDF generation function** (see examples above)

## Testing

### Test Report Generation

```bash
# Test with existing session
curl http://localhost:3001/api/session/cross-model-demo-001/report

# Test with non-existent session
curl http://localhost:3001/api/session/non-existent/report
# Expected: 404 error

# Test PDF format (not yet implemented)
curl http://localhost:3001/api/session/cross-model-demo-001/report?format=pdf
# Expected: 501 error
```

### Verify Report Contents

```bash
# Check integrity verification
curl -s http://localhost:3001/api/session/SESSION_ID/report | \
  jq '.integrityVerification'

# Check model analysis
curl -s http://localhost:3001/api/session/SESSION_ID/report | \
  jq '.modelAnalysis'

# Check timeline
curl -s http://localhost:3001/api/session/SESSION_ID/report | \
  jq '.timeline'

# Check audit hashes
curl -s http://localhost:3001/api/session/SESSION_ID/report | \
  jq '.auditHashes'
```

## Integration with Frontend

### Download Report Button

```tsx
const downloadReport = async (sessionId: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/session/${sessionId}/report`);
    const report = await response.json();
    
    // Download as JSON file
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download report:', error);
  }
};

// Usage in component
<button onClick={() => downloadReport(sessionId)}>
  Download Audit Report
</button>
```

### Display Report Summary

```tsx
interface ReportSummaryProps {
  sessionId: string;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ sessionId }) => {
  const [report, setReport] = useState<ForensicAuditReport | null>(null);
  
  useEffect(() => {
    fetch(`http://localhost:3001/api/session/${sessionId}/report`)
      .then(res => res.json())
      .then(setReport);
  }, [sessionId]);
  
  if (!report) return <div>Loading...</div>;
  
  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Audit Report Summary</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-slate-400">Total Events:</span>
          <span className="text-white ml-2">{report.totalEvents}</span>
        </div>
        
        <div>
          <span className="text-slate-400">Chain Valid:</span>
          <span className={report.integrityVerification.chainValid ? 'text-green-400' : 'text-red-400'}>
            {report.integrityVerification.chainValid ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div>
          <span className="text-slate-400">Risk Level:</span>
          <RiskBadge level={report.summary.finalRiskLevel || 'LOW'} />
        </div>
      </div>
    </div>
  );
};
```

## Benefits

### 1. Comprehensive Documentation
- Complete session history in single report
- All relevant data aggregated
- Cryptographic proof included

### 2. Forensic Value
- Tamper-evident audit trail
- Timeline reconstruction
- Risk escalation tracking

### 3. Compliance Support
- Structured format for auditors
- Integrity verification included
- Exportable for archival

### 4. Investigation Efficiency
- Single API call for complete report
- No need to correlate multiple endpoints
- Ready for analysis tools

## Conclusion

The Forensic Audit Report Generator provides a comprehensive, verified report for any AI session, supporting incident investigation, compliance auditing, and security analysis. The report includes complete timeline reconstruction, risk analysis, and cryptographic integrity proof, making it an essential tool for AI forensic accountability.
