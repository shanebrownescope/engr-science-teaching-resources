SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Files, Tags, Courses, Modules, Sections, FileTags, Pages, Comments ;
SET foreign_key_checks = 1;


CREATE TABLE Users_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'instructor', 'student') DEFAULT 'instructor' NOT NULL,
  accountStatus ENUM('pending', 'approved', 'activated', 'rejected') DEFAULT 'pending',
  registrationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE PasswordResetTokens_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users_v3(id) ON DELETE CASCADE
);

CREATE TABLE Courses_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  courseName VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE CourseTopics_v3 (
  id INT AUTO_INCREMENT,
  courseTopicName VARCHAR(255) NOT NULL,
  courseId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (courseId) REFERENCES Courses_v3(id)
);

CREATE TABLE Files_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  fileName VARCHAR(255),
  s3Url VARCHAR(512),
  description TEXT,
  uploadDate DATE,
  contributorId INT,
  resourceType ENUM('exercise', 'notes', 'video', 'interactive') DEFAULT 'exercise' NOT NULL,
  uploadedUserId INT,
  avgRating DECIMAL(3, 2),
  numReviews INT DEFAULT 0 NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (contributorId) REFERENCES Contributors_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (uploadedUserId) REFERENCES Users_v3(id) ON DELETE CASCADE
);

CREATE TABLE Links_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  linkName VARCHAR(255),
  linkUrl VARCHAR(255) NOT NULL,
  description TEXT,
  uploadDate DATE,
  contributorId INT,
  resourceType ENUM('exercise', 'notes', 'video', 'interactive') DEFAULT 'exercise' NOT NULL,
  uploadedUserId INT,
  avgRating DECIMAL(3, 2),
  numReviews INT DEFAULT 0 NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (contributorId) REFERENCES Contributors_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (uploadedUserId) REFERENCES Users_v3(id) ON DELETE CASCADE
);

CREATE TABLE Tags_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  tagName VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE Contributors_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  contributorName VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE CourseTopicFiles_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  courseTopicId INT,
  fileId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (courseTopicId) REFERENCES CourseTopics_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (fileId) REFERENCES Files_v3(id) ON DELETE CASCADE
);

CREATE TABLE CourseTopicLinks_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  courseTopicId INT,
  linkId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (courseTopicId) REFERENCES CourseTopics_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (linkId) REFERENCES Links_v3(id) ON DELETE CASCADE
);

CREATE TABLE FileTags_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  fileId INT,
  tagId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (tagId) REFERENCES Tags_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (fileId) REFERENCES Files_v3(id) ON DELETE CASCADE
);

CREATE TABLE LinkTags_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  linkId INT,
  tagId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (tagId) REFERENCES Tags_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (linkId) REFERENCES Links_v3(id) ON DELETE CASCADE
);

CREATE TABLE FileReviews_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  fileId INT NOT NULL,
  userId INT NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  comments TEXT,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  userPublicName VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (fileId) REFERENCES Files_v3(id) ON DELETE CASCADE
);

CREATE TABLE LinkReviews_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  linkId INT NOT NULL,
  userId INT NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  comments TEXT,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  userPublicName VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (linkId) REFERENCES Links_v3(id) ON DELETE CASCADE
);

CREATE TABLE ExternalRequests_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  courseId INT NOT NULL,
  requestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  responseDate TIMESTAMP NULL,
  responseNotes TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (courseId) REFERENCES Courses_v3(id)
);