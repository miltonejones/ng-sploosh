terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# ============================================
# S3 Buckets (Private)
# ============================================

resource "aws_s3_bucket" "host_app" {
  bucket = "${var.project_name}-host-${var.environment}-${random_string.suffix.result}"
  tags   = { Name = "host-app" }
}

resource "aws_s3_bucket" "remote_apps" {
  for_each = toset(var.remote_apps)
  bucket   = "${var.project_name}-${each.key}-${var.environment}-${random_string.suffix.result}"
  tags     = { Name = each.key }
}

# ============================================
# Static Website Hosting Configuration
# ============================================

resource "aws_s3_bucket_website_configuration" "host_website" {
  bucket = aws_s3_bucket.host_app.id
  index_document { suffix = "index.html" }
  error_document { key = "index.html" }
}

resource "aws_s3_bucket_website_configuration" "remote_websites" {
  for_each = aws_s3_bucket.remote_apps
  bucket   = each.value.id
  index_document { suffix = "index.html" }
  error_document { key = "index.html" }
}



data "aws_cloudfront_response_headers_policy" "cors_policy" {
  name = "mfe-cors-policy-${var.environment}"
}


# ============================================
# CloudFront Origin Access Identities (OAI)
# ============================================

# Host OAI
resource "aws_cloudfront_origin_access_identity" "host_oai" {
  comment = "OAI for ${var.project_name} host"
}

# Remote OAIs
resource "aws_cloudfront_origin_access_identity" "remote_oai" {
  for_each = aws_s3_bucket.remote_apps
  comment  = "OAI for ${each.key}"
}

# ============================================
# S3 Bucket Policies (Allow only CloudFront access)
# ============================================

# Host bucket policy
resource "aws_s3_bucket_policy" "host_policy" {
  bucket = aws_s3_bucket.host_app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = aws_cloudfront_origin_access_identity.host_oai.iam_arn }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.host_app.arn}/*"
    }]
  })
}

# Remote bucket policies
resource "aws_s3_bucket_policy" "remote_policies" {
  for_each = aws_s3_bucket.remote_apps
  bucket   = each.value.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = aws_cloudfront_origin_access_identity.remote_oai[each.key].iam_arn }
      Action    = "s3:GetObject"
      Resource  = "${each.value.arn}/*"
    }]
  })
}

# ============================================
# CloudFront Distributions
# ============================================

# Host CloudFront distribution
resource "aws_cloudfront_distribution" "host_distribution" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.host_app.bucket_regional_domain_name
    origin_id   = "host-app-origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.host_oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "host-app-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.cors_policy.id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "host-app-cloudfront"
  }
}

# Remote CloudFront distributions
resource "aws_cloudfront_distribution" "remote_distributions" {
  for_each = aws_s3_bucket.remote_apps

  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = each.value.bucket_regional_domain_name
    origin_id   = "${each.key}-origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.remote_oai[each.key].cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "${each.key}-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.cors_policy.id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${each.key}-cloudfront"
  }
}

# ============================================
# Outputs
# ============================================

output "host_app_url" {
  value = "https://${aws_cloudfront_distribution.host_distribution.domain_name}"
}

output "host_bucket_name" {
  value = aws_s3_bucket.host_app.id
}

output "host_distribution_id" {
  value = aws_cloudfront_distribution.host_distribution.id
}

output "remote_app_urls" {
  value = {
    for k, v in aws_cloudfront_distribution.remote_distributions : k => "https://${v.domain_name}"
  }
}

output "remote_bucket_names" {
  value = {
    for k, v in aws_s3_bucket.remote_apps : k => v.id
  }
}

output "federation_manifest" {
  value = {
    for k, v in aws_cloudfront_distribution.remote_distributions : k => "https://${v.domain_name}/remoteEntry.json"
  }
}

output "remote_distribution_ids" {
  value = {
    for k, v in aws_cloudfront_distribution.remote_distributions : k => v.id
  }
}