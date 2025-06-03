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
  `filename` varchar(255) NOT NULL,
  `fileSize` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fc05634b51acfe8a0ac79ee1c69` (`postId`),
  CONSTRAINT `FK_fc05634b51acfe8a0ac79ee1c69` FOREIGN KEY (`postId`) REFERENCES `post_orm_entity` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_image_orm_entity`
--

LOCK TABLES `post_image_orm_entity` WRITE;
/*!40000 ALTER TABLE `post_image_orm_entity` DISABLE KEYS */;
INSERT INTO `post_image_orm_entity` VALUES (1,11,'/dummy/test-news-image.png',1470501),(2,12,'/dummy/test-news-image.png',1470501),(3,13,'/dummy/test-news-image.png',1470501),(4,14,'/dummy/test-news-image.png',1470501),(5,15,'/dummy/test-news-image.png',1470501),(6,16,'/dummy/test-news-image.png',1470501),(7,17,'/dummy/test-news-image.png',1470501),(8,18,'/dummy/test-news-image.png',1470501),(9,19,'/dummy/test-news-image.png',1470501),(10,20,'/dummy/test-news-image.png',1470501),(11,51,'/dummy/test-news-image.png',1470501),(12,52,'/dummy/test-news-image.png',1470501),(13,53,'/dummy/test-news-image.png',1470501),(14,54,'/dummy/test-news-image.png',1470501),(15,55,'/dummy/test-news-image.png',1470501),(16,56,'/dummy/test-news-image.png',1470501),(17,57,'/dummy/test-news-image.png',1470501),(18,58,'/dummy/test-news-image.png',1470501),(19,59,'/dummy/test-news-image.png',1470501),(20,60,'/dummy/test-news-image.png',1470501),(21,91,'/dummy/test-news-image.png',1470501),(22,92,'/dummy/test-news-image.png',1470501),(23,93,'/dummy/test-news-image.png',1470501),(24,94,'/dummy/test-news-image.png',1470501),(25,95,'/dummy/test-news-image.png',1470501),(26,96,'/dummy/test-news-image.png',1470501),(27,97,'/dummy/test-news-image.png',1470501),(28,98,'/dummy/test-news-image.png',1470501),(29,99,'/dummy/test-news-image.png',1470501),(30,100,'/dummy/test-news-image.png',1470501),(31,140,'/post-image/02bf946d-71c9-4398-98ca-75768e47a0fa-applicants.png',87799),(32,141,'/post-image/c67e2034-123e-48ad-952d-8de9df9c4016-guidelinesForApplicants.png',57118),(33,1,'//post-image/fa2a9148-b9a5-495c-b8a2-125516135ed2-20250502-103309_67dec0e0-26f5-11f0-9604-bb5507ce181f.png',1967989),(34,149,'//post-image/9908b7c2-6a5b-41d8-8626-08fef565303c-20240322_102716335_74130.jpeg',508115),(35,150,'//post-image/723bbab2-5b08-460c-9d12-27b707c5d0ad-KakaoTalk_20250528_092928433.jpg',195798),(36,151,'//post-image/c390186e-8455-4fe7-872f-75fc4229b503-20240509_154728097_93729.jpeg',347013),(37,152,'//post-image/519e327b-9625-4edd-b371-e19d8ff53e01-20240912_103427582_20277.jpeg',407172),(38,153,'//post-image/6c6ac71e-29cc-4f8d-8ab9-f476c91cfca1-20241023_104640562_42905_r.jpg',97483),(39,154,'//post-image/39607448-5fb5-4f25-af32-f695cef9028f-20241028_135519293_45957.jpeg',372606),(41,158,'//post-image/fa063b48-1ae2-4109-a5e2-ea1d7561c6b6-20250401_144006247_08856.jpg',307909),(42,159,'//post-image/58abea54-1b9f-446f-9ce9-f5899595ec76-20250422_174555661_79913.jpg',540329),(43,160,'//post-image/065fe64c-08bc-4b07-a27b-111ceb705e50-20250424_164420059_78012.jpg',312575),(44,161,'//post-image/c3991484-a934-4130-b83b-65ee3d0de423-20250425_171236062_33862.jpg',290975);
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

-- Dump completed on 2025-05-28  9:39:35
