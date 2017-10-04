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
-- Structure de la table `sentence`
--

CREATE TABLE IF NOT EXISTS `sentence` (
  `word_id` int(255) NOT NULL COMMENT 'word id #ref',
  `auto_id` int(255) NOT NULL AUTO_INCREMENT COMMENT 'auto id',
  `sentence` text COLLATE utf8_bin NOT NULL COMMENT 'sentence',
  PRIMARY KEY (`auto_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=73 ;

--
-- Contenu de la table `sentence`
--

INSERT INTO `sentence` (`word_id`, `auto_id`, `sentence`) VALUES
(1, 1, 'I love a cat.'),
(40, 10, 'What happen next ?'),
(39, 9, 'What happen with you last night'),
(39, 8, 'What happen next ?'),
(40, 11, 'What happen with you last night'),
(41, 12, 'What happen next ?'),
(41, 13, 'What happen with you last night'),
(42, 14, 'What happen next ?'),
(42, 15, 'What happen with you last night'),
(43, 16, 'What happen next ?'),
(43, 17, 'What happen with you last night'),
(44, 18, 'What happen next ?'),
(44, 19, 'What happen with you last night'),
(45, 20, 'What happen next ?'),
(45, 21, 'What happen with you last night'),
(46, 22, 'What happen next ?'),
(47, 23, 'What happen next ?'),
(48, 24, 'Congratulation to your success.'),
(48, 25, 'wow congratulation.'),
(49, 26, 'Are you like baby ?'),
(49, 27, 'I love a baby.'),
(52, 28, 'I believe you.'),
(52, 29, 'Are you believ me.'),
(54, 30, 'I have lost a key.'),
(54, 31, 'Whose key is this ?'),
(55, 32, 'if you never give up you will success.'),
(55, 33, 'i want to success.'),
(56, 34, 'I like to playing game computer.'),
(56, 35, 'What are you play.'),
(57, 36, ''),
(58, 37, ''),
(59, 38, 'The Google Student Ambassador Program is an opportunity for students to act as liaisons between Google and their universities'),
(60, 39, 'mbassadors are thrilled by new technology'),
(61, 40, ''),
(62, 41, ''),
(63, 42, ''),
(64, 43, ''),
(65, 44, ''),
(66, 45, ''),
(67, 46, ''),
(68, 47, ''),
(69, 48, ''),
(70, 49, ''),
(0, 50, ''),
(72, 51, 'Game is loading.'),
(76, 52, 'I like reading because i''m able to gain knowledge from doing so.'),
(77, 53, 'this book belongs to me.'),
(77, 54, 'you belongs with me.'),
(80, 55, 'Though it''s important to open yourself up to love and you can appreciate a new girl.'),
(80, 56, 'He gets annoying sometime. i still like him though'),
(82, 57, 'I''m excited to announce that we''ve agreed to acquire Oculus'),
(83, 58, 'For the past few years, this has mostly meant building mobile apps that help you share with the people you care about'),
(85, 59, 'Application of information technology to benefit.'),
(87, 60, 'Through optimization of the cost at the same time the government should take measures to facilitate imports of agricultural shortages.'),
(91, 61, 'Find a reason to smile every day.'),
(92, 62, 'Being a good person doesn''t culture. It depend your heart.'),
(96, 63, 'We were impressed because we love him.'),
(96, 64, 'The trips fun and very impressive.'),
(96, 65, 'Impressed with anyone who has seen this quite a bit.'),
(97, 66, 'Compliment little things about her.'),
(98, 67, 'Dress to impress.'),
(100, 68, 'What are your impression when you went to thailand.'),
(103, 69, 'he is terminating his project.'),
(104, 70, 'The Songkran festival is celebrated in Thailand'),
(105, 71, 'Let me choose.'),
(105, 72, 'What do you choose ?');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
