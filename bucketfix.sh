#!/bin/bash

# Get bucket names from terraform
cd terraform
HOST_BUCKET=$(terraform output -raw host_s3_bucket_name)
echo "Fixing bucket: $HOST_BUCKET"

# Fix host bucket
aws s3api put-public-access-block \
    --bucket $HOST_BUCKET \
    --public-access-block-configuration \
        "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Set bucket ownership
aws s3api put-bucket-ownership-controls \
    --bucket $HOST_BUCKET \
    --ownership-controls Rules=[{ObjectOwnership=BucketOwnerPreferred}]

# Set public read ACL
aws s3api put-bucket-acl \
    --bucket $HOST_BUCKET \
    --acl public-read

# Add bucket policy
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${HOST_BUCKET}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
    --bucket $HOST_BUCKET \
    --policy file:///tmp/bucket-policy.json

# Enable website hosting
aws s3 website s3://$HOST_BUCKET \
    --index-document index.html \
    --error-document index.html

echo "✅ Bucket fixed!"

# Test the URL
echo "Testing access:"
S3_ENDPOINT="http://${HOST_BUCKET}.s3-website-us-east-1.amazonaws.com"
echo "S3 URL: $S3_ENDPOINT"
curl -I "$S3_ENDPOINT"

# If using CloudFront, invalidate cache
if terraform output -json cloudfront_distribution_ids 2>/dev/null | grep -q "host"; then
    CF_ID=$(terraform output -json cloudfront_distribution_ids | jq -r '.host')
    echo "Invalidating CloudFront cache for $CF_ID"
    aws cloudfront create-invalidation --distribution-id $CF_ID --paths "/*"
fi