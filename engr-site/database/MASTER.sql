CREATE TABLE Users (
  UserId INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(255),
  Email VARCHAR(255),
  Password VARCHAR(255),
  Role VARCHAR(255),
  PRIMARY KEY (UserId)
);


CREATE TABLE Files (
  FileId INT NOT NULL AUTO_INCREMENT,
  FileName VARCHAR(255),
  S3Url VARCHAR(255),
  UploadedUserId INT,
  PRIMARY KEY (FileId),
  FOREIGN KEY (UploadedUserId) REFERENCES Users(UserId) ON DELETE SET NULL
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
  FOREIGN KEY (UserId) REFERENCES Files(FileId) ON DELETE CASCADE,
  FOREIGN KEY (FileId) REFERENCES Files(FileId) ON DELETE CASCADE,
);




-- CREATE TABLE `Users` (
--   `UserId` INT NOT NULL AUTO_INCREMENT,
--   `Name` VARCHAR(255),
--   `Email` VARCHAR(255),
--   `Password` VARCHAR(255),
--   `Role` VARCHAR(255),
--   PRIMARY KEY (`UserId`)
-- );


-- CREATE TABLE `Files` (
--   `FileId` INT NOT NULL AUTO_INCREMENT,
--   `FileName` VARCHAR(255),
--   `S3Url` VARCHAR(255),
--   `UploadedUserId` INT,
--   PRIMARY KEY (`FileId`),
--   FOREIGN KEY (`UploadedUserId`) REFERENCES `Users`(`UserId`) ON DELETE SET NULL
-- );


-- CREATE TABLE `Tags` (
--   `TagId` INT NOT NULL AUTO_INCREMENT,
--   `TagName` VARCHAR(255),
--   PRIMARY KEY (`TagId`)
-- );


-- CREATE TABLE `FileTags` (
--   `FileTagId` INT NOT NULL AUTO_INCREMENT,
--   `FileId` INT,
--   `TagId` INT,
--   PRIMARY KEY (`FileTagId`),
--   FOREIGN KEY (`UserId`) REFERENCES `Files`(`FileId`) ON DELETE CASCADE,
--   FOREIGN KEY (`FileId`) REFERENCES `Files`(`FileId`) ON DELETE CASCADE,
-- );





