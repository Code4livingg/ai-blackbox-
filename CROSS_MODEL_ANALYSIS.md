# Cross-Model Risk Analysis Feature

## Overview

The AI Blackbox system now supports cross-model risk analysis, evaluating multiple foundation models simultaneously to compare their responses and risk profiles. This feature strengthens AI forensic auditing by revealing model safety variability.

## Implementation Details

### Models Evaluated

1. **Amazon Nova Micro** (`apac.amazon.nova-micro-v1:0`)
   - Fast, cost-effective model
   - APAC inference profile for optimal routing

2. **Anthropic Claude 3 Haiku** (`anthropic.claude-3-haiku-20240307-v1:0`)
   - Anthropic's safety-focused model
   - Known for strong content moderation

### Updated Data Flow

```
User Prompt
  ↓
POST /api/analyze
  ↓
Parallel Model Invocation:
  ├─→ Nova Micro → Response A → Risk Assessment A
  └─→ Claude Haiku → Response B → Risk Assessment B
  ↓
Combined Audit Entry Created
  ↓
Hash Chain Computation
  ↓
Store in DynamoDB + S3
  ↓
Return Comparison Results
```

### New Audit Entry Structure

```typescript
{
  id: string,
  sessionId: string,
  timestamp: number,
  eventType: 'cross_model_analysis',
  data: {
    prompt: string,
    models: [
      {
        modelName: 'Amazon Nova Micro',
        modelId: 'apac.amazon.nova-micro-v1:0',
        response: string,
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
        riskReason: string,
        tokens: number
      },
      {
        modelName: 'Anthropic Claude 3 Haiku',
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        response: string,
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
        riskReason: string,
        tokens: number
      }
    ]
  },
  previousHash: string,
  hash: string
}
```

### Example Audit Entry JSON

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "sessionId": "demo-session-003",
  "timestamp": 1773340000000,
  "eventType": "cross_model_analysis",
  "data": {
    "prompt": "Explain the risks of AI in healthcare",
    "models": [
      {
        "modelName": "Amazon Nova Micro",
        "modelId": "apac.amazon.nova-micro-v1:0",
        "response": "AI in healthcare presents several risks including data privacy concerns, algorithmic bias in diagnosis, over-reliance on automated systems, and potential errors in critical medical decisions...",
        "riskLevel": "MEDIUM",
        "riskReason": "Discusses sensitive healthcare topics and potential AI risks",
        "tokens": 245
      },
      {
        "modelName": "Anthropic Claude 3 Haiku",
        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
        "response": "Healthcare AI systems must be carefully evaluated for safety. Key risks include: 1) Diagnostic errors from biased training data, 2) Privacy violations from patient data exposure, 3) Liability questions when AI makes mistakes...",
        "riskLevel": "MEDIUM",
        "riskReason": "Addresses healthcare AI safety concerns and ethical considerations",
        "tokens": 198
      }
    ]
  },
  "previousHash": "e7fafc8529436a2dbdd68eb9615515df8f4b99fa00f3231e61ef8e7a706b7eb5",
  "hash": "3c9d4a8b7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b"
}
```

## API Response Format

### POST /api/analyze

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
  "sessionId": "demo-session-003",
  "prompt": "Your prompt here",
  "models": [
    {
      "modelName": "Amazon Nova Micro",
      "modelId": "apac.amazon.nova-micro-v1:0",
      "response": "Model response text...",
      "riskLevel": "LOW",
      "riskReason": "Safe educational content",
      "tokens": 150
    },
    {
      "modelName": "Anthropic Claude 3 Haiku",
      "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
      "response": "Model response text...",
      "riskLevel": "LOW",
      "riskReason": "Safe educational content",
      "tokens": 145
    }
  ],
  "auditEntryId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "hash": "3c9d4a8b7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
  "previousHash": "e7fafc8529436a2dbdd68eb9615515df8f4b99fa00f3231e61ef8e7a706b7eb5"
}
```

## Backend Implementation

### Key Functions

#### `invokeBedrockModel(modelId: string, prompt: string)`
- Unified function for invoking any Bedrock model
- Handles different payload formats (Nova vs Claude)
- Returns response text and token counts

#### `assessRisk(prompt: string, response: string, modelId: string)`
- Evaluates risk for a specific model's response
- Uses the same model for risk assessment
- Returns risk level (LOW/MEDIUM/HIGH) and reasoning

#### Updated `/api/analyze` Endpoint
- Evaluates multiple models in parallel using `Promise.all()`
- Creates single audit entry with all model results
- Maintains hash chain integrity
- Handles individual model failures gracefully

### Error Handling

If a model fails to respond:
```typescript
{
  modelName: "Model Name",
  modelId: "model-id",
  response: "Error: Model invocation failed",
  riskLevel: "MEDIUM",
  riskReason: "Model evaluation failed",
  tokens: 0
}
```

## Frontend Integration Notes

### Dashboard Updates Needed

#### 1. Analyze Page (`AnalyzePage.tsx`)

**Current Display:**
- Single response box
- Single risk badge
- Single audit entry

**Updated Display:**
- Model comparison cards (side-by-side or stacked)
- Risk badge for each model
- Highlight risk level differences
- Show token usage per model

**Example UI Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {result.models.map((model) => (
    <div key={model.modelId} className="bg-slate-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{model.modelName}</h3>
        <RiskBadge level={model.riskLevel} />
      </div>
      <p className="text-slate-300">{model.response}</p>
      <div className="mt-4 text-sm text-slate-400">
        <div>Risk: {model.riskReason}</div>
        <div>Tokens: {model.tokens}</div>
      </div>
    </div>
  ))}
</div>
```

#### 2. Sessions Page (`SessionsPage.tsx`)

**Timeline Display:**
- Show cross-model analysis events
- Display model comparison summary
- Highlight risk discrepancies between models

**Example Event Card:**
```tsx
{event.eventType === 'cross_model_analysis' && (
  <div className="space-y-3">
    <div className="text-sm text-slate-400">
      Prompt: {event.data.prompt}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {event.data.models?.map((model) => (
        <div key={model.modelId} className="bg-slate-900 p-3 rounded">
          <div className="font-semibold text-sm">{model.modelName}</div>
          <RiskBadge level={model.riskLevel} className="mt-2" />
        </div>
      ))}
    </div>
  </div>
)}
```

#### 3. Dashboard Page (`DashboardPage.tsx`)

**New Metrics:**
- Model agreement rate (% of times models agree on risk level)
- Risk discrepancy count
- Most conservative model
- Most permissive model

#### 4. New Comparison View (Optional)

Create a dedicated comparison page showing:
- Side-by-side model responses
- Risk level differences highlighted
- Response length comparison
- Token efficiency comparison
- Historical agreement trends

### Type Definitions for Frontend

```typescript
interface ModelResult {
  modelName: string;
  modelId: string;
  response: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskReason: string;
  tokens: number;
}

interface AnalyzeResponse {
  sessionId: string;
  prompt: string;
  models: ModelResult[];
  auditEntryId: string;
  hash: string;
  previousHash: string;
}
```

## Benefits of Cross-Model Analysis

### 1. Safety Validation
- Identifies when models disagree on risk assessment
- Reveals potential blind spots in individual models
- Provides multiple perspectives on content safety

### 2. Model Comparison
- Demonstrates response quality differences
- Shows token efficiency variations
- Reveals model-specific biases

### 3. Forensic Value
- Complete audit trail includes all model evaluations
- Enables post-incident analysis of model behavior
- Supports compliance with multi-model validation requirements

### 4. Risk Escalation Detection
- Flags when one model rates content as high risk while another doesn't
- Enables investigation of discrepancies
- Supports human review of borderline cases

## Testing the Feature

### Test with curl:

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain the ethical considerations of AI in criminal justice",
    "sessionId": "cross-model-test-001"
  }'
```

### Expected Behavior:
1. Both models receive the same prompt
2. Each model generates its own response
3. Each response is independently risk-assessed
4. Single audit entry contains both results
5. Hash chain remains valid
6. Response shows model comparison

### Verification:

```bash
# Check integrity
curl http://localhost:3001/api/integrity

# View session
curl http://localhost:3001/api/session/cross-model-test-001

# Check stats
curl http://localhost:3001/api/stats
```

## Performance Considerations

### Parallel Execution
- Models are invoked in parallel using `Promise.all()`
- Total latency ≈ slowest model response time
- Not 2x the single-model latency

### Cost Implications
- 2x token usage (two models invoked)
- 2x Bedrock API calls per analysis
- Consider implementing model selection based on use case

### Optimization Options
1. **Selective Comparison**: Only use cross-model for high-stakes queries
2. **Caching**: Cache model responses for identical prompts
3. **Async Processing**: Return primary model immediately, compare in background
4. **Model Rotation**: Alternate which models are compared

## Future Enhancements

1. **Configurable Models**: Allow users to select which models to compare
2. **Consensus Scoring**: Aggregate risk scores across models
3. **Disagreement Alerts**: Notify when models significantly disagree
4. **Model Performance Metrics**: Track accuracy, speed, cost per model
5. **A/B Testing**: Compare model performance over time
6. **Custom Risk Thresholds**: Set different thresholds per model

## Backward Compatibility

The system maintains backward compatibility:
- Old audit entries with single model responses remain valid
- Hash chain verification works for both old and new entry types
- Frontend can gracefully handle both formats
- Existing endpoints unchanged (sessions, integrity, stats)

## Security Considerations

- All model responses are logged and hashed
- Risk assessments are tamper-evident
- Model failures are logged and auditable
- No sensitive data is exposed in error messages
- IAM permissions required for both models
