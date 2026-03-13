# AI Blackbox - Serverless Deployment Guide

## Overview

The AI Blackbox backend has been configured for deployment on AWS Lambda using the Serverless Framework. This guide covers setup, deployment, and management.

## Prerequisites

### Required Tools
- Node.js 18.x or higher
- npm or yarn
- AWS CLI configured with credentials
- Serverless Framework CLI

### AWS Permissions Required
- Lambda: CreateFunction, UpdateFunctionCode, DeleteFunction
- DynamoDB: CreateTable, DescribeTable, DeleteTable
- S3: CreateBucket, PutObject, GetObject, DeleteBucket
- IAM: CreateRole, AttachRolePolicy
- Bedrock: InvokeModel

## Installation

### 1. Install Serverless Framework Globally

```bash
npm install -g serverless
serverless --version
```

### 2. Install Project Dependencies

```bash
cd ~/ai-blackbox
npm install -D serverless serverless-plugin-typescript esbuild
npm install serverless-http
```

### 3. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region: ap-south-1
# Enter default output format: json
```

Or set environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=ap-south-1
```

## Project Structure

```
ai-blackbox/
├── serverless.yml              # Serverless configuration
├── src/
│   ├── api/
│   │   ├── server.ts          # Express app (exported)
│   │   └── handler.ts         # Lambda handler wrapper
│   ├── crypto/
│   ├── risk/
│   ├── replay/
│   └── storage/
├── package.json
└── tsconfig.json
```

## Configuration Files

### serverless.yml

The main Serverless configuration file includes:

**Provider Settings**:
- Runtime: Node.js 18.x
- Region: ap-south-1
- Stage: dev (configurable)

**IAM Permissions**:
- Bedrock: InvokeModel
- DynamoDB: Query, Scan, GetItem, PutItem, UpdateItem, DeleteItem
- S3: GetObject, PutObject, ListBucket

**Functions**:
- `api`: Express app handler
  - Memory: 512MB
  - Timeout: 30 seconds
  - HTTP events: ANY method, all paths

**Resources**:
- DynamoDB Table: audit-log-entries
- S3 Bucket: ai-blackbox-audit-archive

### handler.ts

Wraps the Express app for Lambda:

```typescript
import serverless from 'serverless-http';
import app from './server.js';

export const handler = serverless(app);
```

## Deployment

### Deploy to Development

```bash
serverless deploy --stage dev
```

### Deploy to Production

```bash
serverless deploy --stage prod
```

### Deploy Specific Function

```bash
serverless deploy function -f api --stage dev
```

### Deploy with Custom Region

```bash
serverless deploy --stage dev --region ap-south-1
```

## Local Development

### Run Locally with Serverless Offline

```bash
npm install -D serverless-offline
serverless offline start --stage dev
```

### Run Express Directly

```bash
npm run dev
```

## Monitoring and Logs

### View Function Logs

```bash
serverless logs -f api --stage dev --tail
```

### View Recent Logs

```bash
serverless logs -f api --stage dev -n 50
```

### View Logs for Specific Time

```bash
serverless logs -f api --stage dev --startTime 1h
```

## Management

### List Deployed Functions

```bash
serverless info --stage dev
```

### Get Function Details

```bash
serverless describe function -f api --stage dev
```

### Update Environment Variables

Edit `serverless.yml` and redeploy:

```bash
serverless deploy --stage dev
```

### Remove Deployment

```bash
serverless remove --stage dev
```

## Environment Variables

### Available Variables

```yaml
AWS_REGION: ap-south-1
DYNAMODB_TABLE: audit-log-entries-{stage}
S3_BUCKET: ai-blackbox-audit-archive-{stage}
```

### Add Custom Variables

Edit `serverless.yml`:

```yaml
provider:
  environment:
    CUSTOM_VAR: value
```

## API Endpoints

After deployment, the API will be available at:

```
https://{api-id}.execute-api.ap-south-1.amazonaws.com/{stage}/
```

### Available Endpoints

- `POST /api/analyze` - Cross-model analysis
- `GET /api/sessions` - List sessions
- `GET /api/session/:sessionId` - Get session
- `GET /api/session/:sessionId/report` - Generate report
- `GET /api/integrity` - Verify integrity
- `GET /api/stats` - Get statistics

## Troubleshooting

### Issue: "Unable to assume IAM role"

**Solution**: Ensure AWS credentials are configured correctly:

```bash
aws sts get-caller-identity
```

### Issue: "DynamoDB table not found"

**Solution**: Ensure table is created:

```bash
serverless deploy --stage dev
```

### Issue: "Bedrock model not available"

**Solution**: Verify region and model availability:

```bash
aws bedrock list-foundation-models --region ap-south-1
```

### Issue: "Lambda timeout"

**Solution**: Increase timeout in `serverless.yml`:

```yaml
functions:
  api:
    timeout: 60  # Increase from 30
```

### Issue: "Out of memory"

**Solution**: Increase memory in `serverless.yml`:

```yaml
functions:
  api:
    memorySize: 1024  # Increase from 512
```

## Performance Optimization

### Cold Start Optimization

1. **Reduce Package Size**:
   - Use esbuild for bundling
   - Exclude unnecessary dependencies

2. **Increase Memory**:
   - More memory = faster CPU
   - Reduces cold start time

3. **Use Provisioned Concurrency**:
   ```yaml
   functions:
     api:
       provisionedConcurrency: 1
   ```

### Cost Optimization

1. **Use Reserved Concurrency**:
   ```yaml
   functions:
     api:
       reservedConcurrency: 10
   ```

2. **Monitor Usage**:
   ```bash
   serverless metrics --stage dev
   ```

3. **Set Alarms**:
   - Monitor Lambda duration
   - Monitor error rates
   - Monitor DynamoDB usage

## Security Best Practices

### 1. Use IAM Roles

The serverless.yml includes minimal IAM permissions:
- Only Bedrock InvokeModel
- Only specific DynamoDB operations
- Only specific S3 operations

### 2. Encrypt Data

- DynamoDB: Enable encryption at rest
- S3: Enable encryption at rest
- Lambda: Use encrypted environment variables

### 3. VPC Configuration (Optional)

```yaml
provider:
  vpc:
    securityGroupIds:
      - sg-xxxxxxxx
    subnetIds:
      - subnet-xxxxxxxx
```

### 4. API Gateway Security

- Enable API key requirement
- Enable request validation
- Enable WAF (Web Application Firewall)

## Monitoring

### CloudWatch Metrics

Monitor these metrics:
- Duration
- Errors
- Throttles
- Concurrent Executions
- Invocations

### Set Up Alarms

```bash
serverless plugin install -n serverless-plugin-aws-alerts
```

## Scaling

### Auto-Scaling Configuration

DynamoDB auto-scales by default with PAY_PER_REQUEST billing.

For provisioned capacity:

```yaml
resources:
  Resources:
    AuditLogTable:
      Properties:
        BillingMode: PROVISIONED
        ProvisionedThroughput:
          ReadCapacityUnits: 5
          WriteCapacityUnits: 5
```

## Backup and Recovery

### DynamoDB Backups

```bash
aws dynamodb create-backup \
  --table-name audit-log-entries-dev \
  --backup-name audit-backup-$(date +%s)
```

### S3 Versioning

S3 bucket has versioning enabled for audit trail protection.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm install -g serverless
      - run: serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Rollback

### Rollback to Previous Version

```bash
serverless rollback --stage dev
```

### Rollback to Specific Timestamp

```bash
serverless rollback --stage dev --timestamp 1234567890
```

## Cleanup

### Remove All Resources

```bash
serverless remove --stage dev
```

This will delete:
- Lambda function
- API Gateway
- DynamoDB table
- S3 bucket
- IAM role

## Cost Estimation

### Typical Monthly Costs (Development)

- Lambda: ~$0.20 (1M requests)
- DynamoDB: ~$1.25 (on-demand)
- S3: ~$0.50 (storage)
- **Total**: ~$2/month

### Production Costs (Estimated)

- Lambda: ~$5-20 (10-100M requests)
- DynamoDB: ~$10-50 (on-demand)
- S3: ~$5-20 (storage)
- **Total**: ~$20-90/month

## Support and Resources

- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [AWS Bedrock Docs](https://docs.aws.amazon.com/bedrock/)
- [DynamoDB Docs](https://docs.aws.amazon.com/dynamodb/)

## Summary

The AI Blackbox backend is now ready for serverless deployment:

✅ Serverless Framework configured
✅ Lambda handler created
✅ DynamoDB table defined
✅ S3 bucket configured
✅ IAM permissions set
✅ Environment variables configured
✅ Ready for deployment

Deploy with:
```bash
serverless deploy --stage dev
```
