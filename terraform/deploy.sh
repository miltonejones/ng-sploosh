#!/bin/bash

set -e

# Configuration
ENVIRONMENT=${1:-dev}
RESOURCE_GROUP="mfe-static-sites-rg"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="${SCRIPT_DIR}/dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment for environment: ${ENVIRONMENT}${NC}"

# Load Terraform outputs
echo -e "${YELLOW}Loading Terraform outputs...${NC}"
cd "${SCRIPT_DIR}"
terraform output -json > terraform_outputs.json

HOST_STORAGE=$(terraform output -raw host_app_storage_name 2>/dev/null || echo "")
REMOTE_STORAGES=$(terraform output -json remote_storage_names 2>/dev/null || echo "{}")

# Function to get storage connection string
get_storage_connection() {
    local storage_name=$1
    az storage account show-connection-string \
        --name "$storage_name" \
        --resource-group "$RESOURCE_GROUP" \
        --query "connectionString" \
        --output tsv
}

# Build all applications with production configuration
echo -e "${YELLOW}Building all applications...${NC}"
npm run build -- --configuration=production
node build-scripts/prepare-federation.js

echo "☁️ Deploying to Azure..."

# Update federation manifest with Azure URLs
echo -e "${YELLOW}Updating federation manifest with Azure URLs...${NC}"
MANIFEST_FILE="${DIST_DIR}/host-app/federation.manifest.json"

if [ -f "$MANIFEST_FILE" ]; then
    # Get CDN endpoints from Terraform
    HOST_URL=$(terraform output -raw host_cdn_url 2>/dev/null || echo "")
    
    # Update manifest URLs
    jq --arg host "$HOST_URL" '
        to_entries | map({key: .key, value: ($host + .value)}) | from_entries
    ' "$MANIFEST_FILE" > "${MANIFEST_FILE}.tmp"
    mv "${MANIFEST_FILE}.tmp" "$MANIFEST_FILE"
    
    echo -e "${GREEN}Updated federation manifest${NC}"
fi

# Deploy host app
echo -e "${YELLOW}Deploying Host App...${NC}"
if [ -n "$HOST_STORAGE" ]; then
    HOST_CONNECTION=$(get_storage_connection "$HOST_STORAGE")
    
    az storage blob upload-batch \
        --connection-string "$HOST_CONNECTION" \
        --source "${DIST_DIR}/host-app/browser" \
        --destination '$web' \
        --overwrite \
        --content-type 'application/javascript' \
        --pattern '*.js' \
        --content-encoding 'gzip' \
        --only-show-errors
    
    az storage blob upload-batch \
        --connection-string "$HOST_CONNECTION" \
        --source "${DIST_DIR}/host-app/browser" \
        --destination '$web' \
        --overwrite \
        --content-type 'text/html' \
        --pattern '*.html' \
        --only-show-errors
    
    echo -e "${GREEN}Host App deployed successfully${NC}"
else
    echo -e "${RED}Host storage account not found${NC}"
    exit 1
fi

# Deploy remote apps
echo -e "${YELLOW}Deploying Remote Apps...${NC}"

declare -A APP_MAP=(
    ["app-list"]="app-list"
    ["app-workspace"]="app-workspace"
    ["actor-app"]="actor-app"
    ["app-edit"]="app-edit"
    ["home-app"]="home-app"
    ["app-parser"]="app-parser"
)

for app_name in "${!APP_MAP[@]}"; do
    storage_name=$(terraform output -json remote_storage_names | jq -r ".${app_name}" 2>/dev/null || echo "")
    
    if [ -n "$storage_name" ] && [ "$storage_name" != "null" ]; then
        echo -e "${YELLOW}Deploying ${app_name}...${NC}"
        
        APP_CONNECTION=$(get_storage_connection "$storage_name")
        
        # Deploy JavaScript files
        az storage blob upload-batch \
            --connection-string "$APP_CONNECTION" \
            --source "${DIST_DIR}/${app_name}/browser" \
            --destination '$web' \
            --overwrite \
            --content-type 'application/javascript' \
            --pattern '*.js' \
            --only-show-errors \
            2>/dev/null || true
        
        # Deploy HTML files
        az storage blob upload-batch \
            --connection-string "$APP_CONNECTION" \
            --source "${DIST_DIR}/${app_name}/browser" \
            --destination '$web' \
            --overwrite \
            --content-type 'text/html' \
            --pattern '*.html' \
            --only-show-errors \
            2>/dev/null || true
        
        # Deploy JSON files (remoteEntry.json)
        az storage blob upload-batch \
            --connection-string "$APP_CONNECTION" \
            --source "${DIST_DIR}/${app_name}/browser" \
            --destination '$web' \
            --overwrite \
            --content-type 'application/json' \
            --pattern '*.json' \
            --only-show-errors \
            2>/dev/null || true
        
        echo -e "${GREEN}${app_name} deployed successfully${NC}"
    else
        echo -e "${YELLOW}Skipping ${app_name} - storage not found${NC}"
    fi
done

# Purge CDN endpoints for immediate cache refresh
echo -e "${YELLOW}Purging CDN endpoints...${NC}"
for endpoint in $(az cdn endpoint list --resource-group "$RESOURCE_GROUP" --profile-name "mfe-cdn-${ENVIRONMENT}" --query "[].name" --output tsv); do
    az cdn endpoint purge \
        --resource-group "$RESOURCE_GROUP" \
        --profile-name "mfe-cdn-${ENVIRONMENT}" \
        --name "$endpoint" \
        --content-paths "/*" \
        --no-wait
    
    echo -e "${GREEN}Purged CDN endpoint: ${endpoint}${NC}"
done

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Host URL: $(terraform output -raw host_cdn_url 2>/dev/null || echo 'Not found')${NC}"