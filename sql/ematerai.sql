-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               5.7.24 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for ematerai
CREATE DATABASE IF NOT EXISTS `ematerai` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `ematerai`;

-- Dumping structure for table ematerai.contacts
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(13) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `type` enum('company','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.contacts: ~13 rows (approximately)
DELETE FROM `contacts`;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `phone`, `address`, `type`, `created_at`, `updated_at`) VALUES
	(20, 'Admin', 'Istrator', NULL, NULL, 'user', '2021-01-18 17:43:55', '2021-01-18 17:43:55');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;

-- Dumping structure for table ematerai.groups
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `level` tinyint(3) NOT NULL DEFAULT '0',
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.groups: ~2 rows (approximately)
DELETE FROM `groups`;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` (`id`, `name`, `level`, `description`) VALUES
	(1, 'Admin', 0, 'Administrator');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;

-- Dumping structure for table ematerai.login-attemps
CREATE TABLE IF NOT EXISTS `login-attemps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(50) DEFAULT NULL,
  `login` varchar(50) DEFAULT NULL,
  `time` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.login-attemps: ~0 rows (approximately)
DELETE FROM `login-attemps`;
/*!40000 ALTER TABLE `login-attemps` DISABLE KEYS */;
/*!40000 ALTER TABLE `login-attemps` ENABLE KEYS */;

-- Dumping structure for table ematerai.logs
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `activity` varchar(50) DEFAULT NULL,
  `content` text,
  `module` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.logs: ~181 rows (approximately)
DELETE FROM `logs`;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;

-- Dumping structure for table ematerai.province
CREATE TABLE IF NOT EXISTS `province` (
  `id` tinyint(2) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.province: ~34 rows (approximately)
DELETE FROM `province`;
/*!40000 ALTER TABLE `province` DISABLE KEYS */;
INSERT INTO `province` (`id`, `name`) VALUES
	(1, 'Aceh'),
	(2, 'Sumatera Utara'),
	(3, 'Sumatera Barat'),
	(4, 'Riau'),
	(5, 'Jambi'),
	(6, 'Sumatera Selatan'),
	(7, 'Bengkulu'),
	(8, 'Lampung'),
	(9, 'Kepulauan Bangka Belitung'),
	(10, 'Kepulauan Riau'),
	(11, 'DKI Jakarta'),
	(12, 'Jawa Barat'),
	(13, 'Jawa Tengah'),
	(14, 'DI Yogyakarta'),
	(15, 'Jawa Timur'),
	(16, 'Banten'),
	(17, 'Bali'),
	(18, 'Nusa Tenggara Barat'),
	(19, 'Nusa Tenggara Timur'),
	(20, 'Kalimantan Barat'),
	(21, 'Kalimantan Tengah'),
	(22, 'Kalimantan Selatan'),
	(23, 'Kalimantan Timur'),
	(24, 'Kalimantan Utara'),
	(25, 'Sulawesi Utara'),
	(26, 'Sulawesi Tengah'),
	(27, 'Sulawesi Selatan'),
	(28, 'Sulawesi Tenggara'),
	(29, 'Gorontalo'),
	(30, 'Sulawesi Barat'),
	(31, 'Maluku'),
	(32, 'Maluku Utara'),
	(33, 'Papua Barat'),
	(34, 'Papua');
/*!40000 ALTER TABLE `province` ENABLE KEYS */;

-- Dumping structure for table ematerai.quotas
CREATE TABLE IF NOT EXISTS `quotas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) NOT NULL,
  `quota` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_quotas_companies` (`contact_id`),
  CONSTRAINT `FK_quotas_companies` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.quotas: ~0 rows (approximately)
DELETE FROM `quotas`;
/*!40000 ALTER TABLE `quotas` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotas` ENABLE KEYS */;

-- Dumping structure for table ematerai.repositories
CREATE TABLE IF NOT EXISTS `repositories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `reference_doc` varchar(255) DEFAULT NULL,
  `raw_doc` varchar(255) DEFAULT NULL,
  `stamp` varchar(255) DEFAULT NULL,
  `final_doc` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` enum('RAW','SIGNED','CANCELED') DEFAULT 'RAW',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_repositories_users` (`user_id`),
  CONSTRAINT `FK_repositories_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.repositories: ~4 rows (approximately)
DELETE FROM `repositories`;
/*!40000 ALTER TABLE `repositories` DISABLE KEYS */;
/*!40000 ALTER TABLE `repositories` ENABLE KEYS */;

-- Dumping structure for table ematerai.settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.settings: ~0 rows (approximately)
DELETE FROM `settings`;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` (`id`, `key`, `value`) VALUES
	(1, 'STAMP_NOM', '10000');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;

-- Dumping structure for table ematerai.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) DEFAULT NULL,
  `login_token` varchar(50) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL COMMENT '$2a$10$JvMLC22zzWp5eb8W.oViueqnfUgF3TyTryZL47wQcoxl.xHZ/3iSK',
  `sa_user` varchar(200) DEFAULT NULL,
  `sa_pass` varchar(200) DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `activation_code` varchar(50) DEFAULT NULL,
  `forgotten_password_code` varchar(50) DEFAULT NULL,
  `forgotten_password_time` varchar(50) DEFAULT NULL,
  `quota_usage` int(5) DEFAULT '0',
  `quota_limit` int(5) DEFAULT '0',
  `quota_desc` varchar(50) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_users_contacts` (`contact_id`),
  CONSTRAINT `FK_users_contacts` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.users: ~1 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `contact_id`, `login_token`, `ip_address`, `username`, `password`, `sa_user`, `sa_pass`, `email`, `activation_code`, `forgotten_password_code`, `forgotten_password_time`, `quota_usage`, `quota_limit`, `quota_desc`, `active`, `last_login`, `created_at`, `updated_at`) VALUES
	(4, 20, NULL, NULL, NULL, '$2a$10$JvMLC22zzWp5eb8W.oViueqnfUgF3TyTryZL47wQcoxl.xHZ/3iSK', 'suryafajar_pos@gmail.com', '1', 'admin@admin.com', NULL, NULL, NULL, 0, 0, NULL, 1, NULL, '2021-01-18 17:39:26', '2021-02-08 22:34:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table ematerai.users_groups
CREATE TABLE IF NOT EXISTS `users_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_users_groups_groups` (`group_id`),
  KEY `FK_users_groups_users` (`user_id`),
  CONSTRAINT `FK_users_groups_groups` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_groups_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- Dumping data for table ematerai.users_groups: ~1 rows (approximately)
DELETE FROM `users_groups`;
/*!40000 ALTER TABLE `users_groups` DISABLE KEYS */;
INSERT INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
	(2, 4, 1);
/*!40000 ALTER TABLE `users_groups` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
