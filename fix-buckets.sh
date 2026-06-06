#!/bin/bash

echo "🔧 Fixing S3 bucket permissions for MFE..."

cd terraform

# Get all bucket names
HOST_BUCKET=$(terraform output -raw host_s3_bucket_name 2>/dev/null)
REMOTE_BUCKETS=$(terraform output -json remote_s3_bucket_names 2>/dev/null | jq -r '.[]')

# Fix function
fix_bucket() {
    local BUCKET=$1
    echo "📦 Fixing: $BUCKET"
    
    # 1. Remove block public access
    aws s3api put-public-access-block \
        --bucket $BUCKET \
        --public-access-block-configuration \
            "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
        2>/dev/null || true
    
    # 2. Set ownership
    aws s3api put-bucket-ownership-controls \
        --bucket $BUCKET \
        --ownership-controls Rules=[{ObjectOwnership=BucketOwnerPreferred}] \
        2>/dev/null || true
    
    # 3. Set ACL
    aws s3api put-bucket-acl \
        --bucket $BUCKET \
        --acl public-read \
        2>/dev/null || true
    
    # 4. Add bucket policy
    cat > /tmp/policy-$$.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [{
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::${BUCKET}/*"
    }]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket $BUCKET \
        --policy file:///tmp/policy-$$.json \
        2>/dev/null || true
    
    # 5. Enable website hosting
    aws s3 website s3://$BUCKET \
        --index-document index.html \
        --error-document index.html \
        2>/dev/null || true
    
    echo "  ✅ $BUCKET fixed"
}

# Fix host bucket
# if [ -n "$HOST_BUCKET" ]; then
#     fix_bucket "$HOST_BUCKET"
# fi

# # Fix remote buckets
# for BUCKET in $REMOTE_BUCKETS; do
#     fix_bucket "$BUCKET"
# done

echo ""
echo "✅ All buckets fixed!"

# Test one remote entry
echo ""
echo "🧪 Testing remote entry access:"
FIRST_REMOTE=$(echo "$REMOTE_BUCKETS" | head -1)
if [ -n "$FIRST_REMOTE" ]; then
    curl -I "https://${FIRST_REMOTE}.s3-website-us-east-1.amazonaws.com/remoteEntry.json" 2>/dev/null | head -1
fi

# rm -f /tmp/policy-*.json