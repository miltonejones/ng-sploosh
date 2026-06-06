# Add these outputs to your main.tf if not already present

output "remote_s3_bucket_names" {
  description = "Names of remote S3 buckets"
  value = {
    for k, v in aws_s3_bucket.remote_apps : 
    k => v.id
  }
}

output "host_s3_bucket_name" {
  description = "Name of the host S3 bucket"
  value = aws_s3_bucket.host_app.id
}

output "host_app_url" {
  description = "URL of the host application"
  value = var.enable_cloudfront ? "https://${aws_cloudfront_distribution.host_distribution[0].domain_name}" : aws_s3_bucket_website_configuration.host_website.website_endpoint
}

output "remote_app_urls" {
  description = "URLs for remote applications"
  value = var.enable_cloudfront ? {
    for k, v in aws_cloudfront_distribution.remote_distributions : 
    k => "https://${v.domain_name}"
  } : {
    for k, v in aws_s3_bucket_website_configuration.remote_websites : 
    k => v.website_endpoint
  }
}

output "federation_manifest" {
  description = "Federation manifest"
  value = var.enable_cloudfront ? {
    for k, v in aws_cloudfront_distribution.remote_distributions : 
    k => "https://${v.domain_name}/remoteEntry.json"
  } : {
    for k, v in aws_s3_bucket_website_configuration.remote_websites : 
    k => "${v.website_endpoint}remoteEntry.json"
  }
}