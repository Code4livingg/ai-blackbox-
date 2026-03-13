#!/bin/bash

# AI Blackbox AWS Infrastructure Setup
# Region: ap-south-1

REGION="ap-south-1"
TABLE_NAME="ai-blackbox-logs"
BUCKET_NAME="ai-blackbox-audit-logs"

echo "🚀 Setting up AI Blackbox AWS Infrastructure in $REGION"

# Create DynamoDB Table
echo "📊 Creating DynamoDB table: $TABLE_NAME"
aws dynamodb create-table \
  --table-name $TABLE_NAME \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=sessionId,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "[{
      \"IndexName\": \"sessionId-index\",
      \"KeySchema\": [{\"AttributeName\":\"sessionId\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"timestamp\",\"KeyType\":\"RANGE\"}],
      \"Projection\": {\"ProjectionType\":\"ALL\"},
      \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
    }]" \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

echo "⏳ Waiting for table to become active..."
aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION

# Create S3 Bucket
echo "🪣 Creating S3 bucket: $BUCKET_NAME"
aws s3api create-bucket \
  --bucket $BUCKET_NAME \
  --region $REGION \
  --create-bucket-configuration LocationConstraint=$REGION

# Enable versioning on S3 bucket
echo "📝 Enabling versioning on S3 bucket"
aws s3api put-bucket-versioning \
  --bucket $BUCKET_NAME \
  --versioning-configuration Status=Enabled \
  --region $REGION

# Enable encryption on S3 bucket
echo "🔐 Enabling encryption on S3 bucket"
aws s3api put-bucket-encryption \
  --bucket $BUCKET_NAME \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }' \
  --region $REGION

echo "✅ AWS Infrastructure setup complete!"
echo ""
echo "Resources created:"
echo "  - DynamoDB Table: $TABLE_NAME"
echo "  - S3 Bucket: $BUCKET_NAME"
echo "  - Region: $REGION"
