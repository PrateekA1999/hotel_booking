CREATE TABLE users (
    id INT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique identifier for each user',
    first_name VARCHAR(255) NOT NULL COMMENT 'First name of the user',
    last_name VARCHAR(255) NOT NULL COMMENT 'Last name of the user',
    email VARCHAR(255) NOT NULL COMMENT 'Email address of the user',
    phone_number VARCHAR(15) NOT NULL COMMENT 'Phone number of the user',
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password of the user',
    active TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Indicates whether the user account is active (1 for active, 0 for inactive)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the user was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the user was last updated'
) COMMENT='Table to store user information including personal details, account status, and timestamps';