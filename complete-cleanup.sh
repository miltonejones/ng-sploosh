#!/bin/bash

set -e

echo "========================================="
echo "🧹 COMPLETE MFE CLEANUP"
echo "========================================="
echo ""
echo "This will delete ALL MFE resources including:"
echo "  - All S3 buckets (host and remotes)"
echo "  - All CloudFront distributions"
echo "  - All CloudFront OAI"
echo "  - All CloudFront policies"
echo "  - Terraform state"
echo ""
read -p "Are you sure? Type 'yes' to continue: " confirmation

if [ "$confirmation" != "yes" ]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo "Step 1: Deleting S3 buckets..."
for bucket in $(aws s3 ls | grep mfe-workspace | awk '{print $3}'); do
  echo "  Deleting $bucket..."
  aws s3 rm "s3://$bucket" --recursive 2>/dev/null || true
  aws s3 rb "s3://$bucket" 2>/dev/null || true
done
echo "✅ S3 buckets deleted"

echo ""
echo "Step 2: Disabling CloudFront distributions..."
for dist_id in $(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Comment, 'mfe') || contains(Comment, 'host') || contains(Comment, 'app')].Id" --output text 2>/dev/null); do
  echo "  Disabling $dist_id..."
  
  # Get current config
  aws cloudfront get-distribution-config --id "$dist_id" > /tmp/dist.json 2>/dev/null || continue
  ETAG=$(jq -r '.ETag' /tmp/dist.json)
  
  # Disable
  jq '.DistributionConfig.Enabled = false' /tmp/dist.json > /tmp/dist-disabled.json
  aws cloudfront update-distribution --id "$dist_id" --if-match "$ETAG" --distribution-config file:///tmp/dist-disabled.json 2>/dev/null || true
done

echo "Waiting for distributions to disable (15 seconds)..."
sleep 15

echo ""
echo "Step 3: Deleting CloudFront distributions..."
for dist_id in $(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Comment, 'mfe') || contains(Comment, 'host') || contains(Comment, 'app')].Id" --output text 2>/dev/null); do
  echo "  Deleting $dist_id..."
  aws cloudfront delete-distribution --id "$dist_id" 2>/dev/null || true
done
echo "✅ CloudFront distributions deleted"

echo ""
echo "Step 4: Deleting CloudFront OAIs..."
for oai_id in $(aws cloudfront list-cloud-front-origin-access-identities --query "CloudFrontOriginAccessIdentityList.Items[?contains(Comment, 'mfe') || contains(Comment, 'host') || contains(Comment, 'app')].Id" --output text 2>/dev/null); do
  echo "  Deleting OAI $oai_id..."
  aws cloudfront delete-cloud-front-origin-access-identity --id "$oai_id" 2>/dev/null || true
done
echo "✅ OAIs deleted"

echo ""
echo "Step 5: Deleting CloudFront policies..."
for policy_id in $(aws cloudfront list-response-headers-policies --query "ResponseHeadersPolicyList.Items[?contains(ResponseHeadersPolicy.Name, 'mfe') || contains(ResponseHeadersPolicy.Name, 'cors')].Id" --output text 2>/dev/null); do
  echo "  Deleting policy $policy_id..."
  aws cloudfront delete-response-headers-policy --id "$policy_id" 2>/dev/null || true
done
echo "✅ Policies deleted"

echo ""
echo "Step 6: Cleaning Terraform..."
cd terraform 2>/dev/null || true
terraform destroy -auto-approve 2>/dev/null || true
rm -f terraform.tfstate* .terraform.lock.hcl
rm -rf .terraform
echo "✅ Terraform cleaned"

echo ""
echo "========================================="
echo "✅ COMPLETE CLEANUP FINISHED"
echo "========================================="
echo ""
echo "Verify everything is gone:"
echo "  aws s3 ls | grep mfe-workspace"
echo "  aws cloudfront list-distributions"