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
-- Table structure for table `post_image_orm_entity`
--

DROP TABLE IF EXISTS `post_image_orm_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_image_orm_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `filename` varchar(100) NOT NULL,
  `fileSize` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fc05634b51acfe8a0ac79ee1c69` (`postId`),
  CONSTRAINT `FK_fc05634b51acfe8a0ac79ee1c69` FOREIGN KEY (`postId`) REFERENCES `post_orm_entity` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_image_orm_entity`
--

LOCK TABLES `post_image_orm_entity` WRITE;
/*!40000 ALTER TABLE `post_image_orm_entity` DISABLE KEYS */;
INSERT INTO `post_image_orm_entity` VALUES (1,11,'/dummy/test-news-image.png',1470501),(2,12,'/dummy/test-news-image.png',1470501),(3,13,'/dummy/test-news-image.png',1470501),(4,14,'/dummy/test-news-image.png',1470501),(5,15,'/dummy/test-news-image.png',1470501),(6,16,'/dummy/test-news-image.png',1470501),(7,17,'/dummy/test-news-image.png',1470501),(8,18,'/dummy/test-news-image.png',1470501),(9,19,'/dummy/test-news-image.png',1470501),(10,20,'/dummy/test-news-image.png',1470501),(11,51,'/dummy/test-news-image.png',1470501),(12,52,'/dummy/test-news-image.png',1470501),(13,53,'/dummy/test-news-image.png',1470501),(14,54,'/dummy/test-news-image.png',1470501),(15,55,'/dummy/test-news-image.png',1470501),(16,56,'/dummy/test-news-image.png',1470501),(17,57,'/dummy/test-news-image.png',1470501),(18,58,'/dummy/test-news-image.png',1470501),(19,59,'/dummy/test-news-image.png',1470501),(20,60,'/dummy/test-news-image.png',1470501),(21,91,'/dummy/test-news-image.png',1470501),(22,92,'/dummy/test-news-image.png',1470501),(23,93,'/dummy/test-news-image.png',1470501),(24,94,'/dummy/test-news-image.png',1470501),(25,95,'/dummy/test-news-image.png',1470501),(26,96,'/dummy/test-news-image.png',1470501),(27,97,'/dummy/test-news-image.png',1470501),(28,98,'/dummy/test-news-image.png',1470501),(29,99,'/dummy/test-news-image.png',1470501),(30,100,'/dummy/test-news-image.png',1470501),(31,140,'/post-image/02bf946d-71c9-4398-98ca-75768e47a0fa-applicants.png',87799),(32,141,'/post-image/c67e2034-123e-48ad-952d-8de9df9c4016-guidelinesForApplicants.png',57118);
/*!40000 ALTER TABLE `post_image_orm_entity` ENABLE KEYS */;
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
