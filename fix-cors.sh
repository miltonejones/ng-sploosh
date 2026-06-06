#!/bin/bash

cd terraform

echo "🚨 Quick fix for 403 errors - making buckets public..."

# Get bucket names
HOST_BUCKET=$(terraform output -raw host_s3_bucket_name 2>/dev/null)
REMOTE_BUCKETS=$(terraform output -json remote_s3_bucket_names 2>/dev/null | jq -r '.[]')

echo "Host bucket: $HOST_BUCKET"

# Fix host bucket
echo "Fixing host bucket..."
aws s3api put-public-access-block \
    --bucket "$HOST_BUCKET" \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Simple public read policy
aws s3api put-bucket-policy \
    --bucket "$HOST_BUCKET" \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [{
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'"$HOST_BUCKET"'/*"
        }]
    }'

# Fix remote buckets
for BUCKET in $REMOTE_BUCKETS; do
    echo "Fixing $BUCKET..."
    aws s3api put-public-access-block \
        --bucket "$BUCKET" \
        --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
    
    aws s3api put-bucket-policy \
        --bucket "$BUCKET" \
        --policy '{
            "Version": "2012-10-17",
            "Statement": [{
                "Sid": "PublicRead",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::'"$BUCKET"'/*"
            }]
        }'
done

echo ""
echo "✅ Buckets are now public"
echo "Testing access..."
curl -s -o /dev/null -w "Host HTTP Status: %{http_code}\n" "https://${HOST_BUCKET}.s3-website-us-east-1.amazonaws.com"
echo ""
echo "Wait 2-3 minutes, then try your CloudFront URL again"