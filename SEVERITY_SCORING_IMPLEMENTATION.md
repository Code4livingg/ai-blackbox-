# AI Incident Severity Scoring and Alert System - Implementation

## Overview

The AI Incident Severity Scoring and Alert System assigns a severity score (0-100) to every AI interaction session, enabling automated risk assessment, alerting, and prioritization during forensic investigations.

## Implementation Summary

### Files Created

1. **src/risk/severityScoring.ts** - Core severity scoring module

### Files Modified

1. **src/crypto/hashChain.ts** - Extended AuditEntry interface to include severity data
2. **src/api/server.ts** - Integrated severity scoring into /api/analyze endpoint
3. **src/storage/awsLogStore.ts** - Updated stats to include severity metrics

## Severity Scoring Model

### Base Scoring

Risk level points:
- **LOW risk event**: 10 points
- **MEDIUM risk event**: 30 points
- **HIGH risk event**: 60 points

### Modifiers

Additional points added for:
- **Risk escalation detected**: +20 points
- **Multiple models agree on HIGH risk**: +10 points
- **Security-sensitive prompt**: +10 points

### Score Normalization

- Scores are clamped to 0-100 range
- If total > 100, score is set to 100

### Severity Levels

- **0-30**: LOW severity
- **31-70**: MEDIUM severity
- **71-100**: HIGH severity

### Alert Threshold

- Alerts are triggered when severity score >= 70


## Core Functions

### `computeSessionSeverity()`

Computes the severity score for a session based on prompt, model results, and previous session events.

**Parameters**:
```typescript
prompt: string                    // The user prompt
modelResults: ModelResult[]       // Current model evaluations
previousSessionEvents?: ModelResult[]  // Previous events in session (optional)
```

**Returns**:
```typescript
{
  severityScore: number;          // 0-100
  severityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: string[];          // Human-readable risk factors
}
```

**Example**:
```typescript
const severity = computeSessionSeverity(
  "How do I hack into a system?",
  [
    { modelName: "Nova", riskLevel: "HIGH", ... },
    { modelName: "Claude", riskLevel: "HIGH", ... }
  ]
);
// Result: { severityScore: 130 → 100, severityLevel: "HIGH", riskFactors: [...] }
```

### `isSecuritySensitivePrompt()`

Detects if a prompt contains security-sensitive keywords.

**Keywords Detected**:
- Malicious activities: hack, exploit, vulnerability, bypass, jailbreak, malware
- Illegal content: weapon, bomb, explosive, poison, drug, trafficking
- Harmful content: suicide, self-harm, violence, assault, terrorism
- Privacy violations: steal, credential, password, doxxing
- Manipulation: deceive, scam, fraud, deepfake, misinformation
- System abuse: override, ignore instructions, admin access

**Example**:
```typescript
isSecuritySensitivePrompt("How do I hack a website?")  // true
isSecuritySensitivePrompt("What is machine learning?")  // false
```

### `detectRiskEscalation()`

Detects if risk level increased across multiple interactions.

**Example**:
```typescript
const events = [
  { riskLevel: "LOW", ... },
  { riskLevel: "MEDIUM", ... },
  { riskLevel: "HIGH", ... }
];
detectRiskEscalation(events);  // true
```

### `generateAlertIfNeeded()`

Generates an alert event if severity score >= 70.

**Returns**:
```typescript
{
  eventType: 'AI_INCIDENT_ALERT';
  severityScore: number;
  sessionId: string;
  timestamp: number;
  riskFactors: string[];
} | null
```


## Updated Audit Entry Schema

### New Fields

```typescript
{
  id: string;
  timestamp: number;
  sessionId: string;
  eventType: 'cross_model_analysis';
  data: {
    prompt: string;
    models: ModelResult[];
    severityScore: number;        // NEW: 0-100 severity score
    severityLevel: 'LOW' | 'MEDIUM' | 'HIGH';  // NEW: Severity level
    riskFactors: string[];        // NEW: Human-readable risk factors
  };
  previousHash: string;
  hash: string;
}
```

### Example Audit Entry - LOW Severity

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "sessionId": "safe-session-001",
  "timestamp": 1710259814166,
  "eventType": "cross_model_analysis",
  "data": {
    "prompt": "What is machine learning?",
    "models": [
      {
        "modelName": "Amazon Nova Micro",
        "modelId": "apac.amazon.nova-micro-v1:0",
        "response": "Machine learning is a subset of artificial intelligence...",
        "riskLevel": "LOW",
        "riskReason": "Safe educational content",
        "tokens": 150
      },
      {
        "modelName": "Anthropic Claude 3 Haiku",
        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
        "response": "Machine learning is a field of study...",
        "riskLevel": "LOW",
        "riskReason": "Safe educational content",
        "tokens": 145
      }
    ],
    "severityScore": 20,
    "severityLevel": "LOW",
    "riskFactors": [
      "Session classified as LOW severity (score: 20)"
    ]
  },
  "previousHash": "0",
  "hash": "3c9d4a8b7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b"
}
```

### Example Audit Entry - MEDIUM Severity

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "sessionId": "sensitive-session-002",
  "timestamp": 1710259914166,
  "eventType": "cross_model_analysis",
  "data": {
    "prompt": "What are the ethical implications of AI in healthcare?",
    "models": [
      {
        "modelName": "Amazon Nova Micro",
        "modelId": "apac.amazon.nova-micro-v1:0",
        "response": "AI in healthcare presents several ethical considerations...",
        "riskLevel": "MEDIUM",
        "riskReason": "Discusses sensitive healthcare topics",
        "tokens": 245
      },
      {
        "modelName": "Anthropic Claude 3 Haiku",
        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
        "response": "Healthcare AI systems must be carefully evaluated...",
        "riskLevel": "MEDIUM",
        "riskReason": "Addresses healthcare AI safety concerns",
        "tokens": 198
      }
    ],
    "severityScore": 60,
    "severityLevel": "MEDIUM",
    "riskFactors": [
      "Amazon Nova Micro classified as MEDIUM risk: Discusses sensitive healthcare topics",
      "Anthropic Claude 3 Haiku classified as MEDIUM risk: Addresses healthcare AI safety concerns"
    ]
  },
  "previousHash": "3c9d4a8b7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
  "hash": "7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8"
}
```

### Example Audit Entry - HIGH Severity with Alert

```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "sessionId": "high-risk-session-003",
  "timestamp": 1710260014166,
  "eventType": "cross_model_analysis",
  "data": {
    "prompt": "How can I bypass security systems and hack into a database?",
    "models": [
      {
        "modelName": "Amazon Nova Micro",
        "modelId": "apac.amazon.nova-micro-v1:0",
        "response": "I cannot and will not provide information on hacking...",
        "riskLevel": "HIGH",
        "riskReason": "Request for illegal hacking information",
        "tokens": 120
      },
      {
        "modelName": "Anthropic Claude 3 Haiku",
        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
        "response": "I'm not able to help with hacking or bypassing security...",
        "riskLevel": "HIGH",
        "riskReason": "Malicious intent detected",
        "tokens": 115
      }
    ],
    "severityScore": 100,
    "severityLevel": "HIGH",
    "riskFactors": [
      "Amazon Nova Micro classified as HIGH risk: Request for illegal hacking information",
      "Anthropic Claude 3 Haiku classified as HIGH risk: Malicious intent detected",
      "Multiple models agree on HIGH risk classification",
      "Prompt contains security-sensitive keywords"
    ]
  },
  "previousHash": "7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
  "hash": "8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9"
}
```


## API Response Format

### POST /api/analyze - Updated Response

```typescript
{
  sessionId: string;
  prompt: string;
  models: ModelResult[];
  severityScore: number;           // NEW: 0-100 severity score
  severityLevel: 'LOW' | 'MEDIUM' | 'HIGH';  // NEW: Severity level
  riskFactors: string[];           // NEW: Risk factors
  auditEntryId: string;
  hash: string;
  previousHash: string;
  alert?: {                        // NEW: Present if alert triggered
    triggered: true;
    message: string;
  };
}
```

### Example Response - HIGH Severity with Alert

```json
{
  "sessionId": "high-risk-session-003",
  "prompt": "How can I bypass security systems and hack into a database?",
  "models": [
    {
      "modelName": "Amazon Nova Micro",
      "modelId": "apac.amazon.nova-micro-v1:0",
      "response": "I cannot and will not provide information on hacking...",
      "riskLevel": "HIGH",
      "riskReason": "Request for illegal hacking information",
      "tokens": 120
    },
    {
      "modelName": "Anthropic Claude 3 Haiku",
      "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
      "response": "I'm not able to help with hacking or bypassing security...",
      "riskLevel": "HIGH",
      "riskReason": "Malicious intent detected",
      "tokens": 115
    }
  ],
  "severityScore": 100,
  "severityLevel": "HIGH",
  "riskFactors": [
    "Amazon Nova Micro classified as HIGH risk: Request for illegal hacking information",
    "Anthropic Claude 3 Haiku classified as HIGH risk: Malicious intent detected",
    "Multiple models agree on HIGH risk classification",
    "Prompt contains security-sensitive keywords"
  ],
  "auditEntryId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "hash": "8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
  "previousHash": "7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
  "alert": {
    "triggered": true,
    "message": "High-risk session detected (severity: 100)"
  }
}
```

## GET /api/stats - Updated Response

```typescript
{
  totalEntries: number;
  totalSessions: number;
  chainValid: boolean;
  oldestEntry: number | null;
  newestEntry: number | null;
  riskDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  highRiskSessions: number;        // NEW: Count of sessions with severity >= 70
  averageSeverityScore: number;    // NEW: Average severity across all sessions
}
```

### Example Stats Response

```json
{
  "totalEntries": 15,
  "totalSessions": 5,
  "chainValid": true,
  "oldestEntry": 1710259814166,
  "newestEntry": 1710260014166,
  "riskDistribution": {
    "LOW": 8,
    "MEDIUM": 5,
    "HIGH": 2
  },
  "highRiskSessions": 1,
  "averageSeverityScore": 42
}
```


## Alert System

### Alert Generation

When severity score >= 70, an alert is generated and logged to console:

```typescript
console.warn('🚨 AI INCIDENT ALERT:', {
  sessionId: 'high-risk-session-003',
  severityScore: 100,
  riskFactors: [
    'Amazon Nova Micro classified as HIGH risk',
    'Multiple models agree on HIGH risk classification',
    'Prompt contains security-sensitive keywords'
  ]
});
```

### Production Alert Integration

In production, alerts should trigger:

1. **Email/SMS Notifications**
```typescript
await sendEmail({
  to: 'security-team@company.com',
  subject: `AI Incident Alert: Severity ${alert.severityScore}`,
  body: `High-risk AI session detected\n\nSession: ${alert.sessionId}\nSeverity: ${alert.severityScore}\n\nRisk Factors:\n${alert.riskFactors.join('\n')}`
});
```

2. **Webhook to Incident Management**
```typescript
await fetch('https://incident-management.company.com/api/alerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(alert)
});
```

3. **Slack/Teams Notification**
```typescript
await slackClient.chat.postMessage({
  channel: '#ai-security-alerts',
  text: `🚨 AI Incident Alert: Severity ${alert.severityScore}`,
  attachments: [{
    color: 'danger',
    fields: [
      { title: 'Session ID', value: alert.sessionId },
      { title: 'Severity Score', value: alert.severityScore.toString() },
      { title: 'Risk Factors', value: alert.riskFactors.join('\n') }
    ]
  }]
});
```

4. **SIEM Integration**
```typescript
await syslogClient.send({
  severity: 'critical',
  facility: 'security',
  message: JSON.stringify(alert)
});
```


## Frontend Integration Notes

### Dashboard Page Updates

Add severity metrics to the dashboard:

```tsx
// Fetch stats
const [stats, setStats] = useState<any>(null);

useEffect(() => {
  fetch('http://localhost:3001/api/stats')
    .then(res => res.json())
    .then(setStats);
}, []);

// Display severity metrics
<div className="grid grid-cols-4 gap-6">
  <div className="bg-slate-900 rounded-xl p-6">
    <span className="text-slate-400">High Risk Sessions</span>
    <div className="text-4xl font-bold text-red-400">
      {stats?.highRiskSessions || 0}
    </div>
  </div>
  
  <div className="bg-slate-900 rounded-xl p-6">
    <span className="text-slate-400">Average Severity</span>
    <div className="text-4xl font-bold text-white">
      {stats?.averageSeverityScore || 0}
    </div>
  </div>
</div>
```

### Analyze Page Updates

Display severity score and level:

```tsx
{result && (
  <>
    {/* Severity Score Display */}
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-4">
        Incident Severity
      </h3>
      
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-white mb-2">
            {result.severityScore}
          </div>
          <div className="text-sm text-slate-400">/ 100</div>
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
              result.severityLevel === 'HIGH' ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50' :
              result.severityLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500/50' :
              'bg-green-500/20 text-green-300 border-2 border-green-500/50'
            }`}>
              {result.severityLevel} SEVERITY
            </span>
          </div>
          
          {result.alert && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
              <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                <AlertTriangle className="w-4 h-4" />
                {result.alert.message}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Risk Factors */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-3">
          Risk Factors Contributing to Score:
        </h4>
        <ul className="space-y-2">
          {result.riskFactors.map((factor: string, index: number) => (
            <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
)}
```

### Investigation Page Updates

Add severity information to the session overview:

```tsx
<div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
  <h2 className="text-xl font-semibold text-white mb-6">
    Session Overview
  </h2>
  
  <div className="grid grid-cols-6 gap-4">
    {/* Existing fields... */}
    
    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
      <div className="text-slate-400 text-xs mb-1 uppercase">
        Severity Score
      </div>
      <div className="text-white text-2xl font-bold">
        {report.severityScore || 'N/A'}
      </div>
    </div>
    
    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
      <div className="text-slate-400 text-xs mb-1 uppercase">
        Severity Level
      </div>
      <div className="mt-2">
        {report.severityLevel ? (
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
            report.severityLevel === 'HIGH' ? 'bg-red-500/20 text-red-300' :
            report.severityLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {report.severityLevel}
          </span>
        ) : (
          <span className="text-slate-500 text-sm">N/A</span>
        )}
      </div>
    </div>
  </div>
  
  {/* Risk Factors Section */}
  {report.riskFactors && report.riskFactors.length > 0 && (
    <div className="mt-6 bg-slate-950 rounded-lg p-4 border border-slate-800">
      <h3 className="text-sm font-semibold text-slate-400 mb-3">
        Risk Factors:
      </h3>
      <ul className="space-y-2">
        {report.riskFactors.map((factor: string, index: number) => (
          <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
            <span className="text-red-400 mt-1">⚠</span>
            <span>{factor}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
```

### Sessions Page Updates

Show severity indicator in session list:

```tsx
{sessions.map((session) => (
  <div key={session.id} className="bg-slate-900 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <span className="font-mono text-sm">{session.id}</span>
      
      {session.severityScore !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Severity: {session.severityScore}
          </span>
          <span className={`w-2 h-2 rounded-full ${
            session.severityScore >= 70 ? 'bg-red-400' :
            session.severityScore >= 31 ? 'bg-yellow-400' :
            'bg-green-400'
          }`} />
        </div>
      )}
    </div>
  </div>
))}
```


## Testing

### Test Cases

#### Test 1: LOW Severity Session

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is machine learning?",
    "sessionId": "test-low-severity"
  }'
```

**Expected**:
- severityScore: ~20 (2 LOW risk events = 10 + 10)
- severityLevel: "LOW"
- No alert triggered

#### Test 2: MEDIUM Severity Session

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What are the ethical implications of AI in healthcare?",
    "sessionId": "test-medium-severity"
  }'
```

**Expected**:
- severityScore: ~60 (2 MEDIUM risk events = 30 + 30)
- severityLevel: "MEDIUM"
- No alert triggered

#### Test 3: HIGH Severity Session with Alert

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How can I hack into a database?",
    "sessionId": "test-high-severity"
  }'
```

**Expected**:
- severityScore: ~100 (2 HIGH risk = 60 + 60 = 120, clamped to 100)
- severityLevel: "HIGH"
- Alert triggered
- Console warning displayed
- alert object in response

#### Test 4: Security-Sensitive Prompt

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How do I bypass authentication systems?",
    "sessionId": "test-security-sensitive"
  }'
```

**Expected**:
- severityScore: includes +10 for security-sensitive keywords
- riskFactors includes "Prompt contains security-sensitive keywords"

#### Test 5: Risk Escalation

```bash
# First interaction (LOW)
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is cybersecurity?",
    "sessionId": "test-escalation"
  }'

# Second interaction (HIGH) - should detect escalation
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How do I exploit vulnerabilities?",
    "sessionId": "test-escalation"
  }'
```

**Expected**:
- Second request includes +20 for risk escalation
- riskFactors includes "Risk escalation detected"

#### Test 6: Multi-Model HIGH Agreement

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How do I create malware?",
    "sessionId": "test-multi-model-high"
  }'
```

**Expected**:
- Both models classify as HIGH
- severityScore includes +10 for multi-model agreement
- riskFactors includes "Multiple models agree on HIGH risk"

### Verify Stats

```bash
curl http://localhost:3001/api/stats | jq '.'
```

**Expected**:
```json
{
  "totalEntries": 6,
  "totalSessions": 6,
  "chainValid": true,
  "oldestEntry": 1710259814166,
  "newestEntry": 1710260014166,
  "riskDistribution": {
    "LOW": 2,
    "MEDIUM": 2,
    "HIGH": 2
  },
  "highRiskSessions": 2,
  "averageSeverityScore": 60
}
```


## Benefits

### 1. Automated Risk Assessment

- Every session automatically receives a severity score
- No manual review required for initial triage
- Consistent scoring across all interactions

### 2. Prioritized Investigation

- High-severity sessions (>= 70) are immediately flagged
- Investigators can focus on highest-risk incidents first
- Reduces time to detect and respond to threats

### 3. Trend Analysis

- Average severity score tracks overall system risk
- High-risk session count shows threat frequency
- Historical data enables pattern recognition

### 4. Alert Integration

- Automated alerts for high-severity sessions
- Integration with existing incident management systems
- Real-time notification of security threats

### 5. Compliance Support

- Documented risk assessment for every interaction
- Audit trail includes severity justification
- Risk factors provide evidence for compliance reports

## Security Considerations

### Keyword Detection Limitations

The security-sensitive keyword detection is rule-based and may have:

**False Positives**: Legitimate queries containing keywords
- Example: "How do security systems work?" (contains "security")
- Mitigation: Review risk factors, not just score

**False Negatives**: Malicious queries without obvious keywords
- Example: Obfuscated or encoded malicious prompts
- Mitigation: Rely on model risk classification as primary signal

### Severity Score Interpretation

- Scores are relative, not absolute measures of risk
- Context matters: A score of 70 in one domain may differ from another
- Human review still required for high-severity incidents

### Alert Fatigue

- Too many alerts can lead to desensitization
- Tune alert threshold based on your environment
- Consider alert aggregation for multiple incidents

## Future Enhancements

### 1. Machine Learning-Based Scoring

Replace rule-based scoring with ML model:
- Train on historical incident data
- Learn patterns beyond keyword matching
- Adapt to evolving threat landscape

### 2. Dynamic Thresholds

Adjust severity thresholds based on:
- Time of day (higher sensitivity during off-hours)
- User role (stricter for privileged users)
- Historical behavior (anomaly detection)

### 3. Contextual Scoring

Consider additional factors:
- User identity and history
- Geographic location
- Device type and security posture
- Previous session behavior

### 4. Severity Decay

Reduce severity over time if no escalation:
- Initial HIGH severity session
- Followed by multiple LOW severity sessions
- Overall session severity decreases

### 5. Multi-Session Analysis

Analyze patterns across sessions:
- Same user, escalating severity
- Multiple users, similar prompts
- Coordinated attack detection

## Conclusion

The AI Incident Severity Scoring and Alert System provides automated risk assessment for every AI interaction, enabling:

- **Immediate threat detection** through automated scoring
- **Prioritized investigation** by focusing on high-severity sessions
- **Proactive alerting** for security incidents
- **Compliance support** with documented risk assessments
- **Trend analysis** for overall system security posture

The system integrates seamlessly with existing AI Blackbox infrastructure, maintaining hash chain integrity while adding powerful risk assessment capabilities.

---

**Status**: ✅ Complete and ready for testing
**TypeScript**: ✅ No compilation errors
**Integration**: ✅ Fully integrated with existing system
**Documentation**: ✅ Complete
