
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";




DROP TABLE IF EXISTS `batches`;
CREATE TABLE IF NOT EXISTS `batches` (
  `batch_id` varchar(30) NOT NULL,
  `batch_name` varchar(50) NOT NULL,
  `course_id` varchar(20) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`batch_id`),
  KEY `course_id` (`course_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`batch_id`, `batch_name`, `course_id`, `start_date`, `end_date`) VALUES
('SE101-BAT-A-2025', 'SE Batch A', 'SE101', '2025-06-01', '2025-09-01'),
('CY101-BAT-A-2025', 'Cyber Batch A', 'CY101', '2025-06-01', '2025-09-01'),
('DS101-BAT-A-2025', 'DS Batch A', 'DS101', '2025-06-01', '2025-09-01');

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
('C001', '/uploads/coordinators/C001.jpg', 'Alice', 'Smith', 'Female', 'Science', 'DS Batch A'),
('C002', '/uploads/coordinators/C002.jpg', 'Bob', 'Johnson', 'Male', 'Computer Science', 'SE Batch A'),
('C003', '/uploads/coordinators/C003.jpg', 'Carol', 'Lee', 'Female', 'Cyber Security', 'DS Batch A'),
('C004', '/uploads/coordinators/C004.jpg', 'Dave', 'Brown', 'Male', 'Information Systems', 'DS Batch A'),
('C005', '/uploads/coordinators/C005.jpg', 'Emma', 'Williams', 'Female', 'Data Science', 'DS Batch A');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `course_id` varchar(20) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `description` text,
  `coordinator_id` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  KEY `coordinator_id` (`coordinator_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_name`, `description`, `coordinator_id`, `created_at`) VALUES
('SE101', 'Software Engineering', 'Fundamentals of software design, development, and maintenance.', 'C005', '2025-07-08 09:09:59'),
('CY101', 'Cyber Security', 'Introduction to cybersecurity principles and practices.', 'C002', '2025-07-08 09:09:59'),
('DS101', 'Data Science', 'Basics of data analysis, machine learning, and big data.', 'C003', '2025-07-08 09:09:59');

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
('CY101-BAT-', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAKjAfADASIAAhEB', 'Milani', 'Kaveesha', 'Milani Kaveesha', 'Female', '2025-07-02', 'Cyber Security', 'CY101-BAT-A-2025', '2003544387425', '0711208203', '07164963356'),
('DS101-BAT-', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAKwAhQDASIAAhEB', 'Senithuuu', 'Thisafs', 'Senithuuu Thisafs', 'Male', '2025-07-01', 'Data Science', 'DS101-BAT-A-2025', '2002544387425', '0719208203', '07164963356'),
('SE101-BAT-', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExIVFRUVFxUVFRgVGBYXFRUVFRYXFxUXFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lHSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLS0vLS0wMistLv/AABEIALcBEwMBIgACEQEDEQH/', 'Senithu', 'Thisas', 'Senithu Thisas', 'Male', '2025-07-09', 'Software Engineering', 'SE101-BAT-A-2025', '2002554387425', '0716208203', '07164563356');

-- --------------------------------------------------------

--
-- Table structure for table `student_batches`
--

DROP TABLE IF EXISTS `student_batches`;
CREATE TABLE IF NOT EXISTS `student_batches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `batch_id` varchar(30) NOT NULL,
  `student_id` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `batch_id` (`batch_id`),
  KEY `student_id` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
('C001', 'alice', 'alice@lms.com', '$2b$10$HeC7/o.rGHc2SF5Rlms2SuHjdGhGFSvq3pCz3r0WxjIXJryhS1nie', 'Coordinator', '2025-06-09 15:09:32'),
('C002', 'bob', 'bob@lms.com', '$2b$10$it610vYtzBDkanM4JpLkyuPh5elx7kWyNftUdoWldW66/pGh.u9C.', 'Coordinator', '2025-06-10 13:02:48'),
('C003', 'carol', 'carol@lms.com', '$2b$10$DisbJ18zbfNnck.24jPbVeu2St56Fjxvh8Dmnd9sV6FTlnBLmy8gK', 'Coordinator', '2025-06-10 13:02:48'),
('C004', 'dave', 'dave@lms.com', '$2b$10$Pa2q9wiqu4EkQcNwoxOLsessUeb5GGeXMFUwcnCzax1J6XWP6DaHu', 'Coordinator', '2025-06-10 13:02:48'),
('C005', 'emma', 'emma@lms.com', '$2b$10$/FyWDhJUFnKinbXD2yCF3.7wFCrHT03JMHa7NhAH6tpSr5wW5zCuy', 'Coordinator', '2025-06-10 13:02:48'),
('CY101-BAT-', 'Milly', 'milani@lms.com', '$2b$10$9Pc7Cy9L9Ss7IM7ojy5lbuIEW1Ok//OvrWFX.1czaF/C/iqCmhP1m', 'Student', '2025-07-09 20:22:04'),
('DS101-BAT-', 'Senithuuuu', 'thisas@lms.com', '$2b$10$gfyoQnXGjD24yELNfRzxP.XDkPK5NssnOg8xtXbOMNQ/WgJtFdIOG', 'Student', '2025-07-09 20:16:06'),
('S005', 'li2025', 'li@lms.com', '$2b$10$TDMTgiWbaGPvx/0PHjrc4u2K0Ek/1sBOs77h0ECSSBtDzeDv8dPGy', 'Student', '2025-06-10 13:09:45'),
('SE101-BAT-', 'Senu', 'senithuthisas22@gmail.com', '$2b$10$/80sAZMfhts5t5v5ADNHdu6fQP4rUfX3z4XOjlciUm1MjVsss5ZQW', 'Student', '2025-07-09 20:12:32');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coordinators`
--
ALTER TABLE `coordinators`
  ADD CONSTRAINT `coordinators_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

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
