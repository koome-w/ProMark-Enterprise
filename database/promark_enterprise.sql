-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2025 at 03:13 PM
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
-- Database: `promark_enterprise`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `activity_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `activity` text DEFAULT NULL,
  `activity_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`activity_id`, `user_id`, `activity`, `activity_date`) VALUES
(1, 3, 'User logged in', '2025-10-22 14:35:50'),
(2, 3, 'User logged in', '2025-10-22 17:00:16'),
(3, 2, 'User logged in', '2025-10-22 17:00:48'),
(4, 5, 'User logged in', '2025-10-22 17:01:10'),
(5, 1, 'User logged in', '2025-10-22 17:09:14'),
(6, 1, 'User logged in', '2025-10-22 17:09:16'),
(7, 1, 'User logged in', '2025-10-22 17:09:20'),
(8, 1, 'User logged in', '2025-10-22 17:10:46'),
(9, 3, 'User logged in', '2025-10-22 17:23:44'),
(10, 3, 'User logged in', '2025-10-22 17:37:43'),
(11, 1, 'User logged in', '2025-10-22 17:38:55'),
(12, 3, 'User logged in', '2025-10-22 17:39:29'),
(13, 3, 'User logged in', '2025-10-22 18:13:31'),
(14, 3, 'User logged in', '2025-10-23 20:15:25'),
(15, 3, 'User logged in', '2025-10-23 20:48:26'),
(16, 3, 'User logged in', '2025-10-24 11:28:55'),
(17, 3, 'User logged in', '2025-10-24 11:34:41'),
(18, 3, 'User logged in', '2025-10-25 14:42:11'),
(19, 3, 'User logged in', '2025-10-25 16:03:04'),
(20, 3, 'User logged in', '2025-10-25 20:33:40'),
(21, 3, 'User logged in', '2025-10-25 23:14:03'),
(22, 3, 'User logged in', '2025-10-25 23:30:55'),
(23, 3, 'User logged in', '2025-10-26 14:51:54'),
(24, 3, 'User logged in', '2025-10-26 16:56:06'),
(25, 3, 'User logged in', '2025-10-26 17:10:34'),
(26, 2, 'User logged in', '2025-10-28 11:56:01'),
(27, 1, 'User logged in', '2025-10-29 09:07:42'),
(28, 1, 'User logged in', '2025-10-29 09:45:26'),
(29, 2, 'User logged in', '2025-10-29 11:46:34'),
(30, 1, 'User logged in', '2025-10-29 12:03:06'),
(31, 2, 'User logged in', '2025-10-29 18:37:14'),
(32, 3, 'User logged in', '2025-10-29 18:45:22'),
(33, 2, 'User logged in', '2025-10-29 22:47:22'),
(34, 3, 'User logged in', '2025-10-30 00:36:40'),
(35, 5, 'User logged in', '2025-10-30 00:44:52'),
(36, 5, 'User logged in', '2025-10-30 13:03:53'),
(37, 5, 'User logged in', '2025-10-30 13:26:06'),
(38, 3, 'User logged in', '2025-10-30 13:39:23'),
(39, 2, 'User logged in', '2025-10-30 13:49:10'),
(40, 1, 'User logged in', '2025-10-30 13:54:20'),
(41, 3, 'User logged in', '2025-10-30 14:09:58'),
(42, 2, 'User logged in', '2025-10-30 14:12:56'),
(43, 3, 'User logged in', '2025-10-30 14:14:16'),
(44, 2, 'User logged in', '2025-10-30 14:20:54'),
(45, 1, 'User logged in', '2025-10-30 15:16:58'),
(46, 1, 'User logged in', '2025-10-30 15:17:42'),
(47, 2, 'User logged in', '2025-10-30 16:01:54'),
(48, 2, 'User logged in', '2025-10-30 16:02:44'),
(49, 3, 'User logged in', '2025-10-30 16:03:18'),
(50, 3, 'User logged in', '2025-10-30 16:03:36'),
(51, 2, 'User logged in', '2025-10-30 16:03:55'),
(52, 3, 'User logged in', '2025-10-30 16:08:34'),
(53, 2, 'User logged in', '2025-10-30 16:11:43');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Mobile Phones'),
(2, 'Computers & Accessories'),
(3, 'Audio & Gadgets'),
(4, 'Cameras & Photography'),
(5, 'Networking Devices');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `reorder_level` int(11) DEFAULT 5,
  `price` decimal(10,2) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `date_added` datetime DEFAULT current_timestamp(),
  `last_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `category_id`, `quantity`, `reorder_level`, `price`, `supplier`, `date_added`, `last_updated`) VALUES
(1, 'Samsung Galaxy A15', 1, 45, 5, 24999.00, 'SmartTech Distributors', '2025-10-23 21:16:35', '2025-10-23 21:16:35'),
(2, 'HP Pavilion 15', 2, 18, 3, 86999.00, 'CompuWorld Suppliers', '2025-10-23 21:16:35', '2025-10-23 21:16:35'),
(3, 'Sony WH-1000XM4 Headphones', 3, 27, 4, 34999.00, 'SoundLab Kenya', '2025-10-23 21:16:35', '2025-10-23 21:16:35'),
(4, 'Logitech MX Master 3 Mouse', 3, 32, 5, 9999.00, 'TechGear Distributors', '2025-10-23 21:16:35', '2025-10-23 21:16:35'),
(5, 'Dell 24-inch Monitor', 2, 15, 2, 21999.00, 'DisplayPoint Ltd', '2025-10-23 21:16:35', '2025-10-23 21:16:35'),
(6, 'Anker Power Bank 20000mAh', 3, 52, 10, 5499.00, 'GadgetZone Africa', '2025-10-23 21:16:35', '2025-10-26 18:11:35'),
(7, 'Apple iPhone 14', 1, 10, 2, 139999.00, 'Apple Kenya Authorized', '2025-10-23 21:16:35', '2025-10-23 21:16:35'),
(8, 'Canon EOS 90D Camera', 4, 6, 2, 169999.00, 'PhotoPro Kenya', '2025-10-23 21:16:35', '2025-10-29 20:57:04'),
(9, 'TP-Link WiFi Router AC1200', 5, 23, 5, 6499.00, 'NetConnect Africa', '2025-10-23 21:16:35', '2025-10-26 18:03:14'),
(10, 'Seagate 1TB External HDD', 2, 38, 8, 7499.00, 'Storage Solutions Ltd', '2025-10-23 21:16:35', '2025-10-25 23:47:58'),
(12, 'Iphone 17 Air', 1, 9, 3, 215000.00, 'Iphone Store Kenya', '2025-10-24 13:26:27', '2025-10-26 18:40:32');

-- --------------------------------------------------------

--
-- Table structure for table `reorder_alerts`
--

CREATE TABLE `reorder_alerts` (
  `alert_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `current_stock` int(11) DEFAULT NULL,
  `reorder_level` int(11) DEFAULT NULL,
  `alert_status` enum('Pending','Resolved') DEFAULT 'Pending',
  `date_triggered` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reorder_alerts`
--

INSERT INTO `reorder_alerts` (`alert_id`, `product_id`, `current_stock`, `reorder_level`, `alert_status`, `date_triggered`) VALUES
(1, 8, 6, 2, 'Resolved', '2025-10-29 20:57:04');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `report_type` enum('Sales','Inventory','Reorder') DEFAULT NULL,
  `generated_by` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `generated_on` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `restock_logs`
--

CREATE TABLE `restock_logs` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity_added` int(11) DEFAULT NULL,
  `date_restocked` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restock_logs`
--

INSERT INTO `restock_logs` (`id`, `product_id`, `quantity_added`, `date_restocked`) VALUES
(1, 8, 4, '2025-10-29 20:57:04');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sales_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `quantity_sold` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `sales_date` datetime DEFAULT current_timestamp(),
  `recorded_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sales_id`, `product_id`, `user_id`, `quantity_sold`, `total_amount`, `sales_date`, `recorded_by`) VALUES
(1, 1, 1, 5, 49998.00, '2025-10-24 09:30:00', 'john'),
(2, 4, 5, 10, 9999.00, '2025-10-24 10:45:00', 'moe'),
(3, 7, 1, 15, 419997.00, '2025-10-24 12:10:00', 'john'),
(4, 9, 1, 25, 12998.00, '2025-10-24 13:05:00', 'John'),
(5, 3, 5, 19, 34999.00, '2025-10-24 14:40:00', 'Moe'),
(12, 9, NULL, 2, 12998.00, '2025-10-26 18:03:14', 'Jane'),
(13, 6, NULL, 1, 5499.00, '2025-10-26 18:07:33', 'Jane'),
(14, 6, NULL, 1, 5499.00, '2025-10-26 18:11:35', 'Jane'),
(15, 12, NULL, 7, 1505000.00, '2025-10-26 18:31:18', 'Moe'),
(16, 8, NULL, 6, 1019994.00, '2025-10-29 09:30:20', 'Mary');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Manager','Employee') DEFAULT 'Employee',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password`, `role`, `status`, `created_at`) VALUES
(1, 'John Doe', 'john@promark.com', 'e10adc3949ba59abbe56e057f20f883e', 'Employee', 'Active', '2025-10-22 12:52:41'),
(2, 'Mary Wanjiru', 'manager@promark.com', '0795151defba7a4b5dfa89170de46277', 'Manager', 'Active', '2025-10-22 12:52:41'),
(3, 'System Admin', 'admin@promark.com', '0192023a7bbd73250516f069df18b500', 'Admin', 'Active', '2025-10-22 12:52:41'),
(5, 'Ian Moe', 'moe@promark.com', 'e10adc3949ba59abbe56e057f20f883e', 'Employee', 'Active', '2025-10-22 16:37:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `reorder_alerts`
--
ALTER TABLE `reorder_alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `generated_by` (`generated_by`);

--
-- Indexes for table `restock_logs`
--
ALTER TABLE `restock_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sales_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reorder_alerts`
--
ALTER TABLE `reorder_alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `restock_logs`
--
ALTER TABLE `restock_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sales_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `reorder_alerts`
--
ALTER TABLE `reorder_alerts`
  ADD CONSTRAINT `reorder_alerts_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`generated_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `restock_logs`
--
ALTER TABLE `restock_logs`
  ADD CONSTRAINT `restock_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
