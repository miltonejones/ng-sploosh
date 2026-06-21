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
  "app-parser": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."app-parser"')/remoteEntry.json",
  "app-models": "$(echo $REMOTE_CLOUDFRONT_URLS | jq -r '."app-models"')/remoteEntry.json"
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
for app in app-list app-workspace actor-app app-edit home-app app-parser app-models; do
  echo "  Building $app..."
  npx ng build "$app" --configuration=production
  echo -e "  ${GREEN}✅ $app built${NC}"
done


cp projects/host-app/public/federation.manifest-copy.json projects/host-app/public/federation.manifest.json

echo "federation.manifest restored"


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

for app in app-list app-workspace actor-app app-edit home-app app-parser app-models; do
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

# Fix all remote buckets
for BUCKET in $(aws s3 ls | grep -E "app-(list|workspace|edit|home|parser|models|actor)" | awk '{print $3}'); do
  echo "Fixing bucket: $BUCKET"
  aws s3 cp s3://$BUCKET/ s3://$BUCKET/ \
    --recursive \
    --exclude "*" \
    --include "*.js" \
    --include "*.mjs" \
    --content-type "application/javascript" \
    --metadata-directive REPLACE
done

# Fix host bucket
HOST_BUCKET=$(cd terraform_clean && terraform output -raw host_bucket_name)
aws s3 cp s3://$HOST_BUCKET/ s3://$HOST_BUCKET/ \
  --recursive \
  --exclude "*" \
  --include "*.js" \
  --include "*.mjs" \
  --content-type "application/javascript" \
  --metadata-directive REPLACE

 



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



# # In deploy_clean.sh, after the aws s3 sync commands for remote apps:

# echo ""
# echo "⚙️  Verifying and correcting Content-Types for JavaScript files in S3..."

# for app in app-list app-workspace actor-app app-edit home-app app-parser app-models; do
#   BUCKET=$(echo $REMOTE_BUCKETS | jq -r ".\"${app}\"")
  
#   if [ -n "$BUCKET" ] && [ "$BUCKET" != "null" ]; then
#     echo "  Checking Content-Types for $app in S3 bucket: $BUCKET..."
#     # Iterate over all .js files in the local build output
#     find "dist/${app}/browser/" -type f -name "*.js" | while read -r js_file_path; do
#       # Extract the relative path within the S3 bucket
#       s3_key="${js_file_path#dist/${app}/browser/}"
      
#       # Use aws s3api head-object to check current Content-Type in S3
#       current_content_type=$(aws s3api head-object --bucket "${BUCKET}" --key "${s3_key}" 2>/dev/null | jq -r '.ContentType')

#       if [ "$current_content_type" != "application/javascript" ]; then
#         echo -e "    ${YELLOW}⚠️  Content-Type for s3://${BUCKET}/${s3_key} is '${current_content_type}', correcting to 'application/javascript'${NC}"
#         # Copy the file back to S3, replacing its metadata with the correct Content-Type
#         aws s3 cp "${js_file_path}" "s3://${BUCKET}/${s3_key}" --content-type "application/javascript" --metadata-directive REPLACE
#       else
#         echo -e "    ${GREEN}✅ Content-Type for s3://${BUCKET}/${s3_key} is already correct ('application/javascript')${NC}"
#       fi
#     done
#   else
#     echo -e "  ${YELLOW}⚠️ Skipping Content-Type check for $app - bucket not found${NC}"
#   fi
# done

# echo -e "${GREEN}✅ Content-Type verification complete.${NC}"

# ... (then proceed to CloudFront invalidation)



# ... (rest of your script above this section)

# Invalidate CloudFront cache
echo ""
echo "========================================="
echo "🔄 Invalidating CloudFront cache"
echo "========================================="

echo "Invalidating Host CloudFront distribution: $HOST_DIST_ID"
aws cloudfront create-invalidation --distribution-id "$HOST_DIST_ID" --paths "/*"
echo -e "${GREEN}✅ Host cache invalidation requested${NC}"

# Get remote distribution IDs
# Fetch raw output first. If it's empty, default to '{}' for jq processing.
REMOTE_DIST_IDS_RAW=$(cd terraform_clean && terraform output -json remote_distribution_ids 2>/dev/null)
REMOTE_DIST_IDS="${REMOTE_DIST_IDS_RAW:-{}}" # Default to '{}' if REMOTE_DIST_IDS_RAW is empty or unset

num_remote_dists=0 # Initialize to 0

if command -v jq &> /dev/null; then
  # jq is installed, try to get the length. Suppress jq errors by redirecting stderr.
  jq_result=$(echo "$REMOTE_DIST_IDS" | jq '. | length' 2>/dev/null)
  
  # Check if jq_result is non-empty and looks like a number
  if [[ -n "$jq_result" && "$jq_result" =~ ^[0-9]+$ ]]; then
    num_remote_dists="$jq_result"
  else
    echo -e "${YELLOW}⚠️  jq output for remote distribution count was not a valid number. Defaulting to 0.${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  jq command not found. Cannot determine number of remote distributions. Proceeding with 0.${NC}"
fi

if [ "$num_remote_dists" -gt 0 ]; then
  echo "Invalidating Remote CloudFront distributions..."
  # Loop through app names, ensuring jq is available and output is valid.
  for app_name in $(echo "$REMOTE_DIST_IDS" | jq -r 'keys[]' 2>/dev/null); do
    if [ -n "$app_name" ]; then # Ensure app_name is not empty
      DIST_ID=$(echo "$REMOTE_DIST_IDS" | jq -r ".\"${app_name}\"" 2>/dev/null)
      if [ -n "$DIST_ID" ] && [ "$DIST_ID" != "null" ]; then
        echo "  Invalidating $app_name (ID: $DIST_ID)"
        aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"
        echo -e "  ${GREEN}✅ $app_name cache invalidation requested${NC}"
      else
        echo -e "  ${YELLOW}⚠️ Skipping invalidation for $app_name - distribution ID not found or null${NC}"
      fi
    fi
  done
else
  echo "No remote distributions to invalidate."
fi

echo -e "${GREEN}✅ All relevant cache invalidations requested${NC}"

# Wait a moment for invalidation to start
sleep 10 # Increased sleep time slightly

# ... (rest of your script below this section)


