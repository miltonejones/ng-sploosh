# Make host bucket public temporarily
aws s3api put-public-access-block \
  --bucket "mfe-workspace-host-dev-lohgl43w" \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-policy \
  --bucket "mfe-workspace-host-dev-lohgl43w" \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mfe-workspace-host-dev-lohgl43w/*"
    }]
  }'

# Test S3 URL directly
echo "Test S3 URL: http://mfe-workspace-host-dev-lohgl43w.s3-website-us-east-1.amazonaws.com/home"