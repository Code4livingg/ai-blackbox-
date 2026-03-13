# AI Blackbox - Vercel Deployment Guide

## ✅ Backend Connected Successfully

The AI Blackbox dashboard is now fully connected to a serverless backend API that works on Vercel.

## 🚀 What's Working

### Dashboard Features
- ✅ **Total Entries**: Shows 10 demo AI interactions
- ✅ **Total Sessions**: Displays 5 unique sessions
- ✅ **Chain Integrity**: Valid blockchain-style hash chain
- ✅ **Risk Distribution**: LOW (6), MEDIUM (2), HIGH (2)
- ✅ **Interactions Over Time**: Chart populated with data
- ✅ **Generate Demo Button**: Creates new AI activity on demand

### API Endpoints
All endpoints are serverless-compatible and work on Vercel:

- `GET /api/stats` - Dashboard statistics
- `GET /api/sessions` - List all sessions
- `GET /api/session/:sessionId` - Get session details
- `GET /api/log` - Get all audit entries
- `GET /api/integrity` - Verify hash chain integrity
- `POST /api/analyze` - Analyze session risk
- `POST /api/demo` - Generate demo AI activity

### Demo Data (Auto-Generated)
The system automatically generates 10 realistic AI interactions on first load:

1. **Quantum Computing** (LOW risk)
2. **Quantum Applications** (LOW risk)
3. **How to hack a website** (HIGH risk)
4. **Ethical Hacking** (MEDIUM risk)
5. **Write a phishing email** (HIGH risk)
6. **Recognize phishing** (LOW risk)
7. **Climate Change** (LOW risk)
8. **Climate Action** (LOW risk)
9. **SQL Injection** (MEDIUM risk)
10. **Database Security** (LOW risk)

## 🔧 Architecture

### Frontend (Dashboard)
- Built with React + TypeScript + Vite
- Deployed to Vercel
- Uses `/api/*` endpoints (relative paths)

### Backend (API)
- Serverless functions in `/api` directory
- In-memory store with blockchain hash chain
- SHA-256 hashing for integrity
- Auto-initializes with demo data

### Hash Chain Structure
Each entry contains:
```typescript
{
  id: string,
  sessionId: string,
  timestamp: number,
  prompt: string,
  response: string,
  model: string,
  riskScore: number,
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
  previousHash: string,
  hash: string  // SHA-256(previousHash + prompt + response + timestamp)
}
```

## 📊 Risk Scoring Logic

- **LOW (0-30)**: Informational, educational content
- **MEDIUM (31-70)**: Security-related, sensitive topics
- **HIGH (71-100)**: Malicious requests, jailbreak attempts

## 🎯 Analysis Engine

The `/api/analyze` endpoint detects:
- Malicious keywords (hack, phishing, injection, exploit)
- Risk escalation patterns
- Multi-session threat analysis
- Jailbreak attempts

## 🔐 Chain Integrity

The system maintains a blockchain-style audit trail:
- Each entry links to the previous hash
- Tampering detection via hash verification
- `/api/integrity` endpoint validates entire chain

## 🎨 UI Features

### Dashboard Page
- Real-time stats refresh (every 5 seconds)
- "Generate Demo AI Activity" button
- Risk distribution visualization
- Interactions over time chart

### Analyze Page
- Enter session ID or log ID
- Risk assessment with explanation
- Suspicious pattern detection
- Actionable recommendations

### Sessions Page
- List all sessions
- View session details
- Download forensic reports

### Integrity Page
- Chain validation status
- Per-session integrity checks
- Tamper detection

## 🚀 Deployment to Vercel

1. **Connect GitHub Repository**
   - Go to Vercel dashboard
   - Import the `ai-blackbox` repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Root Directory: `dashboard`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy**
   - Vercel will automatically detect the API routes
   - Frontend and backend deploy together
   - Demo data auto-generates on first visit

## 📝 Environment Variables

No environment variables required for demo mode!

The system works out-of-the-box with in-memory storage.

## 🧪 Testing

Visit your deployed site:
1. Dashboard loads with 10 entries
2. Click "Generate Demo AI Activity" to add more
3. Navigate to "Analyze" and enter `session-1`
4. Check "Integrity" page - should show "Valid"
5. View "Sessions" to see all activity

## 🎉 Success Criteria

When the site loads, you should see:
- ✅ Total Entries: 10+
- ✅ Total Sessions: 5+
- ✅ Chain Integrity: Valid
- ✅ Charts populated with data
- ✅ Analyze page working
- ✅ Demo button functional

## 🔄 Future Enhancements

To connect to AWS DynamoDB:
1. Add environment variables for AWS credentials
2. Replace `api/store.ts` with DynamoDB client
3. Keep the same API interface
4. No frontend changes needed!

## 📚 API Documentation

### GET /api/stats
Returns dashboard statistics:
```json
{
  "totalEntries": 10,
  "totalSessions": 5,
  "chainValid": true,
  "riskDistribution": {
    "LOW": 6,
    "MEDIUM": 2,
    "HIGH": 2
  }
}
```

### POST /api/analyze
Analyze a session:
```json
{
  "sessionId": "session-1"
}
```

Returns:
```json
{
  "riskLevel": "HIGH",
  "explanation": "...",
  "suspiciousPatterns": [...],
  "recommendation": "..."
}
```

### POST /api/demo
Generate demo activity:
```json
{
  "message": "Demo activity generated successfully",
  "entriesCreated": 3
}
```

## 🎯 Key Features

1. **Blockchain-Style Audit Trail**: Tamper-evident logging
2. **Cross-Model Analysis**: Compare multiple AI responses
3. **Risk Scoring**: Automatic threat detection
4. **Forensic Reports**: Downloadable session analysis
5. **Real-Time Monitoring**: Live dashboard updates
6. **Demo Mode**: Instant data for demonstrations

## 🏆 Competition Ready

This system is fully functional for the AWS 10,000 AIdeas Competition:
- ✅ Works immediately on Vercel
- ✅ No backend setup required
- ✅ Demo data pre-loaded
- ✅ Professional UI
- ✅ Complete audit trail
- ✅ Risk analysis engine
- ✅ Integrity verification

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify API endpoints are responding
3. Test with demo data first
4. Review this deployment guide

---

**Built for AWS 10,000 AIdeas Competition**
*Forensic Accountability for AI Systems*
