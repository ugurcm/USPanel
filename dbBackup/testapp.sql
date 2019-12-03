/*
Navicat MySQL Data Transfer

Source Server         : USPanelMysql
Source Server Version : 50727
Source Host           : 192.168.99.100:3306
Source Database       : testapp

Target Server Type    : MYSQL
Target Server Version : 50727
File Encoding         : 65001

Date: 2019-12-04 02:12:31
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
-- Table structure for panel_table
-- ----------------------------
DROP TABLE IF EXISTS `panel_table`;
CREATE TABLE `panel_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `hasTable` int(11) DEFAULT '0',
  `hasRowSlug` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table
-- ----------------------------
INSERT INTO `panel_table` VALUES ('1', '0', 'İçerik Yönetimi', 'icerik-yonetimi', '0', '0');
INSERT INTO `panel_table` VALUES ('2', '1', 'Sayfalar', 'sayfalar', '1', '0');
INSERT INTO `panel_table` VALUES ('3', '1', 'Sliderlar', 'slider', '1', '0');
INSERT INTO `panel_table` VALUES ('4', '3', 'Siparişler', 'siparisler', '1', '0');
INSERT INTO `panel_table` VALUES ('5', '0', 'İletişim', null, '0', '0');
INSERT INTO `panel_table` VALUES ('6', '0', 'Şubeler', 'subeler', '0', '0');

-- ----------------------------
-- Table structure for panel_table_column
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column`;
CREATE TABLE `panel_table_column` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `panel_table_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `panel_table_column_input_id` int(11) DEFAULT NULL,
  `panel_table_column_type_id` int(255) DEFAULT NULL,
  `type_length` varchar(50) DEFAULT NULL,
  `type_default_value` varchar(255) DEFAULT NULL,
  `required` int(11) DEFAULT '0',
  `count` int(11) DEFAULT '0',
  `show_in_crud` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column
-- ----------------------------
INSERT INTO `panel_table_column` VALUES ('1', '2', 'Başlık', 'baslik', '1', '1', '50', null, '0', '0', '0');
INSERT INTO `panel_table_column` VALUES ('2', '2', 'Icerik', 'icerik', '7', '1', '1000', null, '0', '0', '0');
INSERT INTO `panel_table_column` VALUES ('3', '6', 'Başlık', 'baslik', '1', '1', '255', null, '0', '2', '1');
INSERT INTO `panel_table_column` VALUES ('4', '6', 'Telefon', 'telefon', '1', '1', '255', null, '0', '3', '1');
INSERT INTO `panel_table_column` VALUES ('5', '6', 'E-Mail', 'email', '1', '1', '255', null, '0', '4', '1');
INSERT INTO `panel_table_column` VALUES ('6', '6', 'Adres', 'adres', '1', '1', '255', null, '0', '5', '1');
INSERT INTO `panel_table_column` VALUES ('7', '6', 'Id', 'id', '1', '2', '11', null, '0', '1', '1');
INSERT INTO `panel_table_column` VALUES ('8', '6', 'Count', 'count', '1', '2', '11', null, '0', '6', '0');

-- ----------------------------
-- Table structure for panel_table_column_input
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column_input`;
CREATE TABLE `panel_table_column_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column_input
-- ----------------------------
INSERT INTO `panel_table_column_input` VALUES ('1', 'TextBox');
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

-- ----------------------------
-- Table structure for panel_table_column_type
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column_type`;
CREATE TABLE `panel_table_column_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `default_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column_type
-- ----------------------------
INSERT INTO `panel_table_column_type` VALUES ('1', 'Varchar', '255');
INSERT INTO `panel_table_column_type` VALUES ('2', 'Int', '11');
INSERT INTO `panel_table_column_type` VALUES ('3', 'Text', '0');
INSERT INTO `panel_table_column_type` VALUES ('4', 'Date', '0');
INSERT INTO `panel_table_column_type` VALUES ('5', 'Datetime', '0');

-- ----------------------------
-- Table structure for sayfalar
-- ----------------------------
DROP TABLE IF EXISTS `sayfalar`;
CREATE TABLE `sayfalar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `icerik` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sayfalar
-- ----------------------------
INSERT INTO `sayfalar` VALUES ('1', null, null, null, null, null);

-- ----------------------------
-- Table structure for subeler
-- ----------------------------
DROP TABLE IF EXISTS `subeler`;
CREATE TABLE `subeler` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `baslik` varchar(255) DEFAULT NULL,
  `telefon` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adres` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of subeler
-- ----------------------------
INSERT INTO `subeler` VALUES ('1', 'US Tokat Şubesi', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', '1');
INSERT INTO `subeler` VALUES ('2', 'asdf LOL', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('3', 'fasdf', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('4', 'asdf', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('5', 'sd', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('6', 'dafd', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('7', 'rfs', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('8', 'fsdfasd', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('9', 'vxcvcasdf', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('10', 'bx', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('11', 'vbxcv', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('12', 'cvzxc', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('13', 'hdfg', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('14', 'dfghdfg', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('15', 'hdf', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('16', 'hd', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('17', 'gh', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('18', 'fghdfrtyer', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('19', 'tyer', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('20', 'yeryj', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('21', 'hgj', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
INSERT INTO `subeler` VALUES ('22', 'jdfgd', '02125415454', 'tokat@uydusoft.com', 'Tokat Devegörmez', null);
