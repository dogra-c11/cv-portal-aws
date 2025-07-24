-- 1. USERS: Admins and recruiters
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'recruiter', 'viewer') NOT NULL DEFAULT 'recruiter',
  mfaEnabled BOOLEAN DEFAULT FALSE,
  otpCode VARCHAR(255),
  otpExpiry DATETIME,
  failedLoginAttempts INT DEFAULT 0,
  lockUntil DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CANDIDATES: Parsed from CVs
CREATE TABLE candidates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255),
  email VARCHAR(255),
  location VARCHAR(255),
  experienceYears INT,
  educationLevel ENUM('Bachelor', 'Master', 'Other'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CV FILES: Uploaded resumes
CREATE TABLE cv_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  candidateId INT NOT NULL,
  uploadedBy INT NOT NULL,
  fileUrl TEXT NOT NULL,
  fileType ENUM('pdf', 'docx', 'txt') NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isLatest BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (candidateId) REFERENCES candidates(id),
  FOREIGN KEY (uploadedBy) REFERENCES users(id)
);

-- 4. SKILLS: Unique skills list
CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100)
);

-- 5. CANDIDATE SKILLS: Many-to-many relation
CREATE TABLE candidate_skills (
  candidateId INT NOT NULL,
  skillId INT NOT NULL,
  PRIMARY KEY (candidateId, skillId),
  FOREIGN KEY (candidateId) REFERENCES candidates(id),
  FOREIGN KEY (skillId) REFERENCES skills(id)
);

-- 6. JOBS: Job Templates
CREATE TABLE job_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  defaultLocation VARCHAR(255),
  defaultRequiredSkills TEXT,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);

-- 7. JOBS: Jobs postings
CREATE TABLE jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  requiredSkills TEXT,
  postedBy INT NOT NULL,
  templateId INT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postedBy) REFERENCES users(id),
  FOREIGN KEY (templateId) REFERENCES job_templates(id)
);

-- 8. AUDIT LOGS: Security tracking
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
