-- Initialise les bases pour auth-service, billing-service et course-service
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS billing_db;
CREATE DATABASE IF NOT EXISTS course_db;

-- Utilisateur pour le billing-service
CREATE USER IF NOT EXISTS 'billing_user'@'%' IDENTIFIED BY 'billing_pass';
GRANT ALL PRIVILEGES ON billing_db.* TO 'billing_user'@'%';

-- Utilisateur pour le course-service
CREATE USER IF NOT EXISTS 'course_user'@'%' IDENTIFIED BY 'course_pass';
GRANT ALL PRIVILEGES ON course_db.* TO 'course_user'@'%';

FLUSH PRIVILEGES;

