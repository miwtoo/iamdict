-- phpMyAdmin SQL Dump
-- version 3.5.8.2
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mar 15 Avril 2014 à 13:52
-- Version du serveur: 5.5.31
-- Version de PHP: 5.3.28

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `iamdictc_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `translate`
--

CREATE TABLE IF NOT EXISTS `translate` (
  `word_id` int(255) NOT NULL COMMENT 'word id #ref',
  `auto_id` int(255) NOT NULL AUTO_INCREMENT COMMENT 'auto id',
  `translate` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'translate',
  PRIMARY KEY (`auto_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=102 ;

--
-- Contenu de la table `translate`
--

INSERT INTO `translate` (`word_id`, `auto_id`, `translate`) VALUES
(1, 1, 'รัก'),
(1, 2, 'ความรัก'),
(40, 16, 'เกิดขึ้น'),
(39, 15, 'บังเอิญ'),
(39, 14, 'เกิดขึ้น'),
(40, 17, 'บังเอิญ'),
(41, 18, 'เกิดขึ้น'),
(41, 19, 'บังเอิญ'),
(42, 20, 'เกิดขึ้น'),
(42, 21, 'บังเอิญ'),
(43, 22, 'เกิดขึ้น'),
(43, 23, 'บังเอิญ'),
(44, 24, 'เกิดขึ้น'),
(44, 25, 'บังเอิญ'),
(45, 26, 'เกิดขึ้น'),
(45, 27, 'บังเอิญ'),
(46, 28, 'เกิดขึ้น'),
(46, 29, 'บังเอิญ'),
(47, 30, 'เกิดขึ้น'),
(47, 31, 'บังเอิญ'),
(48, 32, 'แสดงความยินดี'),
(48, 33, 'ยินดีด้วย'),
(49, 34, 'ทารก'),
(50, 35, 'หวัง'),
(50, 36, 'ต้องการ'),
(50, 37, 'ปรารถนา'),
(51, 38, 'รอ'),
(51, 39, 'รอคอย'),
(52, 40, 'เชื่อ'),
(52, 41, 'ไว้ใจ'),
(53, 42, 'ควบคุม'),
(53, 43, 'บังคับ'),
(54, 44, 'กุญแจ'),
(55, 45, 'สำเร็จ'),
(56, 46, 'เล่น'),
(57, 47, 'ลืม'),
(58, 48, 'ตระหนักถึง'),
(59, 49, 'โอกาศ'),
(60, 50, 'ตื่นตาตื่นใจ'),
(61, 51, 'กระตือรือร้น'),
(62, 52, 'คุ้นเคย'),
(63, 53, 'อาสาสมัคร'),
(64, 54, 'ตัดสินใจ'),
(65, 55, 'อุทิศ'),
(66, 56, 'แรงบันดาลใจ'),
(67, 57, 'ไพศาล'),
(68, 58, 'การเสริมสร้างศักยภาพ'),
(69, 59, 'พิสูจน์'),
(69, 60, 'ทดลอง'),
(70, 61, 'ฟหกฟก'),
(0, 62, 'ฟหกฟหก'),
(72, 63, 'โหลด'),
(73, 64, 'สวรรค์'),
(74, 65, 'โดยเฉพาะอย่างยิ่ง'),
(75, 66, 'แท้จริง'),
(76, 67, 'ได้รับ'),
(77, 68, '้เป็นของ'),
(78, 69, 'ปลอดภัย'),
(79, 70, 'ไม่ปลอดภัย'),
(80, 71, 'ถึงแม้ว่า'),
(81, 72, 'วัฒนธรรม'),
(82, 73, 'ประกาศ'),
(83, 74, 'ส่วนใหญ่'),
(84, 75, 'การจูงใจ'),
(85, 76, 'ประโยชน์'),
(86, 77, 'ประยุกต์'),
(86, 78, 'ประยุกต์ใช้'),
(87, 79, 'การเพิ่มประสิทธิภาพ'),
(88, 80, 'ตรวจสอบ'),
(89, 81, 'สถานการณ์'),
(90, 82, 'เดา'),
(90, 83, 'การคาดการณ์'),
(91, 84, 'การใช้เหตุผล'),
(92, 85, 'ขึ้นอยู่กับ'),
(93, 86, 'ศาสนา'),
(94, 87, 'ความสุข'),
(95, 88, 'ปรารถนา'),
(96, 89, 'ประทับใจ'),
(97, 90, 'ชม'),
(97, 91, 'ยกย่องชมเชย'),
(98, 92, 'แต่งตัว'),
(99, 93, 'มีเสน่ห์'),
(100, 94, 'ความประทับใจ'),
(101, 95, 'knowledge'),
(102, 96, 'ปัญหา'),
(103, 97, 'ยุติ'),
(103, 98, 'ยกเลิก'),
(104, 99, 'งานเทศกาล'),
(105, 100, 'เลือก'),
(106, 101, 'คำตอบ');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;