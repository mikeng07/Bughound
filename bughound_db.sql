CREATE DATABASE bughound_db;
USE bughound_db;

-- insert database entities here
-- TODO: check if this is right
-- TODO: change varchar lengths based on what the variable is

CREATE TABLE users (
    user_id     INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    user_name   VARCHAR(255) NOT NULL,
    user_pass   VARCHAR(255) NOT NULL,
    user_access INT NOT NULL DEFAULT 1                              -- note: 3 levels of access
);

CREATE TABLE bugs (
    bug_id              INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    bug_title           VARCHAR(255) NOT NULL,
    bug_severity        VARCHAR(255) NOT NULL,
    bug_description     VARCHAR(255) NOT NULL,
    bug_fix_suggestion  VARCHAR(255),
    user_reporter_id    INT NOT NULL,
    bug_find_date       DATE NOT NULL,
);

CREATE TABLE reports (
    report_id           INT NOT NULL IDENTITY(1,1) PRIMARY KEY,

    program_name        VARCHAR(255) NOT NULL,
    release_id          INT NOT NULL,
    version_id          INT NOT NULL,

    report_type         VARCHAR(255) NOT NULL,
    report_reproducible BOOLEAN NOT NULL DEFAULT FALSE,

    bug_id              INT NOT NULL,                               -- connects to bugs:bug_id
    report_title        VARCHAR(255) NOT NULL,                      -- connects to bugs:bug_title 
    report_severity     VARCHAR(255) NOT NULL,                      -- connects to bugs:bug_severity
    report_recreate     VARCHAR(255) NOT NULL,                      -- connects to bugs:bug_description
    report_fix_suggest  VARCHAR(255),                               -- connects to bugs:bug_fix_suggestion
    user_reporter_id    INT NOT NULL,                               -- connects to bugs:user_reporter_id
    report_date         DATE NOT NULL,                              -- connects to bugs:bug_find_date

);

CREATE TABLE programs (
    program_id          INT NOT NULL,                               -- TODO: hash program_name, release_id, and version_id together
    program_name        VARCHAR(255) NOT NULL,                      -- connected to reports:program_name
    release_id          INT NOT NULL,                               -- connected to reports:release_id
    version_id          INT NOT NULL,                               -- connected to reports:version_id
);

CREATE TABLE areas (
    area_id             INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    area_title          VARCHAR(255)
);

CREATE TABLE resolutions (
    resolution_id       INT NOT NULL PRIMARY KEY,
    report_id           INT NOT NULL,                               -- connected to reports:report_id
    area_id             INT NOT NULL,                               -- connected to areas:area_id
    resolution_status   INT NOT NULL,                               -- 1-2: open, closed
    resolution_priority INT NOT NULL,                               -- 1-5
    resolution_state    INT NOT NULL,                               -- 1-9: pending, fixed, irreproducible, etc.
    resolution_version  INT NOT NULL,
    resolution_comments VARCHAR(255),  
    
    resolver_id         INT NOT NULL,
    resolver_date       DATE NOT NULL,
    restester_id        INT NOT NULL,
    restester_date      DATE NOT NULL
);




-- insert sql functions/procedures here (TODO: rewrite to make more modular and more function-like)

-- insert a new bug report
-- INSERT INTO bugs (title, description, reported_by, severity) VALUES ('Bug Title', 'Bug Description', 1, 'High');
-- CREATE FUNCTION createBugReport (@title VARCHAR(255), @description VARCHAR(255), @reported_by INT, @severity VARCHAR(255))
-- RETURNS INT AS 
-- begin 
--     INSERT INTO bugs (@title, @description, @reported_by, @severity) VALUES ('Bug Title', 'Bug Description', 1, 'High'); 
--     IF EXISTS(SELECT 1 FROM bugs WHERE bug_title=@title AND bug_description=@description AND reporter_id=@reported_by AND bug_severity=@severity) RETURN 1;
--     RETURN 0;
-- end

-- fetch all bugs (TODO: a select for specific entries)
-- SELECT * FROM bugs;
-- CREATE FUNCTION getBugReports()
-- RETURNS TABLE AS
-- RETURN(select * from bugs);

-- update a bug report
-- UPDATE bugs SET status = 'Resolved' WHERE bug_id = 1;

-- delete a bug report
-- DELETE FROM bugs WHERE bug_id = 1;
-- CREATE FUNCTION deleteBugReport (@bug_id INT)
-- BEGIN
--     IF EXISTS(SELECT 1 FROM bugs WHERE bug_id = @bug_id)
--     BEGIN
--         DELETE FROM bugs WHERE bug_id = @bug_id;
--         RETURN 1;
--     END
--     ELSE
--     BEGIN
--         RETURN 0;
--     END
-- END

-- insert sql procedures (which use the functions; MAYBE to use in PHP-land?)