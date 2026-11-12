
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

# Latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# VPC
resource "aws_vpc" "cloudops_vpc" {
  cidr_block           = "10.20.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "CloudOps-VPC"
    Project = "CloudOps-Enterprise-Platform"
  }
}

# Public subnet
resource "aws_subnet" "cloudops_public" {
  vpc_id                  = aws_vpc.cloudops_vpc.id
  cidr_block              = "10.20.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "CloudOps-Public-Subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "cloudops_igw" {
  vpc_id = aws_vpc.cloudops_vpc.id

  tags = {
    Name = "CloudOps-Internet-Gateway"
  }
}

# Public route table
resource "aws_route_table" "cloudops_public_rt" {
  vpc_id = aws_vpc.cloudops_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.cloudops_igw.id
  }

  tags = {
    Name = "CloudOps-Public-Route-Table"
  }
}

resource "aws_route_table_association" "cloudops_public_assoc" {
  subnet_id      = aws_subnet.cloudops_public.id
  route_table_id = aws_route_table.cloudops_public_rt.id
}

# Security group: HTTP only
resource "aws_security_group" "cloudops_sg" {
  name        = "CloudOps-Web-SG"
  description = "HTTP access for CloudOps host"
  vpc_id      = aws_vpc.cloudops_vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "CloudOps-Web-SG"
  }
}

# IAM role for secure Systems Manager access
resource "aws_iam_role" "cloudops_ssm_role" {
  name = "CloudOps-EC2-SSM-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "cloudops_ssm_policy" {
  role       = aws_iam_role.cloudops_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "cloudops_profile" {
  name = "CloudOps-EC2-Instance-Profile"
  role = aws_iam_role.cloudops_ssm_role.name
}

# EC2 host
resource "aws_instance" "cloudops_host" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.cloudops_public.id
  vpc_security_group_ids = [aws_security_group.cloudops_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.cloudops_profile.name

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
  }

  metadata_options {
    http_tokens = "required"
  }

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user
  EOF

  tags = {
    Name    = "CloudOps-Application-Host"
    Project = "CloudOps-Enterprise-Platform"
  }
}

output "cloudops_instance_public_ip" {
  description = "Public IP of the CloudOps EC2 host"
  value       = aws_instance.cloudops_host.public_ip
}

output "cloudops_vpc_id" {
  description = "CloudOps VPC ID"
  value       = aws_vpc.cloudops_vpc.id
}
