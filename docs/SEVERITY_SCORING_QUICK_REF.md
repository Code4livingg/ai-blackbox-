# Severity Scoring - Quick Reference

## Scoring Formula

```
Base Score = Σ(Risk Points per Model)
  LOW = 10 points
  MEDIUM = 30 points  
  HIGH = 60 points

Modifiers:
  + 20 if risk escalation detected
  + 10 if multiple models agree on HIGH
  + 10 if security-sensitive prompt

Final Score = min(Total, 100)
```

## Severity Levels

| Score | Level | Alert |
|-------|-------|-------|
| 0-30 | LOW | No |
| 31-70 | MEDIUM | No |
| 71-100 | HIGH | Yes |

## Example Calculations

### Example 1: Safe Query
```
Prompt: "What is machine learning?"
Models: LOW (10) + LOW (10) = 20
Modifiers: None
Score: 20 → LOW severity
```

### Example 2: Sensitive Topic
```
Prompt: "AI ethics in healthcare"
Models: MEDIUM (30) + MEDIUM (30) = 60
Modifiers: None
Score: 60 → MEDIUM severity
```

### Example 3: Malicious Query
```
Prompt: "How to hack a database?"
Models: HIGH (60) + HIGH (60) = 120
Modifiers: +10 (multi-model HIGH) + 10 (security keywords)
Score: 140 → 100 (clamped) → HIGH severity + ALERT
```

### Example 4: Risk Escalation
```
Session 1: LOW (10) + LOW (10) = 20
Session 2: HIGH (60) + HIGH (60) = 120
Modifiers: +20 (escalation) + 10 (multi-model) + 10 (keywords)
Score: 160 → 100 (clamped) → HIGH severity + ALERT
```

## API Response

```json
{
  "severityScore": 100,
  "severityLevel": "HIGH",
  "riskFactors": [
    "Amazon Nova Micro classified as HIGH risk",
    "Multiple models agree on HIGH risk",
    "Prompt contains security-sensitive keywords"
  ],
  "alert": {
    "triggered": true,
    "message": "High-risk session detected (severity: 100)"
  }
}
```

## Security Keywords

Triggers +10 modifier if prompt contains:
- **Malicious**: hack, exploit, vulnerability, bypass, jailbreak, malware
- **Illegal**: weapon, bomb, explosive, poison, drug, trafficking
- **Harmful**: suicide, self-harm, violence, assault, terrorism
- **Privacy**: steal, credential, password, doxxing
- **Manipulation**: deceive, scam, fraud, deepfake
- **System Abuse**: override, admin access, privilege escalation

## Stats Endpoint

```bash
GET /api/stats
```

Returns:
```json
{
  "highRiskSessions": 2,
  "averageSeverityScore": 45
}
```

## Testing

```bash
# LOW severity
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is AI?", "sessionId": "test-1"}'

# HIGH severity + alert
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "How to hack?", "sessionId": "test-2"}'
```

## Files

- **Implementation**: `src/risk/severityScoring.ts`
- **Integration**: `src/api/server.ts`
- **Types**: `src/crypto/hashChain.ts`
- **Stats**: `src/storage/awsLogStore.ts`
- **Docs**: `SEVERITY_SCORING_IMPLEMENTATION.md`

---

**Quick Tip**: Severity score = Risk assessment + Context modifiers
