CREATE TABLE bookings (
    id INT(5) AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key with auto-increment, starting from 1. Maximum length is 5 digits.',
    fk_user_id INT NOT NULL COMMENT 'Foreign key referencing the id column in the users table.',
    check_in DATE NOT NULL COMMENT 'Date field to store the check-in date.',
    check_out DATE NOT NULL COMMENT 'Date field to store the check-out date.',
    is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Indicates if the booking is currently active (TRUE or FALSE).',
    CONSTRAINT fk_user FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Table to store booking details, including foreign key to users table.';
