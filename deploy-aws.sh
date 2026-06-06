#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Deploying MFE workspace to AWS (${ENVIRONMENT})"

# Navigate to terraform directory
cd "${SCRIPT_DIR}/terraform"

# Get outputs
HOST_BUCKET=$(terraform output -raw host_s3_bucket_name 2>/dev/null || echo "")
HOST_URL=$(terraform output -raw host_app_url 2>/dev/null || echo "")
REMOTE_BUCKETS_JSON=$(terraform output -json remote_s3_bucket_names 2>/dev/null || echo "{}")
FEDERATION_MANIFEST=$(terraform output -json federation_manifest 2>/dev/null || echo "{}")

echo "✅ Infrastructure ready"
echo "📍 Host URL: ${HOST_URL}"

# Update federation manifest in the Angular project
echo "📝 Updating federation manifest with CloudFront URLs..."
MANIFEST_COPY="${SCRIPT_DIR}/projects/host-app/public/federation.manifest-copy.json"
MANIFEST_FILE="${SCRIPT_DIR}/projects/host-app/public/federation.manifest.json"

# Create assets directory if it doesn't exist
mkdir -p "$(dirname "$MANIFEST_FILE")"

cp $MANIFEST_FILE $MANIFEST_COPY

# Write the manifest
echo "$FEDERATION_MANIFEST" | jq '.' > "$MANIFEST_FILE"

echo "✅ Federation manifest updated:"
cat "$MANIFEST_FILE"

# Go back to root
cd "${SCRIPT_DIR}"

# Build Angular applications
echo "🔨 Building Angular applications..."

# Build shared-utils first (if exists)
if npx ng build shared-utils --configuration=production 2>/dev/null; then
    echo "✅ shared-utils built"
fi

# Build host app
echo "🏠 Building host-app..."
npx ng build host-app --configuration=production

# Build remote apps
echo "📱 Building remote apps..."
for app in app-list app-workspace actor-app app-edit home-app app-parser; do
    echo "  Building $app..."
    npx ng build "$app" --configuration=production
done

echo "✅ Build complete"

# Deploy Host App
if [ -n "$HOST_BUCKET" ] && [ -d "dist/host-app/browser" ]; then
    echo "📤 Deploying Host App to S3 (${HOST_BUCKET})..."
    
    # Sync all files
    aws s3 sync "dist/host-app/browser/" "s3://${HOST_BUCKET}/" --delete
    
    echo "✅ Host App deployed"
else
    echo "⚠️ Host App deployment skipped"
fi

# Deploy Remote Apps
echo "📤 Deploying Remote Apps to S3..."

for app in app-list app-workspace actor-app app-edit home-app app-parser; do
    BUCKET_NAME=$(echo "$REMOTE_BUCKETS_JSON" | jq -r --arg app "$app" '.[$app]' 2>/dev/null || echo "")
    
    if [ -n "$BUCKET_NAME" ] && [ "$BUCKET_NAME" != "null" ] && [ -d "dist/${app}/browser" ]; then
        echo "  Deploying $app to $BUCKET_NAME..."
        aws s3 sync "dist/${app}/browser/" "s3://${BUCKET_NAME}/" --delete
        echo "  ✅ $app deployed"
    else
        echo "  ⚠️ Skipping $app"
    fi
done

# Invalidate CloudFront cache
cd "${SCRIPT_DIR}/terraform"

if terraform output -json cloudfront_distribution_ids 2>/dev/null | grep -q "host"; then
    echo "🔄 Invalidating CloudFront cache..."
    
    HOST_CF_ID=$(terraform output -json cloudfront_distribution_ids 2>/dev/null | jq -r '.host' 2>/dev/null || echo "")
    if [ -n "$HOST_CF_ID" ] && [ "$HOST_CF_ID" != "null" ]; then
        aws cloudfront create-invalidation --distribution-id "$HOST_CF_ID" --paths "/*" --no-cli-pager || true
        echo "  ✅ Host CloudFront invalidated"
    fi
fi

echo ""
echo "📋 Federation Manifest being used:"
echo "$FEDERATION_MANIFEST" | jq '.' 2>/dev/null || echo "$FEDERATION_MANIFEST"

echo ""
echo "🎉 Deployment complete!"
echo "📍 Host URL: ${HOST_URL}"
echo ""
echo "To view the host app, visit: ${HOST_URL}"


cp $MANIFEST_COPY $MANIFEST_FILE