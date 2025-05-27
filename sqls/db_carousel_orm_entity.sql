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
-- Table structure for table `carousel_orm_entity`
--

DROP TABLE IF EXISTS `carousel_orm_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carousel_orm_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `koreanTitle` varchar(255) NOT NULL,
  `koreanDescription` varchar(255) NOT NULL,
  `englishTitle` varchar(255) NOT NULL,
  `englishDescription` varchar(255) NOT NULL,
  `japaneseTitle` varchar(255) NOT NULL,
  `japaneseDescription` varchar(255) NOT NULL,
  `koreanPostId` int NOT NULL,
  `englishPostId` int NOT NULL,
  `japanesePostId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carousel_orm_entity`
--

LOCK TABLES `carousel_orm_entity` WRITE;
/*!40000 ALTER TABLE `carousel_orm_entity` DISABLE KEYS */;
INSERT INTO `carousel_orm_entity` VALUES (1,'/carousel/353a3f9f-a14e-4afe-8619-046a0bc8c8a6-global_zone.jpg','글로벌 존','외국인 유학생과 외국어를 사용한 국제문화교류 실시','global zone','Conducting international cultural exchange with international students using foreign languages.','グローバルゾーン','外国人留学生との外国語を使用した国際文化交流を実施する。',142,143,144),(2,'/carousel/35e205b4-6518-4b3b-b0aa-a36c7a974534-global_zone.jpg','글로벌센터','영어권 교수님들과의 영어 회화, 영문 이력서 첨삭 등의 영어 관련 비교과 특별 활동 실시','global center','Conducting extracurricular activities related to English, such as English conversation with native English-speaking professors and editing English resumes.','グローバルセンター','英語圏の教授との英会話や英語の履歴書添削など、英語に関連した課外活動を実施する。',145,146,147);
/*!40000 ALTER TABLE `carousel_orm_entity` ENABLE KEYS */;
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
