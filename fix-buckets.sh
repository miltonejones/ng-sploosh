#!/bin/bash

cd terraform_clean

HOST_DIST_ID=$(terraform output -raw host_distribution_id)
HOST_BUCKET=$(terraform output -raw host_bucket_name)

echo "Host Distribution ID: $HOST_DIST_ID"
echo "Host Bucket: $HOST_BUCKET"
echo ""

# Get the origin domain from CloudFront
ORIGIN_DOMAIN=$(aws cloudfront get-distribution --id "$HOST_DIST_ID" --query "Distribution.DistributionConfig.Origins.Items[0].DomainName" --output text)
ORIGIN_ID=$(aws cloudfront get-distribution --id "$HOST_DIST_ID" --query "Distribution.DistributionConfig.Origins.Items[0].Id" --output text)

echo "Current CloudFront Origin Domain: $ORIGIN_DOMAIN"
echo "Origin ID: $ORIGIN_ID"
echo ""

# Check if origin is using the correct format
CORRECT_ORIGIN="${HOST_BUCKET}.s3-website-us-east-1.amazonaws.com"
echo "Correct origin should be: $CORRECT_ORIGIN"

if [ "$ORIGIN_DOMAIN" != "$CORRECT_ORIGIN" ]; then
  echo "❌ Origin domain is incorrect!"
  echo "   Current: $ORIGIN_DOMAIN"
  echo "   Expected: $CORRECT_ORIGIN"
else
  echo "✅ Origin domain is correct"
fi

# Check if Origin Access Identity is configured
echo ""
echo "Checking if OAI is configured..."
aws cloudfront get-distribution --id "$HOST_DIST_ID" --query "Distribution.DistributionConfig.Origins.Items[0].OriginAccessControlId" --output text