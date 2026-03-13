# AI Blackbox - Demo Data Summary

## Fresh Data Generated ✅

### Sessions Created

**demo-session-001** (6 entries)
- Prompt 1: "What is machine learning?"
- Prompt 2: "Explain neural networks"
- Both prompts with full AI responses and risk assessments
- All entries: LOW risk
- Hash chain: VALID ✓

**demo-session-002** (3 entries)
- Prompt: "How does fraud detection work in banking?"
- Full AI response with risk assessment
- All entries: LOW risk
- Hash chain: VALID ✓

### System Statistics

- **Total Entries**: 9 audit log entries
- **Total Sessions**: 2 active sessions
- **Chain Integrity**: VALID for all sessions ✓
- **Risk Distribution**:
  - LOW: 3 interactions
  - MEDIUM: 0 interactions
  - HIGH: 0 interactions

### Verification

All hash chains are cryptographically valid:
```json
{
  "overallValid": true,
  "sessions": [
    {
      "sessionId": "demo-session-001",
      "valid": true,
      "entryCount": 6
    },
    {
      "sessionId": "demo-session-002",
      "valid": true,
      "entryCount": 3
    }
  ]
}
```

### Access Points

- **API Server**: http://localhost:3001
- **Dashboard**: http://localhost:5174

### Demo Features to Showcase

1. **Dashboard Page**: View stats, risk distribution, and interaction chart
2. **Analyze Page**: Submit new prompts and see real-time risk assessment
3. **Sessions Page**: 
   - Click on demo-session-001 to see 2 interactions with timeline
   - Click on demo-session-002 to see 1 interaction
   - View complete hash chains for each session
4. **Integrity Page**: See green checkmarks showing all chains are valid

### AWS Resources

- **DynamoDB**: ai-blackbox-logs (9 items)
- **S3**: ai-blackbox-audit-logs (9 JSON files)
- **Bedrock**: amazon.nova-micro-v1:0 (apac inference profile)
- **Region**: ap-south-1

All data is clean, valid, and ready for demonstration!
