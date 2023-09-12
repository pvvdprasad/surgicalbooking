// var mongoose = require('mongoose');

/*
	user: "admin",
    pwd: "$ecret_43@1",
	
	user: RkoUf94no02iObF
password: irMIpF8GT1ux.Ry

mysql -u RkoUf94no02iObF -p
irMIpF8GT1ux.Ry

CREATE DATABASE surgy_latest

ALTER USER 'RkoUf94no02iObF'@'localhost' IDENTIFIED WITH mysql_native_password by 'irMIpF8GT1ux-Ry';
'surgyuser'@'localhost' IDENTIFIED BY 'SuRgyp@ss@123'
*/
/*Testing file upload.......................*/
 var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'127.0.0.1',
   user:'root',
   password:'password',
   database:'surgy_latest'
 });
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
	 createTables();
   }
 });  
 
 
 function createTables(){
	 
 connection.connect(function(err) {
  if (err) console.log("Error Connected!");
  console.log("Connected!");
  
 // var sql = "CREATE TABLE models (id INT NOT NULL AUTO_INCREMENT, model_name CHAR(200) NOT NULL, bid INT NOT NULL , PRIMARY KEY (id));";
  //var sql = "CREATE TABLE manufacturers (id INT NOT NULL AUTO_INCREMENT, mname CHAR(200) NOT NULL, cell CHAR(50), PRIMARY KEY (id));";
//var sql = "CREATE TABLE facilities (id INT NOT NULL AUTO_INCREMENT, fname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150), PRIMARY KEY (id));";
	//sql = "DROP TABLE practises";

// var sql = "CREATE TABLE orders (id INT NOT NULL AUTO_INCREMENT, surgery_center_id INT NOT NULL,surgery_date CHAR(10) NOT NULL, first_name CHAR(50),middle_name CHAR(50),last_name CHAR(50), patient_dob CHAR(20), side CHAR(10), manufacture_id INT, brand_id INT, model_id INT, power_id CHAR(5),surgeon_id INT,practise_id INT, PRIMARY KEY (id));";


//sql = "TRUNCATE fav_iols";
/*
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("TRUNCATE query created");	
	
	//sql = "CREATE TABLE other_users (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, first_name CHAR(50),  middle_name CHAR(50),  last_name CHAR(50),cell CHAR(50),email CHAR(150), npi char(50),passcode char(50),PRIMARY KEY (id));";
	
  
  /*
  'fname' :  reqs.facility_name,
		'fax' :  reqs.facility_fax,
		'cell' : reqs.facility_phone,
		'website' :  reqs.facility_website
  */
 // var sql = "CREATE TABLE facilities (id INT NOT NULL AUTO_INCREMENT, fname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150), PRIMARY KEY (id));";
 
  
  //var sql = "CREATE TABLE other_users (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, first_name CHAR(50),  middle_name CHAR(50),  last_name CHAR(50),cell CHAR(50),email CHAR(150), npi char(50),passcode char(50),PRIMARY KEY (id));";
  // "select id, bname, mid from brands
 // var sql = "CREATE TABLE practises (id INT NOT NULL AUTO_INCREMENT, pname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150), npi char(50), email CHAR(150),PRIMARY KEY (id));";
  
  //var sql = "CREATE TABLE fav_iols (id INT NOT NULL AUTO_INCREMENT, fav_type CHAR(50) NOT NULL,surgeon_id  INT NOT NULL, manufacture CHAR(50),model CHAR(50),brand CHAR(50), PRIMARY KEY (id));";
  
  //sql = "DROP TABLE users";
  //var sql = "INSERT INTO  users (name , passcode, role ) VALUES('admin','admin',1)";
  /*
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("practises query created");	
		 
  });
  
  
   });
  */ 
     
});


 }
module.exports.conn = connection;