# AI Blackbox 🔒

A forensic-grade accountability layer for AI systems built for the AWS 10,000 AIdeas competition.

## Features

- **100% AWS-Native**: Uses Amazon Bedrock (Nova Micro), DynamoDB, and S3
- **Hash Chain Integrity**: Every audit log entry is SHA-256 hashed with the previous entry, creating a tamper-evident chain
- **Forensic Replay**: Reconstruct complete interaction timelines with risk escalation detection
- **Risk Assessment**: Automatic content classification (HIGH/MEDIUM/LOW) using Amazon Bedrock
- **Session Tracking**: Full audit trail per session with integrity verification
- **Durable Storage**: DynamoDB for fast queries, S3 for long-term audit archives
- **REST API**: Complete API for logging, querying, and verifying AI interactions

## AWS Setup

1. Configure AWS credentials:
```bash
aws configure
# Enter your AWS credentials and set region to ap-south-1
```

2. Create AWS infrastructure:
```bash
./scripts/setup-aws-infrastructure.sh
```

This creates:
- DynamoDB table: `ai-blackbox-logs` with sessionId GSI
- S3 bucket: `ai-blackbox-audit-logs` with versioning and encryption

3. Enable Bedrock model access:
   - Go to AWS Console → Bedrock → Model access
   - Request access to `amazon.nova-micro-v1:0` in ap-south-1 region

## Application Setup

1. Install dependencies:
```bash
npm install
```

2. Environment is already configured in `.env`:
```
PORT=3001
AWS_REGION=ap-south-1
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Cleanup

To remove all AWS resources:
```bash
./scripts/cleanup-aws-infrastructure.sh
```

## API Endpoints

### POST /api/analyze
Analyze a prompt with OpenAI and log the interaction.

**Request:**
```json
{
  "prompt": "Your prompt here",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "response": "AI response",
  "riskLevel": "LOW|MEDIUM|HIGH",
  "riskReason": "explanation",
  "auditEntry": { ... }
}
```

### GET /api/sessions
Get all session IDs.

### GET /api/session/:sessionId
Get forensic replay of a specific session with timeline reconstruction.

### GET /api/integrity
Verify the integrity of the entire hash chain.

### GET /api/stats
Get system statistics including risk distribution and chain status.

## Architecture

- **src/crypto/hashChain.ts**: Hash chaining engine with SHA-256
- **src/storage/logStore.ts**: In-memory singleton log store with session indexing
- **src/api/server.ts**: Express REST API server
- **src/replay/replayEngine.ts**: Timeline reconstruction and risk escalation detection

## Security

All audit entries are cryptographically linked using SHA-256 hash chains, making any tampering immediately detectable through integrity verification.


## API Endpoints

### POST /api/analyze
Analyze a prompt with Amazon Bedrock and log the interaction.

**Request:**
```json
{
  "prompt": "Your prompt here",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "response": "AI response from Bedrock",
  "riskLevel": "LOW|MEDIUM|HIGH",
  "riskReason": "explanation",
  "auditEntry": { ... }
}
```

### GET /api/sessions
Get all session IDs.

### GET /api/session/:sessionId
Get forensic replay of a specific session with timeline reconstruction.

### GET /api/integrity
Verify the integrity of the entire hash chain.

### GET /api/stats
Get system statistics including risk distribution and chain status.

## Architecture

- **src/crypto/hashChain.ts**: Hash chaining engine with SHA-256
- **src/storage/awsLogStore.ts**: DynamoDB + S3 storage with session indexing
- **src/api/server.ts**: Express REST API server with Bedrock integration
- **src/replay/replayEngine.ts**: Timeline reconstruction and risk escalation detection

## AWS Services Used

- **Amazon Bedrock**: Nova Micro model for AI inference and risk assessment
- **DynamoDB**: Fast, scalable storage with GSI for session queries
- **S3**: Durable audit log archives with versioning and encryption
- **IAM**: Default credential chain (no hardcoded keys)

## Security

- All audit entries are cryptographically linked using SHA-256 hash chains
- Any tampering is immediately detectable through integrity verification
- S3 versioning preserves complete audit history
- Server-side encryption at rest
- No API keys in code - uses AWS credential chain
