# Netflix-Style Application — AWS DevOps Deployment & CI/CD

A Netflix-style full-stack application containerized with Docker and deployed to AWS EC2 using Amazon ECR, GitHub Actions, and AWS Systems Manager.

This project was built as a hands-on DevOps project to understand how an application moves from local development to a cloud-based CI/CD deployment.

---

## 🚀 Project Overview

The application consists of:

- React frontend
- Spring Boot backend
- MongoDB Atlas database
- Docker
- Docker Compose
- Amazon ECR
- Amazon EC2
- GitHub Actions
- AWS IAM
- GitHub OIDC
- AWS Systems Manager (SSM)

The application was first containerized and tested locally using Docker Compose.

It was then deployed to AWS EC2, with Docker images stored in Amazon ECR and GitHub Actions handling the CI/CD process.

---

## 🏗️ Architecture

```text
Developer
    │
    │ git push
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Build Backend Docker Image
    │
    ├── Build Frontend Docker Image
    │
    └── Push Images to Amazon ECR
              │
              ▼
        Amazon ECR
        ┌───────────────┐
        │ Backend Image │
        │ Frontend Image│
        └───────┬───────┘
                │
                ▼
             AWS EC2
                │
          Docker Compose
          ┌─────┴─────┐
          ▼           ▼
      Frontend      Backend
       :3000         :8080
                       │
                       ▼
                 MongoDB Atlas


Technologies Used
Application
React
Spring Boot
Java 17
MongoDB Atlas
Maven
Containerization
Docker
Docker Compose
Dockerfiles
AWS
Amazon EC2
Amazon ECR
AWS IAM
AWS Systems Manager
AWS OIDC
CI/CD
GitHub Actions
GitHub OIDC
AWS Systems Manager
🐳 Docker

The frontend and backend are packaged into separate Docker images.

Frontend
netflix-frontend

The React application runs on:

Port 3000
Backend
netflix_backend

The Spring Boot application runs on:

Port 8080

The backend connects to MongoDB Atlas using environment variables instead of hardcoding database credentials.

MONGO_DATABASE
MONGO_URI
☁️ Amazon ECR

Two private Amazon ECR repositories were created:

netflix-frontend
netflix_backend

The Docker images are stored in ECR before being deployed to EC2.

Example image registry:

572691076193.dkr.ecr.us-east-1.amazonaws.com/netflix-frontend
572691076193.dkr.ecr.us-east-1.amazonaws.com/netflix_backend
🖥️ Amazon EC2

The application runs on an Ubuntu EC2 instance.

Docker and Docker Compose are installed on the instance.

Docker Compose is responsible for running the frontend and backend containers.

The application is exposed through:

Frontend:
http://EC2_PUBLIC_IP:3000

Backend API:
http://EC2_PUBLIC_IP:8080/api/v1/movies

MongoDB is hosted externally using MongoDB Atlas.

🔄 CI/CD Pipeline

The deployment process is automated using GitHub Actions.

The pipeline follows this flow:

git push origin main
        │
        ▼
GitHub Actions
        │
        ▼
Authenticate with AWS using OIDC
        │
        ▼
Build Docker Images
        │
        ├───────────────┐
        ▼               ▼
 Backend Image    Frontend Image
        │               │
        └───────┬───────┘
                ▼
           Amazon ECR
                │
                ▼
       AWS Systems Manager
                │
                ▼
              EC2
                │
                ▼
       Authenticate Docker
             with ECR
                │
                ▼
       docker compose pull
                │
                ▼
       docker compose up -d
                │
                ▼
        Updated application
🔐 AWS Authentication

GitHub Actions uses GitHub OIDC to authenticate with AWS without storing long-lived AWS access keys inside GitHub.

The GitHub Actions workflow assumes an AWS IAM role:

GitHubActionsNetflixDeployRole

The IAM trust policy restricts the role to the GitHub repository and main branch.

The EC2 instance uses an IAM role to access Amazon ECR.

Docker is authenticated to ECR during deployment using:

aws ecr get-login-password --region us-east-1 | \
docker login --username AWS --password-stdin <ECR_REGISTRY>

This allows Docker on EC2 to pull the latest images from ECR.

🧩 AWS Systems Manager

GitHub Actions deploys to EC2 using AWS Systems Manager instead of opening an SSH connection from GitHub Actions.

The workflow sends commands to the EC2 instance to:

docker compose pull
docker compose up -d
docker image prune -f

This allows the deployment process to be triggered remotely from GitHub Actions.

**🐛 Challenges & Troubleshooting**

This project involved several real deployment issues.

1. Frontend was using an old EC2 IP

The EC2 public IP changed after the instance was restarted.

The frontend was initially trying to communicate with the previous IP address.

The issue was identified through the browser Network tab.

The frontend was then configured to use the hostname from which the application was loaded:

baseURL: `http://${window.location.hostname}:8080`

This allows the frontend to communicate with the backend using the current EC2 hostname.

2. Incorrect deployment directory

The GitHub Actions workflow initially used:

cd ~/ubuntu

This resolved to:

/home/ubuntu/ubuntu

The actual Docker Compose file was located at:

/home/ubuntu/docker-compose.yml

The deployment command was corrected to use:

cd /home/ubuntu
3. Docker could not pull images from ECR

GitHub Actions was able to push images to ECR, but Docker on EC2 initially returned:

no basic auth credentials

The EC2 instance already had an IAM role with access to ECR.

However, Docker itself still needed to authenticate to the ECR registry.

This was resolved using:

aws ecr get-login-password --region us-east-1 | \
docker login --username AWS --password-stdin <ECR_REGISTRY>
4. EC2 disk space

The EC2 instance ran out of disk space while Docker was pulling new images.

Disk usage was investigated with:

df -h

Docker storage was also inspected and unnecessary containers and images were removed.

Useful Docker commands included:

docker ps
docker compose down
docker rmi <image>
docker system df

This freed enough space for the new images to be downloaded and extracted.

📚 What I Learned

This project helped me understand that DevOps is not only about writing Dockerfiles or YAML files.

Some of the main lessons were:

How to containerize a full-stack application
How Docker Compose connects multiple application services
How Docker images are stored and managed in Amazon ECR
How applications can run on AWS EC2
How IAM roles provide AWS permissions
How GitHub OIDC can authenticate GitHub Actions with AWS
How GitHub Actions can automate Docker builds and deployments
How AWS Systems Manager can be used for remote deployment
The difference between AWS permissions and Docker registry authentication
How to troubleshoot networking issues
How to troubleshoot Docker disk-space issues
How to investigate deployment failures instead of simply restarting everything

The biggest lesson was learning to understand what is happening between each component of the deployment pipeline.

🎯 Project Goal

The goal of this project was to move from:

Application running locally

to:

Containerized application
        ↓
Docker Compose
        ↓
Amazon ECR
        ↓
Amazon EC2
        ↓
GitHub Actions CI/CD
        ↓
Automated deployment

This project represents my hands-on learning journey in cloud infrastructure, containerization, CI/CD, and AWS.

👨‍💻 Author

Damilola Kolawole

DevOps / Cloud Computing Learner

GitHub: kolawoledamilola779-del

LinkedIn: www.linkedin.com/in/damilola-kolawole1a








