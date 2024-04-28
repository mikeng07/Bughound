-- insert database entities here

CREATE TABLE Users (
    user_id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_name       VARCHAR(255) NOT NULL UNIQUE,
    user_pass       VARCHAR(255) NOT NULL,
    user_realname   VARCHAR(255) NOT NULL,
    user_access     ENUM('1', '2', '3') NOT NULL DEFAULT '1'
);

CREATE TABLE Programs (
    program_id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    program_name        VARCHAR(255) NOT NULL,                      -- name
    program_version     INT NOT NULL,                               -- release
    release_version     INT NOT NULL                                -- version
);
CREATE TABLE Areas (
    area_id             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    area_title          VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE program_areas (                                        -- bridge table b/t 'programs' and 'areas'
    pa_id               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    program_id          INT NOT NULL,
    area_id             INT NOT NULL,
    FOREIGN KEY (program_id) REFERENCES Programs (program_id),      -- connects to Programs:programs_id
    FOREIGN KEY (area_id)    REFERENCES Areas (area_id)             -- connects to Areas:area_id
);

CREATE TABLE Bugs (
    bug_id              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    program_id          INT NOT NULL,
    bug_type            ENUM('Coding Error','Design Issue','Suggestion','Documentation','Hardware','Query', 'Unknown') NOT NULL DEFAULT 'Unknown',
    bug_severity        ENUM('Mild', 'Infectious', 'Serious', 'Fatal') NOT NULL DEFAULT 'Mild',
    bug_title           VARCHAR(255) NOT NULL,
    bug_description     VARCHAR(255) NOT NULL,
    bug_suggestion      VARCHAR(255),
    bug_reproducible    BOOLEAN NOT NULL DEFAULT FALSE,
    user_reporter_id    INT NOT NULL,
    bug_find_date       DATE NOT NULL,
    FOREIGN KEY (program_id)       REFERENCES Programs(program_id), -- connects to Programs:program_id
    FOREIGN KEY (user_reporter_id) REFERENCES Users(user_id)        -- connects to Users:user_id
);

CREATE TABLE Resolutions (
    resolution_id       INT NOT NULL PRIMARY KEY,
    bug_id              INT NOT NULL,
    area_id             INT NOT NULL,
    res_status          ENUM('Open','Closed', 'Resolved') NOT NULL DEFAULT 'Open',
    res_priority        ENUM('0','1','2','3','4','5','6') NOT NULL DEFAULT '0',
    res_state           ENUM('Pending','FIxed', 'Cannot be reproduced', 'Deferred', 'As designed', 'Withdrawn by reporter', 'Needs more information', 'Disagree with suggestion', 'Duplicate') NOT NULL DEFAULT 'Pending',
    res_version         INT NOT NULL,
    res_comments        VARCHAR(255),
    res_defer           BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_id         INT NOT NULL,
    resolver_id         INT NOT NULL,
    resolver_date       DATE NOT NULL,
    restester_id        INT NOT NULL,
    restester_date      DATE NOT NULL,
    FOREIGN KEY (bug_id)        REFERENCES Bugs(bug_id),            -- connected to Bugs:bug_id
    FOREIGN KEY (area_id)       REFERENCES Areas(area_id),          -- connected to Areas:area_id
    FOREIGN KEY (assigned_id)   REFERENCES Users(user_id),          -- a user is assigned
    FOREIGN KEY (resolver_id)   REFERENCES Users(user_id),          -- a user resolves
    FOREIGN KEY (restester_id)  REFERENCES Users(user_id)           -- a user tests the resolution
);

CREATE TABLE Attachments (
    attach_id       INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    attach_name     VARCHAR(255) NOT NULL,
    attach_content  BLOB,
    bug_id          INT NOT NULL,
    FOREIGN KEY (bug_id) REFERENCES Bugs(bug_id)                    -- connected to Bugs:bug_id
);

-- TEST POPULATION OF TABLES -----------------------------------------

-- NOTE: bugs, reports, and resolutions are set off by submissions only
-- TODO: procedure to connect reports of 1 bug to another bug (correlation)
-- TODO: procedure to add to / remove from 'Users', 'Areas'

-- 'Users' table
INSERT INTO Users (user_name, user_pass, user_realname, user_access) VALUES ("admin", SHA2("admin", 256), "ADMIN", 3);
INSERT INTO Users (user_name, user_pass, user_realname, user_access) VALUES ("user", SHA2("user", 256), "USER", 1);

-- DELETE FROM Users;

-- REMOVING TABLES ---------------------------------------------------
DROP TABLE Attachments;
DROP TABLE Resolutions;
DROP TABLE Bugs;
DROP TABLE program_areas;
DROP TABLE Programs;
DROP TABLE Areas;
DROP TABLE Users;

