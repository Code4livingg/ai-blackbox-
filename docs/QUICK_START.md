# AI Blackbox - Quick Start Guide

## What is AI Blackbox?

AI Blackbox is a forensic accountability system for AI interactions. It captures prompts, model responses, and risk classifications in a tamper-evident cryptographic hash chain, enabling complete forensic replay and audit reporting.

## Quick Start

### 1. Start the System

```bash
# Terminal 1: Start API Server
cd ~/ai-blackbox
npm run dev
# Server runs on http://localhost:3001

# Terminal 2: Start Dashboard
cd ~/ai-blackbox/dashboard
npm run dev
# Dashboard runs on http://localhost:5174
```

### 2. Access the Dashboard

Open your browser to: http://localhost:5174

### 3. Try It Out

#### Analyze a Prompt
1. Click "Analyze" in the sidebar
2. Enter a prompt: "What are the benefits of AI in education?"
3. Click "Analyze"
4. View responses from both AI models side-by-side
5. See risk assessments and audit trail

#### View Sessions
1. Click "Sessions" in the sidebar
2. Select any session from the list
3. View complete timeline of events
4. Click "Download Audit Report" to get forensic report

#### Check Integrity
1. Click "Integrity" in the sidebar
2. View overall chain validity status
3. See per-session integrity details

## Key Features

### 🔍 Cross-Model Analysis
- Evaluates prompts with multiple AI models simultaneously
- Amazon Nova Micro + Anthropic Claude 3 Haiku
- Side-by-side comparison of responses
- Individual risk assessments per model

### 📊 Forensic Reports
- One-click download of comprehensive audit reports
- Complete session timeline
- Cryptographic integrity verification
- Risk escalation detection
- JSON format (PDF coming soon)

### 🔒 Tamper-Evident Hash Chain
- SHA-256 cryptographic linking
- Each entry linked to previous entry
- Immediate detection of any tampering
- Per-session chain verification

### 📈 Real-Time Dashboard
- Total entries and sessions
- Chain integrity status
- Risk distribution (LOW/MEDIUM/HIGH)
- Latest activity timestamp

## API Endpoints

### Analyze Prompt
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Your prompt here", "sessionId": "optional-session-id"}'
```

### Get Forensic Report
```bash
curl http://localhost:3001/api/session/SESSION_ID/report > report.json
```

### Check Integrity
```bash
curl http://localhost:3001/api/integrity
```

### Get All Sessions
```bash
curl http://localhost:3001/api/sessions
```

### Get Session Timeline
```bash
curl http://localhost:3001/api/session/SESSION_ID
```

### Get Statistics
```bash
curl http://localhost:3001/api/stats
```

## Example Workflow

### Forensic Investigation
```bash
# 1. Analyze a prompt
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "How does AI detect fraud?", "sessionId": "investigation-001"}'

# 2. Get the session timeline
curl http://localhost:3001/api/session/investigation-001

# 3. Generate forensic report
curl http://localhost:3001/api/session/investigation-001/report > investigation-report.json

# 4. Verify integrity
curl http://localhost:3001/api/integrity | jq '.sessions[] | select(.sessionId == "investigation-001")'
```

## Understanding the Reports

### Forensic Report Structure
```json
{
  "sessionId": "investigation-001",
  "generatedAt": "2024-03-13T10:30:00Z",
  "totalEvents": 1,
  "prompt": "How does AI detect fraud?",
  "modelAnalysis": [
    {
      "modelName": "Amazon Nova Micro",
      "response": "...",
      "riskLevel": "LOW",
      "riskReason": "Safe educational content"
    },
    {
      "modelName": "Anthropic Claude 3 Haiku",
      "response": "...",
      "riskLevel": "LOW",
      "riskReason": "Safe educational content"
    }
  ],
  "integrityVerification": {
    "chainValid": true,
    "entriesVerified": 1,
    "tamperingDetected": false
  },
  "auditHashes": [
    {
      "entryId": "...",
      "hash": "...",
      "previousHash": "0"
    }
  ]
}
```

## Risk Levels

- **LOW**: Safe, general, educational content
- **MEDIUM**: Sensitive topics (politics, religion, health, finance)
- **HIGH**: Harmful, dangerous, illegal, or unethical content

## AWS Resources

The system uses:
- **DynamoDB**: `ai-blackbox-logs` table (structured audit entries)
- **S3**: `ai-blackbox-audit-logs` bucket (archival storage)
- **Bedrock**: Nova Micro + Claude 3 Haiku models
- **Region**: ap-south-1

## Troubleshooting

### API Server Won't Start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Check AWS credentials
aws sts get-caller-identity

# Check environment variables
cat .env
```

### Dashboard Won't Load
```bash
# Check if port 5174 is in use
lsof -i :5174

# Reinstall dependencies
cd dashboard
rm -rf node_modules
npm install
```

### Models Not Responding
```bash
# Verify AWS credentials
aws bedrock list-foundation-models --region ap-south-1

# Check IAM permissions
aws iam get-user
```

### CORS Errors
- Verify API server is running on port 3001
- Check CORS configuration in `src/api/server.ts`
- Ensure dashboard is accessing correct API URL

## Configuration

### Environment Variables (.env)
```bash
PORT=3001
AWS_REGION=ap-south-1
# AWS credentials from ~/.aws/credentials
```

### Dashboard Configuration
```typescript
// dashboard/src/pages/*.tsx
const API_URL = 'http://localhost:3001';
```

## Data Management

### Clear All Data
```bash
bash scripts/cleanup-aws-infrastructure.sh
```

### Recreate Infrastructure
```bash
bash scripts/setup-aws-infrastructure.sh
```

### Generate Demo Data
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is machine learning?", "sessionId": "demo-001"}'

curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain neural networks", "sessionId": "demo-001"}'
```

## Performance

- **Cross-model analysis**: 2-5 seconds (parallel invocation)
- **Report generation**: 100-500ms
- **Page load**: <1 second
- **Integrity check**: <1 second

## Security

- Cryptographic hash chain (SHA-256)
- Tamper-evident audit trail
- AWS encryption at rest (S3, DynamoDB)
- No credentials in code
- CORS protection
- Input sanitization

## Documentation

- `README.md` - Project overview
- `ARCHITECTURE.md` - System architecture
- `CROSS_MODEL_ANALYSIS.md` - Cross-model feature
- `FORENSIC_AUDIT_REPORT.md` - Report feature
- `FORENSIC_REPORT_IMPLEMENTATION.md` - Implementation details
- `FRONTEND_INTEGRATION_COMPLETE.md` - Frontend documentation
- `TEST_INTEGRATION.md` - Testing guide
- `SESSION_CONTINUATION_SUMMARY.md` - Latest changes

## Support

For issues or questions:
1. Check the documentation files
2. Review the troubleshooting section
3. Check AWS CloudWatch logs
4. Verify AWS credentials and permissions

## Next Steps

1. ✅ System is running
2. ✅ Try analyzing prompts
3. ✅ Download forensic reports
4. ✅ Verify integrity
5. 📝 Run integration tests (see TEST_INTEGRATION.md)
6. 🚀 Deploy to production

## Production Deployment

Before deploying to production:
1. Add authentication (JWT/API keys)
2. Add authorization checks
3. Enable HTTPS only
4. Add rate limiting
5. Configure monitoring
6. Set up backup strategy
7. Review security settings
8. Test disaster recovery

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]

---

**AI Blackbox** - Forensic Accountability for AI Interactions
