# Serverless Deployment - Quick Start

## 1. Install Dependencies

```bash
npm install -g serverless
npm install -D serverless serverless-plugin-typescript esbuild
npm install serverless-http
```

## 2. Configure AWS

```bash
aws configure
# Enter credentials and region: ap-south-1
```

## 3. Deploy

```bash
# Development
serverless deploy --stage dev

# Production
serverless deploy --stage prod
```

## 4. Get API Endpoint

```bash
serverless info --stage dev
```

Output will show:
```
endpoint: https://{api-id}.execute-api.ap-south-1.amazonaws.com/dev
```

## 5. Test API

```bash
curl https://{api-id}.execute-api.ap-south-1.amazonaws.com/dev/api/stats
```

## 6. View Logs

```bash
serverless logs -f api --stage dev --tail
```

## 7. Remove Deployment

```bash
serverless remove --stage dev
```

## Files Created

- `serverless.yml` - Main configuration
- `src/api/handler.ts` - Lambda handler
- `src/api/server.ts` - Updated to export app

## Key Features

✅ Auto-creates DynamoDB table
✅ Auto-creates S3 bucket
✅ Auto-configures IAM role
✅ Supports multiple stages (dev, prod)
✅ TypeScript support
✅ Express app compatibility

## Environment Variables

```
AWS_REGION: ap-south-1
DYNAMODB_TABLE: audit-log-entries-{stage}
S3_BUCKET: ai-blackbox-audit-archive-{stage}
```

## Endpoints

- `POST /api/analyze` - Cross-model analysis
- `GET /api/sessions` - List sessions
- `GET /api/session/:sessionId` - Get session
- `GET /api/session/:sessionId/report` - Generate report
- `GET /api/integrity` - Verify integrity
- `GET /api/stats` - Get statistics

## Troubleshooting

**AWS credentials not found**:
```bash
aws configure
```

**DynamoDB table error**:
```bash
serverless deploy --stage dev
```

**Lambda timeout**:
Edit `serverless.yml` and increase timeout:
```yaml
timeout: 60
```

## Cost

- Lambda: ~$0.20/month (dev)
- DynamoDB: ~$1.25/month (on-demand)
- S3: ~$0.50/month
- **Total**: ~$2/month (dev)

## Next Steps

1. Deploy: `serverless deploy --stage dev`
2. Test: `curl https://{endpoint}/api/stats`
3. Monitor: `serverless logs -f api --stage dev --tail`
4. Scale: Adjust memory/timeout in serverless.yml
5. Secure: Add API key, WAF, VPC

---

**Status**: ✅ Ready for Deployment
