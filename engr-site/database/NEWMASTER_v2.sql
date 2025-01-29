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
  contributor VARCHAR(255),
  resourceType ENUM('exercise', 'notes', 'video', 'interactive') DEFAULT 'exercise' NOT NULL,
  uploadedUserId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (uploadedUserId) REFERENCES Users_v3(id) ON DELETE CASCADE
);

CREATE TABLE CourseTopicFiles (
  id INT NOT NULL AUTO_INCREMENT,
  courseTopicId INT,
  fileId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (courseTopicId) REFERENCES CourseTopics_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (fileId) REFERENCES Files_v3(id) ON DELETE CASCADE
);


CREATE TABLE Tags_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  tagName VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE FileTags_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  fileId INT,
  tagId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (tagId) REFERENCES Tags_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (fileId) REFERENCES Files_v3(id) ON DELETE CASCADE
);


CREATE TABLE Links_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  linkName VARCHAR(255) NOT NULL,
  linkUrl VARCHAR(255) NOT NULL,
  description TEXT,
  uploadDate DATE,
  contributor VARCHAR(255),
  resourceType ENUM('exercise', 'notes', 'video', 'interactive') DEFAULT 'exercise' NOT NULL,
  uploadedUserId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (uploadedUserId) REFERENCES Users_v3(id) ON DELETE CASCADE
);

CREATE TABLE CourseTopicLinks (
  id INT NOT NULL AUTO_INCREMENT,
  courseTopicId INT,
  linkId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (courseTopicId) REFERENCES CourseTopics_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (linkId) REFERENCES Links_v3(id) ON DELETE CASCADE
);


CREATE TABLE LinkTags_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  linkId INT,
  tagId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (tagId) REFERENCES Tags_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (linkId) REFERENCES Links_v3(id) ON DELETE CASCADE
);

CREATE TABLE FileComments_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  fileId INT NOT NULL,
  userId INT NOT NULL,
  parentCommentId INT DEFAULT NULL,
  commentText TEXT NOT NULL,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (parentCommentId) REFERENCES FileComments_v3(id),
  FOREIGN KEY (fileId) REFERENCES Files_v3(id) ON DELETE CASCADE
);

CREATE TABLE LinkComments_v3 (
  id INT NOT NULL AUTO_INCREMENT,
  linkId INT NOT NULL,
  userId INT NOT NULL,
  parentCommentId INT DEFAULT NULL,
  commentText TEXT NOT NULL,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users_v3(id) ON DELETE CASCADE,
  FOREIGN KEY (parentCommentId) REFERENCES LinkComments_v3(id),
  FOREIGN KEY (linkId) REFERENCES Links_v3(id) ON DELETE CASCADE
);
