# Use a Node.js base image that meets Angular CLI requirements
FROM node:20-slim 

# Set a working directory inside the container
WORKDIR /app

# Install necessary packages:
#   curl, unzip: for installing AWS CLI and Terraform
#   python3, pip: for AWS CLI v2
#   jq: for JSON processing in the script
#   git: for Terraform modules if used
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    python3 \
    python3-pip \
    jq \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws

# Install Terraform
ARG TERRAFORM_VERSION="1.7.5" # Adjust to your version
RUN curl -LO "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip" \
    && unzip "terraform_${TERRAFORM_VERSION}_linux_amd64.zip" \
    && mv terraform /usr/local/bin/ \
    && rm "terraform_${TERRAFORM_VERSION}_linux_amd64.zip"

# Install Angular CLI globally
RUN npm install -g @angular/cli@^17
