#!/bin/bash

cd terraform

# Get all remote buckets
REMOTE_BUCKETS=$(terraform output -json remote_bucket_names 2>/dev/null || echo "{}")

cd ..

# Deploy each remote app
for app in app-list app-workspace actor-app app-edit home-app app-parser; do
  # Build the app if not already built
  if [ ! -d "dist/${app}/browser" ]; then
    echo "Building $app..."
    npx ng build "$app" --configuration=production
  fi
  
  # Get bucket name
  BUCKET=$(echo $REMOTE_BUCKETS | jq -r ".\"${app}\"")
  
  if [ -n "$BUCKET" ] && [ "$BUCKET" != "null" ]; then
    echo "Deploying $app to $BUCKET..."
    aws s3 sync "dist/${app}/browser/" "s3://${BUCKET}/" --delete
    echo "✅ $app deployed"
  else
    echo "❌ Bucket not found for $app"
  fi
done