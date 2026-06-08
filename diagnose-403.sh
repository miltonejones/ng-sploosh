#!/bin/bash

cd terraform_clean

HOST_BUCKET=$(terraform output -raw host_bucket_name)
HOST_DIST_ID=$(terraform output -raw host_distribution_id)
HOST_URL=$(terraform output -raw host_app_url)

echo "=== DETAILED 403 DIAGNOSTIC ==="
echo ""

# 1. Test S3 website endpoint directly (should work)
echo "1. Testing S3 website endpoint directly:"
S3_URL="http://${HOST_BUCKET}.s3-website-us-east-1.amazonaws.com"
curl -s -o /dev/null -w "HTTP %{http_code}\n" "$S3_URL"

# 2. Test with a specific file
echo ""
echo "2. Testing index.html on S3 directly:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" "$S3_URL/index.html"

# 3. Check bucket policy
echo ""
echo "3. Bucket policy:"
aws s3api get-bucket-policy --bucket "$HOST_BUCKET" --query Policy --output text 2>/dev/null | jq '.' || echo "No bucket policy"

# 4. Check if bucket has public access block
echo ""
echo "4. Public access block:"
aws s3api get-public-access-block --bucket "$HOST_BUCKET" 2>/dev/null | jq '.' || echo "No public access block"

# 5. Check OAI association
echo ""
echo "5. OAI in CloudFront distribution:"
aws cloudfront get-distribution --id "$HOST_DIST_ID" --query "Distribution.DistributionConfig.Origins.Items[0].OriginAccessIdentity" --output text

# 6. Check what OAI is in bucket policy
echo ""
echo "6. OAI in bucket policy:"
POLICY_OAI=$(aws s3api get-bucket-policy --bucket "$HOST_BUCKET" --query Policy --output text 2>/dev/null | grep -o "OriginAccessIdentity [^ ]*" | head -1 || echo "None")
echo "   $POLICY_OAI"

# 7. List all OAI IDs
echo ""
echo "7. All OAI IDs in your account:"
aws cloudfront list-cloud-front-origin-access-identities --query "CloudFrontOriginAccessIdentityList.Items[*].Id" --output text

# 8. Check CloudFront distribution status
echo ""
echo "8. CloudFront distribution status:"
aws cloudfront get-distribution --id "$HOST_DIST_ID" --query "Distribution.Status" --output text

# 9. Test with specific file via CloudFront
echo ""
echo "9. Testing index.html via CloudFront:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" "$HOST_URL/index.html"

# 10. Get full CloudFront error
echo ""
echo "10. Full CloudFront error details:"
curl -v "$HOST_URL" 2>&1 | grep -E "(< HTTP|< x-amz|< server|error)"