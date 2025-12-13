-- Seed Bangkok Donation Locations for H2 Database
-- Standard Locations
INSERT INTO donation_locations (name, type, address, latitude, longitude, contact_info, opening_hours, start_date, end_date) VALUES
('National Blood Centre', 'HQ', 'Pathum Wan, Bangkok', 13.7375, 100.5311, '02-256-4300', '07:30 - 19:30', NULL, NULL),
('Emporium Donation Room', 'STATION', 'The Emporium, Sukhumvit', 13.7297, 100.5693, '02-269-1000', '10:00 - 19:00', NULL, NULL),
('The Mall Bangkapi', 'MALL', 'Bangkapi, Bangkok', 13.7661, 100.6429, '02-173-1000', '12:00 - 18:00', NULL, NULL),
('Red Cross Station 11', 'STATION', 'Bang Khen, Bangkok', 13.8853, 100.5905, '02-552-1000', '08:30 - 16:30', NULL, NULL),
('Central World Mobile Unit', 'MOBILE', 'Central World, Bangkok', 13.7469, 100.5398, '02-640-7000', '11:00 - 15:00', NULL, NULL),
('Siriraj Hospital', 'HOSPITAL', 'Bangkok Noi, Bangkok', 13.7593, 100.4851, '02-419-7000', '08:00 - 16:00', NULL, NULL),
('Ramathibodi Hospital', 'HOSPITAL', 'Ratchathewi, Bangkok', 13.7668, 100.5262, '02-201-1000', '08:30 - 16:30', NULL, NULL),
-- Temporary Events
('Red Cross Fair 2025', 'EVENT', 'Lumphini Park, Bangkok', 13.7314, 100.5414, 'Red Cross Society', '11:00 - 22:00', '2025-12-11', '2025-12-21');
