#!/bin/bash

set -e

echo "========================================="
echo "🚀 Deploying MFE Applications to CloudFront"
echo "========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get infrastructure outputs from Terraform
cd terraform_clean

echo "📦 Getting infrastructure outputs..."
HOST_BUCKET=$(terraform output -raw host_bucket_name)
HOST_DIST_ID=$(terraform output -raw host_distribution_id)
REMOTE_BUCKETS=$(terraform output -json remote_bucket_names 2>/dev/null || echo "{}")

echo -e "${GREEN}✅ Host bucket: $HOST_BUCKET${NC}"
echo -e "${GREEN}✅ Host CloudFront ID: $HOST_DIST_ID${NC}"

cd ..

# Generate federation manifest with CloudFront URLs
echo ""
echo "📝 Generating federation manifest..."

# For CloudFront, we need the CloudFront URLs, not S3 URLs
HOST_URL=$(cd terraform_clean && terraform output -raw host_app_url)

mkdir -p projects/host-app/public

# Get remote CloudFront URLs from terraform
REMOTE_CLOUDFRONT_URLS=$(cd terraform_clean && terraform output -json remote_app_urls 2>/dev/null || echo "{}")

cat > projects/host-app/public/federation.manifest.json << EOF
{
  "app-list": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."app-list"')/remoteEntry.json",
  "app-workspace": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."app-workspace"')/remoteEntry.json",
  "actor-app": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."actor-app"')/remoteEntry.json",
  "app-edit": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."app-edit"')/remoteEntry.json",
  "home-app": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."home-app"')/remoteEntry.json",
  "app-parser": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."app-parser"')/remoteEntry.json"
}
EOF

echo -e "${GREEN}✅ Federation manifest generated${NC}"
echo "Federation manifest content:"
cat projects/host-app/public/federation.manifest.json | jq '.'

# Build ALL Angular applications
echo ""
echo "🔨 Building Angular applications..."

# Build shared-utils if it exists
if npx ng build shared-utils --configuration=production 2>/dev/null; then
  echo -e "${GREEN}✅ shared-utils built${NC}"
fi

# Build host app
echo "Building host-app..."
npx ng build host-app --configuration=production
echo -e "${GREEN}✅ host-app built${NC}"

# Build all remote apps
echo ""
echo "Building remote apps..."
for app in app-list app-workspace actor-app app-edit home-app app-parser; do
  echo "  Building $app..."
  npx ng build "$app" --configuration=production
  echo -e "  ${GREEN}✅ $app built${NC}"
done

# Deploy Host App to S3
echo ""
echo "========================================="
echo "📤 Deploying to S3"
echo "========================================="

echo "Deploying host-app to S3 bucket: $HOST_BUCKET..."
aws s3 sync "dist/host-app/browser/" "s3://${HOST_BUCKET}/" --delete
echo -e "${GREEN}✅ host-app deployed to S3${NC}"

# Deploy Remote Apps to S3
echo ""
echo "Deploying remote apps to S3..."

for app in app-list app-workspace actor-app app-edit home-app app-parser; do
  # Get bucket name for this app
  BUCKET=$(echo $REMOTE_BUCKETS | jq -r ".\"${app}\"")
  
  if [ -n "$BUCKET" ] && [ "$BUCKET" != "null" ] && [ -d "dist/${app}/browser" ]; then
    echo "  Deploying $app to S3 bucket: $BUCKET..."
    aws s3 sync "dist/${app}/browser/" "s3://${BUCKET}/" --delete
    echo -e "  ${GREEN}✅ $app deployed to S3${NC}"
  else
    echo -e "  ${YELLOW}⚠️ Skipping $app - bucket not found or dist missing${NC}"
  fi
done

# Invalidate CloudFront cache
echo ""
echo "========================================="
echo "🔄 Invalidating CloudFront cache"
echo "========================================="

echo "Invalidating CloudFront distribution: $HOST_DIST_ID"
aws cloudfront create-invalidation --distribution-id "$HOST_DIST_ID" --paths "/*"
echo -e "${GREEN}✅ Cache invalidation requested${NC}"

# Wait a moment for invalidation to start
sleep 5

# Output deployment URLs
echo ""
echo "========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "========================================="
echo ""
echo "📍 HOST APP URL (CloudFront):"
echo "   $(cd terraform_clean && terraform output -raw host_app_url)"
echo ""
echo "📦 REMOTE APP URLs (CloudFront):"
if [ -n "$REMOTE_CLOUDFRONT_URLS" ]; then
  echo "$REMOTE_CLOUDFRONT_URLS" | jq -r 'to_entries[] | "   \(.key): \(.value)"'
fi
echo ""
echo "📋 FEDERATION MANIFEST:"
echo "   $(cd terraform_clean && terraform output -raw host_app_url)/assets/federation.manifest.json"
echo ""
echo "⚠️  Note: CloudFront cache invalidation takes 2-5 minutes to fully propagate"
echo "   Your changes will be visible shortly at the URL above"
echo ""
echo "========================================="