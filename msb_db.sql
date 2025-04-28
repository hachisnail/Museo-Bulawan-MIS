-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 28, 2025 at 09:40 AM
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
  `preferred_time` varchar(30) DEFAULT 'Flexible',
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `additional_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`appointment_id`, `visitor_id`, `purpose_of_visit`, `population_count`, `preferred_date`, `preferred_time`, `creation_date`, `additional_notes`) VALUES
(26, 12, 'Thesis or Dissertation Work', 123, '2025-04-17', 'Flexible', '2025-04-16 22:38:45', '123'),
(27, 19, 'School Field Trip', 123, '2025-04-25', '09:00-10:29', '2025-04-16 22:40:39', '123'),
(28, 12, 'Research', 123, '2025-04-24', 'Flexible', '2025-04-16 22:54:12', '123'),
(29, 20, 'School Field Trip', 123, '2025-04-24', '09:00-10:29', '0000-00-00 00:00:00', '123'),
(30, 21, 'Research', 123, '2025-05-02', 'Flexible', '0000-00-00 00:00:00', '123'),
(31, 22, 'Research', 123, '2025-03-31', 'Flexible', '2025-04-17 07:18:08', '123'),
(32, 12, 'Thesis or Dissertation Work', 123, '2025-05-02', 'Flexible', '2025-04-17 15:35:02', '123'),
(100, 100, 'Company Tour', 5, '2025-05-01', '09:00 AM', '2025-04-10 06:30:00', 'We want to explore the museum exhibits'),
(101, 101, 'School Field Trip', 30, '2025-05-10', '10:00 AM', '2025-04-11 01:15:00', 'Our students are studying Philippine history'),
(102, 102, 'Research Project', 2, '2025-05-15', '02:00 PM', '2025-04-12 03:45:00', 'Need to examine artifacts for thesis'),
(103, 103, 'Corporate Team Building', 15, '2025-05-20', '01:00 PM', '2025-04-13 08:20:00', 'Looking for cultural immersion activity'),
(104, 104, 'Personal Visit', 3, '2025-06-01', '11:00 AM', '2025-04-14 02:10:00', 'Interested in the indigenous art collection'),
(105, 105, 'Photography Session', 2, '2025-06-05', '03:00 PM', '2025-04-15 05:25:00', 'Want to document the architecture'),
(106, 106, 'Research Visit', 4, '2025-05-05', '09:30 AM', '2025-04-16 00:45:00', 'Studying pre-colonial artifacts'),
(107, 106, 'Student Orientation', 25, '2025-05-20', '10:30 AM', '2025-04-16 01:00:00', 'Introducing students to Filipino culture'),
(108, 106, 'Documentary Filming', 8, '2025-06-10', '02:30 PM', '2025-04-16 01:15:00', 'Creating educational content'),
(109, 106, 'Expert Consultation', 3, '2025-06-25', '01:30 PM', '2025-04-16 01:30:00', 'Need expertise on artifact restoration'),
(110, 106, 'Workshop', 15, '2025-07-05', '11:00 AM', '2025-04-16 01:45:00', 'Traditional crafts demonstration'),
(2001, 1001, 'Perlas ng silanganan', 10, '2024-03-15', '09:00:00', '2024-02-19 01:30:00', 'Special exhibit viewing'),
(2002, 1001, 'kutsara', 50, '2024-03-16', '13:00:00', '2024-02-19 02:15:00', 'Historical utensils research'),
(2003, 1001, '160 years old filipiniana', 15, '2024-03-17', '10:00:00', '2024-02-19 03:45:00', 'Archival access needed'),
(2019, 1033, 'Research', 123, '2025-04-24', 'Flexible', '2025-04-18 09:44:56', '123'),
(2020, 3, 'Thesis or Dissertation Work', 123, '2025-04-10', 'Flexible', '2025-04-19 15:22:33', '123'),
(2021, 3, 'Thesis or Dissertation Work', 3, '2025-04-01', 'Flexible', '2025-04-19 15:26:31', ''),
(2022, 3, 'Thesis or Dissertation Work', 342, '2025-04-15', 'Flexible', '2025-04-19 15:28:34', ''),
(2023, 3, 'Thesis or Dissertation Work', 324, '2025-04-15', 'Flexible', '2025-04-19 15:30:36', ''),
(2024, 3, 'School Field Trip', 423, '2025-04-16', '09:00-10:29', '2025-04-19 15:34:01', ''),
(2025, 3, 'Workshops or Classes', 34, '2025-04-14', '01:00-02:29', '2025-04-19 15:36:33', '32423'),
(2026, 3, 'Thesis or Dissertation Work', 324, '2025-04-14', 'Flexible', '2025-04-19 15:38:21', '4324'),
(2027, 3, 'Thesis or Dissertation Work', 324, '2025-04-22', 'Flexible', '2025-04-19 15:42:37', '234'),
(2028, 3, 'Research', 3422, '2025-04-08', 'Flexible', '2025-04-19 15:45:32', '4234'),
(2029, 3, 'Thesis or Dissertation Work', 342, '2025-04-14', 'Flexible', '2025-04-19 15:48:49', '234234'),
(2030, 3, 'Workshops or Classes', 342, '2025-04-22', '10:30-11:59', '2025-04-19 15:50:47', '234'),
(2031, 3, 'Thesis or Dissertation Work', 32, '2025-04-14', 'Flexible', '2025-04-19 16:01:10', '234'),
(2032, 3, 'Thesis or Dissertation Work', 32, '2025-04-08', 'Flexible', '2025-04-19 16:03:21', '23423'),
(2033, 1034, 'Donations', 2, '2025-04-15', 'Flexible', '2025-04-19 18:18:15', ''),
(2034, 1035, 'Donations', 234, '2025-04-16', 'Flexible', '2025-04-19 18:20:50', ''),
(2035, 1036, 'Photography or Media Projects', 1, '2025-04-22', 'Flexible', '2025-04-19 20:26:23', 'i love history XD'),
(2036, 1037, 'Donations', 1, '2025-04-23', 'Flexible', '2025-04-22 06:31:59', ''),
(2037, 1038, 'Donations', 12, '2025-04-24', 'Flexible', '2025-04-23 04:51:03', 'Test');

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
(4, 29, '', 10, '2025-04-23 04:30:20'),
(5, 30, 'Completed', 123, '2025-04-23 14:26:42'),
(6, 31, 'Confirmed', 123, '2025-04-19 14:42:19'),
(7, 32, 'Failed', 12, '2025-04-19 08:00:00'),
(100, 100, 'Failed', 21, '2025-04-19 20:31:35'),
(101, 101, 'Confirmed', 30, '2025-04-23 04:31:11'),
(102, 102, 'To_Review', 45, '2025-04-19 14:03:16'),
(103, 103, 'To_Review', 15, '2025-04-18 17:53:57'),
(104, 104, '', 1, '2025-04-19 14:38:17'),
(105, 105, 'Rejected', 12, '2025-04-19 19:33:03'),
(106, 106, 'Confirmed', 4, '2025-04-18 11:29:53'),
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
(118, 2028, '', NULL, '2025-04-28 06:55:57');

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

INSERT INTO `articles` (`article_id`, `title`, `user_id`, `upload_date`, `images`, `article_category`, `description`, `author`, `address`, `status`, `upload_period_start`, `upload_period_end`, `created_at`, `updated_at`) VALUES
(1, 'Museom First Article', 1, '2025-04-23 00:00:00', NULL, 'Other', '<p>Test</p>', 'Jefferson', 'F. Pimentel St.', 'pending', NULL, NULL, '2025-04-26 10:52:20', '2025-04-26 10:52:20');

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
  `duration_id` int(11) NOT NULL,
  `description_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(13, 'Test', 'Test', 'labayanrenz@gmail.com', '09123456789', '$2b$10$WuGaFLUuL9uYHbvOLH0U1umDbPPR0yoLmNxWpsN1B28SIppmiXSqW', 'Test', 'admin', '2025-04-23 14:18:52', '2025-04-23 14:18:52');

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
  `display_start` timestamp NULL DEFAULT NULL
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
(13, 'labayanrenz@gmail.com', 'Test', 'Test', '09123456789', '6cdfe487-6fde-4872-a53b-cb79619f035c', '2025-04-30 14:16:53', 1, 'admin', 'Test', '2025-04-23 14:16:53', '2025-04-23 14:18:52');

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
  `last_login` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start` timestamp NULL DEFAULT NULL,
  `end` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_logs`
--

INSERT INTO `login_logs` (`id`, `credential_id`, `last_login`, `start`, `end`) VALUES
(1, 1, '2025-03-30 11:43:33', '2025-03-29 16:00:00', '2025-03-29 16:00:00'),
(2, 1, '2025-03-30 11:43:33', '2025-03-29 16:00:00', '2025-03-29 16:00:00'),
(3, 1, '2025-03-30 11:46:46', '2025-03-29 16:00:00', '2025-03-29 16:00:00'),
(9, 2, '2025-03-30 12:08:06', '2025-03-29 16:00:00', '2025-03-29 16:00:00'),
(10, 1, '2025-03-30 12:10:20', '2025-03-29 16:00:00', '2025-03-29 16:00:00'),
(11, 1, '2025-03-30 12:13:37', '2025-03-30 12:13:25', '2025-03-30 12:13:37'),
(12, 2, '2025-03-30 12:15:56', '2025-03-30 12:15:43', '2025-03-30 12:15:56'),
(13, 2, '2025-03-30 12:21:38', '2025-03-30 12:21:08', '2025-03-30 12:21:38'),
(19, 1, '2025-03-30 12:31:06', '2025-03-30 12:30:53', '2025-03-30 12:31:06'),
(20, 2, '2025-03-30 12:32:48', '2025-03-30 12:32:43', '2025-03-30 12:32:48'),
(21, 1, '2025-03-30 12:33:20', '2025-03-30 12:33:18', '2025-03-30 12:33:20'),
(22, 2, '2025-03-30 12:33:33', '2025-03-30 12:33:22', '2025-03-30 12:33:33'),
(23, 2, '2025-03-31 01:47:17', '2025-03-31 01:46:59', '2025-03-31 01:47:17'),
(24, 2, '2025-03-31 02:13:18', '2025-03-31 02:13:04', '2025-03-31 02:13:18'),
(25, 1, '2025-03-31 09:51:42', '2025-03-31 02:28:22', '2025-03-31 09:51:42'),
(26, 1, '2025-03-31 04:59:34', '2025-03-31 04:29:37', '2025-03-31 04:59:34'),
(27, 2, '2025-03-31 05:03:58', '2025-03-31 05:03:55', '2025-03-31 05:03:58'),
(28, 1, '2025-03-31 05:04:16', '2025-03-31 05:04:03', '2025-03-31 05:04:16'),
(29, 2, '2025-03-31 05:04:43', '2025-03-31 05:04:19', '2025-03-31 05:04:43'),
(31, 2, '2025-04-18 11:30:00', '2025-03-31 05:57:51', '2025-04-18 11:30:00'),
(32, 1, '2025-03-31 07:52:13', '2025-03-31 07:19:10', '2025-03-31 07:52:13'),
(33, 2, '2025-03-31 07:52:21', '2025-03-31 07:52:16', '2025-03-31 07:52:21'),
(34, 1, '2025-03-31 08:08:52', '2025-03-31 07:52:24', '2025-03-31 08:08:52'),
(35, 2, '2025-03-31 08:09:09', '2025-03-31 08:08:55', '2025-03-31 08:09:09'),
(36, 1, '2025-03-31 08:09:18', '2025-03-31 08:09:13', '2025-03-31 08:09:18'),
(37, 2, '2025-03-31 08:09:27', '2025-03-31 08:09:21', '2025-03-31 08:09:27'),
(38, 1, '2025-03-31 08:24:29', '2025-03-31 08:09:30', '2025-03-31 08:24:29'),
(39, 2, '2025-03-31 08:24:55', '2025-03-31 08:24:46', '2025-03-31 08:24:55'),
(40, 1, '2025-03-31 08:33:06', '2025-03-31 08:24:57', '2025-03-31 08:33:06'),
(41, 1, '2025-03-31 08:34:21', '2025-03-31 08:33:08', '2025-03-31 08:34:21'),
(42, 1, '2025-03-31 09:09:31', '2025-03-31 08:34:24', '2025-03-31 09:09:31'),
(43, 2, '2025-03-31 09:28:59', '2025-03-31 09:09:34', '2025-03-31 09:28:59'),
(44, 3, '2025-03-31 09:29:17', '2025-03-31 09:29:06', '2025-03-31 09:29:17'),
(45, 1, '2025-03-31 09:29:46', '2025-03-31 09:29:37', '2025-03-31 09:29:45'),
(46, 3, '2025-03-31 09:31:16', '2025-03-31 09:30:32', '2025-03-31 09:31:16'),
(47, 1, '2025-03-31 09:39:36', '2025-03-31 09:31:19', '2025-03-31 09:39:36'),
(48, 3, '2025-03-31 09:43:55', '2025-03-31 09:39:45', '2025-03-31 09:43:55'),
(49, 3, '2025-03-31 09:47:12', '2025-03-31 09:44:11', '2025-03-31 09:47:12'),
(50, 3, '2025-03-31 09:50:57', '2025-03-31 09:47:19', '2025-03-31 09:50:57'),
(51, 3, '2025-03-31 09:52:02', '2025-03-31 09:51:50', '2025-03-31 09:52:02'),
(52, 1, '2025-03-31 10:04:21', '2025-03-31 09:52:05', '2025-03-31 10:04:21'),
(53, 1, '2025-04-12 12:54:39', '2025-04-11 15:47:35', '2025-04-12 12:54:39'),
(54, 1, '2025-04-12 14:28:38', '2025-04-12 12:54:50', '2025-04-12 14:28:38'),
(55, 1, '2025-04-13 02:01:43', '2025-04-12 14:28:42', '2025-04-13 02:01:43'),
(56, 1, '2025-04-13 02:04:05', '2025-04-13 02:01:50', '2025-04-13 02:04:05'),
(57, 1, '2025-04-17 06:36:24', '2025-04-13 02:17:33', '2025-04-17 06:36:24'),
(58, 1, '2025-04-17 07:44:19', '2025-04-17 07:40:09', '2025-04-17 07:44:19'),
(59, 1, '2025-04-17 14:09:56', '2025-04-17 08:18:40', '2025-04-17 14:09:56'),
(60, 1, '2025-04-17 14:10:24', '2025-04-17 14:10:00', '2025-04-17 14:10:24'),
(61, 1, '2025-04-18 11:30:00', '2025-04-17 14:10:53', '2025-04-18 11:30:00'),
(62, 1, '2025-04-18 18:28:06', '2025-04-18 14:28:11', '2025-04-18 18:28:06'),
(63, 1, '2025-04-19 06:50:00', '2025-04-18 18:30:06', '2025-04-19 06:50:00'),
(64, 1, '2025-04-19 15:10:25', '2025-04-19 13:24:00', '2025-04-19 15:10:25'),
(65, 4, '2025-04-19 15:13:48', '2025-04-19 15:10:30', '2025-04-19 15:13:48'),
(66, 1, '2025-04-19 17:48:53', '2025-04-19 15:13:51', '2025-04-19 17:48:53'),
(67, 1, '2025-04-19 20:34:14', '2025-04-19 17:50:09', '2025-04-19 20:34:14'),
(68, 1, '2025-04-19 20:39:38', '2025-04-19 20:38:58', '2025-04-19 20:39:38'),
(69, 2, '2025-04-19 20:39:31', '2025-04-19 20:39:22', '2025-04-19 20:39:31'),
(70, 1, '2025-04-21 07:30:00', '2025-04-19 20:39:43', '2025-04-21 07:30:00'),
(71, 1, '2025-04-21 07:30:40', '2025-04-21 07:30:20', '2025-04-21 07:30:40'),
(72, 1, '2025-04-21 11:12:53', '2025-04-21 10:14:18', '2025-04-21 11:12:53'),
(73, 1, '2025-04-21 11:13:03', '2025-04-21 11:12:56', '2025-04-21 11:13:03'),
(74, 1, '2025-04-22 05:33:01', '2025-04-22 04:13:38', '2025-04-22 05:33:01'),
(75, 2, '2025-04-22 04:21:26', '2025-04-22 04:21:12', '2025-04-22 04:21:26'),
(76, 3, '2025-04-22 04:22:15', '2025-04-22 04:21:53', '2025-04-22 04:22:15'),
(77, 3, '2025-04-22 05:14:30', '2025-04-22 05:14:19', '2025-04-22 05:14:30'),
(78, 2, '2025-04-22 05:23:00', '2025-04-22 05:22:51', '2025-04-22 05:23:00'),
(79, 1, '2025-04-22 06:31:12', '2025-04-22 05:33:15', '2025-04-22 06:31:12'),
(80, 1, '2025-04-22 06:39:47', '2025-04-22 06:32:03', '2025-04-22 06:39:46'),
(81, 1, '2025-04-22 07:07:42', '2025-04-22 06:39:49', '2025-04-22 07:07:42'),
(82, 3, '2025-04-22 06:40:37', '2025-04-22 06:40:24', '2025-04-22 06:40:37'),
(83, 3, '2025-04-22 06:46:43', '2025-04-22 06:46:35', '2025-04-22 06:46:43'),
(84, 2, '2025-04-22 06:58:26', '2025-04-22 06:58:16', '2025-04-22 06:58:26'),
(85, 1, '2025-04-23 03:40:00', '2025-04-22 07:07:44', '2025-04-23 03:40:00'),
(86, 2, '2025-04-23 03:38:10', '2025-04-23 03:37:44', '2025-04-23 03:38:10'),
(87, 2, '2025-04-23 13:50:00', '2025-04-23 04:18:54', '2025-04-23 13:50:00'),
(88, 1, '2025-04-23 04:50:13', '2025-04-23 04:28:06', '2025-04-23 04:50:13'),
(89, 1, '2025-04-23 13:50:00', '2025-04-23 04:51:15', '2025-04-23 13:50:00'),
(90, 13, '2025-04-23 14:19:19', '2025-04-23 14:19:09', '2025-04-23 14:19:19'),
(91, 1, '2025-04-23 14:38:42', '2025-04-23 14:26:34', '2025-04-23 14:38:42'),
(92, 1, '2025-04-24 11:30:00', '2025-04-23 14:44:16', '2025-04-24 11:30:00'),
(93, 1, '2025-04-26 10:45:58', '2025-04-26 06:46:02', '2025-04-26 10:45:58'),
(94, 1, '2025-04-26 11:34:52', '2025-04-26 10:46:11', '2025-04-26 11:34:52'),
(95, 1, '2025-04-26 12:03:00', '2025-04-26 11:34:57', '2025-04-26 12:03:00'),
(96, 1, '2025-04-27 16:30:19', '2025-04-27 16:27:31', '2025-04-27 16:30:19'),
(97, 1, '2025-04-28 06:55:00', '2025-04-28 02:55:04', '2025-04-28 06:55:00'),
(98, 1, '2025-04-28 06:55:05', '2025-04-28 06:55:05', NULL);

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
(32, 'create', 'Credential', 13, '{\"new\":{\"creation_date\":\"2025-04-23T14:18:52.280Z\",\"modified_date\":\"2025-04-23T14:18:52.280Z\",\"id\":13,\"first_name\":\"Test\",\"last_name\":\"Test\",\"email\":\"labayanrenz@gmail.com\",\"password\":\"$2b$10$WuGaFLUuL9uYHbvOLH0U1umDbPPR0yoLmNxWpsN1B28SIppmiXSqW\",\"role\":\"admin\",\"position\":\"Test\",\"contact_number\":\"09123456789\"},\"message\":\"User labayanrenz@gmail.com has successfully completed registration.\"}', 5, '2025-04-23 14:18:52');

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
(1, 1, 'active', '2025-03-30 10:37:21', '2025-04-28 06:55:05'),
(2, 2, 'inactive', '2025-03-30 11:47:33', '2025-04-23 13:46:53'),
(3, 3, 'inactive', '2025-03-31 09:29:06', '2025-04-22 06:46:43'),
(4, 4, 'inactive', '2025-04-19 15:10:07', '2025-04-19 15:13:48'),
(11, 12, 'inactive', '2025-04-19 18:12:00', '2025-04-19 18:12:00'),
(12, 13, 'inactive', '2025-04-23 14:18:52', '2025-04-23 14:19:19');

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
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `artifacts`
--
ALTER TABLE `artifacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `artifact_description`
--
ALTER TABLE `artifact_description`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contribution_type`
--
ALTER TABLE `contribution_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `credentials`
--
ALTER TABLE `credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `logging`
--
ALTER TABLE `logging`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_logs`
--
ALTER TABLE `login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
