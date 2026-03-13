# Integration Testing Guide

## Quick Test Procedure

### Prerequisites
1. API server running on port 3001
2. Dashboard running on port 5174
3. AWS credentials configured
4. Demo data exists in DynamoDB

### Test 1: Cross-Model Analysis

**Steps**:
```bash
# 1. Start the API server (if not running)
cd ~/ai-blackbox
npm run dev

# 2. Start the dashboard (in another terminal)
cd ~/ai-blackbox/dashboard
npm run dev

# 3. Test cross-model analysis via API
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What are the ethical implications of AI in healthcare?", "sessionId": "test-integration-001"}'
```

**Expected Response**:
```json
{
  "sessionId": "test-integration-001",
  "prompt": "What are the ethical implications of AI in healthcare?",
  "models": [
    {
      "modelName": "Amazon Nova Micro",
      "modelId": "apac.amazon.nova-micro-v1:0",
      "response": "...",
      "riskLevel": "LOW",
      "riskReason": "...",
      "tokens": 123
    },
    {
      "modelName": "Anthropic Claude 3 Haiku",
      "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
      "response": "...",
      "riskLevel": "LOW",
      "riskReason": "...",
      "tokens": 456
    }
  ],
  "auditEntryId": "...",
  "hash": "...",
  "previousHash": "..."
}
```

**Frontend Test**:
1. Open http://localhost:5174
2. Navigate to "Analyze" page
3. Enter prompt: "What are the ethical implications of AI in healthcare?"
4. Click "Analyze"
5. Verify:
   - ✓ Two model cards appear side-by-side
   - ✓ Each shows model name, response, and risk badge
   - ✓ Risk comparison summary displays
   - ✓ Audit trail shows session ID, entry ID, and hashes

### Test 2: Forensic Report Download

**Steps**:
```bash
# 1. Generate test report via API
curl http://localhost:3001/api/session/test-integration-001/report > test-report.json

# 2. Verify report structure
cat test-report.json | jq '.sessionId, .totalEvents, .integrityVerification.chainValid'
```

**Expected Output**:
```
"test-integration-001"
1
true
```

**Frontend Test**:
1. Open http://localhost:5174
2. Navigate to "Sessions" page
3. Click on "test-integration-001" session
4. Verify session timeline displays
5. Click "Download Audit Report" button
6. Verify:
   - ✓ Button shows "Generating..." with spinner
   - ✓ File downloads automatically
   - ✓ Filename format: `audit-report-test-integration-001-{timestamp}.json`
   - ✓ File contains complete report structure

### Test 3: Report Structure Validation

**Validate Downloaded Report**:
```bash
# Check report has all required fields
cat audit-report-*.json | jq 'keys'
```

**Expected Keys**:
```json
[
  "auditHashes",
  "endTimestamp",
  "generatedAt",
  "integrityVerification",
  "modelAnalysis",
  "prompt",
  "sessionId",
  "startTimestamp",
  "summary",
  "timeline",
  "totalEvents"
]
```

**Validate Integrity Section**:
```bash
cat audit-report-*.json | jq '.integrityVerification'
```

**Expected**:
```json
{
  "chainValid": true,
  "entriesVerified": 1,
  "tamperingDetected": false,
  "errors": []
}
```

**Validate Model Analysis**:
```bash
cat audit-report-*.json | jq '.modelAnalysis'
```

**Expected**:
```json
[
  {
    "modelName": "Amazon Nova Micro",
    "response": "...",
    "riskLevel": "LOW",
    "riskReason": "..."
  },
  {
    "modelName": "Anthropic Claude 3 Haiku",
    "response": "...",
    "riskLevel": "LOW",
    "riskReason": "..."
  }
]
```

### Test 4: Multiple Sessions

**Create Multiple Test Sessions**:
```bash
# Session 1: Healthcare
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "How does AI assist in medical diagnosis?", "sessionId": "multi-test-001"}'

# Session 2: Finance
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What role does AI play in fraud detection?", "sessionId": "multi-test-002"}'

# Session 3: Education
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "How can AI personalize learning experiences?", "sessionId": "multi-test-003"}'
```

**Frontend Test**:
1. Navigate to Sessions page
2. Verify all three sessions appear in list
3. Click each session and verify:
   - ✓ Timeline displays correctly
   - ✓ Model comparison shows both models
   - ✓ Risk badges display
   - ✓ Hash chain is visible
4. Download report for each session
5. Verify each report is unique and complete

### Test 5: Integrity Verification

**Check Integrity via API**:
```bash
curl http://localhost:3001/api/integrity | jq '.'
```

**Expected**:
```json
{
  "overallValid": true,
  "sessions": [
    {
      "sessionId": "test-integration-001",
      "valid": true,
      "entryCount": 1
    },
    {
      "sessionId": "multi-test-001",
      "valid": true,
      "entryCount": 1
    },
    {
      "sessionId": "multi-test-002",
      "valid": true,
      "entryCount": 1
    },
    {
      "sessionId": "multi-test-003",
      "valid": true,
      "entryCount": 1
    }
  ],
  "timestamp": 1234567890
}
```

**Frontend Test**:
1. Navigate to Integrity page
2. Verify:
   - ✓ Overall status shows "Chain Integrity Valid"
   - ✓ Green checkmark icon displays
   - ✓ All sessions show as valid
   - ✓ Entry counts are correct
   - ✓ No error messages appear

### Test 6: Dashboard Statistics

**Frontend Test**:
1. Navigate to Dashboard page
2. Verify stats cards show:
   - ✓ Total Entries: 4+ (from test sessions)
   - ✓ Total Sessions: 4+ (from test sessions)
   - ✓ Chain Integrity: Valid (green)
   - ✓ Latest Entry: Recent timestamp
3. Verify risk distribution:
   - ✓ LOW RISK: 4+ entries
   - ✓ MEDIUM RISK: 0 entries
   - ✓ HIGH RISK: 0 entries
4. Verify chart displays (mock data)

### Test 7: Error Handling

**Test Non-Existent Session**:
```bash
curl http://localhost:3001/api/session/non-existent-session/report
```

**Expected**:
```json
{
  "error": "Session not found"
}
```

**Frontend Test**:
1. Manually navigate to a session that doesn't exist
2. Try to download report
3. Verify:
   - ✓ Error alert appears
   - ✓ Button returns to normal state
   - ✓ No file downloads

**Test PDF Format (Not Implemented)**:
```bash
curl "http://localhost:3001/api/session/test-integration-001/report?format=pdf"
```

**Expected**:
```json
{
  "error": "PDF export not yet implemented",
  "message": "Use format=json or omit format parameter for JSON report",
  "availableFormats": ["json"]
}
```

### Test 8: Responsive Design

**Frontend Test**:
1. Open dashboard in browser
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Test different screen sizes:
   - Mobile (375px): Single column layout
   - Tablet (768px): Two-column grid
   - Desktop (1920px): Full multi-column
5. Verify:
   - ✓ All content is readable
   - ✓ No horizontal scrolling
   - ✓ Buttons are accessible
   - ✓ Model cards stack properly on mobile

### Test 9: Performance

**Measure API Response Times**:
```bash
# Cross-model analysis
time curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test performance", "sessionId": "perf-test-001"}' \
  -o /dev/null -s

# Report generation
time curl http://localhost:3001/api/session/perf-test-001/report \
  -o /dev/null -s
```

**Expected Times**:
- Cross-model analysis: 2-5 seconds (parallel model invocation)
- Report generation: <500ms (single session)

**Frontend Performance**:
1. Open DevTools Network tab
2. Navigate between pages
3. Verify:
   - ✓ Page transitions are smooth
   - ✓ API calls complete quickly
   - ✓ No unnecessary re-renders
   - ✓ Loading states are clear

### Test 10: Data Consistency

**Verify Hash Chain**:
```bash
# Get session entries
curl http://localhost:3001/api/session/test-integration-001 | jq '.entries'

# Verify first entry has previousHash = "0"
curl http://localhost:3001/api/session/test-integration-001 | jq '.entries[0].previousHash'

# Verify hash chain links
curl http://localhost:3001/api/session/test-integration-001 | jq '.entries[] | {id, hash, previousHash}'
```

**Expected**:
- First entry: `previousHash = "0"`
- Each subsequent entry: `previousHash = previous entry's hash`
- All hashes are 64-character hex strings

## Cleanup

**Remove Test Data**:
```bash
# List test sessions
aws dynamodb scan --table-name ai-blackbox-logs \
  --filter-expression "begins_with(sessionId, :prefix)" \
  --expression-attribute-values '{":prefix":{"S":"test-"}}' \
  --query "Items[*].id.S" --output text

# Delete test entries (run for each ID)
aws dynamodb delete-item --table-name ai-blackbox-logs \
  --key '{"id":{"S":"ENTRY_ID_HERE"}}'
```

**Or use the cleanup script**:
```bash
# Clear all data
bash scripts/cleanup-aws-infrastructure.sh

# Recreate infrastructure
bash scripts/setup-aws-infrastructure.sh
```

## Success Criteria

All tests should pass with:
- ✓ No TypeScript errors
- ✓ No console errors
- ✓ All API endpoints respond correctly
- ✓ All frontend features work as expected
- ✓ Reports download successfully
- ✓ Cross-model comparison displays correctly
- ✓ Hash chain integrity is maintained
- ✓ Responsive design works on all screen sizes
- ✓ Performance is acceptable (<5s for analysis, <1s for reports)

## Troubleshooting

### Issue: Models not responding
**Solution**: Check AWS credentials and region configuration

### Issue: Report download fails
**Solution**: Check browser console for errors, verify session exists

### Issue: Dashboard not loading
**Solution**: Verify API server is running on port 3001

### Issue: TypeScript errors
**Solution**: Run `npm install` in dashboard directory

### Issue: CORS errors
**Solution**: Verify CORS is enabled in API server

## Conclusion

If all tests pass, the integration is complete and the system is ready for production use.
