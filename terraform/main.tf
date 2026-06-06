# Random suffix for unique bucket names
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# S3 Bucket for Host App
resource "aws_s3_bucket" "host_app" {
  bucket = "${var.project_name}-host-${var.environment}-${random_string.suffix.result}"
  tags   = merge(var.tags, { Name = "host-app", Environment = var.environment })
}

# S3 Buckets for Remote Apps
resource "aws_s3_bucket" "remote_apps" {
  for_each = toset(var.remote_apps)
  
  bucket = "${var.project_name}-${each.key}-${var.environment}-${random_string.suffix.result}"
  tags   = merge(var.tags, { Name = each.key, Environment = var.environment })
}

# Enable static website hosting for Host
resource "aws_s3_bucket_website_configuration" "host_website" {
  bucket = aws_s3_bucket.host_app.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Enable static website hosting for Remote Apps
resource "aws_s3_bucket_website_configuration" "remote_websites" {
  for_each = aws_s3_bucket.remote_apps
  
  bucket = each.value.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Block public access (we'll use CloudFront + OAI instead)
resource "aws_s3_bucket_public_access_block" "host_block" {
  bucket = aws_s3_bucket.host_app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "remote_blocks" {
  for_each = aws_s3_bucket.remote_apps
  
  bucket = each.value.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Origin Access Identity for CloudFront
resource "aws_cloudfront_origin_access_identity" "host_oai" {
  comment = "OAI for ${var.project_name} host app ${var.environment}"
}

resource "aws_cloudfront_origin_access_identity" "remote_oai" {
  for_each = toset(var.remote_apps)
  comment  = "OAI for ${each.key} ${var.environment}"
}

# S3 bucket policy for CloudFront access - Host
resource "aws_s3_bucket_policy" "host_policy" {
  bucket = aws_s3_bucket.host_app.id
  policy = data.aws_iam_policy_document.host_s3_policy.json
}

data "aws_iam_policy_document" "host_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.host_app.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.host_oai.iam_arn]
    }
  }
}

# S3 bucket policy for CloudFront access - Remote Apps
resource "aws_s3_bucket_policy" "remote_policies" {
  for_each = aws_s3_bucket.remote_apps
  
  bucket = each.value.id
  policy = data.aws_iam_policy_document.remote_s3_policy[each.key].json
}

data "aws_iam_policy_document" "remote_s3_policy" {
  for_each = aws_s3_bucket.remote_apps
  
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${each.value.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.remote_oai[each.key].iam_arn]
    }
  }
}

# Response headers policy for CORS
resource "aws_cloudfront_response_headers_policy" "cors_policy" {
  name    = "mfe-cors-policy-${var.environment}"
  comment = "CORS policy for MFE applications"

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS"]
    }

    access_control_allow_origins {
      items = ["*"]
    }

    access_control_expose_headers {
      items = ["ETag", "Content-Length", "Content-Type", "Date"]
    }

    access_control_max_age_sec = 3600
    origin_override            = true
  }
}

# CloudFront distribution for Host App
resource "aws_cloudfront_distribution" "host_distribution" {
  count = var.enable_cloudfront ? 1 : 0

  origin {
    domain_name = aws_s3_bucket_website_configuration.host_website.website_endpoint
    origin_id   = "host-app-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "host-app-origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    
    # Attach the CORS policy
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_policy.id
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

  tags = merge(var.tags, {
    Name        = "host-app-cloudfront"
    Environment = var.environment
  })
}

# CloudFront distributions for Remote Apps
resource "aws_cloudfront_distribution" "remote_distributions" {
  for_each = var.enable_cloudfront ? aws_s3_bucket.remote_apps : {}

  origin {
    domain_name = aws_s3_bucket_website_configuration.remote_websites[each.key].website_endpoint
    origin_id   = "${each.key}-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "${each.key}-origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    
    # Attach the CORS policy
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_policy.id
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

  tags = merge(var.tags, {
    Name        = "${each.key}-cloudfront"
    Environment = var.environment
  })
}

# Local values for outputs
locals {
  host_url = var.enable_cloudfront ? "https://${aws_cloudfront_distribution.host_distribution[0].domain_name}" : aws_s3_bucket_website_configuration.host_website.website_endpoint
  
  remote_urls = var.enable_cloudfront ? {
    for k, v in aws_cloudfront_distribution.remote_distributions : k => "https://${v.domain_name}"
  } : {
    for k, v in aws_s3_bucket_website_configuration.remote_websites : k => v.website_endpoint
  }
  
  federation_manifest = {
    for k, url in local.remote_urls : k => "${url}/remoteEntry.json"
  }
}
 