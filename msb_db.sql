-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 17, 2025 at 08:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `msb_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `appointment_id` int(11) NOT NULL,
  `visitor_id` int(11) NOT NULL,
  `purpose_of_visit` varchar(200) NOT NULL,
  `population_count` int(11) NOT NULL,
  `preferred_date` date NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `additional_notes` text DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`appointment_id`, `visitor_id`, `purpose_of_visit`, `population_count`, `preferred_date`, `creation_date`, `additional_notes`, `start_time`, `end_time`) VALUES
(26, 12, 'Thesis or Dissertation Work', 123, '2025-04-17', '2025-04-16 22:38:45', '123', NULL, NULL),
(27, 19, 'School Field Trip', 123, '2025-04-25', '2025-04-16 22:40:39', '123', '09:00:00', '10:29:00'),
(28, 12, 'Research', 123, '2025-04-24', '2025-04-16 22:54:12', '123', NULL, NULL),
(29, 20, 'School Field Trip', 123, '2025-04-24', '0000-00-00 00:00:00', '123', '09:00:00', '10:29:00'),
(30, 21, 'Research', 123, '2025-05-02', '0000-00-00 00:00:00', '123', NULL, NULL),
(31, 22, 'Research', 123, '2025-03-31', '2025-04-17 07:18:08', '123', NULL, NULL),
(32, 12, 'Thesis or Dissertation Work', 123, '2025-05-02', '2025-04-17 15:35:02', '123', NULL, NULL),
(100, 100, 'Company Tour', 5, '2025-05-01', '2025-04-10 06:30:00', 'We want to explore the museum exhibits', NULL, NULL),
(101, 101, 'School Field Trip', 30, '2025-05-10', '2025-04-11 01:15:00', 'Our students are studying Philippine history', NULL, NULL),
(102, 102, 'Research Project', 2, '2025-05-15', '2025-04-12 03:45:00', 'Need to examine artifacts for thesis', NULL, NULL),
(103, 103, 'Corporate Team Building', 15, '2025-05-20', '2025-04-13 08:20:00', 'Looking for cultural immersion activity', NULL, NULL),
(104, 104, 'Personal Visit', 3, '2025-06-01', '2025-04-14 02:10:00', 'Interested in the indigenous art collection', NULL, NULL),
(105, 105, 'Photography Session', 2, '2025-06-05', '2025-04-15 05:25:00', 'Want to document the architecture', NULL, NULL),
(106, 106, 'Research Visit', 4, '2025-05-05', '2025-04-16 00:45:00', 'Studying pre-colonial artifacts', NULL, NULL),
(107, 106, 'Student Orientation', 25, '2025-05-20', '2025-04-16 01:00:00', 'Introducing students to Filipino culture', NULL, NULL),
(108, 106, 'Documentary Filming', 8, '2025-06-10', '2025-04-16 01:15:00', 'Creating educational content', NULL, NULL),
(109, 106, 'Expert Consultation', 3, '2025-06-25', '2025-04-16 01:30:00', 'Need expertise on artifact restoration', NULL, NULL),
(110, 106, 'Workshop', 15, '2025-07-05', '2025-04-16 01:45:00', 'Traditional crafts demonstration', NULL, NULL),
(2001, 1001, 'Perlas ng silanganan', 10, '2024-03-15', '2024-02-19 01:30:00', 'Special exhibit viewing', NULL, NULL),
(2002, 1001, 'kutsara', 50, '2024-03-16', '2024-02-19 02:15:00', 'Historical utensils research', NULL, NULL),
(2003, 1001, '160 years old filipiniana', 15, '2024-03-17', '2024-02-19 03:45:00', 'Archival access needed', NULL, NULL),
(2019, 1033, 'Research', 123, '2025-04-24', '2025-04-18 09:44:56', '123', NULL, NULL),
(2020, 3, 'Thesis or Dissertation Work', 123, '2025-04-10', '2025-04-19 15:22:33', '123', NULL, NULL),
(2021, 3, 'Thesis or Dissertation Work', 3, '2025-04-01', '2025-04-19 15:26:31', '', NULL, NULL),
(2022, 3, 'Thesis or Dissertation Work', 342, '2025-04-15', '2025-04-19 15:28:34', '', NULL, NULL),
(2023, 3, 'Thesis or Dissertation Work', 324, '2025-04-15', '2025-04-19 15:30:36', '', NULL, NULL),
(2024, 3, 'School Field Trip', 423, '2025-04-16', '2025-04-19 15:34:01', '', '09:00:00', '10:29:00'),
(2025, 3, 'Workshops or Classes', 34, '2025-04-14', '2025-04-19 15:36:33', '32423', '01:00:00', '02:29:00'),
(2026, 3, 'Thesis or Dissertation Work', 324, '2025-04-14', '2025-04-19 15:38:21', '4324', NULL, NULL),
(2027, 3, 'Thesis or Dissertation Work', 324, '2025-04-22', '2025-04-19 15:42:37', '234', NULL, NULL),
(2028, 3, 'Research', 3422, '2025-04-08', '2025-04-19 15:45:32', '4234', NULL, NULL),
(2029, 3, 'Thesis or Dissertation Work', 342, '2025-04-14', '2025-04-19 15:48:49', '234234', NULL, NULL),
(2030, 3, 'Workshops or Classes', 342, '2025-04-22', '2025-04-19 15:50:47', '234', '10:30:00', '11:59:00'),
(2031, 3, 'Thesis or Dissertation Work', 32, '2025-04-14', '2025-04-19 16:01:10', '234', NULL, NULL),
(2032, 3, 'Thesis or Dissertation Work', 32, '2025-04-08', '2025-04-19 16:03:21', '23423', NULL, NULL),
(2033, 1034, 'Donations', 2, '2025-04-15', '2025-04-19 18:18:15', '', NULL, NULL),
(2034, 1035, 'Donations', 234, '2025-04-16', '2025-04-19 18:20:50', '', NULL, NULL),
(2035, 1036, 'Photography or Media Projects', 1, '2025-04-22', '2025-04-19 20:26:23', 'i love history XD', NULL, NULL),
(2036, 1037, 'Donations', 1, '2025-04-23', '2025-04-22 06:31:59', '', NULL, NULL),
(2037, 1038, 'Donations', 12, '2025-04-24', '2025-04-23 04:51:03', 'Test', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `appointment_status`
--

CREATE TABLE `appointment_status` (
  `status_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `status` enum('Confirmed','Rejected','To_Review','Failed','Completed') NOT NULL DEFAULT 'To_Review',
  `present_count` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment_status`
--

INSERT INTO `appointment_status` (`status_id`, `appointment_id`, `status`, `present_count`, `updated_at`) VALUES
(1, 26, 'Failed', 56, '2025-04-23 04:29:35'),
(2, 27, 'Rejected', 123, '2025-04-19 13:50:22'),
(3, 28, 'Failed', 123, '2025-04-21 10:54:09'),
(4, 29, 'Rejected', 10, '2025-05-06 09:46:22'),
(5, 30, 'Completed', 123, '2025-04-23 14:26:42'),
(6, 31, 'Confirmed', 123, '2025-04-19 14:42:19'),
(7, 32, 'Failed', 12, '2025-04-19 08:00:00'),
(100, 100, 'Failed', 21, '2025-04-19 20:31:35'),
(101, 101, 'Completed', 30, '2025-05-04 07:14:46'),
(102, 102, 'To_Review', 45, '2025-04-19 14:03:16'),
(103, 103, 'Rejected', 15, '2025-05-14 14:24:05'),
(104, 104, '', 1, '2025-04-19 14:38:17'),
(105, 105, 'Rejected', 12, '2025-04-19 19:33:03'),
(106, 106, 'Completed', 4, '2025-05-04 07:17:53'),
(107, 107, 'To_Review', 32, '2025-04-18 17:23:49'),
(108, 108, 'Confirmed', NULL, '2025-04-18 08:05:00'),
(109, 109, 'Rejected', 3, '2025-04-18 17:59:04'),
(110, 110, 'Failed', NULL, '2025-04-17 16:45:00'),
(111, 2001, 'To_Review', 10, '2025-04-19 14:03:26'),
(112, 2002, 'Failed', NULL, '2025-04-19 08:00:09'),
(113, 2036, 'Rejected', NULL, '2025-04-22 06:32:18'),
(114, 2037, 'Completed', 12, '2025-04-23 13:55:13'),
(115, 2034, '', 23, '2025-04-23 13:49:44'),
(116, 2033, '', NULL, '2025-04-26 10:38:43'),
(117, 2035, '', NULL, '2025-04-27 16:28:45'),
(118, 2028, '', NULL, '2025-04-28 06:55:57'),
(119, 2029, '', NULL, '2025-04-29 04:02:05'),
(120, 2020, '', NULL, '2025-04-29 04:02:45'),
(121, 2021, 'Rejected', NULL, '2025-04-29 04:03:11'),
(122, 2023, '', NULL, '2025-04-30 11:35:33'),
(123, 2026, 'Rejected', NULL, '2025-05-14 14:27:49');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `article_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `upload_date` datetime DEFAULT NULL,
  `images` text DEFAULT NULL,
  `article_category` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `editImages` text DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` enum('pending','posted') NOT NULL DEFAULT 'pending',
  `upload_period_start` datetime DEFAULT NULL,
  `upload_period_end` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`article_id`, `title`, `user_id`, `upload_date`, `images`, `article_category`, `description`, `editImages`, `author`, `address`, `status`, `upload_period_start`, `upload_period_end`, `created_at`, `updated_at`) VALUES
(1, 'Museom First Article', 1, '2025-04-23 00:00:00', NULL, 'Other', '<p>Test</p>', NULL, 'Jefferson', 'F. Pimentel St.', 'pending', NULL, NULL, '2025-04-26 10:52:20', '2025-04-26 10:52:20'),
(2, 'jyfcughb', 1, '2025-05-30 00:00:00', '1746514064797-Screenshot 2025-02-17 211931.png', 'Exhibit', '<p>uj uj h ilbouj</p>', NULL, '.kh b ', 'jgvukg', 'pending', NULL, NULL, '2025-05-06 06:47:44', '2025-05-06 06:47:44'),
(3, 'Test', 1, '2025-05-21 00:00:00', '1746518685594-Screenshot 2025-02-20 150548.png', 'Exhibit', '<p>adsasdasd</p>', NULL, 'again', 'dsada', 'pending', NULL, NULL, '2025-05-06 08:04:45', '2025-05-06 08:04:45'),
(4, 'Test Article', 1, '2025-05-13 00:00:00', '1747210320074-Screenshot 2025-02-19 231126.png', 'Contents', '<div data-type=\"two-column-block\" class=\"two-column-grid\"><div data-type=\"column-left\" class=\"column-left\"><h1></h1><img src=\"http://localhost:5000/uploads/1747210257224-Screenshot 2025-02-17 211931.png\" alt=\"Screenshot 2025-02-17 211931.png\"></div><div data-type=\"column-right\" class=\"column-right\"><p style=\"text-align: justify\">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p></div></div><div data-type=\"two-column-block\" class=\"two-column-grid\"><div data-type=\"column-left\" class=\"column-left\"><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p></div><div data-type=\"column-right\" class=\"column-right\"><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p></div></div><p></p>', NULL, 'Jeff', 'F. Pimentel', 'pending', NULL, NULL, '2025-05-14 08:12:00', '2025-05-14 08:59:03');

-- --------------------------------------------------------

--
-- Table structure for table `artifacts`
--

CREATE TABLE `artifacts` (
  `id` int(11) NOT NULL,
  `artifact_type` enum('tools','weapons','personal adornment','ceremonial objects','art','historic document','military artifacts','scientific specimens','everyday objects') NOT NULL,
  `artifact_creator` varchar(100) NOT NULL,
  `creation_date` timestamp NULL DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT NULL,
  `accession_type` enum('lend','donated','purchased') NOT NULL,
  `artifact_condition` enum('excellent','good','fair','poor','fragmentary','unstable','deteriorated') NOT NULL,
  `modified_date` timestamp NULL DEFAULT NULL,
  `donation_date` timestamp NULL DEFAULT NULL,
  `display_status` enum('stored','displayed') NOT NULL,
  `lending_duration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`lending_duration`)),
  `related_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`related_files`)),
  `description_id` int(11) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artifacts`
--

INSERT INTO `artifacts` (`id`, `artifact_type`, `artifact_creator`, `creation_date`, `upload_date`, `accession_type`, `artifact_condition`, `modified_date`, `donation_date`, `display_status`, `lending_duration`, `related_files`, `description_id`, `deleted_at`, `description`) VALUES
(1, 'personal adornment', 'The golden sword', '2025-05-05 00:00:00', '2025-05-13 00:00:00', 'donated', 'fair', NULL, NULL, 'stored', '{\"start_date\":\"\",\"end_date\":\"\",\"lender\":\"\"}', '{\"pictures\":[{\"filename\":\"the_golden_sword_img_1_1747153769979.png\",\"originalName\":\"Screenshot 2025-02-17 211931.png\",\"size\":39903,\"path\":\"http://localhost:5000/assets/artifacts/pictures/the_golden_sword_img_1_1747153769979.png\",\"mimetype\":\"image/png\"}],\"documents\":[{\"filename\":\"the_golden_sword_doc_1_1747153769980.docx\",\"originalName\":\"assingment to write tommorow.docx\",\"size\":18054,\"path\":\"http://localhost:5000/uploads/artifacts/documents/the_golden_sword_doc_1_1747153769980.docx\",\"mimetype\":\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\"}]}', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `artifact_description`
--

CREATE TABLE `artifact_description` (
  `id` int(11) NOT NULL,
  `origin` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`origin`)),
  `culture` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`culture`)),
  `period` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`period`)),
  `discovery_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`discovery_details`)),
  `excavation_site` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`excavation_site`)),
  `accession_no` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`accession_no`)),
  `aquisition_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`aquisition_history`)),
  `artifact_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artifact_description`
--

INSERT INTO `artifact_description` (`id`, `origin`, `culture`, `period`, `discovery_details`, `excavation_site`, `accession_no`, `aquisition_history`, `artifact_id`) VALUES
(1, '{\"country\":\"Egypt\",\"region\":\"Nile Valey\"}', '{\"name\":\"Acient Egypt\"}', '{\"name\":\"New Kingdom\"}', '{\"discoverer\":\"Jeff\",\"discovery_date\":\"2025-05-14\"}', '{\"site_name\":\"Valley of the kings\",\"location\":\"Luxor egypt\"}', '{\"number\":\"\"}', '{\"provenance\":\"\"}', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contribution_type`
--

CREATE TABLE `contribution_type` (
  `id` int(11) NOT NULL,
  `duration_period` varchar(255) DEFAULT NULL,
  `accession_type` varchar(50) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `condition` text DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `transfer_status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contribution_type`
--

INSERT INTO `contribution_type` (`id`, `duration_period`, `accession_type`, `remarks`, `condition`, `reason`, `status`, `transfer_status`) VALUES
(1, NULL, 'Donation', NULL, NULL, NULL, 'accepted', 'Acquired');

-- --------------------------------------------------------

--
-- Table structure for table `credentials`
--

CREATE TABLE `credentials` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `role` enum('admin','staff','system') NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `credentials`
--

INSERT INTO `credentials` (`id`, `first_name`, `last_name`, `email`, `contact_number`, `password`, `position`, `role`, `creation_date`, `modified_date`) VALUES
(1, 'Jefferson', 'Talagtag', 'jeff@email.com', '09054163430', '$2a$10$HIihtDf4zUU6QjNSPqSPN.LkBdbwrPt9uP.6dkxkrCiNCOVOL/Mwi', 'Curator', 'admin', '2025-03-30 10:27:13', '2025-03-30 10:27:13'),
(2, 'John Russel', 'Digga', 'guiwan@email.com', '09234567890', '$2a$10$HIihtDf4zUU6QjNSPqSPN.LkBdbwrPt9uP.6dkxkrCiNCOVOL/Mwi', 'Archivist', 'staff', '2025-03-30 10:27:13', '2025-03-30 10:27:13'),
(3, 'Allen Jepte', 'Mateo', 'allen@email.com', '09123456789', '$2a$10$Y3tWIlbD/Uxd4QEnJk93TOHlrPv.aWqjsnT6TNvjmE.XAf43g79M.', 'Secretary', 'admin', '2025-03-31 09:28:52', '2025-03-31 09:28:52'),
(4, 'Jiane', 'Ricafrente', 'ricafrentejianerose@gmail.com', '09073434119', '$2b$10$ueULzfGn0rEN9mSWBsjS6.0X.LP6bEGsGMXPgx9YqqQoqMtlyezVq', 'Archivist', 'admin', '2025-04-19 15:10:07', '2025-04-19 15:10:07'),
(5, 'Visitor', '', 'system@domain.com', NULL, 'systempassword', NULL, 'system', '2025-04-19 15:48:24', '2025-04-19 15:52:28'),
(12, 'Jefferson', 'Marcilla', 'jeffersontalagtag06@gmail.com', '09054163430', '$2b$10$V04wjBhvWLyOhDEBBLQnLu9wMDFlHUIzTZ6CDBNPJlBRywdUAen7i', 'test', 'admin', '2025-04-19 18:12:00', '2025-04-19 18:12:00'),
(14, 'labayan', 'renz', 'labayanrenz@gmail.com', '1234567890', '$2b$10$PDI8lFswU.ptOMwkN.2PoeT45azluhgzL1BZLOkXunwzr0AdghTVa', 'Test', 'admin', '2025-05-06 08:57:08', '2025-05-06 08:57:08');

-- --------------------------------------------------------

--
-- Table structure for table `donator`
--

CREATE TABLE `donator` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `organization` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donator`
--

INSERT INTO `donator` (`id`, `name`, `age`, `phone`, `sex`, `email`, `organization`, `province`, `city`, `barangay`, `street`) VALUES
(1, 'Jefferson Talgatag', 21, '09054163430', 'male', 'jeffersontalagtag06@gmail.com', 'CNSC', 'La Union', 'Bacnotan', 'Bacqui', '10');

-- --------------------------------------------------------

--
-- Table structure for table `duration_logs`
--

CREATE TABLE `duration_logs` (
  `id` int(11) NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`description`)),
  `display_end` timestamp NULL DEFAULT NULL,
  `display_start` timestamp NULL DEFAULT NULL,
  `artifact_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `form`
--

CREATE TABLE `form` (
  `id` int(11) NOT NULL,
  `donator_id` int(11) NOT NULL,
  `contribution_id` int(11) DEFAULT NULL,
  `accession_status` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `artifact_name` varchar(255) DEFAULT NULL,
  `donation_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `acquired` varchar(255) DEFAULT NULL,
  `additional_info` text DEFAULT NULL,
  `narrative` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `related_images` text DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form`
--

INSERT INTO `form` (`id`, `donator_id`, `contribution_id`, `accession_status`, `user_id`, `artifact_name`, `donation_date`, `description`, `acquired`, `additional_info`, `narrative`, `images`, `documents`, `related_images`, `updated_at`) VALUES
(1, 1, 1, 'accepted', 1, 'Test', '2025-04-26 11:50:22', 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTesta', 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTes', 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTesta', 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestaTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTesta', '', '', '', '2025-04-26 11:53:59');

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `isUsed` tinyint(1) DEFAULT 0,
  `role` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `position` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invitations`
--

INSERT INTO `invitations` (`id`, `email`, `first_name`, `last_name`, `contact_number`, `token`, `expiresAt`, `isUsed`, `role`, `position`, `createdAt`, `updatedAt`) VALUES
(13, 'labayanrenz@gmail.com', 'Test', 'Test', '09123456789', '6cdfe487-6fde-4872-a53b-cb79619f035c', '2025-04-30 14:16:53', 1, 'admin', 'Test', '2025-04-23 14:16:53', '2025-04-23 14:18:52'),
(15, 'labayanrenz@gmail.com', 'labayan', 'renz', '1234567890', '8d23d38c-6e12-4de3-a8dd-93b77f348c09', '2025-05-13 08:56:18', 1, 'admin', 'Test', '2025-05-06 08:56:18', '2025-05-06 08:57:08');

-- --------------------------------------------------------

--
-- Table structure for table `logging`
--

CREATE TABLE `logging` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `method` enum('update','add','edit','delete') NOT NULL,
  `affected_resource` varchar(255) NOT NULL,
  `location` enum('donation','articles','artifacts','appointment','users') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_logs`
--

CREATE TABLE `login_logs` (
  `id` int(11) NOT NULL,
  `credential_id` int(11) NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT current_timestamp(),
  `start` timestamp NULL DEFAULT NULL,
  `end` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL,
  `terminated_reason` varchar(255) DEFAULT NULL,
  `tokenVersion` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_logs`
--

INSERT INTO `login_logs` (`id`, `credential_id`, `last_login`, `start`, `end`, `ip_address`, `user_agent`, `last_activity`, `terminated_reason`, `tokenVersion`) VALUES
(1, 1, '2025-03-30 11:43:33', '2025-03-29 16:00:00', '2025-03-29 16:00:00', NULL, NULL, NULL, NULL, 0),
(2, 1, '2025-03-30 11:43:33', '2025-03-29 16:00:00', '2025-03-29 16:00:00', NULL, NULL, NULL, NULL, 0),
(3, 1, '2025-03-30 11:46:46', '2025-03-29 16:00:00', '2025-03-29 16:00:00', NULL, NULL, NULL, NULL, 0),
(9, 2, '2025-03-30 12:08:06', '2025-03-29 16:00:00', '2025-03-29 16:00:00', NULL, NULL, NULL, NULL, 0),
(10, 1, '2025-03-30 12:10:20', '2025-03-29 16:00:00', '2025-03-29 16:00:00', NULL, NULL, NULL, NULL, 0),
(11, 1, '2025-03-30 12:13:37', '2025-03-30 12:13:25', '2025-03-30 12:13:37', NULL, NULL, NULL, NULL, 0),
(12, 2, '2025-03-30 12:15:56', '2025-03-30 12:15:43', '2025-03-30 12:15:56', NULL, NULL, NULL, NULL, 0),
(13, 2, '2025-03-30 12:21:38', '2025-03-30 12:21:08', '2025-03-30 12:21:38', NULL, NULL, NULL, NULL, 0),
(19, 1, '2025-03-30 12:31:06', '2025-03-30 12:30:53', '2025-03-30 12:31:06', NULL, NULL, NULL, NULL, 0),
(20, 2, '2025-03-30 12:32:48', '2025-03-30 12:32:43', '2025-03-30 12:32:48', NULL, NULL, NULL, NULL, 0),
(21, 1, '2025-03-30 12:33:20', '2025-03-30 12:33:18', '2025-03-30 12:33:20', NULL, NULL, NULL, NULL, 0),
(22, 2, '2025-03-30 12:33:33', '2025-03-30 12:33:22', '2025-03-30 12:33:33', NULL, NULL, NULL, NULL, 0),
(23, 2, '2025-03-31 01:47:17', '2025-03-31 01:46:59', '2025-03-31 01:47:17', NULL, NULL, NULL, NULL, 0),
(24, 2, '2025-03-31 02:13:18', '2025-03-31 02:13:04', '2025-03-31 02:13:18', NULL, NULL, NULL, NULL, 0),
(25, 1, '2025-03-31 09:51:42', '2025-03-31 02:28:22', '2025-03-31 09:51:42', NULL, NULL, NULL, NULL, 0),
(26, 1, '2025-03-31 04:59:34', '2025-03-31 04:29:37', '2025-03-31 04:59:34', NULL, NULL, NULL, NULL, 0),
(27, 2, '2025-03-31 05:03:58', '2025-03-31 05:03:55', '2025-03-31 05:03:58', NULL, NULL, NULL, NULL, 0),
(28, 1, '2025-03-31 05:04:16', '2025-03-31 05:04:03', '2025-03-31 05:04:16', NULL, NULL, NULL, NULL, 0),
(29, 2, '2025-03-31 05:04:43', '2025-03-31 05:04:19', '2025-03-31 05:04:43', NULL, NULL, NULL, NULL, 0),
(31, 2, '2025-04-18 11:30:00', '2025-03-31 05:57:51', '2025-04-18 11:30:00', NULL, NULL, NULL, NULL, 0),
(32, 1, '2025-03-31 07:52:13', '2025-03-31 07:19:10', '2025-03-31 07:52:13', NULL, NULL, NULL, NULL, 0),
(33, 2, '2025-03-31 07:52:21', '2025-03-31 07:52:16', '2025-03-31 07:52:21', NULL, NULL, NULL, NULL, 0),
(34, 1, '2025-03-31 08:08:52', '2025-03-31 07:52:24', '2025-03-31 08:08:52', NULL, NULL, NULL, NULL, 0),
(35, 2, '2025-03-31 08:09:09', '2025-03-31 08:08:55', '2025-03-31 08:09:09', NULL, NULL, NULL, NULL, 0),
(36, 1, '2025-03-31 08:09:18', '2025-03-31 08:09:13', '2025-03-31 08:09:18', NULL, NULL, NULL, NULL, 0),
(37, 2, '2025-03-31 08:09:27', '2025-03-31 08:09:21', '2025-03-31 08:09:27', NULL, NULL, NULL, NULL, 0),
(38, 1, '2025-03-31 08:24:29', '2025-03-31 08:09:30', '2025-03-31 08:24:29', NULL, NULL, NULL, NULL, 0),
(39, 2, '2025-03-31 08:24:55', '2025-03-31 08:24:46', '2025-03-31 08:24:55', NULL, NULL, NULL, NULL, 0),
(40, 1, '2025-03-31 08:33:06', '2025-03-31 08:24:57', '2025-03-31 08:33:06', NULL, NULL, NULL, NULL, 0),
(41, 1, '2025-03-31 08:34:21', '2025-03-31 08:33:08', '2025-03-31 08:34:21', NULL, NULL, NULL, NULL, 0),
(42, 1, '2025-03-31 09:09:31', '2025-03-31 08:34:24', '2025-03-31 09:09:31', NULL, NULL, NULL, NULL, 0),
(43, 2, '2025-03-31 09:28:59', '2025-03-31 09:09:34', '2025-03-31 09:28:59', NULL, NULL, NULL, NULL, 0),
(44, 3, '2025-03-31 09:29:17', '2025-03-31 09:29:06', '2025-03-31 09:29:17', NULL, NULL, NULL, NULL, 0),
(45, 1, '2025-03-31 09:29:46', '2025-03-31 09:29:37', '2025-03-31 09:29:45', NULL, NULL, NULL, NULL, 0),
(46, 3, '2025-03-31 09:31:16', '2025-03-31 09:30:32', '2025-03-31 09:31:16', NULL, NULL, NULL, NULL, 0),
(47, 1, '2025-03-31 09:39:36', '2025-03-31 09:31:19', '2025-03-31 09:39:36', NULL, NULL, NULL, NULL, 0),
(48, 3, '2025-03-31 09:43:55', '2025-03-31 09:39:45', '2025-03-31 09:43:55', NULL, NULL, NULL, NULL, 0),
(49, 3, '2025-03-31 09:47:12', '2025-03-31 09:44:11', '2025-03-31 09:47:12', NULL, NULL, NULL, NULL, 0),
(50, 3, '2025-03-31 09:50:57', '2025-03-31 09:47:19', '2025-03-31 09:50:57', NULL, NULL, NULL, NULL, 0),
(51, 3, '2025-03-31 09:52:02', '2025-03-31 09:51:50', '2025-03-31 09:52:02', NULL, NULL, NULL, NULL, 0),
(52, 1, '2025-03-31 10:04:21', '2025-03-31 09:52:05', '2025-03-31 10:04:21', NULL, NULL, NULL, NULL, 0),
(53, 1, '2025-04-12 12:54:39', '2025-04-11 15:47:35', '2025-04-12 12:54:39', NULL, NULL, NULL, NULL, 0),
(54, 1, '2025-04-12 14:28:38', '2025-04-12 12:54:50', '2025-04-12 14:28:38', NULL, NULL, NULL, NULL, 0),
(55, 1, '2025-04-13 02:01:43', '2025-04-12 14:28:42', '2025-04-13 02:01:43', NULL, NULL, NULL, NULL, 0),
(56, 1, '2025-04-13 02:04:05', '2025-04-13 02:01:50', '2025-04-13 02:04:05', NULL, NULL, NULL, NULL, 0),
(57, 1, '2025-04-17 06:36:24', '2025-04-13 02:17:33', '2025-04-17 06:36:24', NULL, NULL, NULL, NULL, 0),
(58, 1, '2025-04-17 07:44:19', '2025-04-17 07:40:09', '2025-04-17 07:44:19', NULL, NULL, NULL, NULL, 0),
(59, 1, '2025-04-17 14:09:56', '2025-04-17 08:18:40', '2025-04-17 14:09:56', NULL, NULL, NULL, NULL, 0),
(60, 1, '2025-04-17 14:10:24', '2025-04-17 14:10:00', '2025-04-17 14:10:24', NULL, NULL, NULL, NULL, 0),
(61, 1, '2025-04-18 11:30:00', '2025-04-17 14:10:53', '2025-04-18 11:30:00', NULL, NULL, NULL, NULL, 0),
(62, 1, '2025-04-18 18:28:06', '2025-04-18 14:28:11', '2025-04-18 18:28:06', NULL, NULL, NULL, NULL, 0),
(63, 1, '2025-04-19 06:50:00', '2025-04-18 18:30:06', '2025-04-19 06:50:00', NULL, NULL, NULL, NULL, 0),
(64, 1, '2025-04-19 15:10:25', '2025-04-19 13:24:00', '2025-04-19 15:10:25', NULL, NULL, NULL, NULL, 0),
(65, 4, '2025-04-19 15:13:48', '2025-04-19 15:10:30', '2025-04-19 15:13:48', NULL, NULL, NULL, NULL, 0),
(66, 1, '2025-04-19 17:48:53', '2025-04-19 15:13:51', '2025-04-19 17:48:53', NULL, NULL, NULL, NULL, 0),
(67, 1, '2025-04-19 20:34:14', '2025-04-19 17:50:09', '2025-04-19 20:34:14', NULL, NULL, NULL, NULL, 0),
(68, 1, '2025-04-19 20:39:38', '2025-04-19 20:38:58', '2025-04-19 20:39:38', NULL, NULL, NULL, NULL, 0),
(69, 2, '2025-04-19 20:39:31', '2025-04-19 20:39:22', '2025-04-19 20:39:31', NULL, NULL, NULL, NULL, 0),
(70, 1, '2025-04-21 07:30:00', '2025-04-19 20:39:43', '2025-04-21 07:30:00', NULL, NULL, NULL, NULL, 0),
(71, 1, '2025-04-21 07:30:40', '2025-04-21 07:30:20', '2025-04-21 07:30:40', NULL, NULL, NULL, NULL, 0),
(72, 1, '2025-04-21 11:12:53', '2025-04-21 10:14:18', '2025-04-21 11:12:53', NULL, NULL, NULL, NULL, 0),
(73, 1, '2025-04-21 11:13:03', '2025-04-21 11:12:56', '2025-04-21 11:13:03', NULL, NULL, NULL, NULL, 0),
(74, 1, '2025-04-22 05:33:01', '2025-04-22 04:13:38', '2025-04-22 05:33:01', NULL, NULL, NULL, NULL, 0),
(75, 2, '2025-04-22 04:21:26', '2025-04-22 04:21:12', '2025-04-22 04:21:26', NULL, NULL, NULL, NULL, 0),
(76, 3, '2025-04-22 04:22:15', '2025-04-22 04:21:53', '2025-04-22 04:22:15', NULL, NULL, NULL, NULL, 0),
(77, 3, '2025-04-22 05:14:30', '2025-04-22 05:14:19', '2025-04-22 05:14:30', NULL, NULL, NULL, NULL, 0),
(78, 2, '2025-04-22 05:23:00', '2025-04-22 05:22:51', '2025-04-22 05:23:00', NULL, NULL, NULL, NULL, 0),
(79, 1, '2025-04-22 06:31:12', '2025-04-22 05:33:15', '2025-04-22 06:31:12', NULL, NULL, NULL, NULL, 0),
(80, 1, '2025-04-22 06:39:47', '2025-04-22 06:32:03', '2025-04-22 06:39:46', NULL, NULL, NULL, NULL, 0),
(81, 1, '2025-04-22 07:07:42', '2025-04-22 06:39:49', '2025-04-22 07:07:42', NULL, NULL, NULL, NULL, 0),
(82, 3, '2025-04-22 06:40:37', '2025-04-22 06:40:24', '2025-04-22 06:40:37', NULL, NULL, NULL, NULL, 0),
(83, 3, '2025-04-22 06:46:43', '2025-04-22 06:46:35', '2025-04-22 06:46:43', NULL, NULL, NULL, NULL, 0),
(84, 2, '2025-04-22 06:58:26', '2025-04-22 06:58:16', '2025-04-22 06:58:26', NULL, NULL, NULL, NULL, 0),
(85, 1, '2025-04-23 03:40:00', '2025-04-22 07:07:44', '2025-04-23 03:40:00', NULL, NULL, NULL, NULL, 0),
(86, 2, '2025-04-23 03:38:10', '2025-04-23 03:37:44', '2025-04-23 03:38:10', NULL, NULL, NULL, NULL, 0),
(87, 2, '2025-04-23 13:50:00', '2025-04-23 04:18:54', '2025-04-23 13:50:00', NULL, NULL, NULL, NULL, 0),
(88, 1, '2025-04-23 04:50:13', '2025-04-23 04:28:06', '2025-04-23 04:50:13', NULL, NULL, NULL, NULL, 0),
(89, 1, '2025-04-23 13:50:00', '2025-04-23 04:51:15', '2025-04-23 13:50:00', NULL, NULL, NULL, NULL, 0),
(91, 1, '2025-04-23 14:38:42', '2025-04-23 14:26:34', '2025-04-23 14:38:42', NULL, NULL, NULL, NULL, 0),
(92, 1, '2025-04-24 11:30:00', '2025-04-23 14:44:16', '2025-04-24 11:30:00', NULL, NULL, NULL, NULL, 0),
(93, 1, '2025-04-26 10:45:58', '2025-04-26 06:46:02', '2025-04-26 10:45:58', NULL, NULL, NULL, NULL, 0),
(94, 1, '2025-04-26 11:34:52', '2025-04-26 10:46:11', '2025-04-26 11:34:52', NULL, NULL, NULL, NULL, 0),
(95, 1, '2025-04-26 12:03:00', '2025-04-26 11:34:57', '2025-04-26 12:03:00', NULL, NULL, NULL, NULL, 0),
(96, 1, '2025-04-27 16:30:19', '2025-04-27 16:27:31', '2025-04-27 16:30:19', NULL, NULL, NULL, NULL, 0),
(97, 1, '2025-04-28 06:55:00', '2025-04-28 02:55:04', '2025-04-28 06:55:00', NULL, NULL, NULL, NULL, 0),
(98, 1, '2025-04-28 10:55:00', '2025-04-28 06:55:05', '2025-04-28 10:55:00', NULL, NULL, NULL, NULL, 0),
(99, 3, '2025-04-29 04:00:00', '2025-04-28 11:31:28', '2025-04-29 04:00:00', NULL, NULL, NULL, NULL, 0),
(100, 1, '2025-04-30 08:01:30', '2025-04-29 03:59:15', '2025-04-30 08:01:30', NULL, NULL, NULL, NULL, 0),
(101, 1, '2025-04-30 10:45:23', '2025-04-30 10:44:57', '2025-04-30 10:45:23', NULL, NULL, NULL, NULL, 0),
(102, 1, '2025-04-30 11:36:21', '2025-04-30 11:34:37', '2025-04-30 11:36:21', NULL, NULL, NULL, NULL, 0),
(103, 1, '2025-04-30 19:45:00', '2025-04-30 11:47:55', '2025-04-30 19:45:00', NULL, NULL, NULL, NULL, 0),
(104, 1, '2025-05-01 09:25:00', '2025-04-30 19:45:57', '2025-05-01 09:25:00', NULL, NULL, NULL, NULL, 0),
(105, 1, '2025-05-02 04:40:00', '2025-05-01 09:25:03', '2025-05-02 04:40:00', NULL, NULL, NULL, NULL, 0),
(106, 1, '2025-05-02 14:15:00', '2025-05-02 04:43:45', '2025-05-02 14:15:00', NULL, NULL, NULL, NULL, 0),
(107, 2, '2025-05-02 14:24:26', '2025-05-02 14:15:03', '2025-05-02 14:24:26', NULL, NULL, NULL, NULL, 0),
(108, 1, '2025-05-02 14:24:45', '2025-05-02 14:16:08', '2025-05-02 14:24:45', NULL, NULL, NULL, NULL, 0),
(109, 1, '2025-05-02 16:00:27', '2025-05-02 14:24:47', '2025-05-02 16:00:27', NULL, NULL, NULL, NULL, 0),
(110, 1, '2025-05-02 16:00:52', '2025-05-02 16:00:31', '2025-05-02 16:00:52', NULL, NULL, NULL, NULL, 0),
(111, 1, '2025-05-03 09:06:34', '2025-05-03 08:58:42', '2025-05-03 09:06:34', NULL, NULL, NULL, NULL, 0),
(112, 1, '2025-05-05 19:10:00', '2025-05-04 05:06:19', '2025-05-05 19:10:00', NULL, NULL, NULL, NULL, 0),
(113, 1, '2025-05-05 19:26:45', '2025-05-05 19:13:20', '2025-05-05 19:26:45', NULL, NULL, NULL, NULL, 0),
(114, 1, '2025-05-05 19:39:12', '2025-05-05 19:38:50', '2025-05-05 19:39:11', NULL, NULL, NULL, NULL, 0),
(115, 1, '2025-05-05 19:42:04', '2025-05-05 19:42:02', '2025-05-05 19:42:04', NULL, NULL, NULL, NULL, 0),
(116, 1, '2025-05-05 20:17:37', '2025-05-05 20:17:37', '2025-05-05 20:17:48', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-05 20:17:42', 'New login from another device', 0),
(117, 1, '2025-05-05 20:17:48', '2025-05-05 20:17:48', '2025-05-05 20:19:02', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-05 20:18:18', 'New login from another device', 0),
(118, 1, '2025-05-05 20:19:02', '2025-05-05 20:19:02', '2025-05-05 20:26:39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-05 20:26:35', 'New login from another device', 0),
(119, 1, '2025-05-05 20:26:39', '2025-05-05 20:26:39', '2025-05-05 20:27:10', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-05 20:26:39', 'New login from another device', 0),
(120, 1, '2025-05-05 20:27:10', '2025-05-05 20:27:10', '2025-05-05 20:34:53', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-05 20:34:53', 'User logout', 0),
(121, 1, '2025-05-05 20:35:11', '2025-05-05 20:35:11', '2025-05-05 20:35:16', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-05 20:35:11', 'New login from another device', 0),
(122, 1, '2025-05-05 20:35:16', '2025-05-05 20:35:16', '2025-05-05 20:45:43', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-05 20:45:20', 'New login from another device', 0),
(123, 1, '2025-05-05 20:45:43', '2025-05-05 20:45:43', '2025-05-05 20:47:42', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-05 20:47:26', 'New login from another device', 0),
(124, 1, '2025-05-05 20:47:42', '2025-05-05 20:47:42', '2025-05-05 20:47:54', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-05 20:47:42', 'New login from another device', 0),
(125, 1, '2025-05-05 20:47:54', '2025-05-05 20:47:54', '2025-05-05 20:48:08', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-05 20:47:54', 'New login from another device', 0),
(126, 1, '2025-05-05 20:48:08', '2025-05-05 20:48:08', '2025-05-05 20:57:10', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-05 20:57:08', 'New login from another device', 0),
(127, 1, '2025-05-05 20:57:10', '2025-05-05 20:57:10', '2025-05-05 20:59:06', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-05 20:59:06', 'User logout', 0),
(128, 1, '2025-05-06 05:16:01', '2025-05-06 05:16:01', '2025-05-06 05:16:16', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 05:16:02', 'New login from another device', 0),
(129, 1, '2025-05-06 05:16:16', '2025-05-06 05:16:16', '2025-05-06 05:16:30', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-06 05:16:16', 'New login from another device', 0),
(130, 1, '2025-05-06 05:16:30', '2025-05-06 05:16:30', '2025-05-06 05:48:45', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 05:48:30', 'New login from another device', 0),
(131, 1, '2025-05-06 05:48:46', '2025-05-06 05:48:46', '2025-05-06 05:57:18', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-06 05:56:28', 'New login from another device', 0),
(132, 1, '2025-05-06 05:57:18', '2025-05-06 05:57:18', '2025-05-06 06:00:48', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 06:00:48', 'User logout', 0),
(133, 1, '2025-05-06 06:00:50', '2025-05-06 06:00:50', '2025-05-06 06:05:43', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 06:05:43', 'User logout', 0),
(134, 1, '2025-05-06 06:26:46', '2025-05-06 06:26:46', '2025-05-06 06:28:58', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 06:28:58', 'User logout', 0),
(135, 1, '2025-05-06 06:29:01', '2025-05-06 06:29:01', '2025-05-06 07:56:26', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 07:56:26', 'User logout', 0),
(136, 1, '2025-05-06 07:56:28', '2025-05-06 07:56:28', '2025-05-06 07:57:05', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 07:56:59', 'New login from another device', 0),
(137, 1, '2025-05-06 07:57:05', '2025-05-06 07:57:05', '2025-05-06 07:57:38', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-06 07:57:35', 'New login from another device', 0),
(138, 1, '2025-05-06 07:57:39', '2025-05-06 07:57:39', '2025-05-06 08:04:16', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 08:04:16', 'User logout', 0),
(139, 1, '2025-05-06 08:04:19', '2025-05-06 08:04:19', '2025-05-06 08:04:55', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 08:04:55', 'User logout', 0),
(140, 1, '2025-05-06 08:42:37', '2025-05-06 08:42:37', '2025-05-06 10:40:20', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-06 10:19:23', 'New login from another device', 0),
(141, 14, '2025-05-06 08:57:33', '2025-05-06 08:57:33', '2025-05-06 09:07:53', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-06 09:07:53', 'User logout', 0),
(142, 1, '2025-05-06 10:40:20', '2025-05-06 10:40:20', '2025-05-07 07:24:16', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-06 10:43:21', 'New login from another device', 0),
(143, 1, '2025-05-07 07:24:16', '2025-05-07 07:24:16', '2025-05-07 07:30:54', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', '2025-05-07 07:30:54', 'User logout', 0),
(144, 1, '2025-05-07 07:30:59', '2025-05-07 07:30:59', '2025-05-07 07:36:16', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-07 07:36:16', 'User logout', 0),
(145, 1, '2025-05-07 07:47:51', '2025-05-07 07:47:51', '2025-05-07 07:55:08', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-07 07:55:08', 'User logout', 0),
(146, 1, '2025-05-07 07:57:22', '2025-05-07 07:57:22', '2025-05-07 07:57:57', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1', '2025-05-07 07:57:57', 'User logout', 0),
(147, 1, '2025-05-08 06:47:30', '2025-05-08 06:47:30', '2025-05-10 11:15:00', '136.158.102.216', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1', '2025-05-08 06:49:30', NULL, 0),
(148, 1, '2025-05-10 11:15:24', '2025-05-10 11:15:24', '2025-05-10 11:48:20', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-10 11:48:20', 'User logout', 0),
(149, 1, '2025-05-10 11:49:41', '2025-05-10 11:49:41', '2025-05-10 11:51:22', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-10 11:51:22', 'User logout', 0),
(150, 1, '2025-05-13 15:38:40', '2025-05-13 15:38:40', '2025-05-13 18:18:25', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-13 18:18:25', 'User logout', 0),
(151, 1, '2025-05-13 18:19:00', '2025-05-13 18:19:00', '2025-05-13 18:25:31', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-13 18:25:31', 'User logout', 0),
(152, 1, '2025-05-14 03:22:48', '2025-05-14 03:22:48', '2025-05-14 07:22:43', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 07:22:43', 'User logout', 0),
(153, 1, '2025-05-14 07:23:28', '2025-05-14 07:23:28', '2025-05-14 07:23:28', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 07:23:28', 'Token expired or invalid', 0),
(154, 1, '2025-05-14 07:24:30', '2025-05-14 07:24:30', '2025-05-14 08:12:26', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 08:12:26', 'User logout', 0),
(155, 1, '2025-05-14 08:54:08', '2025-05-14 08:54:08', '2025-05-14 13:52:58', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 09:00:43', 'New login from another device', 0),
(156, 1, '2025-05-14 13:52:58', '2025-05-14 13:52:58', '2025-05-14 14:00:20', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 13:53:04', 'New login from another device', 0),
(157, 1, '2025-05-14 14:00:20', '2025-05-14 14:00:20', '2025-05-14 14:00:32', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 14:00:22', 'New login from another device', 0),
(158, 1, '2025-05-14 14:00:32', '2025-05-14 14:00:32', '2025-05-14 14:17:03', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 14:00:32', 'New login from another device', 0),
(159, 2, '2025-05-14 14:00:53', '2025-05-14 14:00:53', '2025-05-14 16:15:02', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 14:00:53', 'New login from another device', 0),
(160, 1, '2025-05-14 14:17:03', '2025-05-14 14:17:03', '2025-05-14 14:17:59', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 14:17:59', 'User logout', 0),
(161, 1, '2025-05-14 14:23:38', '2025-05-14 14:23:38', '2025-05-14 14:41:25', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 14:41:25', 'User logout', 0),
(162, 1, '2025-05-14 14:41:28', '2025-05-14 14:41:28', '2025-05-14 14:56:23', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 14:56:23', 'User logout', 0),
(163, 1, '2025-05-14 15:06:02', '2025-05-14 15:06:02', '2025-05-14 15:11:51', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 15:11:51', 'User logout', 0),
(164, 1, '2025-05-14 15:12:02', '2025-05-14 15:12:02', '2025-05-14 15:14:26', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 15:14:26', 'User logout', 0),
(165, 1, '2025-05-14 15:14:29', '2025-05-14 15:14:29', '2025-05-14 15:15:33', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 15:15:33', 'User logout', 0),
(166, 1, '2025-05-14 15:15:35', '2025-05-14 15:15:35', '2025-05-14 15:21:00', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 15:21:00', 'User logout', 0),
(167, 1, '2025-05-14 15:21:05', '2025-05-14 15:21:05', '2025-05-14 15:51:53', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 15:51:47', 'New login from another device', 0),
(168, 1, '2025-05-14 15:51:53', '2025-05-14 15:51:53', '2025-05-14 16:16:31', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 16:16:31', 'User logout', 0),
(169, 2, '2025-05-14 16:15:02', '2025-05-14 16:15:02', '2025-05-14 16:15:08', '136.158.102.216', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-14 16:15:08', 'User logout', 0),
(170, 3, '2025-05-14 16:16:23', '2025-05-14 16:16:23', '2025-05-14 16:20:37', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-14 16:20:37', 'User logout', 0),
(171, 1, '2025-05-14 16:20:09', '2025-05-14 16:20:09', '2025-05-14 16:37:17', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-14 16:37:17', 'User logout', 0),
(172, 1, '2025-05-14 16:37:50', '2025-05-14 16:37:50', '2025-05-15 05:20:00', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:19:50', NULL, 0),
(173, 1, '2025-05-15 05:23:00', '2025-05-15 05:23:00', '2025-05-15 05:31:09', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:31:09', 'User logout', 0),
(174, 1, '2025-05-15 05:31:11', '2025-05-15 05:31:11', '2025-05-15 05:31:30', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:31:30', 'User logout', 0),
(175, 1, '2025-05-15 05:31:32', '2025-05-15 05:31:32', '2025-05-15 05:31:34', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:31:32', 'New login from another device', 0),
(176, 1, '2025-05-15 05:31:34', '2025-05-15 05:31:34', '2025-05-15 05:31:45', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:31:34', 'New login from another device', 0),
(177, 1, '2025-05-15 05:31:45', '2025-05-15 05:31:45', '2025-05-15 05:32:15', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:31:47', 'New login from another device', 0),
(178, 1, '2025-05-15 05:32:15', '2025-05-15 05:32:15', '2025-05-15 05:33:08', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:32:27', 'New login from another device', 0),
(179, 1, '2025-05-15 05:33:08', '2025-05-15 05:33:08', '2025-05-15 05:36:25', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:33:09', 'New login from another device', 0),
(180, 1, '2025-05-15 05:36:25', '2025-05-15 05:36:25', '2025-05-15 05:47:36', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:47:36', 'User logout', 0),
(181, 1, '2025-05-15 05:47:38', '2025-05-15 05:47:38', '2025-05-15 05:51:07', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:51:07', 'User logout', 0),
(182, 1, '2025-05-15 05:51:09', '2025-05-15 05:51:09', '2025-05-15 05:57:15', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 05:57:15', 'User logout', 0),
(183, 1, '2025-05-15 05:57:48', '2025-05-15 05:57:48', '2025-05-15 06:05:22', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 06:05:22', 'User logout', 0),
(184, 2, '2025-05-15 05:58:09', '2025-05-15 05:58:09', '2025-05-15 05:58:13', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-15 05:58:13', 'User logout', 0),
(185, 1, '2025-05-15 06:06:41', '2025-05-15 06:06:41', '2025-05-15 06:18:43', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 06:18:43', 'User logout', 0),
(186, 1, '2025-05-15 06:18:46', '2025-05-15 06:18:46', '2025-05-15 06:44:02', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 06:44:02', 'User logout', 0),
(187, 1, '2025-05-15 06:44:05', '2025-05-15 06:44:05', '2025-05-15 06:44:25', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 06:44:25', 'User logout', 0),
(188, 1, '2025-05-15 06:44:42', '2025-05-15 06:44:42', '2025-05-15 06:47:55', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 06:47:19', 'New login from another device', 0),
(189, 1, '2025-05-15 06:47:55', '2025-05-15 06:47:55', '2025-05-15 06:57:08', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 06:57:06', 'New login from another device', 0),
(190, 1, '2025-05-15 06:57:08', '2025-05-15 06:57:08', '2025-05-15 16:20:00', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 06:59:55', NULL, 0),
(191, 1, '2025-05-15 16:21:51', '2025-05-15 16:21:51', '2025-05-15 16:52:17', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 16:52:05', 'New login from another device', 0),
(192, 1, '2025-05-15 16:52:17', '2025-05-15 16:52:17', '2025-05-15 17:22:50', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 17:22:43', 'New login from another device', 0),
(193, 1, '2025-05-15 17:22:50', '2025-05-15 17:22:50', '2025-05-15 17:53:20', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 17:53:08', 'New login from another device', 0),
(194, 1, '2025-05-15 17:53:20', '2025-05-15 17:53:20', '2025-05-15 18:24:13', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 18:23:47', 'New login from another device', 0),
(195, 1, '2025-05-15 18:24:13', '2025-05-15 18:24:13', '2025-05-15 18:54:37', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 18:54:28', 'New login from another device', 0),
(196, 1, '2025-05-15 18:54:37', '2025-05-15 18:54:37', '2025-05-15 18:55:51', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 18:54:44', 'New login from another device', 0),
(197, 1, '2025-05-15 18:55:51', '2025-05-15 18:55:51', '2025-05-15 19:27:06', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 19:26:03', 'New login from another device', 0),
(198, 1, '2025-05-15 19:27:06', '2025-05-15 19:27:06', '2025-05-15 19:27:52', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 19:27:52', 'User logout', 0),
(199, 1, '2025-05-15 19:27:57', '2025-05-15 19:27:57', '2025-05-15 19:28:24', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 19:28:24', 'User logout', 0),
(200, 1, '2025-05-15 19:28:26', '2025-05-15 19:28:26', '2025-05-15 19:29:25', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 19:29:17', 'New login from another device', 0),
(201, 1, '2025-05-15 19:29:25', '2025-05-15 19:29:25', '2025-05-16 04:24:19', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-15 19:31:57', 'New login from another device', 0),
(202, 1, '2025-05-16 04:24:19', '2025-05-16 04:24:19', '2025-05-16 05:00:51', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 04:54:44', 'New login from another device', 0),
(203, 1, '2025-05-16 05:00:51', '2025-05-16 05:00:51', '2025-05-16 05:10:50', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:10:50', 'User logout', 0),
(204, 1, '2025-05-16 05:10:53', '2025-05-16 05:10:53', '2025-05-16 05:16:07', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:15:59', 'New login from another device', 0),
(205, 1, '2025-05-16 05:16:07', '2025-05-16 05:16:07', '2025-05-16 05:19:33', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:19:29', 'New login from another device', 0),
(206, 1, '2025-05-16 05:19:33', '2025-05-16 05:19:33', '2025-05-16 05:19:50', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:19:50', 'User logout', 0),
(207, 1, '2025-05-16 05:19:56', '2025-05-16 05:19:56', '2025-05-16 05:20:26', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:20:01', 'New login from another device', 0),
(208, 1, '2025-05-16 05:20:26', '2025-05-16 05:20:26', '2025-05-16 05:28:31', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:22:57', 'New login from another device', 0),
(209, 1, '2025-05-16 05:28:31', '2025-05-16 05:28:31', '2025-05-16 05:28:48', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:28:31', 'New login from another device', 0),
(210, 1, '2025-05-16 05:28:48', '2025-05-16 05:28:48', '2025-05-16 05:29:59', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:28:48', 'New login from another device', 0),
(211, 1, '2025-05-16 05:29:59', '2025-05-16 05:29:59', '2025-05-16 05:36:42', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:32:00', 'New login from another device', 0),
(212, 1, '2025-05-16 05:36:42', '2025-05-16 05:36:42', '2025-05-16 05:41:06', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:38:56', 'New login from another device', 0),
(213, 1, '2025-05-16 05:41:06', '2025-05-16 05:41:06', '2025-05-16 05:49:23', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:49:13', 'New login from another device', 0),
(214, 1, '2025-05-16 05:49:23', '2025-05-16 05:49:23', '2025-05-16 05:50:13', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:49:24', 'New login from another device', 0),
(215, 1, '2025-05-16 05:50:13', '2025-05-16 05:50:13', '2025-05-16 05:50:37', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:50:13', 'New login from another device', 0),
(216, 1, '2025-05-16 05:50:37', '2025-05-16 05:50:37', '2025-05-16 05:52:34', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:50:37', 'New login from another device', 0),
(217, 1, '2025-05-16 05:52:34', '2025-05-16 05:52:34', '2025-05-16 05:57:40', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:52:35', 'New login from another device', 0),
(218, 1, '2025-05-16 05:57:40', '2025-05-16 05:57:40', '2025-05-16 05:58:25', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:58:25', 'User logout', 0),
(219, 1, '2025-05-16 05:58:28', '2025-05-16 05:58:28', '2025-05-16 05:59:50', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:59:50', 'User logout', 0),
(220, 1, '2025-05-16 05:59:52', '2025-05-16 05:59:52', '2025-05-16 06:00:29', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 05:59:52', 'New login from another device', 0),
(221, 1, '2025-05-16 06:00:29', '2025-05-16 06:00:29', '2025-05-16 06:02:02', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 06:02:02', 'User logout', 0),
(222, 1, '2025-05-16 06:02:05', '2025-05-16 06:02:05', '2025-05-16 06:03:07', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 06:03:00', 'New login from another device', 0),
(223, 1, '2025-05-16 06:03:07', '2025-05-16 06:03:07', '2025-05-16 06:07:20', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 06:06:42', 'New login from another device', 0),
(224, 1, '2025-05-16 06:07:20', '2025-05-16 06:07:20', '2025-05-16 06:46:38', '136.158.102.65', 'Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true', '2025-05-16 06:37:23', 'New login from another device', 0),
(225, 1, '2025-05-16 06:46:38', '2025-05-16 06:46:38', '2025-05-16 06:47:00', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 06:47:00', 'User logout', 0),
(226, 1, '2025-05-16 06:47:04', '2025-05-16 06:47:04', '2025-05-16 06:53:47', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 06:53:47', 'User logout', 0),
(227, 1, '2025-05-16 06:53:49', '2025-05-16 06:53:49', '2025-05-16 06:55:20', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 06:55:20', 'User logout', 0),
(228, 1, '2025-05-16 06:55:22', '2025-05-16 06:55:22', '2025-05-16 06:55:47', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 06:55:47', 'User logout', 0),
(229, 1, '2025-05-16 06:55:57', '2025-05-16 06:55:57', '2025-05-16 07:14:21', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 07:14:21', 'User logout', 0),
(230, 1, '2025-05-16 07:14:53', '2025-05-16 07:14:53', '2025-05-16 07:22:33', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 07:22:15', 'New login from another device', 0),
(231, 1, '2025-05-16 07:22:33', '2025-05-16 07:22:33', '2025-05-16 07:33:23', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 07:32:13', 'New login from another device', 0),
(232, 1, '2025-05-16 07:33:23', '2025-05-16 07:33:23', '2025-05-16 08:03:37', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 08:03:21', 'New login from another device', 0),
(233, 1, '2025-05-16 08:03:37', '2025-05-16 08:03:37', '2025-05-16 08:03:46', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 08:03:37', 'New login from another device', 0),
(234, 1, '2025-05-16 08:03:46', '2025-05-16 08:03:46', '2025-05-16 08:04:36', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 08:03:46', 'New login from another device', 0),
(235, 1, '2025-05-16 08:04:36', '2025-05-16 08:04:36', '2025-05-16 08:05:04', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 08:04:36', 'New login from another device', 0),
(236, 1, '2025-05-16 08:05:04', '2025-05-16 08:05:04', '2025-05-16 08:25:33', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 08:25:33', 'User logout', 0),
(237, 1, '2025-05-16 08:44:13', '2025-05-16 08:44:13', '2025-05-16 08:45:06', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 08:45:06', 'User logout', 0),
(238, 1, '2025-05-16 08:45:12', '2025-05-16 08:45:12', '2025-05-16 14:54:44', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 09:15:21', 'New login from another device', 0),
(239, 1, '2025-05-16 14:54:45', '2025-05-16 14:54:45', '2025-05-16 15:10:40', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 15:07:03', 'New login from another device', 0),
(240, 1, '2025-05-16 15:10:40', '2025-05-16 15:10:40', '2025-05-17 04:00:00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-16 15:18:50', NULL, 0),
(241, 1, '2025-05-17 05:10:42', '2025-05-17 05:10:42', '2025-05-17 05:10:56', '136.158.102.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', '2025-05-17 05:10:56', 'User logout', 0);

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `action` enum('create','update','delete','soft_delete') NOT NULL,
  `model` varchar(50) NOT NULL,
  `modelId` int(11) NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `action`, `model`, `modelId`, `details`, `userId`, `createdAt`) VALUES
(17, 'create', 'Invitation', 9, '{\"new\":{\"isUsed\":false,\"id\":9,\"email\":\"jeffersontalagtag06@gmail.com\",\"first_name\":\"Jefferson\",\"last_name\":\"Marcilla\",\"contact_number\":\"09054163430\",\"token\":\"ff0d8bd2-45da-43ac-a197-ccd2f17fdc3e\",\"expiresAt\":\"2025-04-26T18:11:29.997Z\",\"role\":\"admin\",\"position\":\"test\",\"updatedAt\":\"2025-04-19T18:11:29.999Z\",\"createdAt\":\"2025-04-19T18:11:29.999Z\"},\"message\":\"An invitation was created and added to the Invitation table\"}', 1, '2025-04-19 18:11:32'),
(18, 'create', 'Credential', 12, '{\"new\":{\"creation_date\":\"2025-04-19T18:12:00.100Z\",\"modified_date\":\"2025-04-19T18:12:00.100Z\",\"id\":12,\"first_name\":\"Jefferson\",\"last_name\":\"Marcilla\",\"email\":\"jeffersontalagtag06@gmail.com\",\"password\":\"$2b$10$V04wjBhvWLyOhDEBBLQnLu9wMDFlHUIzTZ6CDBNPJlBRywdUAen7i\",\"role\":\"admin\",\"position\":\"test\",\"contact_number\":\"09054163430\"},\"message\":\"User jeffersontalagtag06@gmail.com has successfully completed registration and account is set to inactive.\"}', 5, '2025-04-19 18:12:00'),
(19, 'create', 'Appointment', 2034, '{\"new\":{\"creation_date\":\"2025-04-19T18:20:50.028Z\",\"appointment_id\":2034,\"visitor_id\":1035,\"purpose_of_visit\":\"Donations\",\"population_count\":\"234\",\"preferred_date\":\"2025-04-16\",\"preferred_time\":\"Flexible\",\"additional_notes\":\"\"},\"message\":\"a visitor has successfully created an appoinment.\"}', 5, '2025-04-19 18:20:50'),
(20, 'create', 'Invitation', 10, '{\"new\":{\"isUsed\":false,\"id\":10,\"email\":\"Test@gmail.com\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"contact_number\":\"102924655\",\"token\":\"dd14f9c1-613f-4e75-8efe-0da7a4243cb8\",\"expiresAt\":\"2025-04-26T19:32:12.971Z\",\"role\":\"admin\",\"position\":\"234\",\"updatedAt\":\"2025-04-19T19:32:12.983Z\",\"createdAt\":\"2025-04-19T19:32:12.983Z\"},\"message\":\"An invitation was created and added to the Invitation table\"}', 1, '2025-04-19 19:32:15'),
(21, 'soft_delete', 'Invitation', 10, '{\"previous\":{\"id\":10,\"email\":\"Test@gmail.com\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"contact_number\":\"102924655\",\"token\":\"dd14f9c1-613f-4e75-8efe-0da7a4243cb8\",\"expiresAt\":\"2025-04-26T19:32:12.000Z\",\"isUsed\":false,\"role\":\"admin\",\"position\":\"234\",\"deletedAt\":null,\"createdAt\":\"2025-04-19T19:32:12.000Z\",\"updatedAt\":\"2025-04-19T19:32:12.000Z\"},\"new\":{\"id\":10,\"email\":\"Test@gmail.com\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"contact_number\":\"102924655\",\"token\":\"dd14f9c1-613f-4e75-8efe-0da7a4243cb8\",\"expiresAt\":\"2025-04-26T19:32:12.000Z\",\"isUsed\":false,\"role\":\"admin\",\"position\":\"234\",\"deletedAt\":\"2025-04-19T19:32:30.370Z\",\"createdAt\":\"2025-04-19T19:32:12.000Z\",\"updatedAt\":\"2025-04-19T19:32:30.370Z\"},\"message\":\"Invitation with ID 10 was revoked and marked for soft deletion in the Invitation table\"}', 1, '2025-04-19 19:32:30'),
(22, 'delete', 'Invitation', 10, '{\"previous\":{\"id\":10,\"email\":\"Test@gmail.com\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"contact_number\":\"102924655\",\"token\":\"dd14f9c1-613f-4e75-8efe-0da7a4243cb8\",\"expiresAt\":\"2025-04-26T19:32:12.000Z\",\"isUsed\":false,\"role\":\"admin\",\"position\":\"234\",\"createdAt\":\"2025-04-19T19:32:12.000Z\",\"updatedAt\":\"2025-04-19T19:32:30.000Z\"},\"new\":null,\"message\":\"Invitation with ID 10 was hard deleted from the Invitation table\"}', 1, '2025-04-19 19:38:50'),
(23, 'delete', 'Invitation', 1, '{\"previous\":{\"id\":1,\"email\":\"ricarfrentejianerose@gmail.com\",\"first_name\":\"Jiane\",\"last_name\":\"Ricafrente\",\"contact_number\":\"09073434119\",\"token\":\"0b1f3b2a-f5fc-4d62-8be7-e59203208518\",\"expiresAt\":\"2025-04-26T15:08:24.000Z\",\"isUsed\":false,\"role\":\"admin\",\"position\":\"Archivist\",\"createdAt\":\"2025-04-19T15:08:24.000Z\",\"updatedAt\":\"2025-04-19T15:09:17.000Z\"},\"new\":null,\"message\":\"Invitation with ID 1 was hard deleted from the Invitation table\"}', 1, '2025-04-19 19:39:10'),
(24, 'create', 'Invitation', 11, '{\"new\":{\"isUsed\":false,\"id\":11,\"email\":\"for@invite.test\",\"first_name\":\"test\",\"last_name\":\"delete\",\"contact_number\":\"102924655\",\"token\":\"f820f9b4-09fb-4aaa-a197-c5afec89fec0\",\"expiresAt\":\"2025-04-26T19:43:14.507Z\",\"role\":\"admin\",\"position\":\"sad\",\"updatedAt\":\"2025-04-19T19:43:14.513Z\",\"createdAt\":\"2025-04-19T19:43:14.513Z\"},\"message\":\"An invitation was created and added to the Invitation table\"}', 1, '2025-04-19 19:43:17'),
(25, 'delete', 'Invitation', 11, '{\"previous\":{\"id\":11,\"email\":\"for@invite.test\",\"first_name\":\"test\",\"last_name\":\"delete\",\"contact_number\":\"102924655\",\"token\":\"f820f9b4-09fb-4aaa-a197-c5afec89fec0\",\"expiresAt\":\"2025-04-26T19:43:14.000Z\",\"isUsed\":false,\"role\":\"admin\",\"position\":\"sad\",\"createdAt\":\"2025-04-19T19:43:14.000Z\",\"updatedAt\":\"2025-04-19T19:43:14.000Z\"},\"new\":null,\"message\":\"Invitation with ID 11 was hard deleted from the Invitation table\"}', 1, '2025-04-19 19:43:49'),
(26, 'create', 'Appointment', 2035, '{\"new\":{\"creation_date\":\"2025-04-19T20:26:23.054Z\",\"appointment_id\":2035,\"visitor_id\":1036,\"purpose_of_visit\":\"Photography or Media Projects\",\"population_count\":\"1\",\"preferred_date\":\"2025-04-22\",\"preferred_time\":\"Flexible\",\"additional_notes\":\"i love history XD\"},\"message\":\"a visitor has successfully created an appoinment.\"}', 5, '2025-04-19 20:26:23'),
(27, 'create', 'Appointment', 2036, '{\"new\":{\"creation_date\":\"2025-04-22T06:31:59.086Z\",\"appointment_id\":2036,\"visitor_id\":1037,\"purpose_of_visit\":\"Donations\",\"population_count\":\"1\",\"preferred_date\":\"2025-04-23\",\"preferred_time\":\"Flexible\",\"additional_notes\":\"\"},\"message\":\"a visitor has successfully created an appoinment.\"}', 5, '2025-04-22 06:31:59'),
(28, 'create', 'Invitation', 12, '{\"new\":{\"isUsed\":false,\"id\":12,\"email\":\"test@email.cpm\",\"first_name\":\"Another test\",\"last_name\":\"Test\",\"contact_number\":\"243895749857\",\"token\":\"3a79789d-5134-406b-b0b2-df4d0a356792\",\"expiresAt\":\"2025-04-30T04:28:37.605Z\",\"role\":\"admin\",\"position\":\"test\",\"updatedAt\":\"2025-04-23T04:28:37.606Z\",\"createdAt\":\"2025-04-23T04:28:37.606Z\"},\"message\":\"An invitation was created and added to the Invitation table\"}', 1, '2025-04-23 04:28:39'),
(29, 'delete', 'Invitation', 12, '{\"previous\":{\"id\":12,\"email\":\"test@email.cpm\",\"first_name\":\"Another test\",\"last_name\":\"Test\",\"contact_number\":\"243895749857\",\"token\":\"3a79789d-5134-406b-b0b2-df4d0a356792\",\"expiresAt\":\"2025-04-30T04:28:37.000Z\",\"isUsed\":false,\"role\":\"admin\",\"position\":\"test\",\"createdAt\":\"2025-04-23T04:28:37.000Z\",\"updatedAt\":\"2025-04-23T04:28:37.000Z\"},\"message\":\"Invitation with ID 12 was hard deleted from the Invitation table\"}', 1, '2025-04-23 04:28:51'),
(30, 'create', 'Appointment', 2037, '{\"new\":{\"creation_date\":\"2025-04-23T04:51:03.237Z\",\"appointment_id\":2037,\"visitor_id\":1038,\"purpose_of_visit\":\"Donations\",\"population_count\":\"12\",\"preferred_date\":\"2025-04-24\",\"preferred_time\":\"Flexible\",\"additional_notes\":\"Test\"},\"message\":\"a visitor has successfully created an appoinment.\"}', 5, '2025-04-23 04:51:03'),
(31, 'create', 'Invitation', 13, '{\"new\":{\"isUsed\":false,\"id\":13,\"email\":\"labayanrenz@gmail.com\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"contact_number\":\"09123456789\",\"token\":\"6cdfe487-6fde-4872-a53b-cb79619f035c\",\"expiresAt\":\"2025-04-30T14:16:53.312Z\",\"role\":\"admin\",\"position\":\"Test\",\"updatedAt\":\"2025-04-23T14:16:53.315Z\",\"createdAt\":\"2025-04-23T14:16:53.315Z\"},\"message\":\"An invitation was created and added to the Invitation table\"}', 1, '2025-04-23 14:16:56'),
(32, 'create', 'Credential', 13, '{\"new\":{\"creation_date\":\"2025-04-23T14:18:52.280Z\",\"modified_date\":\"2025-04-23T14:18:52.280Z\",\"id\":13,\"first_name\":\"Test\",\"last_name\":\"Test\",\"email\":\"labayanrenz@gmail.com\",\"password\":\"$2b$10$WuGaFLUuL9uYHbvOLH0U1umDbPPR0yoLmNxWpsN1B28SIppmiXSqW\",\"role\":\"admin\",\"position\":\"Test\",\"contact_number\":\"09123456789\"},\"message\":\"User labayanrenz@gmail.com has successfully completed registration.\"}', 5, '2025-04-23 14:18:52'),
(33, 'create', 'Invitation', 14, '{\"new\":{\"isUsed\":false,\"id\":14,\"email\":\"labayanrenz@gmail.com\",\"first_name\":\"Renz\",\"last_name\":\"Labayan\",\"contact_number\":\"0912456732423\",\"token\":\"f229b4d3-6522-4482-867a-a8f2c946af5d\",\"expiresAt\":\"2025-05-08T09:26:16.008Z\",\"role\":\"admin\",\"position\":\"Test\",\"updatedAt\":\"2025-05-01T09:26:16.009Z\",\"createdAt\":\"2025-05-01T09:26:16.009Z\"},\"message\":\"An invitation was created and added to the Invitation table\"}', 1, '2025-05-01 09:26:18'),
(34, 'delete', 'Invitation', 14, '{\"previous\":{\"id\":14,\"email\":\"labayanrenz@gmail.com\",\"first_name\":\"Renz\",\"last_name\":\"Labayan\",\"contact_number\":\"0912456732423\",\"token\":\"f229b4d3-6522-4482-867a-a8f2c946af5d\",\"expiresAt\":\"2025-05-08T09:26:16.000Z\",\"isUsed\":false,\"role\":\"admin\",\"position\":\"Test\",\"createdAt\":\"2025-05-01T09:26:16.000Z\",\"updatedAt\":\"2025-05-01T09:26:16.000Z\"},\"message\":\"Invitation with ID 14 was hard deleted from the Invitation table\"}', 1, '2025-05-01 09:27:38'),
(35, 'create', 'Invitation', 15, '{\"new\":{\"isUsed\":false,\"id\":15,\"email\":\"labayanrenz@gmail.com\",\"first_name\":\"labayan\",\"last_name\":\"renz\",\"contact_number\":\"1234567890\",\"token\":\"8d23d38c-6e12-4de3-a8dd-93b77f348c09\",\"expiresAt\":\"2025-05-13T08:56:18.732Z\",\"role\":\"admin\",\"position\":\"Test\",\"updatedAt\":\"2025-05-06T08:56:18.733Z\",\"createdAt\":\"2025-05-06T08:56:18.733Z\"},\"message\":\"An invitation was created and added to the Invitation table\"}', 1, '2025-05-06 08:56:21'),
(36, 'create', 'Credential', 14, '{\"new\":{\"creation_date\":\"2025-05-06T08:57:08.849Z\",\"modified_date\":\"2025-05-06T08:57:08.849Z\",\"id\":14,\"first_name\":\"labayan\",\"last_name\":\"renz\",\"email\":\"labayanrenz@gmail.com\",\"password\":\"$2b$10$PDI8lFswU.ptOMwkN.2PoeT45azluhgzL1BZLOkXunwzr0AdghTVa\",\"role\":\"admin\",\"position\":\"Test\",\"contact_number\":\"1234567890\"},\"message\":\"User labayanrenz@gmail.com has successfully completed registration.\"}', 5, '2025-05-06 08:57:08');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `schedule_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `availability` enum('SHARED','EXCLUSIVE') NOT NULL DEFAULT 'SHARED',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` enum('ACTIVE','COMPLETED') NOT NULL DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`schedule_id`, `title`, `description`, `date`, `start_time`, `end_time`, `availability`, `createdAt`, `updatedAt`, `status`) VALUES
(1, 'Test', 'This us a testing for schedule', '2025-05-02', '09:00:00', '10:00:00', 'SHARED', '2025-04-30 19:46:58', '2025-05-04 05:42:46', 'COMPLETED'),
(2, 'Test', 'Test event for testing', '2025-05-04', '09:00:00', '10:00:00', 'SHARED', '2025-05-04 07:03:53', '2025-05-04 07:04:03', 'COMPLETED'),
(3, 'Test again', 'again huhu', '2025-05-04', '09:00:00', '10:00:00', 'SHARED', '2025-05-04 07:10:04', '2025-05-04 07:12:44', 'COMPLETED'),
(4, 'Test', 'Test', '2025-05-04', '09:00:00', '10:00:00', 'SHARED', '2025-05-04 07:30:52', '2025-05-04 07:30:58', 'COMPLETED'),
(5, 'cxbdf', 'gewgwegtg', '2025-05-14', '09:00:00', '10:00:00', 'SHARED', '2025-05-13 16:37:31', '2025-05-13 16:37:31', 'ACTIVE'),
(6, 'gewgw', 'wegweg', '2025-05-14', '09:30:00', '10:00:00', 'SHARED', '2025-05-13 16:37:41', '2025-05-13 16:37:41', 'ACTIVE'),
(7, 'fasfa', 'fasfa', '2025-05-14', '09:00:00', '10:00:00', 'SHARED', '2025-05-13 16:37:51', '2025-05-13 16:38:01', 'COMPLETED'),
(8, 'Test', 'This is a test for schedule', '2025-05-16', '09:00:00', '10:00:00', 'SHARED', '2025-05-16 14:55:30', '2025-05-16 14:55:30', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `credential_id` int(11) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `credential_id`, `status`, `creation_date`, `modified_date`) VALUES
(1, 1, 'inactive', '2025-03-30 10:37:21', '2025-05-17 05:10:56'),
(2, 2, 'inactive', '2025-03-30 11:47:33', '2025-05-15 05:58:13'),
(3, 3, 'inactive', '2025-03-31 09:29:06', '2025-05-14 16:20:37'),
(4, 4, 'inactive', '2025-04-19 15:10:07', '2025-04-19 15:13:48'),
(11, 12, 'inactive', '2025-04-19 18:12:00', '2025-04-19 18:12:00'),
(13, 14, 'inactive', '2025-05-06 08:57:08', '2025-05-06 09:07:53');

-- --------------------------------------------------------

--
-- Table structure for table `visitor`
--

CREATE TABLE `visitor` (
  `visitor_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `organization` varchar(150) DEFAULT NULL,
  `province` varchar(100) NOT NULL,
  `barangay` varchar(100) NOT NULL,
  `city_municipality` varchar(100) NOT NULL,
  `street` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitor`
--

INSERT INTO `visitor` (`visitor_id`, `first_name`, `last_name`, `email`, `phone`, `organization`, `province`, `barangay`, `city_municipality`, `street`) VALUES
(1, 'louis@gmail.com', 'louis@gmail.com', 'louis@gmail.com', '12312', 'louis@gmail.com', 'Ilocos Norte', 'Adams', 'Adams', 'louis@gmail.com'),
(2, 'louis@gmail.com', 'louis@gmail.com', 'louis@gmail.com', '12312', 'louis@gmail.com', 'Ilocos Norte', 'Adams', 'Adams', 'louis@gmail.com'),
(3, 'Louis', 'Ricafrente', 'louis@gmail.com', '+639123456789', '123', 'Batanes', 'Uvoy ', 'Mahatao', '123324'),
(4, 'Louis Michael', 'Ricafrente', 'louis@gmail.com', '09056686509', 'cnsc', 'Ilocos Sur', 'Bagbagotot', 'Banayoyo', '1213'),
(5, 'Louis Michael', 'Ricafrente', 'louis@gmai.com', '123', '123', 'Ilocos Sur', 'Bato', 'Cabugao', '123'),
(6, '1231', '23', 'louis@gmail.com', '123', '123', 'Ilocos Sur', 'An-annam', 'Bantay', '123'),
(7, '1231', '23', 'louis@gmai.com', '', '123', 'Ilocos Norte', 'Adams', 'Adams', '123'),
(8, '123', '123', 'louis@gmial.com', '123', '123', 'Ilocos Sur', 'Banbanaal', 'Banayoyo', '23'),
(9, '123', '123', 'louis@gmail.com', '123', '123', 'Ilocos Norte', 'Baay', 'City of Batac', '123'),
(10, 'Louis', ' Ricafrente', 'louis@gmail.com', '123', '123', 'Ilocos Norte', 'Adams', 'Adams', '123'),
(11, 'jeff', 'talagtag', 'jeff@gmail.com', '123', '123', 'Ilocos Sur', 'Bessang', 'Burgos', '123'),
(12, '123', '123', '123@gmail.com', '09123456789', '123', 'Ilocos Sur', 'Balaleng', 'Bantay', '123'),
(13, '123123', '13', 'louis@gmail.com', '09056686509', 'asdh1', 'Ilocos Norte', 'Alogoog', 'Badoc', '132'),
(14, '1231', '123', 'louis@gmail.com', '09056686509', '123', 'Ilocos Sur', 'Baclig ', 'Cabugao', '123'),
(15, '1312', '123', '123@gmail.com', '09056686509', '123', 'Ilocos Sur', 'Aragan', 'Cabugao', '123'),
(16, 'Jen', 'Ricafrente', 'jen@gmail.com', '09056686509', '123', 'Ilocos Sur', 'Aggay', 'Bantay', '123'),
(17, 'Allen', 'Mateo', 'allen@gmail.com', '09074343119', '123', 'Pangasinan', 'Baybay', 'Aguilar', '123'),
(18, 'Louis', '123', '123@gmail.com', '09123456789', '123', 'Ilocos Sur', 'Casilagan Norte', 'Banayoyo', '123'),
(19, '123try', '123', '123@gmail.com', '09123456789', '123', 'La Union', 'Basca', 'Aringay', '123'),
(20, '123', '123', '123@gmail.comn', '09123456789', '123', 'Ilocos Sur', 'Bisangol', 'Banayoyo', '123'),
(21, '123', '123', '13@gmail.com', '09123456897', '123', 'Ilocos Norte', 'Bani', 'Bacarra', '123'),
(22, '123trytry', '123', '1123@gmail.com', '09123456789', '123', 'Pangasinan', 'Baybay', 'Aguilar', '123'),
(100, 'Juan', 'Dela Cruz', 'juan@example.com', '09123456789', 'ABC Corporation', 'Metro Manila', 'Barangay 123', 'Quezon City', '123 Main St'),
(101, 'Maria', 'Santos', 'maria@example.com', '09234567890', 'XYZ University', 'Cebu', 'Barangay 456', 'Cebu City', '456 College Ave'),
(102, 'Pedro', 'Reyes', 'pedro@example.com', '09345678901', 'LMN School', 'Davao', 'Barangay 789', 'Davao City', '789 School Rd'),
(103, 'Ana', 'Garcia', 'ana@example.com', '09456789012', 'DEF Company', 'Rizal', 'Barangay 101', 'Antipolo', '101 Corporate Blvd'),
(104, 'Jose', 'Mendoza', 'jose@example.com', '09567890123', 'GHI Organization', 'Laguna', 'Barangay 202', 'Santa Rosa', '202 Community Ave'),
(105, 'Sofia', 'Lopez', 'sofia@example.com', '09678901234', 'JKL Group', 'Batangas', 'Barangay 303', 'Batangas City', '303 Business Park'),
(106, 'Carlos', 'Manalo', 'carlos@example.com', '09789012345', 'PQR Institute', 'Pampanga', 'Barangay 404', 'Angeles City', '404 Research Ave'),
(1001, 'Liam', 'Anderson', 'liam.anderson@example.com', '+63 912 345 6789', 'National Museum', 'Metro Manila', 'San Lorenzo', 'Makati City', '123 Main Street'),
(1033, '123try now', '123', '123@gmail.com', '09123456789', '123', 'La Union', 'Bacqui', 'Bacnotan', '123'),
(1034, 'Jeff', 'Marcilla', 'jeffersontalagtag06@gmail.com', '09054163430', 'CNSC', 'Pangasinan', 'Baybay', 'Aguilar', '132'),
(1035, 'Plaeas', 'Afjnbwuhj', 'bikb@adsae.asfa', '09123456780', '34', 'La Union', 'Bacqui', 'Bacnotan', '3'),
(1036, 'Charlyn', 'Celeria', 'cha@email.com', '09054163430', 'CNSC', 'Camarines Sur', 'Santa Elena', 'Bula', '1'),
(1037, 'Test', 'Yes', 'asdkasjd@ajsdnajksd.asda', '09123456789', 'CNSC', 'Ilocos Sur', 'Balaleng', 'Bantay', '234'),
(1038, 'Jefferson', 'Talagtag', 'jeffersontalagtag06@gmail.com', '09054163430', 'CNSC', 'Ilocos Sur', 'Balaleng', 'Bantay', '12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `fk_appointment_visitor` (`visitor_id`);

--
-- Indexes for table `appointment_status`
--
ALTER TABLE `appointment_status`
  ADD PRIMARY KEY (`status_id`),
  ADD KEY `fk_appointment` (`appointment_id`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`article_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `artifacts`
--
ALTER TABLE `artifacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `artifact_description`
--
ALTER TABLE `artifact_description`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_artifactdescription_artifact` (`artifact_id`);

--
-- Indexes for table `contribution_type`
--
ALTER TABLE `contribution_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `credentials`
--
ALTER TABLE `credentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `donator`
--
ALTER TABLE `donator`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `duration_logs`
--
ALTER TABLE `duration_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_durationlogs_artifact` (`artifact_id`);

--
-- Indexes for table `form`
--
ALTER TABLE `form`
  ADD PRIMARY KEY (`id`),
  ADD KEY `donator_id` (`donator_id`),
  ADD KEY `contribution_id` (`contribution_id`);

--
-- Indexes for table `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `logging`
--
ALTER TABLE `logging`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `login_logs`
--
ALTER TABLE `login_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_login_logs_credential` (`credential_id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `credential_id` (`credential_id`);

--
-- Indexes for table `visitor`
--
ALTER TABLE `visitor`
  ADD PRIMARY KEY (`visitor_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2038;

--
-- AUTO_INCREMENT for table `appointment_status`
--
ALTER TABLE `appointment_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `artifacts`
--
ALTER TABLE `artifacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `artifact_description`
--
ALTER TABLE `artifact_description`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contribution_type`
--
ALTER TABLE `contribution_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `credentials`
--
ALTER TABLE `credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `donator`
--
ALTER TABLE `donator`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `duration_logs`
--
ALTER TABLE `duration_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `form`
--
ALTER TABLE `form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `logging`
--
ALTER TABLE `logging`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_logs`
--
ALTER TABLE `login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `visitor`
--
ALTER TABLE `visitor`
  MODIFY `visitor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1039;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `fk_appointment_visitor` FOREIGN KEY (`visitor_id`) REFERENCES `visitor` (`visitor_id`);

--
-- Constraints for table `appointment_status`
--
ALTER TABLE `appointment_status`
  ADD CONSTRAINT `fk_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`) ON DELETE CASCADE;

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `credentials` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `artifact_description`
--
ALTER TABLE `artifact_description`
  ADD CONSTRAINT `fk_artifactdescription_artifact` FOREIGN KEY (`artifact_id`) REFERENCES `artifacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `duration_logs`
--
ALTER TABLE `duration_logs`
  ADD CONSTRAINT `fk_durationlogs_artifact` FOREIGN KEY (`artifact_id`) REFERENCES `artifacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `form`
--
ALTER TABLE `form`
  ADD CONSTRAINT `form_ibfk_1` FOREIGN KEY (`donator_id`) REFERENCES `donator` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `form_ibfk_2` FOREIGN KEY (`contribution_id`) REFERENCES `contribution_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `logging`
--
ALTER TABLE `logging`
  ADD CONSTRAINT `logging_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `login_logs`
--
ALTER TABLE `login_logs`
  ADD CONSTRAINT `fk_login_logs_credential` FOREIGN KEY (`credential_id`) REFERENCES `credentials` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `credentials` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`credential_id`) REFERENCES `credentials` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
