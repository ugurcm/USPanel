/*
Navicat MySQL Data Transfer

Source Server         : USPanelMysql
Source Server Version : 50727
Source Host           : 192.168.99.100:3306
Source Database       : testapp

Target Server Type    : MYSQL
Target Server Version : 50727
File Encoding         : 65001

Date: 2020-01-13 09:56:45
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ci_sessions
-- ----------------------------
DROP TABLE IF EXISTS `ci_sessions`;
CREATE TABLE `ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` int(10) unsigned NOT NULL DEFAULT '0',
  `data` blob NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ci_sessions_timestamp` (`timestamp`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of ci_sessions
-- ----------------------------
INSERT INTO `ci_sessions` VALUES ('d0f30a6cd2ad970963f5351a3dcc944737168b51', '172.18.0.1', '1552253126', 0x5F5F63695F6C6173745F726567656E65726174657C693A313535323235333132363B);
INSERT INTO `ci_sessions` VALUES ('780ce71cf2a53ab52ad5500927e041bb3094c6a2', '172.18.0.1', '1552253163', 0x5F5F63695F6C6173745F726567656E65726174657C693A313535323235333132363B);

-- ----------------------------
-- Table structure for cms_users
-- ----------------------------
DROP TABLE IF EXISTS `cms_users`;
CREATE TABLE `cms_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_users
-- ----------------------------
INSERT INTO `cms_users` VALUES ('1', 'ugur', '123', 'ugur@ozc.com.tr', '1');

-- ----------------------------
-- Table structure for content
-- ----------------------------
DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT NULL,
  `content_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of content
-- ----------------------------
INSERT INTO `content` VALUES ('1', '0', '1', '1', '1', 'Kurumsal');
INSERT INTO `content` VALUES ('2', '0', '1', '2', '1', 'Corporate');
INSERT INTO `content` VALUES ('3', '0', '1', '3', '1', 'Kurumsal Deuch');
INSERT INTO `content` VALUES ('4', '0', '4', '1', '1', 'İletişim');
INSERT INTO `content` VALUES ('5', '0', '4', '2', '1', 'Contact Us');
INSERT INTO `content` VALUES ('6', '0', '1', '4', '1', 'Kurumsal French');

-- ----------------------------
-- Table structure for content_type
-- ----------------------------
DROP TABLE IF EXISTS `content_type`;
CREATE TABLE `content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of content_type
-- ----------------------------
INSERT INTO `content_type` VALUES ('1', 'Kategoriler');

-- ----------------------------
-- Table structure for iletisim-mesajlari
-- ----------------------------
DROP TABLE IF EXISTS `iletisim-mesajlari`;
CREATE TABLE `iletisim-mesajlari` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of iletisim-mesajlari
-- ----------------------------

-- ----------------------------
-- Table structure for panel_table
-- ----------------------------
DROP TABLE IF EXISTS `panel_table`;
CREATE TABLE `panel_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT '0',
  `parent_path` varchar(1000) DEFAULT '',
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `hasTable` int(11) DEFAULT '0',
  `hasRowSlug` int(11) DEFAULT '0',
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table
-- ----------------------------
INSERT INTO `panel_table` VALUES ('2', '0', '[\"0\"]', 'İçerik Yönetimi', 'icerik-yonetimi', '0', '0', null);
INSERT INTO `panel_table` VALUES ('6', '2', '[\"0\",\"2\"]', 'Sayfalar', 'sayfalar', '1', '0', null);
INSERT INTO `panel_table` VALUES ('7', '0', '[\"0\"]', 'Mesajlar', 'mesajlar', '0', '0', null);
INSERT INTO `panel_table` VALUES ('8', '0', '[\"0\"]', 'Ürün Yönetimi', 'urun-yonetimi', '0', '0', null);
INSERT INTO `panel_table` VALUES ('9', '8', '[\"0\",\"8\"]', 'Ürünler', 'urunler', '1', '0', null);
INSERT INTO `panel_table` VALUES ('10', '7', '[\"0\",\"7\"]', 'İletişim Mesajları', 'iletisim-mesajlari', '1', '0', null);

-- ----------------------------
-- Table structure for panel_table_column
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column`;
CREATE TABLE `panel_table_column` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `panel_table_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `panel_table_column_input_id` int(11) DEFAULT '0',
  `panel_table_column_type_id` int(255) DEFAULT '0',
  `type_length` varchar(50) DEFAULT '',
  `type_default_value` varchar(255) DEFAULT '',
  `required` int(11) DEFAULT '0',
  `count` int(11) DEFAULT '0',
  `show_in_crud` int(11) DEFAULT '0',
  `edit_form` int(11) DEFAULT '1',
  `json_data_model` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column
-- ----------------------------
INSERT INTO `panel_table_column` VALUES ('5', '13', 'd1', null, '0', '0', '', '', '0', '0', '0', '1', null);
INSERT INTO `panel_table_column` VALUES ('6', '13', 'd2', null, '0', '0', '', '', '0', '0', '0', '1', null);
INSERT INTO `panel_table_column` VALUES ('7', '13', 'a2', null, '0', '0', '', '', '0', '0', '0', '1', null);
INSERT INTO `panel_table_column` VALUES ('10', '14', 'baslik', 'baslik', '1', '1', '255', '', '0', '0', '0', '1', null);
INSERT INTO `panel_table_column` VALUES ('11', '14', 'icerik', 'icerik', '7', '3', '', '', '0', '0', '0', '1', null);
INSERT INTO `panel_table_column` VALUES ('12', '14', 'durum', 'durum', '5', '2', '11', '0', '0', '0', '0', '1', null);
INSERT INTO `panel_table_column` VALUES ('13', '14', 'Siralama', 'siralama', '1', '2', '11', '0', '0', '0', '0', '1', null);
INSERT INTO `panel_table_column` VALUES ('14', '6', 'Başlık', 'baslik', '1', '1', '255', '', '0', '0', '0', '1', null);

-- ----------------------------
-- Table structure for panel_table_column_input
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column_input`;
CREATE TABLE `panel_table_column_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column_input
-- ----------------------------
INSERT INTO `panel_table_column_input` VALUES ('1', 'Text');
INSERT INTO `panel_table_column_input` VALUES ('2', 'Select');
INSERT INTO `panel_table_column_input` VALUES ('3', 'Picture');
INSERT INTO `panel_table_column_input` VALUES ('4', 'Option');
INSERT INTO `panel_table_column_input` VALUES ('5', 'Checkbox');
INSERT INTO `panel_table_column_input` VALUES ('6', 'MultiSelect');
INSERT INTO `panel_table_column_input` VALUES ('7', 'Textarea');
INSERT INTO `panel_table_column_input` VALUES ('8', 'Tekli Kategori Selectbox(Alt alta select)');
INSERT INTO `panel_table_column_input` VALUES ('9', 'Çoklu Kategori Seçim Modülü');
INSERT INTO `panel_table_column_input` VALUES ('10', 'Resim Tekli');
INSERT INTO `panel_table_column_input` VALUES ('11', 'Resim Galerili JSON');
INSERT INTO `panel_table_column_input` VALUES ('12', 'Dosya Tekli');
INSERT INTO `panel_table_column_input` VALUES ('13', 'Dosya Listeli JSON');
INSERT INTO `panel_table_column_input` VALUES ('14', 'JSON Liste Oluşturma Modülü');
INSERT INTO `panel_table_column_input` VALUES ('15', 'MultiSelect CheckboxGroup JSON');
INSERT INTO `panel_table_column_input` VALUES ('16', 'MultiSelect CheckboxGroup Coklu İlişki Table');

-- ----------------------------
-- Table structure for panel_table_column_type
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column_type`;
CREATE TABLE `panel_table_column_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `default_value` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column_type
-- ----------------------------
INSERT INTO `panel_table_column_type` VALUES ('1', 'Varchar', '255', 'varchar');
INSERT INTO `panel_table_column_type` VALUES ('2', 'Int', '11', 'int');
INSERT INTO `panel_table_column_type` VALUES ('3', 'Text', '0', 'text');
INSERT INTO `panel_table_column_type` VALUES ('4', 'Date', '0', 'date');
INSERT INTO `panel_table_column_type` VALUES ('5', 'Datetime', '0', 'datetime');

-- ----------------------------
-- Table structure for sayfalar
-- ----------------------------
DROP TABLE IF EXISTS `sayfalar`;
CREATE TABLE `sayfalar` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `baslik` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sayfalar
-- ----------------------------

-- ----------------------------
-- Table structure for urunler
-- ----------------------------
DROP TABLE IF EXISTS `urunler`;
CREATE TABLE `urunler` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of urunler
-- ----------------------------
