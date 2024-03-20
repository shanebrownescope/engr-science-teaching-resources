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

CREATE TABLE Concepts (
  ConceptId INT AUTO_INCREMENT,
  ConceptName VARCHAR(255) NOT NULL,
  SectionId INT,
  S3Url VARCHAR(255), 
  PRIMARY KEY (ConceptId),
  FOREIGN KEY (SectionId) REFERENCES Sections(SectionId)
)


CREATE TABLE Files (
  FileId INT NOT NULL AUTO_INCREMENT,
  FileName VARCHAR(255),
  S3Url VARCHAR(512),
  Description TEXT,
  UploadDate DATE,
  Contributor VARCHAR(255),
  ConceptId INT,
  UploadedUserId INT,
  PRIMARY KEY (FileId),
  FOREIGN KEY (UploadedUserId) REFERENCES Users(UserId) ON DELETE CASCADE,
  FOREIGN KEY (ConceptId) REFERENCES Concepts(ConceptId)
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
  LinkName VARCHAR(255),
  LinkUrl VARCHAR(255),
  Description TEXT,
  UploadDate DATE,
  Contributor VARCHAR(255),
  ConceptId INT,
  UploadedUserId INT,
  PRIMARY KEY (LinkId),
  FOREIGN KEY (UploadedUserId) REFERENCES Users(UserId) ON DELETE CASCADE,
  FOREIGN KEY (ConceptId) REFERENCES Concepts(ConceptId)
);


CREATE TABLE LinkTags (
  LinkTagId INT NOT NULL AUTO_INCREMENT,
  LinkId INT,
  TagId INT,
  PRIMARY KEY (LinkTagId),
  FOREIGN KEY (TagId) REFERENCES Tags(TagId) ON DELETE CASCADE,
  FOREIGN KEY (LinkId) REFERENCES Links(LinkId) ON DELETE CASCADE
);

CREATE TABLE Comments (
  CommentId INT NOT NULL AUTO_INCREMENT,
  PageType ENUM('file', 'link'),
  PageId INT,
  UserId INT,
  ParentCommentId INT,
  CommentText TEXT NOT NULL,
  CommentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (CommentId),
  FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
  FOREIGN KEY (FileId) REFERENCES Files(FileId) ON DELETE CASCADE,
  FOREIGN KEY (ParentCommentId) REFERENCES Comments(CommentId)
);

--* inserting comments
INSERT INTO comments (page_type, page_id, comment_text, commenter_name, comment_date)
VALUES ('file', 1, 'This is a great file!', 'John Doe', NOW());

INSERT INTO comments (page_type, page_id, comment_text, commenter_name, comment_date)
VALUES ('link', 1, 'Awesome link!', 'Jane Smith', NOW());


-- Inserting a top-level comment (not a response to another comment)
INSERT INTO Comments (pdf_id, user_id, comment_text, comment_date)
VALUES (123, 456, 'This is an interesting read.', NOW());

-- Inserting a response to a comment (where parent_comment_id references the comment_id of the parent comment)
INSERT INTO Comments (pdf_id, user_id, parent_comment_id, comment_text, comment_date)
VALUES (123, 789, 1, 'I agree, the third section is particularly insightful.', NOW);

--* selecting comments: 
SELECT * FROM comments WHERE page_type = 'file' AND page_id = 1;
SELECT * FROM comments WHERE page_type = 'link' AND page_id = 1;
-- Selecting top-level comments for a specific PDF file (where parent_comment_id is NULL)
SELECT * FROM Comments WHERE pdf_id = 123 AND parent_comment_id IS NULL;

-- Selecting responses to a specific comment (where parent_comment_id references the comment_id of the parent comment)
SELECT * FROM Comments WHERE pdf_id = 123 AND parent_comment_id = 1;




INSERT INTO Courses (CourseName) VALUES ('dynamics');
INSERT INTO Modules (ModuleName, CourseId) VALUES ('1d-motion', 1);



INSERT INTO Sections (SectionName, ModuleId) VALUES ('Problems', 1);


-- search query test 
-- files
  SELECT f.FileId, f.FileName, f.S3Url, f.Description, f.UploadDate, f.Contributor,
         JSON_ARRAYAGG(t.TagName) AS TagNames
  FROM Files f
  JOIN FileTags ft ON f.FileId = ft.FileId
  JOIN Tags t ON ft.TagId = t.TagId
  WHERE (f.FileName LIKE CONCAT('%', $1, '%') OR
         t.TagName LIKE CONCAT('%', $1, '%'))
  GROUP BY f.FileId

-- links
  SELECT l.LinkId, l.LinkName, l.LinkUrl, l.Description, l.UploadDate, l.Contributor,
         JSON_ARRAYAGG(t.TagName) AS TagNames
  FROM Links l
  LEFT JOIN LinkTags lt ON l.LinkId = lt.LinkId
  LEFT JOIN Tags t ON lt.TagId = t.TagId
  WHERE (l.LinkName LIKE CONCAT('%', $1, '%') OR
         t.TagName LIKE CONCAT('%', $1, '%'))
  GROUP BY l.LinkId;






-- 
 SELECT 
    'file' AS Type,
    Files.FileId AS Id,
    Files.FileName AS Name,
    Files.Description AS Description,
    Files.UploadDate AS UploadDate,
    Files.Contributor AS Contributor,
    GROUP_CONCAT(FileTagConcat.TagName SEPARATOR ', ') AS Tags
  FROM 
    Files
  JOIN 
  (
    SELECT 
      FileId, GROUP_CONCAT(Tags.TagName) AS TagName
    FROM 
      FileTags
    JOIN 
      Tags ON FileTags.TagId = Tags.TagId
    GROUP BY 
      FileId
  ) AS FileTagConcat
  ON 
    Files.FileId = FileTagConcat.FileId
  WHERE 
    (FileTagConcat.TagName LIKE CONCAT('%', ?, '%') OR Files.FileName LIKE CONCAT('%', ?, '%'))
  GROUP BY 
    Files.FileId

  UNION

  SELECT 
    'link' AS Type,
    Links.LinkId AS Id,
    Links.LinkName AS Name,
    Links.Description AS Description,
    Links.UploadDate AS UploadDate,
    Links.Contributor AS Contributor,
    GROUP_CONCAT(LinkTagConcat.TagName SEPARATOR ', ') AS Tags
  FROM 
    Links
  JOIN 
  (
    SELECT 
      LinkId, GROUP_CONCAT(Tags.TagName) AS TagName
    FROM 
      LinkTags
    JOIN 
      Tags ON LinkTags.TagId = Tags.TagId
    GROUP BY 
      LinkId
  ) AS LinkTagConcat
  ON 
    Links.LinkId = LinkTagConcat.LinkId
  WHERE 
    (LinkTagConcat.TagName LIKE CONCAT('%', ?, '%') OR Links.LinkName LIKE CONCAT('%', ?, '%'))
  GROUP BY 
    Links.LinkId;




-- * NAME first
 SELECT 
    'file' AS Type,
    Files.FileId AS Id,
    Files.FileName AS Name,
    Files.Description AS Description,
    Files.UploadDate AS UploadDate,
    Files.Contributor AS Contributor,
    GROUP_CONCAT(FileTagConcat.TagName SEPARATOR ', ') AS Tags
  FROM 
    Files
  JOIN 
  (
    SELECT 
      FileId, GROUP_CONCAT(Tags.TagName) AS TagName
    FROM 
      FileTags
    JOIN 
      Tags ON FileTags.TagId = Tags.TagId
    GROUP BY 
      FileId
  ) AS FileTagConcat
  ON 
    Files.FileId = FileTagConcat.FileId
  WHERE 
    (Files.FileName LIKE CONCAT('%', ?, '%') OR FileTagConcat.TagName LIKE CONCAT('%', ?, '%'))
  GROUP BY 
    Files.FileId

  UNION

  SELECT 
    'link' AS Type,
    Links.LinkId AS Id,
    Links.LinkName AS Name,
    Links.Description AS Description,
    Links.UploadDate AS UploadDate,
    Links.Contributor AS Contributor,
    GROUP_CONCAT(LinkTagConcat.TagName SEPARATOR ', ') AS Tags
  FROM 
    Links
  JOIN 
  (
    SELECT 
      LinkId, GROUP_CONCAT(Tags.TagName) AS TagName
    FROM 
      LinkTags
    JOIN 
      Tags ON LinkTags.TagId = Tags.TagId
    GROUP BY 
      LinkId
  ) AS LinkTagConcat
  ON 
    Links.LinkId = LinkTagConcat.LinkId
  WHERE 
    (Links.LinkName LIKE CONCAT('%', ?, '%') OR LinkTagConcat.TagName LIKE CONCAT('%', ?, '%'))
  GROUP BY 
    Links.LinkId;





-- !!!!

-- * TAGS first USING
  SELECT 
    'file' AS Type,
    Files.FileId AS Id,
    Files.FileName AS Name,
    Files.Description AS Description,
    Files.UploadDate AS UploadDate,
    Files.Contributor AS Contributor,
    IFNULL(GROUP_CONCAT(FileTagConcat.TagName SEPARATOR ', '), '') AS Tags
  FROM 
    Files
  LEFT JOIN 
    (
      SELECT 
        FileId, GROUP_CONCAT(Tags.TagName) AS TagName
      FROM 
        FileTags
      JOIN 
        Tags ON FileTags.TagId = Tags.TagId
      GROUP BY 
        FileId
    ) AS FileTagConcat
  ON 
    Files.FileId = FileTagConcat.FileId
  WHERE 
    ((FileTagConcat.TagName LIKE CONCAT('%', ?, '%') OR Files.FileName LIKE CONCAT('%', ?, '%')) OR (Files.FileName LIKE CONCAT('%', ?, '%') AND (FileTagConcat.TagName IS NULL OR FileTagConcat.TagName = '')))
  GROUP BY 
    Files.FileId

  UNION

  SELECT 
    'link' AS Type,
    Links.LinkId AS Id,
    Links.LinkName AS Name,
    Links.Description AS Description,
    Links.UploadDate AS UploadDate,
    Links.Contributor AS Contributor,
    IFNULL(GROUP_CONCAT(LinkTagConcat.TagName SEPARATOR ', '), '') AS Tags
  FROM 
    Links
  LEFT JOIN  
    (
      SELECT 
        LinkId, GROUP_CONCAT(Tags.TagName) AS TagName
      FROM 
        LinkTags
      JOIN 
        Tags ON LinkTags.TagId = Tags.TagId
      GROUP BY 
        LinkId
    ) AS LinkTagConcat
  ON 
    Links.LinkId = LinkTagConcat.LinkId
  WHERE 
    ((LinkTagConcat.TagName LIKE CONCAT('%', ?, '%') OR Links.LinkName LIKE CONCAT('%', ?, '%')) OR (Links.LinkName LIKE CONCAT('%', ?, '%') AND (LinkTagConcat.TagName IS NULL OR LinkTagConcat.TagName = '')))
  GROUP BY 
    Links.LinkId;