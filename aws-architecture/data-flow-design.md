# 1.3 Data Flow Design

This section walks through how data flows through the system for each core use case.

---

## 1. CV Upload Process

1. Recruiter logs in securely using email/password and optional MFA.
2. From the frontend, they upload a CV file using a presigned URL provided by the backend.
3. The file gets stored in an S3 bucket.
4. That upload triggers an AWS Lambda function.
5. Lambda extracts text content (either via custom code or using AWS Textract if needed).
6. The extracted data (name, email, skills, etc.) is saved to the MySQL database under the correct candidate.
7. Lambda logs the event to CloudWatch.

---

## 2. Search Request

1. Recruiter types a keyword or filter into the search bar (e.g. “JavaScript AND React” or filter by years of experience).
2. The frontend sends a GET request to the backend API.
3. Backend queries MySQL using optimized SQL + full-text search indexes.
4. Matching candidate records are returned, ranked or sorted as needed.
5. Results are displayed in the UI instantly.

---

## 3. User Authentication (Login with MFA)

1. User submits login credentials.
2. Backend checks password and whether MFA is enabled.
3. If MFA is enabled, a one-time code (TOTP) is verified.
4. If successful, backend signs a JWT token and returns it.
5. The token is stored securely in localStorage or sessionStorage based on “Remember Me”.
6. Authenticated users can now access protected endpoints.

---

## 4. Batch Processing (Data Cleanup & Analytics)

1. A scheduled event (like a daily CloudWatch cron) triggers a Lambda function.
2. It cleans up old unlinked CVs or expired sessions.
3. It could also generate simple analytics — like how many CVs were uploaded this week or which skills are trending.
4. These analytics can be stored in a separate table or exported to a reporting dashboard.

---