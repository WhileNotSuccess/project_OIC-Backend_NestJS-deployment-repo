-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `country_orm_entity`
--

DROP TABLE IF EXISTS `country_orm_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country_orm_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `englishName` varchar(255) NOT NULL,
  `japaneseName` varchar(255) NOT NULL,
  `x` int NOT NULL,
  `y` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country_orm_entity`
--

LOCK TABLES `country_orm_entity` WRITE;
/*!40000 ALTER TABLE `country_orm_entity` DISABLE KEYS */;
INSERT INTO `country_orm_entity` VALUES (1,'대만','Taiwan','台湾',1200,420),(2,'미국','United States','アメリカ',320,360),(3,'중국','China','中国',1140,380),(4,'일본','Japan','日本',1260,360),(5,'호주','Australia','オーストラリア',1280,720),(6,'뉴질랜드','New Zealand','ニュージーランド',1400,780),(7,'필리핀','Philippines','フィリピン',1200,470),(8,'스위스','Switzerland','スイス',800,310),(9,'베트남','Vietnam','ベトナム',1160,490),(10,'루마니아','Romania','ルーマニア',860,340),(11,'영국','United Kingdom','イギリス',770,280),(12,'러시아','Russia','ロシア',1000,200),(13,'말레이시아','Malaysia','マレーシア',1180,520),(14,'슬로바키아','Slovakia','スロバキア',830,330),(15,'체코','Czech Republic','チェコ',820,320),(16,'캐나다','Canada','カナダ',300,250),(17,'카자흐스탄','Kazakhstan','カザフスタン',980,300),(18,'헝가리','Hungary','ハンガリー',825,325),(20,'몽골','Mongolia','モンゴル',1080,330);
/*!40000 ALTER TABLE `country_orm_entity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22  0:48:03
