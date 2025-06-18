-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 15, 2025 at 05:50 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `coordinators`
--

DROP TABLE IF EXISTS `coordinators`;
CREATE TABLE IF NOT EXISTS `coordinators` (
  `user_id` varchar(10) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `department` varchar(255) NOT NULL,
  `assigned_batch` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `coordinators`
--

INSERT INTO `coordinators` (`user_id`, `profile_picture`, `first_name`, `last_name`, `gender`, `department`, `assigned_batch`) VALUES
('C001', '/uploads/coordinators/C001.jpg', 'Alice', 'Smith', 'Female', 'Science', 'Batch X'),
('C002', '/uploads/coordinators/C002.jpg', 'Bob', 'Johnson', 'Male', 'Computer Science', 'Batch CS-1'),
('C003', '/uploads/coordinators/C003.jpg', 'Carol', 'Lee', 'Female', 'Cyber Security', 'Batch CY-1'),
('C004', '/uploads/coordinators/C004.jpg', 'Dave', 'Brown', 'Male', 'Information Systems', 'Batch IS-1'),
('C005', '/uploads/coordinators/C005.jpg', 'Emma', 'Williams', 'Female', 'Data Science', 'Batch DS-1');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `course_id` varchar(10) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `description` text,
  `coordinator_id` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  KEY `coordinator_id` (`coordinator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_name`, `description`, `coordinator_id`, `created_at`) VALUES
('CS101', 'Computer Science', 'Core concepts in algorithms, data structures, and computing.', 'C001', '2025-06-10 13:04:18'),
('CY101', 'Cyber Security', 'Introduction to cybersecurity principles and practices.', 'C002', '2025-06-10 13:04:18'),
('DS101', 'Data Science', 'Basics of data analysis, machine learning, and big data.', 'C003', '2025-06-10 13:04:18'),
('IS101', 'Information Systems', 'Study of information systems in organizations.', 'C004', '2025-06-10 13:04:18'),
('SE101', 'Software Engineering', 'Fundamentals of software design, development, and maintenance.', 'C005', '2025-06-10 13:04:18');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `enrollment_id` varchar(10) NOT NULL,
  `student_id` varchar(10) NOT NULL,
  `course_id` varchar(10) NOT NULL,
  `enrollment_date` date NOT NULL,
  `status` enum('active','completed','dropped') DEFAULT 'active',
  PRIMARY KEY (`enrollment_id`),
  UNIQUE KEY `student_id` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollment_id`, `student_id`, `course_id`, `enrollment_date`, `status`) VALUES
('E001', 'S001', 'SE101', '2025-06-10', 'completed'),
('E002', 'S002', 'CS101', '2025-06-10', 'active'),
('E003', 'S003', 'DS101', '2025-06-10', 'active'),
('E004', 'S004', 'CY101', '2025-06-10', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `user_id` varchar(10) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `date_of_birth` date NOT NULL,
  `course` varchar(255) NOT NULL,
  `batch` varchar(255) NOT NULL,
  `NIC` varchar(20) NOT NULL,
  `mobile_number` varchar(15) NOT NULL,
  `parents_number` varchar(15) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`user_id`, `profile_picture`, `first_name`, `last_name`, `full_name`, `gender`, `date_of_birth`, `course`, `batch`, `NIC`, `mobile_number`, `parents_number`) VALUES
('S001', '/uploads/students/S001.jpg', 'John', 'Doe', 'John Doe', 'Male', '2006-02-28', 'Mathematics', 'Batch A', '991234567V', '0711234567', '0777654321'),
('S002', '/uploads/students/S002.jpg', 'Jane', 'Miller', 'Jane Miller', 'Female', '2007-01-15', 'Science', 'Batch B', '982345678V', '0722345678', '0788765432'),
('S003', '/uploads/students/S003.jpg', 'Mike', 'Green', '', 'Male', '2005-03-12', 'Software Engineering', 'Batch SE-1', '991234568V', '0711234568', '0777654322'),
('S004', '/uploads/students/S004.jpg', 'Sara', 'White', '', 'Female', '2006-07-25', 'Computer Science', 'Batch CS-1', '991234569V', '0711234569', '0777654323'),
('S005', '/uploads/students/S005.jpg', 'Li', 'Zhang', '', 'Male', '2005-11-02', 'Data Science', 'Batch DS-1', '991234570V', '0711234570', '0777654324');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(10) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','Coordinator','Student') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
('A001', 'admin', 'admin@lms.com', '$2b$10$XpFh.82x3FOj9rJUond5/OGWPqrkiFOdb4yZxvQ17h8kPvc2tZE7C', 'Admin', '2025-06-09 15:08:38'),
('C001', 'alice', 'alice@lms.com', '$2b$10$z7FTOF.8m/fNNzFybVibQOXyrm5sFYMPEljYe0TVL/yoXZkOdMneu', 'Coordinator', '2025-06-09 15:09:32'),
('C002', 'bob', 'bob@lms.com', '$2b$10$it610vYtzBDkanM4JpLkyuPh5elx7kWyNftUdoWldW66/pGh.u9C.', 'Coordinator', '2025-06-10 13:02:48'),
('C003', 'carol', 'carol@lms.com', '$2b$10$DisbJ18zbfNnck.24jPbVeu2St56Fjxvh8Dmnd9sV6FTlnBLmy8gK', 'Coordinator', '2025-06-10 13:02:48'),
('C004', 'dave', 'dave@lms.com', '$2b$10$Pa2q9wiqu4EkQcNwoxOLsessUeb5GGeXMFUwcnCzax1J6XWP6DaHu', 'Coordinator', '2025-06-10 13:02:48'),
('C005', 'emma', 'emma@lms.com', '$2b$10$/FyWDhJUFnKinbXD2yCF3.7wFCrHT03JMHa7NhAH6tpSr5wW5zCuy', 'Coordinator', '2025-06-10 13:02:48'),
('S001', 'john2025', 'john@lms.com', '$2b$10$8Fc8qIAD.vBDeTC9WVTMMe7XeS5TjQeu4BBXiiLEcwBBpUjFuuOc6', 'Student', '2025-06-09 15:10:21'),
('S002', 'jane2025', 'jane@lms.com', '$2b$10$5xnd3ltU4qXuuyEWIjlU3uB3p3WCPRB0xbGHjtst8/zZMOM1gnz22', 'Student', '2025-06-09 15:12:43'),
('S003', 'mike2025', 'mike@lms.com', '$2b$10$ff4y1JBteZPYOcqv6UBiEu0QEz0ZEfEH6n2JqokM.C/U2bWiFXFIS', 'Student', '2025-06-10 13:09:45'),
('S004', 'sara2025', 'sara@lms.com', '$2b$10$CSeZyw81Qek03qiJAU7hEuqYUUMX8/wmfGxXFvNCJJnELMZaS22ba', 'Student', '2025-06-10 13:09:45'),
('S005', 'li2025', 'li@lms.com', '$2b$10$TDMTgiWbaGPvx/0PHjrc4u2K0Ek/1sBOs77h0ECSSBtDzeDv8dPGy', 'Student', '2025-06-10 13:09:45');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coordinators`
--
ALTER TABLE `coordinators`
  ADD CONSTRAINT `coordinators_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`coordinator_id`) REFERENCES `coordinators` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
