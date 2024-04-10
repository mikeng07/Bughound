CREATE bughound_db;
USE bughound_db;

-- insert database entities here (TODO: projects, etc)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY
    username VARCHAR(255) NOT NULL;
    password VARCHAR(255) NOT NULL;
    -- additional fields
);

CREATE TABLE bugs (
    bug_id INT AUTO_INCREMENT PRIMARY KEY
    -- additional fields
);


-- insert sql functions/procedures here (TODO: rewrite to make more modular and more function-like)

-- insert a new bug report
-- INSERT INTO bugs (title, description, reported_by, severity) VALUES ('Bug Title', 'Bug Description', 1, 'High');

-- fetch all bugs (TODO: a select for specific entries)
-- SELECT * FROM bugs;

-- update a bug report
-- UPDATE bugs SET status = 'Resolved' WHERE bug_id = 1;

-- delete a bug report
-- DELETE FROM bugs WHERE bug_id = 1;
CREATE FUNCTION deleteBugReport (@bug_id INT)
RETURNS INT
AS
BEGIN
    IF EXISTS(SELECT 1 FROM bugs WHERE bug_id = @bug_id)
    BEGIN
        DELETE FROM bugs WHERE bug_id = @bug_id;
        RETURN 1;
    END
    ELSE
    BEGIN
        RETURN 0;
    END
END



-- insert sql procedures (which use the functions; MAYBE to use in PHP-land?)