variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "mfe-workspace"
}

variable "remote_apps" {
  description = "Remote applications"
  type        = list(string)
  default = [
    "app-list",
    "app-workspace",
    "actor-app",
    "app-edit",
    "home-app",
    "app-parser",
    "app-models"
  ]
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
  }
}