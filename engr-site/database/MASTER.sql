SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Files, Tags, Courses, Modules, Sections, FileTags, Pages, Comments ;
SET foreign_key_checks = 1;

CREATE TABLE Users (
  UserId INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(255),
  Email VARCHAR(255),
  Password VARCHAR(255),
  Role VARCHAR(255),
  PRIMARY KEY (UserId)
);


CREATE TABLE Courses (
  CourseId INT NOT NULL AUTO_INCREMENT,
  CourseName VARCHAR(255) NOT NULL,
  PRIMARY KEY (courseId)
);

CREATE TABLE Modules (
    ModuleId INT AUTO_INCREMENT,
    ModuleName VARCHAR(255) NOT NULL,
    CourseId INT,
    S3Url VARCHAR(255), 
    PRIMARY KEY (ModuleId),
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId)
);

CREATE TABLE Sections (
    SectionId INT AUTO_INCREMENT,
    SectionName VARCHAR(255) NOT NULL,
    ModuleId INT,
    S3Url VARCHAR(255), 
    PRIMARY KEY (SectionId),
    FOREIGN KEY (ModuleId) REFERENCES Modules(ModuleId)
);


CREATE TABLE Files (
  FileId INT NOT NULL AUTO_INCREMENT,
  FileName VARCHAR(255),
  SectionId INT,
  S3Url VARCHAR(255),
  UploadedUserId INT,
  PRIMARY KEY (FileId),
  FOREIGN KEY (UploadedUserId) REFERENCES Users(UserId) ON DELETE CASCADE
  FOREIGN KEY (SectionId) REFERENCES Sections(SectionId)
);


CREATE TABLE Tags (
  TagId INT NOT NULL AUTO_INCREMENT,
  TagName VARCHAR(255),
  PRIMARY KEY (TagId)
);

CREATE TABLE FileTags (
  FileTagId INT NOT NULL AUTO_INCREMENT,
  FileId INT,
  TagId INT,
  PRIMARY KEY (FileTagId),
  FOREIGN KEY (TagId) REFERENCES Tags(TagId) ON DELETE CASCADE,
  FOREIGN KEY (FileId) REFERENCES Files(FileId) ON DELETE CASCADE
);

CREATE TABLE Links (
  LinkId INT NOT NULL AUTO_INCREMENT,
  LinkUrl VARCHAR(255),
  PRIMARY KEY (LinkId)
)


CREATE TABLE LinkTags (
  LinkTagsId INT NOT NULL AUTO_INCREMENT,
  LinkId INT,
  TagId INT,
  PRIMARY KEY (LinkTagsId),
  FOREIGN KEY (TagId) REFERENCES Tags(TagId) ON DELETE CASCADE,
  FOREIGN KEY (LinkId) REFERENCES Links(LinkId) ON DELETE CASCADE
);



CREATE TABLE Comments (
  CommentId INT NOT NULL AUTO_INCREMENT,
  UserId INT NOT NULL,
  FileId INT,
  UserName VARCHAR(255) NOT NULL,
  CommentText TEXT NOT NULL,
  CommentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (CommentId),
  FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
  FOREIGN KEY (FileId) REFERENCES Files(FileId) ON DELETE CASCADE
);







INSERT INTO Courses (CourseName) VALUES ('dynamics');
INSERT INTO Modules (ModuleName, CourseId) VALUES ('1d-motion', 1);



INSERT INTO Sections (SectionName, ModuleId) VALUES ('Problems', 1);