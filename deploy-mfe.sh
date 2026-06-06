#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# echo "🚀 Deploying MFE workspace to AWS (${ENVIRONMENT})"

# # Get Terraform outputs
 cd "${SCRIPT_DIR}/terraform"

# rm -rf .terraform.lock.hcl terraform.tfstate*

# echo "📦 Initializing Terraform..."
# terraform init

# echo "🏗️ Applying infrastructure..."
# terraform apply -auto-approve


# Get outputs
HOST_BUCKET=$(terraform output -raw host_s3_bucket_name 2>/dev/null || echo "")
HOST_URL=$(terraform output -raw host_app_url 2>/dev/null || echo "")
REMOTE_BUCKETS=$(terraform output -json remote_s3_bucket_names 2>/dev/null || echo "{}")

echo "✅ Infrastructure ready"
echo "📍 Host URL: ${HOST_URL}"
echo "📍 REMOTE_BUCKETS: ${REMOTE_BUCKETS}"

cd $SCRIPT_DIR
# Build Angular applications - Build each project individually
# echo "🔨 Building Angular applications..."

# # Build shared-utils first (dependency)
# echo "📦 Building shared-utils..."
# npx ng build shared-utils --configuration=production

# # Build host app
# echo "🏠 Building host-app..."
# npx ng build host-app --configuration=production

# # Build remote apps
# echo "📱 Building remote apps..."
# for app in app-list app-workspace actor-app app-edit home-app app-parser; do
#     echo "  Building $app..."
#     npx ng build "$app" --configuration=production
# done

# echo "✅ Build complete"

# Deploy Host App
if [ -n "$HOST_BUCKET" ]; then
    echo "📤 Deploying Host App to S3..."
    
    # Sync all files with appropriate cache headers
    aws s3 sync "dist/host-app/browser/" "s3://${HOST_BUCKET}/" \
        --delete \
        --cache-control "max-age=31536000, immutable" \
        --exclude "*.html" \
        --exclude "*.json" \
        --exclude "*.js.map"
    
    # HTML and JSON files - no cache or short cache
    aws s3 sync "dist/host-app/browser/" "s3://${HOST_BUCKET}/" \
        --delete \
        --cache-control "no-cache" \
        --include "*.html" \
        --include "*.json"
    
    echo "✅ Host App deployed"
fi

# Deploy Remote Apps
echo "📤 Deploying Remote Apps to S3..."

# Get remote bucket names

for app in app-list app-workspace actor-app app-edit home-app app-parser; do
    # BUCKET_NAME=$(echo "$REMOTE_BUCKETS" | jq -r ".${app}" 2>/dev/null || echo "")
    BUCKET_NAME=$(echo "$REMOTE_BUCKETS" | grep -o "\"${app}\":\"[^\"]*\"" | cut -d'"' -f4)
    
    # If that fails, try jq again but with proper quoting
    if [ -z "$BUCKET_NAME" ]; then
        BUCKET_NAME=$(echo "$REMOTE_BUCKETS" | jq --arg app "$app" -r '.[$app]' 2>/dev/null || echo "")
    fi
    
    # If still empty, try direct parsing
    if [ -z "$BUCKET_NAME" ] || [ "$BUCKET_NAME" = "null" ]; then
        BUCKET_NAME=$(echo "$REMOTE_BUCKETS" | python3 -c "import sys, json; print(json.load(sys.stdin).get('$app', ''))" 2>/dev/null || echo "")
    fi
    
    if [ -n "$BUCKET_NAME" ] && [ "$BUCKET_NAME" != "null" ] && [ -d "dist/${app}/browser" ]; then
        echo "  Deploying $app to $BUCKET_NAME..."
        
        # Deploy static assets with long cache
        aws s3 sync "dist/${app}/browser/" "s3://${BUCKET_NAME}/" \
            --delete \
            --cache-control "max-age=31536000, immutable" \
            --exclude "*.html" \
            --exclude "*.json" \
            --exclude "*.js.map" \
            2>/dev/null || true
        
        # Deploy HTML and JSON with no cache
        aws s3 sync "dist/${app}/browser/" "s3://${BUCKET_NAME}/" \
            --delete \
            --cache-control "no-cache" \
            --include "*.html" \
            --include "*.json" \
            2>/dev/null || true
        
        echo "  ✅ $app deployed"
    else
        echo "  ⚠️ Skipping $app - bucket '$BUCKET_NAME' not found or dist missing from $REMOTE"
    fi
done


 cd "${SCRIPT_DIR}/terraform"

# Invalidate CloudFront cache if CloudFront is enabled
if terraform output -json cloudfront_distribution_ids 2>/dev/null | grep -q "host"; then
    echo "🔄 Invalidating CloudFront cache..."
    
    HOST_CF_ID=$(terraform output -json cloudfront_distribution_ids 2>/dev/null | jq -r '.host' 2>/dev/null || echo "")
    if [ -n "$HOST_CF_ID" ] && [ "$HOST_CF_ID" != "null" ]; then
        aws cloudfront create-invalidation --distribution-id "$HOST_CF_ID" --paths "/*" --no-cli-pager
        echo "  ✅ Host CloudFront invalidated"
    fi
    
    REMOTE_CF_IDS=$(terraform output -json cloudfront_distribution_ids 2>/dev/null | jq -r '.remote | to_entries[] | .value' 2>/dev/null || echo "")
    for cf_id in $REMOTE_CF_IDS; do
        if [ -n "$cf_id" ] && [ "$cf_id" != "null" ]; then
            aws cloudfront create-invalidation --distribution-id "$cf_id" --paths "/*" --no-cli-pager
            echo "  ✅ Remote CloudFront invalidated: $cf_id"
        fi
    done
fi

# Output federation manifest
echo ""
echo "📋 Federation Manifest:"
MANIFEST=$(terraform output -json federation_manifest 2>/dev/null || echo "{}")
echo "$MANIFEST" | jq '.' 2>/dev/null || echo "$MANIFEST"

echo ""
echo "🎉 Deployment complete!"
echo "📍 Host URL: ${HOST_URL}"
echo ""
echo "To view the host app, visit: ${HOST_URL}"