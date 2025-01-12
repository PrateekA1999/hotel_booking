CREATE TABLE rooms (
    id INT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- 'id': Primary key for the room, auto-incremented starting from 1
    type ENUM('Normal', 'Deluxe', 'Villa', 'Cottage') NOT NULL COMMENT 'Room type (Normal, Deluxe, Villa, Cottage), required field',  -- 'type': Enum for room type, required field
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp for room creation, set to current time automatically',  -- 'created_at': Timestamp for room creation, not required
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp for room last update, automatically updated when record is modified'  -- 'updated_at': Timestamp for room last update, not required
) COMMENT = 'Rooms table stores room details including type, capacity, price, and timestamps for creation and updates';