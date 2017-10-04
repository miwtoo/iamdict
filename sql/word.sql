-- phpMyAdmin SQL Dump
-- version 3.5.8.2
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mar 15 Avril 2014 à 13:51
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
-- Structure de la table `word`
--

CREATE TABLE IF NOT EXISTS `word` (
  `word_id` int(255) NOT NULL AUTO_INCREMENT COMMENT 'word id #ref',
  `user_id` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'user id #ref',
  `word` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'word',
  `type` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'word type Ex. verb',
  `created` varchar(10) COLLATE utf8_bin NOT NULL COMMENT 'created time',
  `update_data` varchar(10) COLLATE utf8_bin NOT NULL COMMENT 'update',
  `count_view` int(255) NOT NULL COMMENT 'count view',
  PRIMARY KEY (`word_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=107 ;

--
-- Contenu de la table `word`
--

INSERT INTO `word` (`word_id`, `user_id`, `word`, `type`, `created`, `update_data`, `count_view`) VALUES
(1, '1', 'love', 'verb', '1394990235', '1394990235', 0),
(40, '1', 'happen', 'varb', '1395120199', '1395120199', 0),
(53, '1', 'control', 'varb', '1395139416', '1395139416', 0),
(52, '1', 'believe', 'varb', '1395133170', '1395133170', 0),
(51, '1', 'wait', 'varb', '1395130133', '1395130133', 0),
(50, '1', 'wish', 'varb', '1395129860', '1395129860', 0),
(49, '1', 'baby', 'noun', '1395129284', '1395129284', 0),
(48, '1', 'congratulation', 'varb', '1395124275', '1395124275', 0),
(54, '1', 'key', 'noun', '1395215813', '1395215813', 0),
(55, '1', 'success', 'varb', '1395215940', '1395215940', 0),
(56, '1', 'play', 'verb', '1395304672', '1395304672', 0),
(57, '1', 'forget', 'verb', '1395374196', '1395374196', 0),
(58, '1', 'realise', 'verb', '1395375471', '1395375471', 0),
(59, '1', 'opportunity', 'verb', '1395376691', '1395376691', 0),
(60, '1', 'thrilled', 'verb', '1395376853', '1395376853', 0),
(61, '1', 'enthusiastic', 'verb', '1395376914', '1395376914', 0),
(62, '1', 'familiar', 'verb', '1395377110', '1395377110', 0),
(63, '', 'volunteer', 'verb', '1395384411', '1395384411', 0),
(64, '1', 'decided', 'verb', '1395386299', '1395386299', 0),
(65, '1', 'dedicate', 'verb', '1395386345', '1395386345', 0),
(66, '1', 'inspired', 'verb', '1395386509', '1395386509', 0),
(67, '1', 'expansive', 'verb', '1395386735', '1395386735', 0),
(68, '1', 'empowering', 'verb', '1395387148', '1395387148', 0),
(69, '1', 'prove', 'verb', '1395387256', '1395387256', 0),
(72, '1', 'load', 'verb', '1395470839', '1395470839', 0),
(73, '1', 'heaven', 'verb', '1395495079', '1395495079', 0),
(74, '1', 'especially', 'verb', '1395671751', '1395671751', 0),
(75, '1', 'actually', 'verb', '1395672217', '1395672217', 0),
(76, '1', 'gain', 'verb', '1395675026', '1395675026', 0),
(77, '1', 'belong', 'verb', '1395675109', '1395675109', 0),
(78, '1', 'secure', 'verb', '1395675472', '1395675472', 0),
(79, '1', 'insecure', 'verb', '1395675487', '1395675487', 0),
(80, '1', 'though', 'verb', '1395676782', '1395676782', 0),
(81, '1', 'culture', 'verb', '1395678564', '1395678564', 0),
(82, '1', 'announce', 'verb', '1395808428', '1395808428', 0),
(83, '1', 'mostly', 'verb', '1395808506', '1395808506', 0),
(84, '1', 'attracting', 'verb', '1395907680', '1395907680', 0),
(85, '1', 'benefit', 'verb', '1396024508', '1396024508', 0),
(86, '1', 'application', 'verb', '1396024529', '1396024529', 0),
(87, '1', 'optimization', 'verb', '1396025015', '1396025015', 0),
(88, '1', 'verify', 'verb', '1396581925', '1396581925', 0),
(89, '1', 'situation', 'noun', '1396584937', '1396584937', 0),
(90, '1', 'guess', 'verb', '1396622008', '1396622008', 0),
(91, '1', 'reason', 'noun', '1396672025', '1396672025', 0),
(92, '1', 'depend', 'verb', '1396926513', '1396926513', 0),
(93, '1', 'religion', 'verb', '1396926602', '1396926602', 0),
(94, '1', 'happiness', 'noun', '1397061743', '1397061743', 0),
(95, '1', 'wishful', 'adjective', '1397152298', '1397152298', 0),
(96, '1', 'impress', 'verb', '1397188794', '1397188794', 0),
(97, '1', 'compliment', 'verb', '1397188925', '1397188925', 0),
(98, '1', 'dress', 'verb', '1397189314', '1397189314', 0),
(99, '1', 'attractive', 'adjective', '1397189460', '1397189460', 0),
(100, '1', 'impression', 'noun', '1397226715', '1397226715', 0),
(101, '1', 'nkowledge', 'noun', '1397407026', '1397407026', 0),
(102, '1', 'problem', 'noun', '1397412226', '1397412226', 0),
(103, '1', 'terminating', 'verb', '1397473403', '1397473403', 0),
(104, '1', 'festival', 'noun', '1397495208', '1397495208', 0),
(105, '1', 'choose', 'verb', '1397495620', '1397495620', 0),
(106, '1', 'answer', 'verb', '1397544122', '1397544122', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
