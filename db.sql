-- MySQL dump 10.13  Distrib 8.0.34, for Linux (x86_64)
--
-- Host: localhost    Database: surgy_latest
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bins`
--

DROP TABLE IF EXISTS `bins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bins` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `binname` text,
  `uniquename` text,
  `binstatus` int DEFAULT NULL,
  `comments` text,
  `fact_id` int DEFAULT NULL,
  `firmware` text,
  `mac_id` text,
  `mandate` text,
  `model` text,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bins`
--

LOCK TABLES `bins` WRITE;
/*!40000 ALTER TABLE `bins` DISABLE KEYS */;
INSERT INTO `bins` VALUES (1,NULL,NULL,1,'Damaged',1,'mjajdahhsdkf','hiuuhkhuu','09/13/2023','kgjuuhu'),(2,NULL,NULL,0,'',0,'dfergrhrt','dfgdgdgdg','09/04/2023','kuhkjkjk'),(3,NULL,NULL,0,'Damaged',2,'kfssfjkdf456','undefined','09/07/2023','Test Model');
/*!40000 ALTER TABLE `bins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bname` char(200) NOT NULL,
  `mid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (3,'brand 3',4),(4,'gdffgfgdfg',4),(6,'Test 3 Brand1',3),(7,'Brand 4',3);
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fname` char(200) NOT NULL,
  `fax` char(50) DEFAULT NULL,
  `cell` char(50) DEFAULT NULL,
  `website` char(150) DEFAULT NULL,
  `surgeons` text,
  `email` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'Test facility','68778686778','7667876887','dfgdgdfgdgdgd.dgfd','','fggdffd@gmail.com'),(2,'Mason Surgery Center','900980908888','099000880989','www.mason.com','|3|',NULL),(6,'Gold medical facility','2123630114','7183030752','goldmedical.com',NULL,NULL),(9,'White Medical Facility','7183030758','7183030758','whitemedical.com',NULL,NULL),(10,'NYC Medical','6567656776','6567656776','nyc.com',NULL,NULL),(14,'Test3 Facility','879799798989','997988779989','t3fac.com',NULL,'test@gmail.com');
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fav_iols`
--

DROP TABLE IF EXISTS `fav_iols`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fav_iols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fav_type` char(50) NOT NULL,
  `surgeon_id` int NOT NULL,
  `manufacture` char(50) DEFAULT NULL,
  `model` char(50) DEFAULT NULL,
  `brand` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fav_iols`
--

LOCK TABLES `fav_iols` WRITE;
/*!40000 ALTER TABLE `fav_iols` DISABLE KEYS */;
INSERT INTO `fav_iols` VALUES (1,'fav1',1,'2','1','1'),(2,'fav2',1,'2','5','2'),(3,'fav3',1,'2','3','2'),(4,'fav1',25,'4','4','3'),(5,'fav2',25,'3','9','6'),(6,'fav1',2,'3','8','6'),(7,'fav3',25,'4','4','3');
/*!40000 ALTER TABLE `fav_iols` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mname` char(200) NOT NULL,
  `cell` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
INSERT INTO `manufacturers` VALUES (3,'test 3',''),(4,'test 4','');
/*!40000 ALTER TABLE `manufacturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_name` char(200) NOT NULL,
  `bid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (4,'model 654',3),(7,'Model 33',7),(8,'Test B444',6),(9,'TTT3',6),(10,'Test brand3',3);
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surgery_center_id` int NOT NULL,
  `surgery_date` char(10) NOT NULL,
  `first_name` char(50) DEFAULT NULL,
  `middle_name` char(50) DEFAULT NULL,
  `last_name` char(50) DEFAULT NULL,
  `patient_dob` char(20) DEFAULT NULL,
  `side` char(10) DEFAULT NULL,
  `manufacture_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `model_id` int DEFAULT NULL,
  `power_id` char(5) DEFAULT NULL,
  `surgeon_id` int DEFAULT NULL,
  `practise_id` int DEFAULT NULL,
  `first_sel_type` text,
  `second_sel_type` text,
  `b_manufacture_id` int DEFAULT NULL,
  `b_brand_id` int DEFAULT NULL,
  `b_model_id` int DEFAULT NULL,
  `b_power_id` text,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,14,'09/22/2023','stdiyyyuf','ittrutfty','rtyf','09/22/2023','right',4,3,4,'6.5',25,1,'fav3','fav2',NULL,NULL,NULL,NULL,0),(2,14,'09/22/2023','iuuiuu','iuiuiuyuiu','iuhiuguuyuygu','09/28/2023','right',4,3,4,'5.5',25,1,'fav3','fav2',NULL,NULL,NULL,NULL,4),(3,14,'09/22/2023','kukyiuuihuiu','iuiuiu','iuiuhuiouo','09/01/2023','left',4,3,4,'11',25,14,'fav3','fav1',NULL,NULL,NULL,NULL,3);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `other_users`
--

DROP TABLE IF EXISTS `other_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `other_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` char(50) DEFAULT NULL,
  `middle_name` char(50) DEFAULT NULL,
  `last_name` char(50) DEFAULT NULL,
  `cell` char(50) DEFAULT NULL,
  `email` char(150) DEFAULT NULL,
  `npi` char(50) DEFAULT NULL,
  `passcode` char(50) DEFAULT NULL,
  `fact_id` int DEFAULT NULL,
  `selected_sc` text NOT NULL,
  `used_sc` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `other_users`
--

LOCK TABLES `other_users` WRITE;
/*!40000 ALTER TABLE `other_users` DISABLE KEYS */;
INSERT INTO `other_users` VALUES (24,24,'ioioiuioiuo','iuhhjhjhjkh','kkhkhjkhkjh','6577556','gdgdfgdfdg@gnfg.fgh','45435435','mzdRdeBu',NULL,'',''),(25,25,'John','B','Ross','7887878787','bmsdksdhhksd@dfgdfg.gfd','564564','1Cj53dtt',NULL,'',''),(26,1,'','','','','','','7eM0S781',NULL,'',''),(27,10,'Baqir','Abbas','M','9876543210','baqir@pmtac.com','','628ciIqH',NULL,'',''),(28,26,'PVV','Prasad','D','564566465','pvvdprasad@gmail.com','12345678','hk8g4LTV',NULL,'',''),(29,30,'Test','S','Surgeon','6577556','test3@gmail.com','8978989988','YyJuDiKx',NULL,'','');
/*!40000 ALTER TABLE `other_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practises`
--

DROP TABLE IF EXISTS `practises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pname` char(200) NOT NULL,
  `fax` char(50) DEFAULT NULL,
  `cell` char(50) DEFAULT NULL,
  `website` char(150) DEFAULT NULL,
  `npi` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practises`
--

LOCK TABLES `practises` WRITE;
/*!40000 ALTER TABLE `practises` DISABLE KEYS */;
INSERT INTO `practises` VALUES (4,'Clearview','676567656','8787776','clearview2020.com','1912919457'),(5,'Eyecare','87788767','876766775555','eyecare.com','');
/*!40000 ALTER TABLE `practises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surgeon_facility`
--

DROP TABLE IF EXISTS `surgeon_facility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surgeon_facility` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surgeon_id` int NOT NULL,
  `facility_id` int NOT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surgeon_facility`
--

LOCK TABLES `surgeon_facility` WRITE;
/*!40000 ALTER TABLE `surgeon_facility` DISABLE KEYS */;
INSERT INTO `surgeon_facility` VALUES (5,25,1,0),(7,24,14,0),(8,25,14,0);
/*!40000 ALTER TABLE `surgeon_facility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` char(30) NOT NULL,
  `passcode` char(30) NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'surgeon','surgeon',2),(2,'admin','admin',1),(24,'ioioiuioiuo','mzdRdeBu',2),(25,'John','John',2),(26,'PVV','prasad',2),(30,'Test','YyJuDiKx',2),(31,'test@gmail.com','test',3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-26  6:02:10
