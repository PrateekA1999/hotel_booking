CREATE TABLE booked_rooms_mapping (
    fk_booking_id INT NOT NULL COMMENT 'Foreign key referencing the id column in the booking table.',
    fk_rooms_id INT NOT NULL COMMENT 'Foreign key referencing the id column in the rooms table.',    
    -- Define foreign key constraints
    CONSTRAINT fk_booking FOREIGN KEY (fk_booking_id) REFERENCES bookings(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    
    CONSTRAINT fk_room FOREIGN KEY (fk_rooms_id) REFERENCES rooms(id) 
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Mapping table to link bookings with rooms and track if rooms are occupied.';
