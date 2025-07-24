# AWS Service Selection

This section explains the AWS services I chose for each part of the architecture, and why they made sense for the problem. I focused on keeping things simple, scalable, and familiar.

---

## 1. User Interface Layer

**Services Used:** Amazon S3 + Amazon CloudFront

**Why I Chose These:**
I’m hosting the frontend (built in React) as a static site on Amazon S3. It’s super simple to set up and doesn’t require a server. CloudFront makes the frontend load fast from anywhere by caching files globally. It also handles HTTPS, which is important for security.

---

## 2. Application Layer

**Services Used:** Amazon ECS Fargate + Application Load Balancer (ALB)

**Why I Chose These:**
I containerized my Node.js backend and deployed it using Fargate so I don’t have to manage servers or EC2 instances. Fargate automatically scales when needed. ALB is used to distribute traffic and route requests to the correct containers.

---

## 3. Authentication and Security

**Services Used:** JWT Auth (custom in backend) + IAM roles for permissions

**Why I Chose These:**
For login, I used JWTs to keep things stateless and secure. I added optional MFA support as well. IAM roles help control what AWS services can talk to each other — for example, making sure only the Lambda function can access the S3 bucket.

---

## 4. Processing Layer

**Services Used:** Amazon S3 + AWS Lambda + (optional) Textract

**Why I Chose These:**
When a recruiter uploads a CV, it gets stored in S3. That upload event automatically triggers a Lambda function, which extracts data (like name, skills, etc.) and saves it in the database. Textract is an optional service in case we want to extract structured data from PDFs more accurately.

---

## 5. Data Layer

**Services Used:** Amazon RDS (MySQL) + Amazon S3

**Why I Chose These:**
I’m using MySQL on RDS for the main app data — users, candidates, jobs, skills, etc. It’s managed by AWS so I don’t need to worry about backups or scaling. CV files are stored in S3, which is cheap and secure. I use presigned URLs to allow the frontend to upload or access files safely.

---

## 6. Monitoring Layer

**Services Used:** Amazon CloudWatch

**Why I Chose This:**
CloudWatch gives me logs and metrics from both the backend and the Lambda functions. I can set up alerts if something goes wrong (like too many failed CV uploads or API errors). It helps me monitor the system without needing extra tools.

---

## Other Security Features

- All APIs and the frontend are served over HTTPS
- S3 buckets are private and only accessible through signed URLs
- MFA can be enabled during login
- I’ve added input validation and basic rate limiting to protect the backend

This setup keeps things lightweight and simple to manage, but still secure and scalable enough to grow if needed.
