CREATE DATABASE banners CHARACTER SET utf8 COLLATE utf8_bin;

CREATE USER 'banners'@'localhost' IDENTIFIED BY 'xxxxxx';

GRANT ALL PRIVILEGES ON banners.* TO 'banners'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE `banners`.`banner` (
  `id`               INT          NOT NULL AUTO_INCREMENT,
  `organization_urn` VARCHAR(100) NOT NULL COMMENT 'URN of the organization where the banners are shown',
  `position`         VARCHAR(10)  NOT NULL COMMENT 'Possible values: NAVBAR | WIDGET',
  `content`          TEXT         NOT NULL COMMENT 'Content of the banner: WIDGET image, NAVBAR text',
  PRIMARY KEY (`id`)
);