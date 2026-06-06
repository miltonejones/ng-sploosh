#!/bin/bash

cd terraform

# Get the actual CloudFront URLs from Terraform
HOST_URL=$(terraform output -raw host_app_url 2>/dev/null)
MANIFEST=$(terraform output -json federation_manifest 2>/dev/null)

echo "🔍 Verifying CloudFront deployment..."
echo ""
echo "Host URL: $HOST_URL"
echo ""

# Test host app
echo "========================================="
echo "Testing Host App"
echo "========================================="
HOST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HOST_URL")
echo "Host app HTTP status: $HOST_STATUS"

if [ "$HOST_STATUS" = "200" ]; then
    echo "✅ Host app is accessible"
    
    # Check if manifest is accessible
    MANIFEST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HOST_URL/federation.manifest.json")
    if [ "$MANIFEST_STATUS" = "200" ]; then
        echo "✅ Federation manifest accessible"
    else
        echo "⚠️  Federation manifest not found at $HOST_URL/federation.manifest.json"
    fi
else
    echo "❌ Host app not accessible"
fi

# Test all remote apps from the manifest
echo ""
echo "========================================="
echo "Testing Remote Apps from Federation Manifest"
echo "========================================="

# Extract remote URLs from manifest
if [ -n "$MANIFEST" ] && [ "$MANIFEST" != "{}" ]; then
    echo "$MANIFEST" | jq -r 'to_entries[] | "\(.key): \(.value)"' | while read line; do
        APP_NAME=$(echo "$line" | cut -d: -f1)
        REMOTE_URL=$(echo "$line" | cut -d: -f2- | sed 's/^ //')
        
        echo ""
        echo "Testing: $APP_NAME"
        echo "URL: $REMOTE_URL"
        
        # Test remoteEntry.json
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$REMOTE_URL")
        echo "  HTTP Status: $STATUS"
        
        if [ "$STATUS" = "200" ]; then
            echo "  ✅ remoteEntry.json is accessible"
            
            # Check CORS headers
            CORS_HEADER=$(curl -s -I "$REMOTE_URL" -H "Origin: $HOST_URL" 2>/dev/null | grep -i "access-control-allow-origin")
            if [ -n "$CORS_HEADER" ]; then
                echo "  ✅ CORS headers present"
            else
                echo "  ⚠️  No CORS headers (may cause browser issues)"
            fi
        else
            echo "  ❌ remoteEntry.json not accessible"
        fi
    done
else
    echo "❌ No federation manifest found"
fi

# Test the specific actor-app that we know works
echo ""
echo "========================================="
echo "Direct Test: actor-app"
echo "========================================="
ACTOR_URL="https://dwl982ezudf3g.cloudfront.net/remoteEntry.json"
echo "URL: $ACTOR_URL"

# Get detailed headers
echo ""
echo "Response Headers:"
curl -s -I "$ACTOR_URL" -H "Origin: $HOST_URL" 2>/dev/null | head -10

echo ""
echo "========================================="
echo "Browser Console Test"
echo "========================================="
echo "In your browser console, run:"
echo ""
echo "// Test if remote can be loaded"
echo "import('https://dwl982ezudf3g.cloudfront.net/remoteEntry.json')"
echo "  .then(m => console.log('✅ Remote loaded:', m))"
echo "  .catch(e => console.error('❌ Failed:', e));"
echo ""
echo "// Check federation manifest"
echo "fetch('https://d2t6zwm4en3qjp.cloudfront.net/federation.manifest.json')"
echo "  .then(r => r.json())"
echo "  .then(m => console.log('Manifest:', m));"