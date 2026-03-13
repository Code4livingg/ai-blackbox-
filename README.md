# AI Blackbox 🔒

**Forensic Accountability for AI Systems**

AI Blackbox is a tamper-evident audit system that records, verifies, and reconstructs every AI decision using cryptographic hash chains and AWS infrastructure.

![AI Blackbox Logo](dashboard/public/aiblackbox-logo.png)

---

## 🎯 Overview

AI Blackbox provides forensic-grade accountability for AI systems by:
- Recording every AI interaction with tamper-evident hash chains
- Analyzing prompts and responses for safety risks using Amazon Bedrock
- Storing immutable audit logs in DynamoDB and S3
- Enabling investigators to replay and verify AI decision timelines

---

## 🏗️ Architecture

```
┌─────────────┐
│   User/AI   │
│   System    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     AI Blackbox API (Lambda)        │
│  ┌───────────────────────────────┐  │
│  │  Express + serverless-http    │  │
│  └───────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│   Amazon    │ │ DynamoDB │ │ Amazon   │ │   Hash Chain │
│   Bedrock   │ │  Audit   │ │    S3    │ │   Integrity  │
│ Risk Model  │ │   Logs   │ │ Archive  │ │  Verification│
└─────────────┘ └──────────┘ └──────────┘ └──────────────┘
       │              │              │              │
       └──────────────┴──────────────┴──────────────┘
                      │
                      ▼
            ┌──────────────────┐
            │  Investigation   │
            │    Dashboard     │
            │  (React + Vite)  │
            └──────────────────┘
```

---

## 🚀 Features

### 🔐 Tamper-Evident Logging
- Every audit entry is cryptographically chained using SHA-256
- Any modification to historical records is immediately detectable
- Complete chain-of-custody for AI decisions

### 🤖 AI Risk Analysis
- Amazon Bedrock models evaluate prompts and responses
- Multi-model consensus for robust threat detection
- Severity scoring (0-100) with LOW/MEDIUM/HIGH classification

### 📊 Forensic Replay
- Reconstruct complete decision timelines
- Verify hash chain integrity
- Generate forensic audit reports

### ⚡ Real-time Monitoring
- Live dashboard with session tracking
- Risk escalation detection
- Alert generation for high-severity incidents

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18.x + TypeScript
- **Framework**: Express.js
- **Deployment**: AWS Lambda + API Gateway (serverless-http)
- **AI Models**: Amazon Bedrock (Nova Micro, Claude 3 Haiku)
- **Storage**: DynamoDB (audit logs) + S3 (archive)
- **Cryptography**: SHA-256 hash chains

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Routing**: React Router

### Infrastructure
- **IaC**: Serverless Framework
- **Region**: us-east-1
- **CI/CD**: GitHub

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- AWS Account with Bedrock access
- AWS CLI configured

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Code4livingg/ai-blackbox-.git
cd ai-blackbox

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your AWS credentials

# Build TypeScript
npm run build

# Deploy to AWS
npx serverless deploy --stage dev --region us-east-1
```

### Frontend Setup

```bash
# Navigate to dashboard
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🎮 Demo Mode

For testing without AWS services:

```bash
# Set demo mode
export DEMO_MODE=true

# Start backend
npm start

# Access demo endpoints
curl http://localhost:3000/api/demo-sessions
```

Demo mode provides:
- Simulated AI responses
- Pre-loaded demo sessions
- No AWS service calls required

---

## 🔌 API Endpoints

### Production API
```
https://1xu53nkchj.execute-api.us-east-1.amazonaws.com/dev
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze prompt with AI models |
| GET | `/api/sessions` | List all sessions |
| GET | `/api/session/:id` | Get session timeline |
| GET | `/api/session/:id/report` | Generate forensic report |
| GET | `/api/integrity` | Verify hash chain |
| GET | `/api/stats` | System statistics |
| GET | `/api/demo-sessions` | Get demo data |

---

## 📖 Usage Examples

### Analyze a Prompt

```bash
curl -X POST https://your-api-url/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How do AI systems make decisions?",
    "sessionId": "session-001"
  }'
```

### Get Session Timeline

```bash
curl https://your-api-url/api/session/session-001
```

### Verify Integrity

```bash
curl https://your-api-url/api/integrity
```

---

## 🎨 Dashboard Features

### Landing Page
- Professional SaaS design
- AWS infrastructure showcase
- Architecture visualization
- Developer resources

### Investigation Console
- Session timeline view
- Model comparison panel
- Integrity verification
- Forensic report export

### Analytics Dashboard
- Real-time statistics
- Risk distribution charts
- Session monitoring
- Alert management

---

## 🔒 Security

- **Hash Chain Integrity**: SHA-256 cryptographic verification
- **Immutable Storage**: DynamoDB + S3 with versioning
- **IAM Permissions**: Least privilege access
- **API Gateway**: Rate limiting and throttling
- **Encryption**: At-rest and in-transit

---

## 📊 Severity Scoring

| Score | Level | Description |
|-------|-------|-------------|
| 0-30 | LOW | Safe, general content |
| 31-69 | MEDIUM | Sensitive topics, requires review |
| 70-100 | HIGH | Harmful, dangerous, or illegal content |

**Modifiers**:
- +20 for risk escalation
- +10 for multi-model HIGH consensus
- +10 for security-sensitive keywords

---

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd dashboard && npm test

# Test API endpoints
./scripts/test-api.sh
```

---

## 📚 Documentation

Additional documentation available in `/docs`:
- Architecture details
- Deployment guides
- API specifications
- Development guides

---

## 🤝 Contributing

This project was built for the AWS 10,000 AIdeas Competition.

---

## 📄 License

ISC

---

## 👤 Author

**Code4livingg**
- GitHub: [@Code4livingg](https://github.com/Code4livingg)
- Repository: [ai-blackbox-](https://github.com/Code4livingg/ai-blackbox-)

---

## 🏆 AWS 10,000 AIdeas Competition

Built with:
- ☁️ Amazon Bedrock
- 📊 Amazon DynamoDB
- 🗄️ Amazon S3
- ⚡ AWS Lambda
- 🌐 Amazon API Gateway

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/Code4livingg/ai-blackbox-.git
cd ai-blackbox && npm install

# 2. Deploy backend
npx serverless deploy --stage dev --region us-east-1

# 3. Start frontend
cd dashboard && npm install && npm run dev

# 4. Open browser
open http://localhost:5173
```

---

**Built for forensic accountability in AI systems** 🔒
