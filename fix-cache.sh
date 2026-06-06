cd terraform

# Invalidate all CloudFront distributions
CF_IDS=$(terraform output -json cloudfront_distribution_ids 2>/dev/null | jq -r '.remote | to_entries[] | .value')

for CF_ID in $CF_IDS; do
    echo "Invalidating CloudFront: $CF_ID"
    aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*" --no-cli-pager
done

# Also invalidate host
HOST_CF_ID=$(terraform output -json cloudfront_distribution_ids 2>/dev/null | jq -r '.host')
if [ -n "$HOST_CF_ID" ] && [ "$HOST_CF_ID" != "null" ]; then
    aws cloudfront create-invalidation --distribution-id "$HOST_CF_ID" --paths "/*" --no-cli-pager
fi