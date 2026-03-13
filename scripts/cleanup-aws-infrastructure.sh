#!/bin/bash

# AI Blackbox AWS Infrastructure Cleanup
# Region: ap-south-1

REGION="ap-south-1"
TABLE_NAME="ai-blackbox-logs"
BUCKET_NAME="ai-blackbox-audit-logs"

echo "🧹 Cleaning up AI Blackbox AWS Infrastructure in $REGION"

# Empty and delete S3 bucket
echo "🪣 Emptying S3 bucket: $BUCKET_NAME"
aws s3 rm s3://$BUCKET_NAME --recursive --region $REGION

echo "🗑️  Deleting S3 bucket: $BUCKET_NAME"
aws s3api delete-bucket --bucket $BUCKET_NAME --region $REGION

# Delete DynamoDB table
echo "📊 Deleting DynamoDB table: $TABLE_NAME"
aws dynamodb delete-table --table-name $TABLE_NAME --region $REGION

echo "✅ Cleanup complete!"
