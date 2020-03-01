/*
Navicat MySQL Data Transfer

Source Server         : USPanelMysql
Source Server Version : 50727
Source Host           : 192.168.99.100:3306
Source Database       : testapp

Target Server Type    : MYSQL
Target Server Version : 50727
File Encoding         : 65001

Date: 2020-02-23 11:16:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for _content
-- ----------------------------
DROP TABLE IF EXISTS `_content`;
CREATE TABLE `_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT NULL,
  `content_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of _content
-- ----------------------------
INSERT INTO `_content` VALUES ('1', '0', '1', '1', '1', 'Kurumsal');
INSERT INTO `_content` VALUES ('2', '0', '1', '2', '1', 'Corporate');
INSERT INTO `_content` VALUES ('3', '0', '1', '3', '1', 'Kurumsal Deuch');
INSERT INTO `_content` VALUES ('4', '0', '4', '1', '1', 'İletişim');
INSERT INTO `_content` VALUES ('5', '0', '4', '2', '1', 'Contact Us');
INSERT INTO `_content` VALUES ('6', '0', '1', '4', '1', 'Kurumsal French');

-- ----------------------------
-- Table structure for _content_ornek
-- ----------------------------
DROP TABLE IF EXISTS `_content_ornek`;
CREATE TABLE `_content_ornek` (
  `id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of _content_ornek
-- ----------------------------
INSERT INTO `_content_ornek` VALUES ('1', '1', 'Türkçe');
INSERT INTO `_content_ornek` VALUES ('1', '2', 'İngilizce');
INSERT INTO `_content_ornek` VALUES ('2', '1', 'French');
INSERT INTO `_content_ornek` VALUES ('2', '2', 'wqe');

-- ----------------------------
-- Table structure for _content_type
-- ----------------------------
DROP TABLE IF EXISTS `_content_type`;
CREATE TABLE `_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of _content_type
-- ----------------------------
INSERT INTO `_content_type` VALUES ('1', 'Kategoriler');

-- ----------------------------
-- Table structure for alt-dersler
-- ----------------------------
DROP TABLE IF EXISTS `alt-dersler`;
CREATE TABLE `alt-dersler` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of alt-dersler
-- ----------------------------

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
-- Table structure for dersler
-- ----------------------------
DROP TABLE IF EXISTS `dersler`;
CREATE TABLE `dersler` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ders-adi` varchar(200) DEFAULT '',
  `siniflar` varchar(1000) DEFAULT '',
  `ogrenciler` varchar(1000) DEFAULT '',
  `alt-dersler` int(11) DEFAULT '0',
  `alt-dersler_path` varchar(2000) DEFAULT '["0"]',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dersler
-- ----------------------------
INSERT INTO `dersler` VALUES ('1', 'Matematik', '[\"1\",\"3\"]', '[\"2\",\"1\",\"3\"]', '0', '[\"0\"]');
INSERT INTO `dersler` VALUES ('2', 'Tarih', '[\"1\",\"2\",\"8\"]', '', '0', '[\"0\"]');
INSERT INTO `dersler` VALUES ('3', 'Edebiyat', '[\"1\",\"4\",\"9\"]', '', '0', '[\"0\"]');
INSERT INTO `dersler` VALUES ('4', 'Yazılım', '[\"1\",\"3\",\"9\"]', '', '0', '[\"0\"]');
INSERT INTO `dersler` VALUES ('5', 'İstatistik', '[\"2\",\"1\",\"4\",\"5\",\"6\"]', '', '0', '[\"0\"]');
INSERT INTO `dersler` VALUES ('6', 'Geometri', '[\"1\"]', '[\"1\"]', '1', '[\"0\",\"1\"]');

-- ----------------------------
-- Table structure for dersler_to_ogrenciler
-- ----------------------------
DROP TABLE IF EXISTS `dersler_to_ogrenciler`;
CREATE TABLE `dersler_to_ogrenciler` (
  `dersler_id` int(11) unsigned NOT NULL DEFAULT '0',
  `ogrenciler_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`dersler_id`,`ogrenciler_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dersler_to_ogrenciler
-- ----------------------------
INSERT INTO `dersler_to_ogrenciler` VALUES ('1', '1');
INSERT INTO `dersler_to_ogrenciler` VALUES ('1', '2');
INSERT INTO `dersler_to_ogrenciler` VALUES ('1', '3');
INSERT INTO `dersler_to_ogrenciler` VALUES ('6', '1');

-- ----------------------------
-- Table structure for dersler_to_siniflar
-- ----------------------------
DROP TABLE IF EXISTS `dersler_to_siniflar`;
CREATE TABLE `dersler_to_siniflar` (
  `dersler_id` int(11) unsigned NOT NULL DEFAULT '0',
  `siniflar_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`dersler_id`,`siniflar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dersler_to_siniflar
-- ----------------------------
INSERT INTO `dersler_to_siniflar` VALUES ('1', '1');
INSERT INTO `dersler_to_siniflar` VALUES ('1', '3');
INSERT INTO `dersler_to_siniflar` VALUES ('2', '1');
INSERT INTO `dersler_to_siniflar` VALUES ('2', '2');
INSERT INTO `dersler_to_siniflar` VALUES ('2', '8');
INSERT INTO `dersler_to_siniflar` VALUES ('3', '1');
INSERT INTO `dersler_to_siniflar` VALUES ('3', '4');
INSERT INTO `dersler_to_siniflar` VALUES ('3', '9');
INSERT INTO `dersler_to_siniflar` VALUES ('4', '1');
INSERT INTO `dersler_to_siniflar` VALUES ('4', '3');
INSERT INTO `dersler_to_siniflar` VALUES ('4', '9');
INSERT INTO `dersler_to_siniflar` VALUES ('5', '1');
INSERT INTO `dersler_to_siniflar` VALUES ('5', '2');
INSERT INTO `dersler_to_siniflar` VALUES ('5', '4');
INSERT INTO `dersler_to_siniflar` VALUES ('5', '5');
INSERT INTO `dersler_to_siniflar` VALUES ('5', '6');
INSERT INTO `dersler_to_siniflar` VALUES ('6', '1');

-- ----------------------------
-- Table structure for language
-- ----------------------------
DROP TABLE IF EXISTS `language`;
CREATE TABLE `language` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  `slug1id2` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of language
-- ----------------------------
INSERT INTO `language` VALUES ('1', 'Türkçe', 'tr', '1', null, '1');
INSERT INTO `language` VALUES ('2', 'İngilizce', 'en', '1', null, '1');

-- ----------------------------
-- Table structure for ogrenciler
-- ----------------------------
DROP TABLE IF EXISTS `ogrenciler`;
CREATE TABLE `ogrenciler` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ogrenci-ad-soyad` varchar(200) DEFAULT '',
  `ogretmen` int(11) DEFAULT '0',
  `sinif` int(11) DEFAULT '0',
  `alacagi-dersler` varchar(250) DEFAULT '',
  `yedek-ogrenci` int(11) DEFAULT '0',
  `yedek-ogrenci_path` varchar(2000) DEFAULT '["0"]',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ogrenciler
-- ----------------------------
INSERT INTO `ogrenciler` VALUES ('1', 'Elif Türkmen', '1', '1', '[\"2\",\"5\"]', '0', '[\"0\"]');
INSERT INTO `ogrenciler` VALUES ('2', 'Ayşe Sarı', '1', '3', '', '0', '[\"0\"]');
INSERT INTO `ogrenciler` VALUES ('3', 'Hasan Koç', '1', '1', '[\"1\",\"2\"]', '1', '[\"0\",\"1\"]');

-- ----------------------------
-- Table structure for ogrenciler_to_dersler
-- ----------------------------
DROP TABLE IF EXISTS `ogrenciler_to_dersler`;
CREATE TABLE `ogrenciler_to_dersler` (
  `ogrenciler_id` int(11) unsigned NOT NULL DEFAULT '0',
  `dersler_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ogrenciler_id`,`dersler_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ogrenciler_to_dersler
-- ----------------------------
INSERT INTO `ogrenciler_to_dersler` VALUES ('1', '2');
INSERT INTO `ogrenciler_to_dersler` VALUES ('1', '5');
INSERT INTO `ogrenciler_to_dersler` VALUES ('2', '1');
INSERT INTO `ogrenciler_to_dersler` VALUES ('2', '4');
INSERT INTO `ogrenciler_to_dersler` VALUES ('2', '5');
INSERT INTO `ogrenciler_to_dersler` VALUES ('3', '1');
INSERT INTO `ogrenciler_to_dersler` VALUES ('3', '2');

-- ----------------------------
-- Table structure for ogretmenler
-- ----------------------------
DROP TABLE IF EXISTS `ogretmenler`;
CREATE TABLE `ogretmenler` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ad-soyad` varchar(255) DEFAULT '',
  `brans` varchar(250) DEFAULT '',
  `ana-sinifi` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ogretmenler
-- ----------------------------
INSERT INTO `ogretmenler` VALUES ('1', 'Ahmet Koç', 'Sınıf Öğretmeni', '3');
INSERT INTO `ogretmenler` VALUES ('2', 'Fatma Kılıç', 'Türkçe', '2');
INSERT INTO `ogretmenler` VALUES ('3', 'Mehmet Erkoç', 'Matematik', '4');
INSERT INTO `ogretmenler` VALUES ('4', 'Yusuf Özgür', 'Matematiks', '0');

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
  `language_active` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table
-- ----------------------------
INSERT INTO `panel_table` VALUES ('27', '0', '[\"0\"]', 'Sınıflar', 'siniflar', '1', '0', null, '1');
INSERT INTO `panel_table` VALUES ('28', '0', '[\"0\"]', 'Öğretmenler', 'ogretmenler', '1', '0', null, '0');
INSERT INTO `panel_table` VALUES ('29', '0', '[\"0\"]', 'Öğrenciler', 'ogrenciler', '1', '0', null, '0');
INSERT INTO `panel_table` VALUES ('30', '0', '[\"0\"]', 'Dersler', 'dersler', '1', '0', null, '0');
INSERT INTO `panel_table` VALUES ('31', '30', '[\"0\",\"30\"]', 'Alt Dersler', 'alt-dersler', '1', '0', null, '0');
INSERT INTO `panel_table` VALUES ('32', '0', '[\"0\"]', 'Slider', 'slider', '1', '0', null, '1');

-- ----------------------------
-- Table structure for panel_table_column
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column`;
CREATE TABLE `panel_table_column` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `panel_table_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `language_active` int(11) DEFAULT '0',
  `panel_table_column_input_id` int(11) DEFAULT '0',
  `panel_table_column_type_id` int(255) DEFAULT '0',
  `type_length` varchar(50) DEFAULT '',
  `type_default_value` varchar(255) DEFAULT '',
  `form_type` varchar(255) DEFAULT NULL,
  `required` int(11) DEFAULT '0',
  `count` int(11) DEFAULT '0',
  `show_in_crud` int(11) DEFAULT '0',
  `edit_form` int(11) DEFAULT '1',
  `json_data_model` text,
  `relation_type_id` int(11) DEFAULT '0',
  `relation_panel_table_id` int(11) DEFAULT '0',
  `relation_panel_table_column_slug` varchar(255) DEFAULT '',
  `relation_panel_table_altkategori_slug` varchar(255) DEFAULT '',
  `altkategori_slug` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column
-- ----------------------------
INSERT INTO `panel_table_column` VALUES ('29', '27', 'ID', 'id', '0', '1', '2', '11', '0', 'string', '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('30', '27', 'Adı', 'adi', '1', '1', '1', '255', '', 'string', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('31', '28', 'ID', 'id', '0', '1', '2', '11', '0', 'string', '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('32', '28', 'Ad Soyad', 'ad-soyad', '0', '1', '1', '255', '', 'string', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('33', '28', 'Branş', 'brans', '0', '1', '1', '250', '', 'string', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('34', '28', 'Ana Sınıfı', 'ana-sinifi', '0', '2', '2', '11', '0', 'string', '0', '0', '1', '1', null, '2', '27', 'adi', '', '');
INSERT INTO `panel_table_column` VALUES ('35', '27', 'Sınıf Türü', 'sinif-turu', '0', '1', '1', '255', '', 'string', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('36', '27', 'Matematik Öğretmeni', 'matematik-ogretmeni', '0', '2', '2', '11', '0', 'string', '0', '0', '1', '1', null, '2', '28', 'ad-soyad', '', '');
INSERT INTO `panel_table_column` VALUES ('37', '29', 'ID', 'id', '0', '1', '2', '11', '0', 'string', '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('38', '29', 'Öğrenci Ad Soyad', 'ogrenci-ad-soyad', '0', '1', '1', '200', '', 'string', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('39', '29', 'Öğretmen', 'ogretmen', '0', '2', '2', '11', '0', 'string', '0', '0', '1', '1', null, '3', '28', 'ad-soyad', '', '');
INSERT INTO `panel_table_column` VALUES ('40', '29', 'Sınıf', 'sinif', '0', '2', '2', '11', '0', 'string', '0', '0', '1', '1', null, '3', '27', 'adi', '', '');
INSERT INTO `panel_table_column` VALUES ('41', '30', 'ID', 'id', '0', '1', '2', '11', '0', 'string', '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('42', '30', 'Ders Adı', 'ders-adi', '0', '1', '1', '200', '', 'string', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('43', '29', 'Alacağı Dersler', 'alacagi-dersler', '0', '17', '1', '250', '', 'Array', '0', '0', '1', '1', null, '4', '30', 'ders-adi', '', '');
INSERT INTO `panel_table_column` VALUES ('44', '30', 'Sınıflar', 'siniflar', '0', '17', '1', '1000', '', 'Array', '0', '0', '1', '1', null, '4', '27', 'adi', 'alt-kategoriler', '');
INSERT INTO `panel_table_column` VALUES ('50', '27', 'Alt Kategoriler', 'alt-kategoriler', '0', '8', '2', '11', '0', '', '0', '0', '1', '1', null, '0', '0', '', '', 'adi');
INSERT INTO `panel_table_column` VALUES ('51', '31', 'ID', 'id', '0', '1', '2', '11', '0', null, '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('52', '27', 'Durumu', 'durumu', '0', '18', '2', '5', '0', 'Int', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('53', '30', 'Öğrenciler', 'ogrenciler', '0', '17', '1', '1000', '', 'Array', '0', '0', '1', '1', null, '4', '29', 'ogrenci-ad-soyad', 'yedek-ogrenci', '');
INSERT INTO `panel_table_column` VALUES ('54', '29', 'Yedek Öğrenci', 'yedek-ogrenci', '0', '8', '2', '11', '0', '', '0', '0', '1', '1', null, '0', '0', '', '', 'ogrenci-ad-soyad');
INSERT INTO `panel_table_column` VALUES ('55', '30', 'Alt Dersler', 'alt-dersler', '0', '8', '2', '11', '0', 'Int', '0', '0', '1', '1', null, '0', '0', '', '', 'ders-adi');
INSERT INTO `panel_table_column` VALUES ('57', '27', 'language_id', 'language_id', '0', '1', '2', '11', '1', 'Int', '0', '0', '0', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('58', '27', 'content_id', 'content_id', '0', '1', '2', '11', '1', 'Int', '0', '0', '0', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('59', '32', 'ID', 'id', '0', '1', '2', '11', '0', null, '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('60', '32', 'language_id', 'language_id', '0', '1', '2', '11', '1', 'Int', '0', '0', '0', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('61', '32', 'content_id', 'content_id', '0', '1', '2', '11', '0', 'Int', '0', '0', '0', '0', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('62', '32', 'Başlık', 'baslik', '1', '1', '1', '250', '', '', '0', '0', '1', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('65', '32', 'Ön Yazı', 'on-yazi', '1', '7', '1', '500', '', '', '0', '0', '0', '1', null, '0', '0', '', '', '');
INSERT INTO `panel_table_column` VALUES ('66', '32', 'Öğretmenler', 'ogretmenler', '0', '17', '1', '200', '', 'Array', '0', '0', '1', '1', null, '4', '28', 'ad-soyad', '', '');
INSERT INTO `panel_table_column` VALUES ('69', '32', 'Sınıflar', 'siniflar', '0', '17', '1', '200', '', 'Array', '0', '0', '0', '1', null, '4', '27', 'adi', 'alt-kategoriler', '');

-- ----------------------------
-- Table structure for panel_table_column_input
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_column_input`;
CREATE TABLE `panel_table_column_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `componentName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_column_input
-- ----------------------------
INSERT INTO `panel_table_column_input` VALUES ('1', 'Text', 'Text');
INSERT INTO `panel_table_column_input` VALUES ('2', 'Select', 'Select');
INSERT INTO `panel_table_column_input` VALUES ('3', 'Picture', null);
INSERT INTO `panel_table_column_input` VALUES ('4', 'Option', null);
INSERT INTO `panel_table_column_input` VALUES ('5', 'Checkbox', null);
INSERT INTO `panel_table_column_input` VALUES ('6', 'MultiSelect', null);
INSERT INTO `panel_table_column_input` VALUES ('7', 'Textarea', 'Textarea');
INSERT INTO `panel_table_column_input` VALUES ('8', 'Kendisine Ait Alt Kategori Seçim Modülü', 'AltKategori');
INSERT INTO `panel_table_column_input` VALUES ('9', 'Farklı Tablodan Alt Kategorili Seçim Modülü n-n Çoktan Çoğa Seçimli', null);
INSERT INTO `panel_table_column_input` VALUES ('10', 'Resim Tekli', null);
INSERT INTO `panel_table_column_input` VALUES ('11', 'Resim Galerili JSON', null);
INSERT INTO `panel_table_column_input` VALUES ('12', 'Dosya Tekli', null);
INSERT INTO `panel_table_column_input` VALUES ('13', 'Dosya Listeli JSON', null);
INSERT INTO `panel_table_column_input` VALUES ('14', 'JSON Liste Oluşturma Modülü', null);
INSERT INTO `panel_table_column_input` VALUES ('15', 'MultiSelect CheckboxGroup JSON', null);
INSERT INTO `panel_table_column_input` VALUES ('16', 'MultiSelect CheckboxGroup Bire Çok İlişki Table', null);
INSERT INTO `panel_table_column_input` VALUES ('17', 'n-n Çoktan Çoğa Seçim', 'CokluSecim');
INSERT INTO `panel_table_column_input` VALUES ('18', 'Aktif Pasif (Durumu)', 'AktifPasif');

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
-- Table structure for panel_table_component_relation_type
-- ----------------------------
DROP TABLE IF EXISTS `panel_table_component_relation_type`;
CREATE TABLE `panel_table_component_relation_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel_table_component_relation_type
-- ----------------------------
INSERT INTO `panel_table_component_relation_type` VALUES ('1', 'Yok, JSON Data');
INSERT INTO `panel_table_component_relation_type` VALUES ('2', '1e1 İlişki, 1-1');
INSERT INTO `panel_table_component_relation_type` VALUES ('3', '1e Çok İlişki, 1-n');
INSERT INTO `panel_table_component_relation_type` VALUES ('4', 'Çoka Çok İlişki, n-n');

-- ----------------------------
-- Table structure for siniflar
-- ----------------------------
DROP TABLE IF EXISTS `siniflar`;
CREATE TABLE `siniflar` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `adi` varchar(255) DEFAULT '',
  `sinif-turu` varchar(255) DEFAULT '',
  `matematik-ogretmeni` int(11) DEFAULT '0',
  `alt-kategoriler` int(11) DEFAULT '0',
  `alt-kategoriler_path` varchar(2000) DEFAULT '["0"]',
  `durumu` int(5) DEFAULT '0',
  `language_id` int(11) unsigned DEFAULT '1',
  `content_id` int(11) unsigned DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of siniflar
-- ----------------------------
INSERT INTO `siniflar` VALUES ('15', '1a tr', 'Lise', '4', '0', '[\"0\"]', '1', '1', '15');
INSERT INTO `siniflar` VALUES ('16', '1a eng', 'Lise', '4', '0', '[\"0\"]', '1', '2', '15');
INSERT INTO `siniflar` VALUES ('24', '1b', '2. sınıf', '0', '0', '[\"0\"]', '1', '1', '24');
INSERT INTO `siniflar` VALUES ('25', '1b eng', '2. sınıf', '0', '0', '[\"0\"]', '0', '2', '24');
INSERT INTO `siniflar` VALUES ('26', '1c tr', '1c sınıfı', '0', '0', '[\"0\"]', '1', '1', '26');
INSERT INTO `siniflar` VALUES ('27', '1c english', '1c sınıfı', '0', '0', '[\"0\"]', '0', '2', '26');
INSERT INTO `siniflar` VALUES ('28', '1a alt tr', '1a alt sınıfı', '1', '15', '[\"0\",\"15\"]', '1', '1', '28');
INSERT INTO `siniflar` VALUES ('29', '1a alt en', '1a alt sınıfı', '1', '15', '[\"0\",\"15\"]', '1', '2', '28');

-- ----------------------------
-- Table structure for slider
-- ----------------------------
DROP TABLE IF EXISTS `slider`;
CREATE TABLE `slider` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) unsigned DEFAULT '1',
  `content_id` int(11) unsigned DEFAULT '0',
  `baslik` varchar(250) DEFAULT '',
  `on-yazi` varchar(500) DEFAULT '',
  `ogretmenler` varchar(200) DEFAULT '',
  `siniflar` varchar(200) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of slider
-- ----------------------------
INSERT INTO `slider` VALUES ('1', '1', '1', 'Slider 1', 'tr önyazı', '[\"1\",\"2\"]', '');
INSERT INTO `slider` VALUES ('2', '2', '1', 'Slider 1 Eng', 'eng ön yazı', '', '');

-- ----------------------------
-- Table structure for slider_to_ogretmenler
-- ----------------------------
DROP TABLE IF EXISTS `slider_to_ogretmenler`;
CREATE TABLE `slider_to_ogretmenler` (
  `slider_id` int(11) unsigned NOT NULL DEFAULT '0',
  `ogretmenler_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`slider_id`,`ogretmenler_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of slider_to_ogretmenler
-- ----------------------------
INSERT INTO `slider_to_ogretmenler` VALUES ('1', '1');
INSERT INTO `slider_to_ogretmenler` VALUES ('1', '2');

-- ----------------------------
-- Table structure for slider_to_siniflar
-- ----------------------------
DROP TABLE IF EXISTS `slider_to_siniflar`;
CREATE TABLE `slider_to_siniflar` (
  `slider_id` int(11) unsigned NOT NULL DEFAULT '0',
  `siniflar_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`slider_id`,`siniflar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of slider_to_siniflar
-- ----------------------------
INSERT INTO `slider_to_siniflar` VALUES ('1', '15');
INSERT INTO `slider_to_siniflar` VALUES ('1', '26');
