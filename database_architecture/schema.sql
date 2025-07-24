-- 1. USERS: Admins and recruiters
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'recruiter', 'viewer') NOT NULL DEFAULT 'recruiter',
  mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CANDIDATES: Parsed from CVs
CREATE TABLE candidates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255),
  email VARCHAR(255),
  location VARCHAR(255),
  experience_years INT,
  education_level ENUM('Bachelor', 'Master', 'Other'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CV FILES: Uploaded resumes
CREATE TABLE cv_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  candidate_id INT NOT NULL,
  uploaded_by INT NOT NULL,
  file_url TEXT NOT NULL,
  file_type ENUM('pdf', 'docx', 'txt') NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_latest BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- 4. SKILLS: Unique skills list
CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100)
);

-- 5. CANDIDATE SKILLS: Many-to-many relation
CREATE TABLE candidate_skills (
  candidate_id INT NOT NULL,
  skill_id INT NOT NULL,
  PRIMARY KEY (candidate_id, skill_id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- 6. JOBS: Job postings
CREATE TABLE jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  required_skills TEXT,
  posted_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- 7. AUDIT LOGS: Security tracking
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
