/*
Navicat MySQL Data Transfer

Source Server         : DockerUsPanel
Source Server Version : 80021
Source Host           : localhost:3306
Source Database       : uspanel

Target Server Type    : MYSQL
Target Server Version : 80021
File Encoding         : 65001

Date: 2020-12-20 23:58:33
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for _content
-- ----------------------------
DROP TABLE IF EXISTS `_content`;
CREATE TABLE `_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent` int DEFAULT NULL,
  `content_id` int DEFAULT NULL,
  `language_id` int DEFAULT NULL,
  `content_type_id` int DEFAULT NULL,
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
  `id` int NOT NULL,
  `language_id` int NOT NULL,
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
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of _content_type
-- ----------------------------
INSERT INTO `_content_type` VALUES ('1', 'Kategoriler');

-- ----------------------------
-- Table structure for alt_slider
-- ----------------------------
DROP TABLE IF EXISTS `alt_slider`;
CREATE TABLE `alt_slider` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of alt_slider
-- ----------------------------

-- ----------------------------
-- Table structure for ci_sessions
-- ----------------------------
DROP TABLE IF EXISTS `ci_sessions`;
CREATE TABLE `ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` int unsigned NOT NULL DEFAULT '0',
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
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `count` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_users
-- ----------------------------
INSERT INTO `cms_users` VALUES ('1', 'ugur', '123', 'ugur@ozc.com.tr', '1');

-- ----------------------------
-- Table structure for column
-- ----------------------------
DROP TABLE IF EXISTS `column`;
CREATE TABLE `column` (
  `id` int NOT NULL AUTO_INCREMENT,
  `panel_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `language_active` int DEFAULT '0',
  `component_id` int DEFAULT '0',
  `column_type_id` int DEFAULT '0',
  `type_length` varchar(50) DEFAULT '',
  `type_default_value` varchar(255) DEFAULT '',
  `form_data_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `required` int DEFAULT '0',
  `count` int DEFAULT '0',
  `show_in_crud` int DEFAULT '0',
  `form_edit` int DEFAULT '1',
  `target_table` varchar(255) DEFAULT '',
  `target_table_title` varchar(255) DEFAULT '',
  `target_table_secilen_kolon` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of column
-- ----------------------------
INSERT INTO `column` VALUES ('1', '1', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('2', '2', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('3', '3', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('4', '4', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('5', '5', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('6', '8', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('7', '9', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('9', '4', 'Başlık', 'baslik', '0', '1', '1', '200', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('12', '4', 'Count', 'count', '0', '1', '2', '11', '0', null, '0', '0', '0', '0', '', '', '');
INSERT INTO `column` VALUES ('15', '3', 'Başlık', 'baslik', '0', '1', '1', '250', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('16', '9', 'Başlık', 'baslik', '0', '1', '1', '255', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('17', '11', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('18', '11', 'Ad Soyad', 'ad_soyad', '0', '1', '1', '200', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('19', '12', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('20', '12', 'Başlık', 'baslik', '0', '1', '1', '200', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('22', '12', 'Alt Sınıflar', 'alt_siniflar', '0', '2', '2', '11', '0', null, '0', '0', '1', '1', '', 'baslik', '');
INSERT INTO `column` VALUES ('23', '11', 'Sınıf', 'sinif_id', '0', '3', '2', '11', '0', null, '0', '0', '1', '1', 'siniflar', 'baslik', '');
INSERT INTO `column` VALUES ('25', '11', 'Slider Alt', 'slider_alt', '0', '3', '2', '11', '0', null, '0', '0', '1', '1', 'slider_alt', 'baslik', '');
INSERT INTO `column` VALUES ('26', '12', 'Sınıf Başkanı', 'sinif_baskani', '0', '3', '2', '11', '0', null, '0', '0', '1', '1', 'ogrenciler', 'ad_soyad', '');
INSERT INTO `column` VALUES ('27', '13', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('28', '13', 'Etüd Adı', 'etud_adi', '0', '1', '1', '200', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('31', '13', 'Count', 'count', '0', '1', '2', '11', '0', null, '0', '0', '0', '0', '', '', '');
INSERT INTO `column` VALUES ('36', '14', 'ID', 'id', '0', '1', '2', '11', '0', 'Int', '0', '0', '1', '0', '', '', '');
INSERT INTO `column` VALUES ('37', '14', 'Başlık', 'baslik', '0', '1', '1', '255', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('38', '14', 'Etüd ID', 'etud_id', '0', '3', '1', '255', '', null, '0', '0', '1', '0', 'etudler', 'etud_adi', '');
INSERT INTO `column` VALUES ('39', '14', 'Count', 'count', '0', '1', '2', '11', '0', null, '0', '0', '0', '0', '', '', '');
INSERT INTO `column` VALUES ('40', '13', 'Özellikleri', 'ozellikleri', '0', '7', '1', '50', '', null, '0', '0', '1', '0', 'etud_ozellikleri', '', 'etud_id');
INSERT INTO `column` VALUES ('41', '13', 'Üst Kategori', 'ust_kategori', '0', '2', '2', '11', '0', null, '0', '0', '1', '1', '', 'etud_adi', '');
INSERT INTO `column` VALUES ('42', '14', 'Değer', 'deger', '0', '1', '1', '255', '', null, '0', '0', '1', '1', '', '', '');
INSERT INTO `column` VALUES ('44', '13', 'İçerik', 'icerik', '0', '8', '3', '', '', null, '0', '0', '0', '1', '', '', '');

-- ----------------------------
-- Table structure for column_copy
-- ----------------------------
DROP TABLE IF EXISTS `column_copy`;
CREATE TABLE `column_copy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `panel_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `language_active` int DEFAULT '0',
  `component_id` int DEFAULT '0',
  `column_type_id` int DEFAULT '0',
  `type_length` varchar(50) DEFAULT '',
  `type_default_value` varchar(255) DEFAULT '',
  `form_data_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `required` int DEFAULT '0',
  `count` int DEFAULT '0',
  `show_in_crud` int DEFAULT '0',
  `form_edit` int DEFAULT '1',
  `json_data_model` text,
  `relation_type_id` int DEFAULT '0',
  `relation_panel_table_id` int DEFAULT '0',
  `relation_panel_table_column_slug` varchar(255) DEFAULT '',
  `relation_panel_table_altkategori_slug` varchar(255) DEFAULT '',
  `altkategori_slug` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of column_copy
-- ----------------------------
INSERT INTO `column_copy` VALUES ('1', '1', 'ID', 'id', '0', '1', '2', '11', '0', null, '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `column_copy` VALUES ('2', '2', 'ID', 'id', '0', '1', '2', '11', '0', null, '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `column_copy` VALUES ('3', '3', 'ID', 'id', '0', '1', '2', '11', '0', null, '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `column_copy` VALUES ('4', '4', 'ID', 'id', '0', '1', '2', '11', '0', null, '0', '0', '1', '0', null, '0', '0', '', '', '');
INSERT INTO `column_copy` VALUES ('5', '5', 'ID', 'id', '0', '1', '2', '11', '0', null, '0', '0', '1', '0', null, '0', '0', '', '', '');

-- ----------------------------
-- Table structure for column_type
-- ----------------------------
DROP TABLE IF EXISTS `column_type`;
CREATE TABLE `column_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `default_value` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of column_type
-- ----------------------------
INSERT INTO `column_type` VALUES ('1', 'Varchar', '255', 'varchar');
INSERT INTO `column_type` VALUES ('2', 'Int', '11', 'int');
INSERT INTO `column_type` VALUES ('3', 'Text', '0', 'text');
INSERT INTO `column_type` VALUES ('4', 'Date', '0', 'date');
INSERT INTO `column_type` VALUES ('5', 'Datetime', '0', 'datetime');

-- ----------------------------
-- Table structure for component
-- ----------------------------
DROP TABLE IF EXISTS `component`;
CREATE TABLE `component` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `componentName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of component
-- ----------------------------
INSERT INTO `component` VALUES ('1', 'Input Text', 'Text');
INSERT INTO `component` VALUES ('2', 'Alt Kategori Modülü', 'AltKategori');
INSERT INTO `component` VALUES ('3', 'Selectbox [1e1 secim]', 'Selectbox');
INSERT INTO `component` VALUES ('4', 'Selectbox [1e1 secim][AltKategorili]', 'SelectboxAltKategorili');
INSERT INTO `component` VALUES ('5', 'Selectbox [1eN secim] Çoklu', 'SelectboxCoklu');
INSERT INTO `component` VALUES ('6', 'Selectbox [1eN secim] Çoklu [AltKategorili]', 'SelectboxCokluAltKategorili');
INSERT INTO `component` VALUES ('7', 'Selectbox [1e1 secim]  Liste Butonu', 'SelectboxListeBtn');
INSERT INTO `component` VALUES ('8', 'Text İçerik', 'TextEditor');

-- ----------------------------
-- Table structure for component_copy
-- ----------------------------
DROP TABLE IF EXISTS `component_copy`;
CREATE TABLE `component_copy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `componentName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of component_copy
-- ----------------------------
INSERT INTO `component_copy` VALUES ('1', 'Text', 'Text');
INSERT INTO `component_copy` VALUES ('2', 'Select', 'Select');
INSERT INTO `component_copy` VALUES ('3', 'Picture', null);
INSERT INTO `component_copy` VALUES ('4', 'Option', null);
INSERT INTO `component_copy` VALUES ('5', 'Checkbox', null);
INSERT INTO `component_copy` VALUES ('6', 'MultiSelect', null);
INSERT INTO `component_copy` VALUES ('7', 'Textarea', 'Textarea');
INSERT INTO `component_copy` VALUES ('8', 'Kendisine Ait Alt Kategori Seçim Modülü', 'AltKategori');
INSERT INTO `component_copy` VALUES ('9', 'Farklı Tablodan Alt Kategorili Seçim Modülü n-n Çoktan Çoğa Seçimli', null);
INSERT INTO `component_copy` VALUES ('10', 'Resim Tekli', null);
INSERT INTO `component_copy` VALUES ('11', 'Resim Galerili JSON', null);
INSERT INTO `component_copy` VALUES ('12', 'Dosya Tekli', null);
INSERT INTO `component_copy` VALUES ('13', 'Dosya Listeli JSON', null);
INSERT INTO `component_copy` VALUES ('14', 'JSON Liste Oluşturma Modülü', null);
INSERT INTO `component_copy` VALUES ('15', 'MultiSelect CheckboxGroup JSON', null);
INSERT INTO `component_copy` VALUES ('16', 'MultiSelect CheckboxGroup Bire Çok İlişki Table', null);
INSERT INTO `component_copy` VALUES ('17', 'n-n Çoktan Çoğa Seçim', 'CokluSecim');
INSERT INTO `component_copy` VALUES ('18', 'Aktif Pasif (Durumu)', 'AktifPasif');

-- ----------------------------
-- Table structure for etud_ozellikleri
-- ----------------------------
DROP TABLE IF EXISTS `etud_ozellikleri`;
CREATE TABLE `etud_ozellikleri` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `baslik` varchar(255) DEFAULT '',
  `etud_id` varchar(255) DEFAULT '',
  `count` int DEFAULT '0',
  `deger` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of etud_ozellikleri
-- ----------------------------
INSERT INTO `etud_ozellikleri` VALUES ('1', 'Mavi', '1', '2', '');
INSERT INTO `etud_ozellikleri` VALUES ('2', 'Yeşil', '1', '1', '');
INSERT INTO `etud_ozellikleri` VALUES ('3', 'Türkçe Özellik', '2', '3', '');
INSERT INTO `etud_ozellikleri` VALUES ('4', 'tr2', '2', '4', '');
INSERT INTO `etud_ozellikleri` VALUES ('5', 'aaa', '2', '5', '');
INSERT INTO `etud_ozellikleri` VALUES ('6', 'b etüdü mavi', '5', '2', '');
INSERT INTO `etud_ozellikleri` VALUES ('7', 'b etüdü yeşil', '5', '1', '');
INSERT INTO `etud_ozellikleri` VALUES ('8', 'En alt mat 01 yeni', '7', '1', '');
INSERT INTO `etud_ozellikleri` VALUES ('9', 'en alt mat 02', '7', '2', '');
INSERT INTO `etud_ozellikleri` VALUES ('10', 'm2', '7', '6', '220');
INSERT INTO `etud_ozellikleri` VALUES ('11', 'Kırmızı', '16', '7', '');
INSERT INTO `etud_ozellikleri` VALUES ('12', 'Mavi', '16', '8', '');

-- ----------------------------
-- Table structure for etudler
-- ----------------------------
DROP TABLE IF EXISTS `etudler`;
CREATE TABLE `etudler` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `etud_adi` varchar(200) DEFAULT '',
  `count` int DEFAULT '0',
  `ozellikleri` varchar(50) DEFAULT '',
  `ust_kategori` int DEFAULT '0',
  `icerik` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of etudler
-- ----------------------------
INSERT INTO `etudler` VALUES ('1', 'Etüd 01', '1', '', '0', null);
INSERT INTO `etudler` VALUES ('2', 'Etüd Türkçe', '2', '', '0', null);
INSERT INTO `etudler` VALUES ('3', '1 a mat etüdüs', '7', '', '0', null);
INSERT INTO `etudler` VALUES ('4', '1a mats', '2', '', '2', null);
INSERT INTO `etudler` VALUES ('5', '1b alt etüdü', '3', '', '0', null);
INSERT INTO `etudler` VALUES ('6', 'hasan develi 1 a mat etüd', '5', '', '0', null);
INSERT INTO `etudler` VALUES ('7', '1B Matematik', '8', '', '0', null);
INSERT INTO `etudler` VALUES ('13', 'z son', '1', '', '2', null);
INSERT INTO `etudler` VALUES ('15', 'trr 2', '3', '', '2', null);
INSERT INTO `etudler` VALUES ('16', 'hd yusuf', '9', '', '6', null);

-- ----------------------------
-- Table structure for language
-- ----------------------------
DROP TABLE IF EXISTS `language`;
CREATE TABLE `language` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  `slug1id2` int DEFAULT '1',
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
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ad_soyad` varchar(200) DEFAULT '',
  `sinif_id` int DEFAULT '0',
  `slider_alt` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ogrenciler
-- ----------------------------
INSERT INTO `ogrenciler` VALUES ('1', 'Hasan Koç', '1', '2');
INSERT INTO `ogrenciler` VALUES ('2', 'Hasan Develis', '2', '3');
INSERT INTO `ogrenciler` VALUES ('3', 'Yusuf Erdoğan', '3', '2');
INSERT INTO `ogrenciler` VALUES ('4', 'Uğur Yılmaz', '2', '2');

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `parent` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of page
-- ----------------------------

-- ----------------------------
-- Table structure for panel
-- ----------------------------
DROP TABLE IF EXISTS `panel`;
CREATE TABLE `panel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent` int DEFAULT '0',
  `parent_path` varchar(1000) DEFAULT '',
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `has_table` int DEFAULT '0',
  `has_row_slug` int DEFAULT '0',
  `count` int DEFAULT '0',
  `language_active` int unsigned DEFAULT '0',
  `component_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `list_type` int DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  `show_sidebar` tinyint unsigned DEFAULT '0',
  `order_column` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `order_type` varchar(255) DEFAULT '',
  `order_drag` tinyint DEFAULT '0',
  `drag_column` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of panel
-- ----------------------------
INSERT INTO `panel` VALUES ('1', '0', '[\"0\"]', 'Anasayfa', 'anasayfa', '0', '0', '1', '0', 'home', '2', 'fa fa-home', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('2', '0', '[\"0\"]', 'İçerik Yönetimi', 'icerik-yonetimi', '0', '0', '2', '0', '', '2', 'fa fa-newspaper', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('3', '2', '[\"0\",\"2\"]', 'Sayfalar', 'sayfalar', '1', '0', '6', '0', '', '2', '', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('4', '0', '[\"0\"]', 'Slider', 'slider', '1', '0', '3', '0', '', '2', '', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('5', '2', '[\"0\",\"2\"]', 'Alt Slider', 'alt_slider', '1', '0', '8', '0', '', '2', '', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('8', '0', '[\"0\"]', 'Footer Logolar', 'footer-logolar', '0', '0', '4', '0', '', '2', '', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('9', '0', '[\"0\"]', 'Slider Alts', 'slider_alt', '1', '0', '5', '0', '', '2', '', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('11', '0', '[\"0\"]', 'Öğrenciler', 'ogrenciler', '1', '0', '6', '0', '', '2', '', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('12', '0', '[\"0\"]', 'Sınıflar', 'siniflar', '1', '0', '7', '0', '', '2', '', '1', 'id', 'asc', '0', '');
INSERT INTO `panel` VALUES ('13', '0', '[\"0\"]', 'Etüdler', 'etudler', '1', '0', '8', '0', '', '2', '', '1', 'count', 'asc', '1', 'count');
INSERT INTO `panel` VALUES ('14', '0', '[\"0\"]', 'Etüd Özellikleri', 'etud_ozellikleri', '1', '0', '9', '0', '', '2', '', '0', 'count', 'asc', '1', 'count');

-- ----------------------------
-- Table structure for relation_type
-- ----------------------------
DROP TABLE IF EXISTS `relation_type`;
CREATE TABLE `relation_type` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of relation_type
-- ----------------------------
INSERT INTO `relation_type` VALUES ('1', 'Yok, JSON Data');
INSERT INTO `relation_type` VALUES ('2', '1e1 İlişki, 1-1');
INSERT INTO `relation_type` VALUES ('3', '1e Çok İlişki, 1-n');
INSERT INTO `relation_type` VALUES ('4', 'Çoka Çok İlişki, n-n');

-- ----------------------------
-- Table structure for sayfalar
-- ----------------------------
DROP TABLE IF EXISTS `sayfalar`;
CREATE TABLE `sayfalar` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `baslik` varchar(250) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sayfalar
-- ----------------------------
INSERT INTO `sayfalar` VALUES ('1', 'Hakkımızda');
INSERT INTO `sayfalar` VALUES ('2', 'Ürünlerimiz');
INSERT INTO `sayfalar` VALUES ('3', 'İletişim');

-- ----------------------------
-- Table structure for siniflar
-- ----------------------------
DROP TABLE IF EXISTS `siniflar`;
CREATE TABLE `siniflar` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `baslik` varchar(200) DEFAULT '',
  `alt_siniflar` int DEFAULT '0',
  `sinif_baskani` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of siniflar
-- ----------------------------
INSERT INTO `siniflar` VALUES ('1', '1A', '0', '1');
INSERT INTO `siniflar` VALUES ('2', '1B', '0', '3');
INSERT INTO `siniflar` VALUES ('3', '1a etüt', '1', '2');
INSERT INTO `siniflar` VALUES ('5', '1a kurs', '1', '0');
INSERT INTO `siniflar` VALUES ('6', '1a 1. etüd', '3', '0');
INSERT INTO `siniflar` VALUES ('7', '1a 2. etüd saat 2', '3', '0');
INSERT INTO `siniflar` VALUES ('8', '1a 3. etüd', '6', '0');
INSERT INTO `siniflar` VALUES ('9', '1 b alt sınıfıdır', '2', '0');
INSERT INTO `siniflar` VALUES ('10', '1a matematik', '1', '0');
INSERT INTO `siniflar` VALUES ('11', '1a türkçe', '1', '0');
INSERT INTO `siniflar` VALUES ('12', '1 a fiziks', '1', '0');
INSERT INTO `siniflar` VALUES ('13', '1a matematik etüd', '10', '0');
INSERT INTO `siniflar` VALUES ('14', '1b alt sınıfı etüd', '9', '0');
INSERT INTO `siniflar` VALUES ('15', '1b 2. alt sınıf', '2', '3');

-- ----------------------------
-- Table structure for slider
-- ----------------------------
DROP TABLE IF EXISTS `slider`;
CREATE TABLE `slider` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `baslik` varchar(200) DEFAULT '',
  `count` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of slider
-- ----------------------------
INSERT INTO `slider` VALUES ('1', 'Slider 01', '0');

-- ----------------------------
-- Table structure for slider_alt
-- ----------------------------
DROP TABLE IF EXISTS `slider_alt`;
CREATE TABLE `slider_alt` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `baslik` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of slider_alt
-- ----------------------------
INSERT INTO `slider_alt` VALUES ('1', '1. slider alt');
INSERT INTO `slider_alt` VALUES ('2', '2. slider alt');
INSERT INTO `slider_alt` VALUES ('3', '3. slider alt');

-- ----------------------------
-- Table structure for urun_kategorileri
-- ----------------------------
DROP TABLE IF EXISTS `urun_kategorileri`;
CREATE TABLE `urun_kategorileri` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `parent` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of urun_kategorileri
-- ----------------------------
INSERT INTO `urun_kategorileri` VALUES ('1', 'Elektronik', '0');
INSERT INTO `urun_kategorileri` VALUES ('2', 'Mobilya', '0');
INSERT INTO `urun_kategorileri` VALUES ('3', 'Beyaz Eşya', '0');
INSERT INTO `urun_kategorileri` VALUES ('4', 'Bilgisayar', '1');
INSERT INTO `urun_kategorileri` VALUES ('5', 'Cep Telefonu', '1');
INSERT INTO `urun_kategorileri` VALUES ('6', 'Oem Ürünler', '4');
INSERT INTO `urun_kategorileri` VALUES ('7', 'Monitörler', '4');
INSERT INTO `urun_kategorileri` VALUES ('8', 'Kasalar', '4');
INSERT INTO `urun_kategorileri` VALUES ('9', 'Notebooks', '2');
INSERT INTO `urun_kategorileri` VALUES ('10', '2. El Notebooks', '8');
INSERT INTO `urun_kategorileri` VALUES ('11', '0 Notebooks', '10');

-- ----------------------------
-- Table structure for urunler
-- ----------------------------
DROP TABLE IF EXISTS `urunler`;
CREATE TABLE `urunler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of urunler
-- ----------------------------
INSERT INTO `urunler` VALUES ('1', 'US Laptop 01');
INSERT INTO `urunler` VALUES ('2', 'US Laptop 02');
INSERT INTO `urunler` VALUES ('3', 'US Laptop 03');
INSERT INTO `urunler` VALUES ('4', 'Ram 64 GB');
INSERT INTO `urunler` VALUES ('5', 'Ram 32 GB');
INSERT INTO `urunler` VALUES ('6', '25 inc monitor');

-- ----------------------------
-- Table structure for urunler_to_urun_kategorileri
-- ----------------------------
DROP TABLE IF EXISTS `urunler_to_urun_kategorileri`;
CREATE TABLE `urunler_to_urun_kategorileri` (
  `urunler_id` int NOT NULL,
  `urun_kategorileri_id` int NOT NULL,
  PRIMARY KEY (`urunler_id`,`urun_kategorileri_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of urunler_to_urun_kategorileri
-- ----------------------------
INSERT INTO `urunler_to_urun_kategorileri` VALUES ('1', '4');
INSERT INTO `urunler_to_urun_kategorileri` VALUES ('1', '7');
INSERT INTO `urunler_to_urun_kategorileri` VALUES ('3', '4');
INSERT INTO `urunler_to_urun_kategorileri` VALUES ('5', '7');
INSERT INTO `urunler_to_urun_kategorileri` VALUES ('6', '7');
