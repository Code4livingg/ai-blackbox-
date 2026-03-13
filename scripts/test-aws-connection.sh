#!/bin/bash

# Test AWS connection and resources

REGION="ap-south-1"
TABLE_NAME="ai-blackbox-logs"
BUCKET_NAME="ai-blackbox-audit-logs"

echo "🔍 Testing AWS Connection and Resources"
echo ""

# Test AWS credentials
echo "1. Testing AWS credentials..."
aws sts get-caller-identity --region $REGION
if [ $? -eq 0 ]; then
  echo "✅ AWS credentials configured"
else
  echo "❌ AWS credentials not configured"
  exit 1
fi
echo ""

# Test DynamoDB table
echo "2. Checking DynamoDB table: $TABLE_NAME"
aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ DynamoDB table exists"
else
  echo "❌ DynamoDB table not found. Run ./scripts/setup-aws-infrastructure.sh"
fi
echo ""

# Test S3 bucket
echo "3. Checking S3 bucket: $BUCKET_NAME"
aws s3 ls s3://$BUCKET_NAME --region $REGION > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ S3 bucket exists"
else
  echo "❌ S3 bucket not found. Run ./scripts/setup-aws-infrastructure.sh"
fi
echo ""

# Test Bedrock access
echo "4. Checking Bedrock model access..."
aws bedrock list-foundation-models --region $REGION --query 'modelSummaries[?modelId==`amazon.nova-micro-v1:0`]' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Bedrock access configured"
else
  echo "⚠️  Bedrock access may need to be enabled in AWS Console"
fi
echo ""

echo "✅ AWS connection test complete!"
