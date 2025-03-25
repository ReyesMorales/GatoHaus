-- Insertar tipos de habitación
INSERT INTO room_types (name, description) VALUES
('Deluxe', 'Habitación amplia con terraza y vistas'),
('Suite', 'Habitación con sala privada y snacks'),
('Cat', 'Habitación estándar con juguetes y cama cómoda');

-- Insertar habitaciones físicas
INSERT INTO rooms (room_number, type_id) VALUES
('101', 1),
('102', 1),
('201', 2),
('202', 2),
('301', 3);
