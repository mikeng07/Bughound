-- insert database entities here
-- TODO: check if this is right
-- TODO: change varchar lengths based on what the variable is

CREATE TABLE Users (
    user_id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_name       VARCHAR(255) NOT NULL,
    user_pass       VARCHAR(255) NOT NULL,
    user_realname   VARCHAR(255) NOT NULL,
    user_access     INT NOT NULL DEFAULT 1   -- note: access_lvl (1:emp, 2:manager, 3:admin)
);

CREATE TABLE bug_severity (
    severity_id     INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bug_severity    VARCHAR(255) NOT NULL
);

CREATE TABLE Bugs (
    bug_id              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bug_title           VARCHAR(255) NOT NULL,
    bug_severity_id     INT NOT NULL,
    bug_description     VARCHAR(255) NOT NULL,
    bug_fix_suggestion  VARCHAR(255),
    user_reporter_id    INT NOT NULL,
    bug_find_date       DATE NOT NULL,
    FOREIGN KEY (bug_severity_id)  REFERENCES bug_severity(severity_id),-- connects to bug_severity:bug_severity_id
    FOREIGN KEY (user_reporter_id) REFERENCES Users(user_id)            -- connects to Users:user_id
);

CREATE TABLE Programs (
    program_id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    program_name        VARCHAR(255) NOT NULL,                          -- name
    program_version     INT NOT NULL,                                   -- release
    release_version     INT NOT NULL                                    -- version
);
CREATE TABLE Areas (
    area_id             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    area_title          VARCHAR(255) NOT NULL
);
CREATE TABLE program_areas (                                            -- bridge table b/t 'programs' and 'areas'
    program_id          INT NOT NULL,
    area_id             INT NOT NULL,
    FOREIGN KEY (program_id) REFERENCES Programs (program_id),          -- connects to Programs:programs_id
    FOREIGN KEY (area_id)    REFERENCES Areas (area_id)                 -- connects to Areas:area_id
);

CREATE TABLE report_types(
    report_type_id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    report_type         VARCHAR(255) NOT NULL
);
CREATE TABLE Reports (
    report_id           INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    program_id          INT NOT NULL,
    release_id          INT NOT NULL,
    version_id          INT NOT NULL,
    bug_id              INT NOT NULL,
    report_type_id      INT NOT NULL,
    report_reproducible BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (report_type_id) REFERENCES report_types(report_type_id),-- connects to report_types:report_type_id
    FOREIGN KEY (program_id)     REFERENCES Programs(program_id),        -- connects to Programs:program_id
    FOREIGN KEY (bug_id)         REFERENCES Bugs(bug_id)                 -- connects to Bugs:bug_id
);

CREATE TABLE resolution_statuses(
    res_status_id       INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    res_status          VARCHAR(255) NOT NULL           -- open, closed, resolved
);
CREATE TABLE resolution_states(
    res_state_id        INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    res_state           VARCHAR(255) NOT NULL           -- pending, fixed, irreproducible, etc.
);
CREATE TABLE Resolutions (
    resolution_id       INT NOT NULL PRIMARY KEY,
    report_id           INT NOT NULL,
    area_id             INT NOT NULL,
    res_status_id       INT NOT NULL,
    res_priority        INT NOT NULL DEFAULT 0,         -- 0-6
    res_state_id        INT NOT NULL,
    res_version         INT NOT NULL,
    res_comments        VARCHAR(255),
    res_defer           BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_id         INT NOT NULL,
    resolver_id         INT NOT NULL,
    resolver_date       DATE NOT NULL,
    restester_id        INT NOT NULL,
    restester_date      DATE NOT NULL,
    FOREIGN KEY (report_id)     REFERENCES Reports(report_id),                  -- connected to Reports:report_id
    FOREIGN KEY (area_id)       REFERENCES Areas(area_id),                      -- connected to Areas:area_id
    FOREIGN KEY (res_status_id) REFERENCES resolution_statuses(res_status_id),  -- connected to resolution_statuses:res_status_id
    FOREIGN KEY (res_state_id)  REFERENCES resolution_states(res_state_id),     -- connected to resolution_states:res_state_id
    FOREIGN KEY (assigned_id)   REFERENCES Users(user_id),                      -- a user is assigned
    FOREIGN KEY (resolver_id)   REFERENCES Users(user_id),                      -- a user resolves
    FOREIGN KEY (restester_id)  REFERENCES Users(user_id)                       -- a user tests the resolution
);


create procedure dropTables()
BEGIN
    DROP TABLE Resolutions;
    DROP TABLE Reports;
    DROP TABLE program_areas;
    DROP TABLE Programs;
    DROP TABLE Bugs;
    DROP TABLE resolution_states, resolution_statuses, report_types, bug_severity;
    DROP TABLE Areas, Users;
END


-- TEST POPULATION OF TABLES -----------------------------------------

-- NOTE: bugs, reports, and resolutions are set off by submissions only
-- TODO: procedure to connect reports of 1 bug to another bug (correlation)
-- TODO: procedure to add to / remove from 'Users', 'Areas'

create procedure populateTables()
BEGIN
    -- 'Users' table
    INSERT INTO Users (user_name, user_pass, user_realname, user_access) VALUES ("user_Seungjun", "Seungjun_pass", "Seungjun", 1);
    INSERT INTO Users (user_name, user_pass, user_realname, user_access) VALUES ("user_Mike", "Mike_pass", "Mike", 3);
    INSERT INTO Users (user_name, user_pass, user_realname, user_access) VALUES ("user_Austin", "Austin_pass", "Austin", 2);
    -- 'Areas' table
    INSERT INTO Areas (area_title) VALUES ("Back-end");
    INSERT INTO Areas (area_title) VALUES ("Front-end");
    INSERT INTO Areas (area_title) VALUES ("Hardware");
    INSERT INTO Areas (area_title) VALUES ("Networking");
    INSERT INTO Areas (area_title) VALUES ("Software");

    -- The following tables are NOT getting changed
    -- 'bug_severity'
    INSERT INTO bug_severity (bug_severity) VALUES ("Mild");
    INSERT INTO bug_severity (bug_severity) VALUES ("Infectious");
    INSERT INTO bug_severity (bug_severity) VALUES ("Serious");
    INSERT INTO bug_severity (bug_severity) VALUES ("Fatal");
    -- 'report_types'
    INSERT INTO report_types (report_type) VALUES ("Coding Error");
    INSERT INTO report_types (report_type) VALUES ("Design Issue");
    INSERT INTO report_types (report_type) VALUES ("Suggestion");
    INSERT INTO report_types (report_type) VALUES ("Documentation");
    INSERT INTO report_types (report_type) VALUES ("Hardware");
    INSERT INTO report_types (report_type) VALUES ("Query");
    -- 'resolution_statuses'
    INSERT INTO resolution_statuses (res_status) VALUES ("Open");
    INSERT INTO resolution_statuses (res_status) VALUES ("Closed");
    INSERT INTO resolution_statuses (res_status) VALUES ("Resolved");
    -- 'resolution_states'
    INSERT INTO resolution_states (res_state) VALUES ("Pending");
    INSERT INTO resolution_states (res_state) VALUES ("Fixed");
    INSERT INTO resolution_states (res_state) VALUES ("Cannot be reproduced");
    INSERT INTO resolution_states (res_state) VALUES ("Deferred");
    INSERT INTO resolution_states (res_state) VALUES ("As designed");
    INSERT INTO resolution_states (res_state) VALUES ("Withdrawn by reporter");
    INSERT INTO resolution_states (res_state) VALUES ("Needs more information");
    INSERT INTO resolution_states (res_state) VALUES ("Disagree with suggestion");
    INSERT INTO resolution_states (res_state) VALUES ("Duplicate");
END
------------------------------------------------------------------------

-- procedure calls      (call <procedure-name>)
-- deleting procedures  (drop procedure <procedure-name>)
drop procedure dropTables;
drop procedure populateTables;

-- create procedure submitNewReport (IN program_name, report_type, report_severity, report_reproducible, report_summary, report_problem, report_suggested_fix, reporter_name, report_date, report_attachments)

-- create procedure submitNewResolution(IN functional_area, assignment_name, resolution_comments, resolution_status, resolution_priority, resolution_state, resolution_version, resolver_name, resolver_date, tester_name, tester_date, resolution_deferred)

create procedure searchForBugs(IN input_bug_id INT)
BEGIN
    select * from reports where bug_id = input_bug_id;
END
-- call searchForBugs(<some bug_id>)

create procedure getUserAssignment(IN assigned_name VARCHAR(255))
BEGIN
    SELECT @user_id := user_id from users where user_name = assigned_name;
    select * from resolutions where assigned_id = @user_id;
END
-- call getUserAssignment(<some user name>);