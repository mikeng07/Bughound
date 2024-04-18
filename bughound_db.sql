-- insert database entities here
-- TODO: check if this is right
-- TODO: change varchar lengths based on what the variable is

create procedure createTables()
BEGIN
    CREATE TABLE users (
        user_id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_name       VARCHAR(255) NOT NULL,
        user_pass       VARCHAR(255) NOT NULL,
        user_realname   VARCHAR(255) NOT NULL,
        user_access     INT NOT NULL DEFAULT 1   -- note: access_lvl (1:emp, 2:manager, 3:admin)
    );
    CREATE TABLE bugs (
        bug_id              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        bug_title           VARCHAR(255) NOT NULL,
        bug_severity        VARCHAR(255) NOT NULL,
        bug_description     VARCHAR(255) NOT NULL,
        bug_fix_suggestion  VARCHAR(255),
        user_reporter_id    INT NOT NULL,
        FOREIGN KEY (user_reporter_id) REFERENCES users(user_id),
        bug_find_date       DATE NOT NULL
    );
    CREATE TABLE programs (
        program_id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        program_name        VARCHAR(255) NOT NULL
    );
    CREATE TABLE program_releases (
        release_id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        release_name        VARCHAR(255) NOT NULL,

        program_id          INT NOT NULL,
        FOREIGN KEY (program_id) REFERENCES programs(program_id)
        
    );
    CREATE TABLE release_versions (
        version_id          INT NOT NULL PRIMARY KEY,
        version_name        VARCHAR(255) NOT NULL,

        release_id          INT NOT NULL,
        FOREIGN KEY (release_id) REFERENCES program_releases (release_id)

        
    );

    CREATE TABLE areas (
        area_id             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        area_title          VARCHAR(255) NOT NULL
    );
    CREATE TABLE reports (
        report_id           INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        program_id          INT NOT NULL,
        FOREIGN KEY (program_id) REFERENCES programs(program_id),        -- connects to programs:program_id
        bug_id              INT NOT NULL,
        FOREIGN KEY (bug_id)     REFERENCES bugs(bug_id),            -- connects to bugs:bug_id
        report_type         VARCHAR(255) NOT NULL,
        report_reproducible BOOLEAN NOT NULL DEFAULT FALSE
    );
    CREATE TABLE resolutions (
        resolution_id       INT NOT NULL PRIMARY KEY,
        report_id           INT NOT NULL,
        FOREIGN KEY (report_id) REFERENCES reports(report_id),  -- connected to reports:report_id
        area_id             INT NOT NULL,
        FOREIGN KEY (area_id)   REFERENCES areas(area_id),      -- connected to areas:area_id
        resolution_status   VARCHAR(255) NOT NULL,              -- open, closed, resolved
        resolution_priority INT NOT NULL,                       -- 1-5
        resolution_state    VARCHAR(255) NOT NULL,              -- pending, fixed, irreproducible, etc.
        resolution_version  INT NOT NULL,
        resolution_comments VARCHAR(255),
        resolution_defer    BOOLEAN NOT NULL DEFAULT FALSE,  
        
        assigned_id         INT NOT NULL,
        FOREIGN KEY (assigned_id) REFERENCES users(user_id),   -- a user is assigned
        resolver_id         INT NOT NULL,
        FOREIGN KEY (resolver_id) REFERENCES users(user_id),   -- a user resolves
        resolver_date       DATE NOT NULL,
        restester_id        INT NOT NULL,
        FOREIGN KEY (restester_id) REFERENCES users(user_id), -- a user tests the resolution
        restester_date      DATE NOT NULL
    );
END

create procedure dropTables()
BEGIN
    DROP TABLE resolutions;
    DROP TABLE reports;
    DROP TABLE bugs;
    DROP TABLE programs;
    DROP TABLE areas;
    DROP TABLE users;
END


-- TEST POPULATION OF TABLES -----------------------------------------

-- NOTE: bugs, reports, and resolutions are set off by submissions only
-- TODO: procedure to connect reports of 1 bug to another bug (correlation)
-- TODO: procedure to add to / remove from 'users', 'programs', 'areas'

create procedure populateTables()
BEGIN
    -- 'users' table
    INSERT INTO users (user_name, user_pass, user_access) VALUES ("user_Seungjun", "Seungjun_pass", 1);
    INSERT INTO users (user_name, user_pass, user_access) VALUES ("user_Austin", "Austin_pass", 2);
    INSERT INTO users (user_name, user_pass, user_access) VALUES ("user_Mike", "Mike_pass", 3);
    -- 'programs' table
    INSERT INTO programs (program_name) VALUES ("COBOL Coder v1");
    INSERT INTO programs (program_name) VALUES ("COBOL Coder v2");
    INSERT INTO programs (program_name) VALUES ("COBOL Coder v3");
    INSERT INTO programs (program_name) VALUES ("COBOL Coder v4");
    INSERT INTO programs (program_name) VALUES ("Python 3 v3.8");
    INSERT INTO programs (program_name) VALUES ("Python 3 v3.9");
    INSERT INTO programs (program_name) VALUES ("Python 3 v3.10");
    INSERT INTO programs (program_name) VALUES ("Python 3 v3.11");
    INSERT INTO programs (program_name) VALUES ("Python 3 v3.12");
    -- 'areas' table
    INSERT INTO areas (area_title) VALUES ("Back-end");
    INSERT INTO areas (area_title) VALUES ("Front-end");
    INSERT INTO areas (area_title) VALUES ("Hardware");
    INSERT INTO areas (area_title) VALUES ("Networking");
    INSERT INTO areas (area_title) VALUES ("Software");
END
------------------------------------------------------------------------

-- procedure calls      (call <procedure-name>)
-- deleting procedures  (drop procedure <procedure-name>)
drop procedure dropTables;
drop procedure createTables;
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