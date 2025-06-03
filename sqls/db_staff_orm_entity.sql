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
-- Table structure for table `staff_orm_entity`
--

DROP TABLE IF EXISTS `staff_orm_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_orm_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `team` varchar(255) NOT NULL,
  `position_jp` varchar(255) NOT NULL,
  `team_jp` varchar(255) NOT NULL,
  `position_en` varchar(255) NOT NULL,
  `team_en` varchar(255) NOT NULL,
  `order` int NOT NULL DEFAULT 100,
  `role` varchar(255) DEFAULT NULL,
  `role_en` varchar(255) DEFAULT NULL,
  `role_jp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_orm_entity`
--

LOCK TABLES `staff_orm_entity` WRITE;
/*!40000 ALTER TABLE `staff_orm_entity` DISABLE KEYS */;
INSERT INTO `staff_orm_entity` VALUES
(1,'전상표','원장','053-940-5635','spjeon@yju.ac.kr','국제교류원','園長','国際交流園','Director','Office of International Cooperation',1,'국제교류원장','Director of the Office of International Cooperation','国際交流園長'),
(2,'차용두','교수','053-940-5627','storm77@yju.ac.kr','국제교류1팀','教授','国際交流1チーム','Professor','International Exchange Team 1',2,'업무 총괄','Overall management','業務総括'),
(3,'김계화','교수','053-940-5505','jimin88@yju.ac.kr','국제교류2팀','教授','国際交流2チーム','Professor','International Exchange Team 2',3,'중국권 업무 총괄','Overall management of China-related operations','中国関連業務総括'),
(4,'정신혜','직원','053-940-5632','lemon1110@yju.ac.kr','국제교류1팀','事務員','国際交流1チーム','University staff','International Exchange Team 1',4,'유학생(학위) 모집','Recruitment of degree-seeking international students','留学生'),
(5,'이경진','직원','053-940-5630','klm2024@yju.ac.kr','국제교류1팀','事務員','国際交流1チーム','University staff','International Exchange Team 1',5,'유학생(어학) 모집','Recruitment of language exchange international students','留学生'),
(6,'심명규','직원','053-940-5531','mkshim@yju.ac.kr','국제교류1팀','事務員','国際交流1チーム','University staff','International Exchange Team 1',6,'한국어교육센터','Korean Education Center','韓国語教育センター'),
(7,'김종옥','직원','053-940-5489','kimjo@yju.ac.kr','국제교류2팀','事務員','国際交流2チーム','University staff','International Exchange Team 2',7,'중국권 유학생 관리','Management of China-related international students','中国関連留学生管理'),
(8,'김현우','직원','053-940-5506','xuanyou@yju.ac.kr','국제교류2팀','事務員','国際交流2チーム','University staff','International Exchange Team 2',8,'중국권 유학생 모집','Recruitment of China-related international students','中国関連留学生募集'),
(9,'권기선','직원','053-940-5717','kks0303@yju.ac.kr','국제교류1팀','事務員','国際交流1チーム','University staff','International Exchange Team 1',9,'유학생 기숙사 등','International student dormitory','留学生寮など'),
(10,'배현숙','직원','053-940-5490','hesbae@yju.ac.kr','국제교류1팀','事務員','国際交流1チーム','University staff','International Exchange Team 1',10,'교내 글로벌','Management of on-campus global programs','校内グローバル'),
(11,'박유니','조교','053-940-5631','weinipiao6@yju.ac.kr','국제교류2팀','大学助手','国際交流2チーム','Teaching assistant','International Exchange Team 2',11,'조교','Teaching assistant','大学助手'),
(12,'이아용','조교','053-940-5625','yong00@yju.ac.kr','국제교류1팀','大学助手','国際交流1チーム','Teaching assistant','International Exchange Team 1',12,'조교','Teaching assistant','大学助手'),
(13,'김해림','조교','-','somang0681@yju.ac.kr','국제교류2팀','大学助手','国際交流2チーム','Teaching assistant','International Exchange Team 2',13,'조교','Teaching assistant','大学助手');

/*!40000 ALTER TABLE `staff_orm_entity` ENABLE KEYS */;
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
