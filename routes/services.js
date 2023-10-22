var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var conn = require('../model/db').conn;
const config = process.env;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
  
const app = express();
  
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};  

router.post('/testlan', async function(req, res, next) {
	console.log(req);
	
	if(checkToken(req)) console.log('It is true');
	else console.log('It is false');
	
	//console.log(checkToken(req));
	res.send({'dsf':'ffffffffffffff'})
});

function checkToken(req){
	var reqs = req.body;
	
	console.log('In the check token..........');
	//console.log(reqs);
	decoded = 'error';
	const token = req.body.token || req.query.token || req.headers["x-access-token"];
	//console.log('In the check token is.....222222222222222.....'+token);
	try{
	 decoded = jwt.verify(token, config.JWT_SECRET_KEY);
	console.log('decoded is...........'+decoded);
	
	}catch(e){console.log(e);}
	
	if(decoded == 'error') return false;
	else return true;
	/*
	console.log(decoded);
	console.log('-----------');
	
	return decoded;
	*/
}
  
// Set up Global configuration access

router.post('/save_order', async function(req, res, next) {
	var reqs = req.body;
	
	//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
	
	console.log('2-----------------');
	console.log(reqs);
	console.log('2-----------------');
	console.log(reqs.sucenter);
	console.log('1-----------------');
	
	var sql = 'INSERT INTO orders(surgery_center_id, surgery_date, first_name, middle_name, last_name, patient_dob, side, manufacture_id, brand_id, model_id, power_id,surgeon_id ,practise_id,first_sel_type,second_sel_type,status,b_manufacture_id, b_brand_id, b_model_id, b_power_id) VALUES('+reqs.surgycenter+', "'+reqs.start_dt+'", "'+reqs.fn+'", "'+reqs.mn+'", "'+reqs.ln+'", "'+reqs.dob+'", "'+reqs.side+'", '+reqs.manu+', '+reqs.brand+', '+reqs.model+', "'+reqs.power+'", 0, '+reqs.surgycenter+', "'+reqs.back_iol+'", "'+reqs.pri_iol+'",0,'+reqs.backup_manu+', '+reqs.backup_brand+', '+reqs.backup_model+', "'+reqs.backup_power+'")'; 
	console.log(sql);
	
	await conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
		}
		console.log("User query created");
		res.send({results:result});
	  });
});

router.post('/decommissioned', async function(req, res, next) {
	//AWS.config.update(config.aws_remote_config);
	//var results = await scanTable(config.aws_bins_table_name);
	//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
	
	sql = 'select * from bins where binstatus = 3';
	
	html = '<h2>Decommissioned Bins</h2><table><tr><th>Model / Bin no</th><th>Mac ID</th><th>Firmware</th><th>Manufactured Date</th><th>Comments</th><th>Action</th></tr>';
	conn.query(sql, function (err, results) {
		/*
	for(i=0;i<results.length;i++){
		if(results[i].binstatus == 3){
			html += '<tr><td>'+ results[i].model + '/'+results[i].binname+'</td><td>'+ results[i].mac_id +'</td><td>'+ results[i].firmware +'</td><td>'+ results[i].mandate +'</td><td>Comment '+i+'</td><td><a href="javascript:recommission(\''+results[i].uid+'\')">Recommission</a></td></tr>';
			
			// break;
		}
	}html += '</table>'; */
	res.send({ data:results });
	});
	
	
});

router.post('/unassignedBins', async function(req, res, next) {
	
	//var results = await scanTable(config.aws_users_table_name);
	//var binresults = await scanTable(config.aws_bins_table_name);
	
	//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
	
	arrbin = [];
	sql = 'select * from bins where binstatus = 0';
	html = '<h2>Unassigned Bins</h2><table id="righttable"><tr><th>Model</th><th>Mac ID</th><th>Firmware</th><th>Manufactured Date</th></tr>';
	conn.query(sql, function (err, binresults) {
		/*
		for(i=0;i<binresults.length;i++){
			//if(binresults[i].binstatus == 0)
				//arrbin.push(binresults[i]);
			html += '<tr><td>'+binresults[i].model+'</td><td>'+binresults[i].mac_id+'</td><td>'+binresults[i].firmware+'</td><td>'+binresults[i].mandate+'</td></tr>';
		}
		html += '</table>';
		*/
		res.send({data:binresults});
	});
});

router.post('/assignedBins', async function(req, res, next) {
	
	//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
		
	arrbin = []; fff = true;
	sql = 'select * from bins where binstatus = 1';
	
	
	/*
	html = '<h2>Assigned Bins</h2><select id="dynfacilsele" onchange="changefacildd(this.value)" style="margin-bottom: 20px"></select><table id="righttable"><tr><th>Model</th><th>Mac ID</th><th>Firmware</th><th>Status</th><th>Manufactured Date</th><th>Action</th></tr>';
	*/
	conn.query(sql, function (err, binresults) {
		
		/*
	for(i=0;i<binresults.length;i++){
		//if(binresults[i].binstatus == 1)
			//arrbin.push(binresults[i]);
			if(fff){
				html += '<tr><td>'+binresults[i].model+'</td><td>'+binresults[i].mac_id+'</td><td>'+binresults[i].firmware+'</td><td><img style="width:22px" src="../images/signal.png" onclick="showslots()" /></td><td>'+binresults[i].mandate+'</td><td><a href="javascript:decommi(\''+binresults[i].uid+'\')">Decommission</a><div class="hidassdiv" id="'+binresults[i].uid+'_hid"><span class="spanclose" onclick="closediv(\''+binresults[i].uid+'_hid\')">X</span><a href="javascript:seleop(1,'+binresults[i].uid+')">Malfunction</a><br><a href="javascript:seleop(2,'+binresults[i].uid+')">Damaged</a><br><a href="javascript:seleop(3,'+binresults[i].uid+')">Other</a></div></td></tr>';
				fff = false;
			}else{
				html += '<tr><td>'+binresults[i].model+'</td><td>'+binresults[i].mac_id+'</td><td>'+binresults[i].firmware+'</td><td><img style="width:25px" src="../images/nosignal.png" /></td><td>'+binresults[i].mandate+'</td><td><a href="javascript:decommi(\''+binresults[i].uid+'\')">Decommission</a><div class="hidassdiv" id="'+binresults[i].uuid+'_hid"><span class="spanclose" onclick="closediv(\''+binresults[i].uid+'_hid\')">X</span><a href="javascript:seleop(1,'+binresults[i].uid+')">Malfunction</a><br><a href="javascript:seleop(2,'+binresults[i].uuid+')">Damaged</a><br><a href="javascript:seleop(3,'+binresults[i].uid+')">Other</a></div></td></tr>';				
			}
		}
		html += '</table>';
		*/
		res.send({data:binresults});
	});	
});


router.post('/addbin', async function(req, res, next) {
	reqs = req.body;
	
	//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
	
	sql = 'insert into bins (binstatus, comments,fact_id, firmware , mac_id ,mandate ,model) values(0,'+
	'"",0,"'+reqs.firmware+'","'+reqs.macid+'","'+reqs.mandate+'","'+reqs.model+'")';
	//docClient.put(params, function(err, data) {
		console.log(sql);
	conn.query(sql, function (err, binresults) {
	  if (err) {
		console.log("Error", err);
		res.send({results:"Error"});
	  } else {
		console.log("Success", binresults);
		res.send({results:"Success"});
	  }
	});
});


router.post('/resetpassword', async function(req, res, next) {
	reqs = req.body;
	var pass = generatePassword();
	
	//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
	
	sql = 'select id,user_id,first_name,npi,passcode,email,fact_id from other_users where id= '+reqs.user_id;
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{
			if(result[0].npi=='' ||result[0].npi=='undefined'){ // Facility
				sql = '';
			}else{
				sql = 'update users set passcode ='+pass+' where id='+result[0].user_id;
			}
			sendEmail(result[0].email,'Temporary password for surgicalbooking.com', '<b><i>Hi '+result[0].first_name+',<br></i></b>Your temporary password is '+pass);
			conn.query(sql, function (err, result) {
			
			});
		}
		res.send({'message':'Succes'});
		//res.render('admin/order_history', { BASE_PATH: '../',results:result });
	});
});

router.post('/save_password',async function(req, res, next) {	
	// query2 = "select id, first_name,  selected_sc,  used_sc from other_users where user_id="+req.session.userid;
	reqs = req.body;
	console.log(reqs);
	
//	if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }

		sql = 'update users set passcode = "'+reqs.p+'" where id='+reqs.uid;
		console.log(sql);
		
		conn.query(sql, function (err, result) {
			res.send({});
		});
//	}
});

router.get('/getbinUpdate',async function(req, res, next) {	
	
    var bin_mac_id = req.query.bin_mac_id;
    console.log(bin_mac_id);
	
	var sql = "SELECT   bins.binstatus,  bins.mac_id,  orders.surgery_date, DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y') as tdate, orders.patient_dob, orders.side, orders.status as order_status, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name,                            CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, m.mname as primary_manufacturer, b.bname as primary_brand_name, models.model_name as primary_model_name, power_id as primary_power,mb.mname as backup_manufacturer, bb.bname as backup_brand_name, mob.model_name as backup_model_name, b_power_id as backup_power  FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id  WHERE orders.bin_mac_id = '"+bin_mac_id+"' AND surgery_date = DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y')";
			 
	console.log(sql);
	conn.query(sql, function (err, result) {
		if(err){
			res.status(400).send("Not Found");
		}else{
			res.status(200).json(result);
		}
	});
});


router.post('/remove_bin',async function(req, res, next) {	
	reqs = req.body;
	console.log(reqs.bin_mac_id);
	var bin_mac_id= reqs.bin_mac_id;
	
	sql = 'UPDATE bins SET removed_bins = 1 where mac_id = "'+bin_mac_id+'"';
	//console.log(sql);
	conn.query(sql, function (err, result) {
		if(err){
			res.status(400).send("Error executing query");
		}else{
			res.status(200).send(result);
		}
	});
});

router.post('/postlogin', async function(req, res, next) {
	var reqs = req.body;
  var loginid =	reqs.loginid;
  var passid =	reqs.passid;
  console.log(reqs);
 
  
  var sql = "select id,role from users where name ='"+loginid+"' and passcode='"+passid+"'";
  //VALUES('surgeon','surgeon',2)";
  console.log(sql);
  conn.query(sql, function (err, result) {
    if (err){
		res.render('admin/login', { BASE_PATH: '../', message: 'Database error. Please try again later.' });
	}else{
		 if(!result || result.length === 0){
			// If no user with the given credentials is found, render the login view with an error message
			// res.status(401).render('admin/login', { BASE_PATH: '../', message: 'Unauthorized access. Please login with valid credentials.' });
			res.send({'message':'invalid details'});
			//console.log(result);
		}else{
			for(i=0;i<result.length;i++){
				//console.log(result[i]);
				req.session.userid = result[i].id;
				req.session.role = result[i].role;
				console.log(req.session.role)
				break;
			}
			console.log(req.session);
			try{
				if(!req.session || !req.session.userid ){
					res.send({'message':'invalid details'});
				}else{
					console.log('user id exists');
					
					let jwtSecretKey = process.env.JWT_SECRET_KEY;
					let data = {
						time: Date(),
						userid: req.session.userid
					}
					
					const token = jwt.sign(data, jwtSecretKey,{expiresIn: "6h" });
					console.log('In the service oken:'+token);
					res.send({token, 'userid':req.session.userid});
				}
			}catch(e){
				console.log("User query cannot be created");
			}
   			console.log("PostLogin Completed");
		}
	}
	});

});

/*
const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
	

router.post('/generateToken', async function(req, res, next) {
//router.get("/generateToken", async function(req, res) {
    // Validate User Here
    // Then generate JWT Token
	console.log('In the service');
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }
  
    const token = jwt.sign(data, jwtSecretKey);
	console.log('In the service oken:'+token);
    res.send(token);
});
*/

module.exports = router;