var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var conn = require('../model/db').conn;
const config = process.env;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const io = require('../bin/www').io;
const moment = require('moment');
const cron = require('node-cron');


function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


//transporter.verify().then(console.log).catch(console.error);

console.log('to id is:' + to);
console.log('sub  is:' + sub);
console.log('body is:' + body);

var mailOptions = {
  from: 'info@surgislate.com',
  to: to,
  subject: sub,
  html: body
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


}

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
// For Mobile App
	// Set up Global configuration access
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


	// For Logging out
	router.get('/logout',  function(req, res, next) {
		console.log('in the logout');
		//console.log(req.session);
		try{
		//if(typeof req.session === undefined){}else{
			req.session.destroy(); //
			console.log("Logged out.")
			res.status(200); 
		//}
		}catch(e){console.log(e);}
		res.send({})
	}); 

	// Endpoints for  creating New orders
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



	// Setup to get new order records for facility approval
	router.post('/neworders', async function(req, res, next){
		reqs = req.body;
		// console.log(reqs);
		sid= reqs.sid
		sql = 'select  id from facilities where email = (select name from users where id = '+sid+')';

		await conn.query(sql, function (err, result) {
			if (result && result.length > 0) {
				sid = result[0].id;
				// console.log(sid);
				sql = `select o.id,surgery_date,
					CONCAT(o.first_name, ' ', o.middle_name, ' ', o.last_name) As Patient_Name,o.patient_dob,o.side as Surgery_Side,
					CONCAT(u.first_name, ' ', u.middle_name, ' ', u.last_name) As Surgeon_Name,
					CONCAT(m.mname , ':', models.model_name, ':' , o.power_id) As PrimaryIOL,  
					CONCAT(mb.mname, ' : ', bb.bname, ' : ', o.b_power_id ) As BackupIOL
					from orders o 
					left join other_users u on u.user_id = o.surgeon_id
					left JOIN manufacturers as m on o.manufacture_id = m.id 
					left JOIN models on o.model_id = models.id
					left JOIN manufacturers as mb on o.b_manufacture_id = mb.id
					left JOIN brands as bb on o.b_brand_id = bb.id
					left JOIN facilities as f on o.surgery_center_id= f.id
					where 
					surgery_center_id='${sid}' AND status= 0 order by surgery_date`;
					// console.log(sql);
				conn.query(sql, function (err, result) {
					if (err){
						console.log( err);
						res.status(500).send("Not Found")
					}else{
						if(result.length > 0){
							// console.log(result);
							res.status(200).json(result);
						}
					}
				});
			}else{
			res.json({ message: "No New order available"})
			}
		});
	});

	router.post('/approveorder', async function(req, res, next) {
		reqs = req.body;
		// console.log(reqs);
		console.log("In the Approve Order process......")
		sql = 'select surgery_date,surgery_center_id,bin_mac_id from orders where id='+reqs.oid;
		//sql = 'update orders set status = 1 where id='+reqs.oid;
		await conn.query(sql, function (err, result) {
			fact_id = 0;
			if(result[0].bin_mac_id == ''){
				console.log("assigning slot of a masterbin")
				fact_id = result[0].surgery_center_id;
				surg_id = result[0].surgery_date;
				// console.log("I am the surgery Date",surg_id);
				const currentDate = moment().format('MM/DD/YYYY');
				// console.log("I am the current Date",currentDate);
				// surgery_dt varchar(25) NOT NULL, facility_id    int,  status int,
				// surgery_dt varchar(25) NOT NULL, facility_id    int,  status 
				// sql = 'select surgery_date,surgery_center_id from orders where id='+reqs.oid;
				sql = ' select bin_mac_id from orders where surgery_center_id='+fact_id +' and surgery_date="' +  surg_id+'"';
				console.log(sql);
				conn.query(sql, function (err, bookedbins) {
					obj = bookedbins[0];
					bbins = [];selected_mac_id=''; // array.splice(index, 1);
					for(i=0;i<bookedbins.length;i++){if(bookedbins[i].bin_mac_id!='') bbins.push(bookedbins[i].bin_mac_id);}
					//if(bbins.length>0)selected_mac_id=bbins[0];
					sql = 'select binstatus,comments,fact_id,firmware, mac_id    , mandate,model  from bins  b  where removed_bins =0 and fact_id='+fact_id;
					console.log(sql);
					conn.query(sql, function (err, facbins) {
						
						
						all_facbin = [];for(i=0;i<facbins.length;i++){all_facbin.push(facbins[i].mac_id);}
						for(i=0;i<bookedbins.length;i++){
							if(all_facbin.includes(bookedbins[i])){
								ind = all_facbin.indexOf(bookedbins[i]);
								all_facbin.splice(ind, 1);
							}
						}
						selected_bin='';
						if(all_facbin.length > 0)					
							selected_bin = all_facbin[0];
						
						sql = 'update orders set status = 1,bin_mac_id= "'+selected_bin+'" where id='+reqs.oid;
						conn.query(sql, function (err, freebins) {
							if (err) {
								console.error(err);
								res.status(500).json({ message: "Error in finding available slots" });
								return;
							}
							console.log("Matching date of surgery")
							if(surg_id === currentDate){
								console.log("Date match");
								const selectAvailableSlotQuery = 'SELECT slot_ID FROM slots WHERE masterBin_mac_id = "'+selected_bin+'" AND status = 0 AND order_id= 0  ORDER BY slot_ID ASC LIMIT 1';
								conn.query(selectAvailableSlotQuery, function (err, availableSlots){
									if (err) {
										console.error(err);
										res.status(500).json({ message: "Error in finding available slots" });
							
									}
									if(availableSlots.length > 0){
										const availableSlot = availableSlots[0].slot_ID;
										// Now, store order details into the first available slot
										const storeOrderDetailsQuery = 'UPDATE slots SET order_id= "'+reqs.oid+'" WHERE masterBin_mac_id = "'+selected_bin+'" AND slot_ID = "'+availableSlot+'"';
										console.log(storeOrderDetailsQuery);
										conn.query(storeOrderDetailsQuery, function (err, result) {
											if (err) {
												console.error(err);
												res.status(500).json({ message: "Error in storing order details" });
												return;
											}
											console.log("Order details stored in the slot" );
										});
									}
								});
							}
							// else{
							// 	// Do something else...
							// 	console.log('Dates are not equal');
							// }
										
						});
								
					});
					
					res.send({});
				});
					
					/*
					sql = 'select id,mac_id    , facility_id  from bins_logs  where facility_id='+obj.surgery_center_id +' and surgery_dt !="'+obj.surgery_date+'"';
					console.log(sql);
					mac_id='';
					conn.query(sql, function (err, freebins) {
						
						if(freebins==undefined || freebins.length==0){
							bin=facbins[0];
							mac_id=facbins[0].mac_id;
							sql = 'insert into bins_logs(surgery_dt,facility_id,status,order_id,mac_id) values("'+obj.surgery_date+'",'+obj.surgery_center_id+',1,'+reqs.oid+',"'+facbins[0].mac_id+'")';
						}else if(freebins.length>0){
							bin=freebins[0];
							mac_id=freebins[0].mac_id;
							sql = 'insert into bins_logs(surgery_dt,facility_id,status,order_id,mac_id) values("'+obj.surgery_date+'",'+obj.surgery_center_id+',1,'+reqs.oid+',"'+freebins[0].mac_id+'")';
						}
						console.log(sql);
						
						conn.query(sql, function (err, freebins) {
							sql = 'update orders set status = 1,bin_mac_id= "'+mac_id+'" where id='+reqs.oid;
							conn.query(sql, function (err, freebins) {
							res.send({});});});
					});
					*/
			}else{res.send({});}
		});
			
	});

	// Endpoint for view order history as month
	router.post('/get_month_records', async function(req, res, next) {
    	const { surgery_center_id, month, year } = req.body;
    	const formattedMonth = month < 10 ? '0' + month : month;
		fid = surgery_center_id; // Use surgery_center_id from request body
		fffid = 0;
		sql = 'select id, name from users where id='+fid;
		await conn.query(sql, function (err, result) {
			console.log(result);
			if(undefined != result){
				sql = 'select id,fname,cell,email,fax,website from facilities where email = "'+result[0].name+'"';
				conn.query(sql, function (err, result2){
					if(undefined != result2){
						fffid = result2[0].id;
						var sql = "SELECT  orders.id,slots.slot_ID,orders.surgery_date, orders.patient_dob, orders.side AS Surgery_Side, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name, CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, CONCAT(mb.mname, ' : ', mob.model_name, ' : ', b_power_id ) As BackupIOL FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id left JOIN slots on orders.id = slots.order_id WHERE orders.surgery_center_id = '"+fffid+"' AND orders.surgery_date LIKE '"+formattedMonth+'/'+'%'+year+"' AND (orders.status=3 or orders.status = 4 or orders.status = 1)";
						const sqlParams = [fffid, `${year}-${formattedMonth}-%`]; // Using correct SQL LIKE clause syntax
						console.log(sql);
						console.log("Month =" + formattedMonth + " &&&&&&& " + "Year =" + year);
				    	console.log("Surgery Center ID = " + surgery_center_id);
						conn.query(sql, sqlParams, function(err, data) {
							if (err) {
								console.log(err);
								res.status(500).json({ error: 'An error occurred while fetching data' });
							} else {
								if (data.length === 0) {
									res.status(200).json({ message: 'No orders found for the specified date and surgery center.' });
								} else {
									console.log(data);
									res.status(200).json(data);
								}
							}
						});
					}

				});
			}
		});
	});

	// Endpoint for view order history as day
	router.post('/get_day_records', async function (req, res, next) {
		// var reqs = req.body;
		reqs = req.body;
		// console.log(reqs); // reqs.fid
		// reqs.m++;
		reqs.m=reqs.m<10?'0'+reqs.m:reqs.m;
		reqs.d=reqs.d<10?'0'+reqs.d:reqs.d;
		fid = reqs.surgery_center_id;
		console.log(reqs.m,reqs.d,reqs.y,reqs.surgery_center_id)
		fffid = 0;
	
		/*
			new order ---> 0
			approved ---> 1
			not approved ->2
			completed ---> 3 
			not completed -> 4
		*/
	
		sql = 'select id, name from users where id='+fid;
		console.log(sql);
		await conn.query(sql, function (err, result) {
			console.log(result);
			if(undefined != result){
				sql = 'select id,fname,cell,email,fax,website from facilities where email = "'+result[0].name+'"';
				console.log(':-------------'+sql);
				conn.query(sql, function (err, result2) {
					console.log(result2);

					if(undefined != result2){
						fffid = result2[0].id;
						fobj = result2[0];
					
						var sql = "SELECT  orders.id,slots.slot_ID,orders.surgery_date, orders.patient_dob, orders.side AS Surgery_Side, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name, CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, CONCAT(mb.mname, ' : ', mob.model_name, ' : ', b_power_id ) As BackupIOL FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id left JOIN slots on orders.id = slots.order_id WHERE orders.surgery_center_id = '"+fffid+"' AND orders.surgery_date = '"+reqs.m+"/"+reqs.d+"/"+reqs.y+"' AND (orders.status=3 or orders.status = 4 or orders.status = 1)";
						console.log(':-'+sql);
					
						conn.query(sql, function (err, data) {
							if (err) console.log( err);
							if(undefined != data){
								console.log(data);
					
								res.status(200).json({data});
							}
						});
					
					
					}
				});
			}
		});
	});

	// Endpoints for  related to show decommissioned Master Bins
	router.post('/decommissionedBin', async function(req, res, next) {
		reqs = req.body;
		console.log(reqs);
		const sql = 'update bins set binstatus = 3,comments="'+reqs.ans+'" where uid = '+reqs.id;
		console.log('SQL Query:', sql);
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

	// Endpoint for Recommission. After Recommission Bin will moved to un
	router.post('/moveBinToUnassignedBins', async function(req, res, next) {
		reqs = req.body;
		console.log(reqs);
		
		const sql = 'UPDATE bins SET binstatus = 0, comments = NULL WHERE uid = ' + reqs.id;
		console.log('SQL Query:', sql);
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

	// End Point for decommissioned a master Bin.
	router.post('/decommissioned', async function(req, res, next) {
		//AWS.config.update(config.aws_remote_config);
		//var results = await scanTable(config.aws_bins_table_name);
		//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
		const { fact_id } = req.body;
		if (!fact_id) {
			return res.status(400).json({ error: 'Missing fact_id in the request body' });
		}
		arrbin = [];
		const sql = 'SELECT * FROM bins WHERE binstatus = 3 AND fact_id = ?';
		console.log('SQL Query:', sql);
		conn.query(sql, function (err, results) {
			if (err) {
				console.error('SQL Query Error:', err);
				return res.status(500).json({ error: 'An error occurred while fetching data' });
			}

			console.log('Fact ID:', fact_id);
			console.log('Data:', binresults);
			res.status(200).json({ data: binresults });
		});
		
		
	});
		
	// Endpoints for  related to show unassigned Master Bins
	router.post('/unassignedBins', async function(req, res, next) {
		const { fact_id } = req.body;
		if (!fact_id) {
			return res.status(400).json({ error: 'Missing facility ID.' });
		}
		//var results = await scanTable(config.aws_users_table_name);
		//var binresults = await scanTable(config.aws_bins_table_name);
		
		//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
		
		arrbin = [];
		const sql = 'SELECT * FROM bins WHERE binstatus = 0 AND fact_id = ?';
		console.log('SQL Query:', sql);

		conn.query(sql, function (err, binresults) {
			if (err) {
				console.error('SQL Query Error:', err);
				return res.status(500).json({ error: 'An error occurred while fetching data' });
			}

			console.log('Fact ID:', fact_id);
			console.log('Data:', binresults);
			res.status(200).json({ data: binresults });
		});
	});

	
	// Endpoints for  related to see Master Bins
	router.post('/mastersBins', async function(req, res, next) {
		const { user_id } = req.body;
		const currentTime = moment(); // Use moment to get the current time
		if (!user_id) {
			return res.status(400).json({ error: 'Missing user_id in the request body' });
		}
	
		const sql = 'SELECT bins.binstatus, bins.firmware, bins.mac_id, bins.mandate, bins.model, bin_logs.timestamp FROM facilities LEFT JOIN users ON facilities.email = users.name LEFT JOIN bins ON facilities.id = bins.fact_id LEFT JOIN bin_logs ON bins.mac_id = bin_logs.mac_id WHERE bins.binstatus = 1 AND users.id = ' + user_id;
		console.log('SQL Query:', sql);
	
		conn.query(sql, [user_id], async function(err, binresults) {
			console.log(binresults);
			if (err) {
				console.error('SQL Query Error:', err);
				return res.status(500).json({ error: 'An error occurred while fetching data' });
			}
			
			const filteredBins = binresults.map(bin => {
				const lastHeartbeatTime = moment(bin.timestamp, 'YYYY-MM-DD HH:mm:ss');
				const timeDifference = currentTime.diff(lastHeartbeatTime, 'minutes');
				const connectionStatus = timeDifference <= 10 ? 1 : 0;
				const { binname, timestamp, ...rest } = bin;
				
				// Create a new bin object with 'connection_status' key-value pair
				return {
					...rest,
					connection_status: connectionStatus
				};
			});
			return res.status(200).json({ bins: filteredBins });
		});
	});

	// EndPoint to check slots info of selected Master Bins 
	router.post('/viewslots', async function(req, res, next) {
		const userMacId = req.body.mac_id; // Assuming the user sends the mac_id in the request body
		console.log('Received mac_id:', userMacId);
		const sql = 'SELECT slot_ID,masterBin_mac_id,order_id,status FROM slots WHERE masterBin_mac_id = ?';
		// console.log(sql);
		conn.query(sql, [userMacId], function (err, binresults) {

		if (err) {
			// console.error('SQL Query Error:', err);
			return res.status(500).json({ error: 'An error occurred while fetching data' });
		}
		
		if (binresults.length === 0) {
			// console.log('Bin status is not available');
			return res.status(404).json({ message: 'MasterBin Slots are not available' });
		} else {
			//if slots have order
			// console.log(binresults)
			res.status(200).json({ binresults });
		}
		});
	});

	// EndPoint to check order Details of selected slot of master bin 
	router.get('/vieworder', async function(req, res, next) {
		reqs = req.body;
		console.log(reqs);
		const macID = req.query.macID;
		const slotID = req.query.slotID;
		console.log(macID,slotID)
		sql = `Select   slots.slot_ID,orders.surgery_date, orders.status As Order_Status, orders.side AS Surgery_Side,
		CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, 
		CONCAT(mb.mname, ' : ', bb.bname, ' : ', b_power_id ) As BackupIOL,
		CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name,
		orders.patient_dob,
		CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name FROM slots
		left join orders on (slots.masterBin_mac_id = orders.bin_mac_id AND slots.order_id= orders.id)
		left JOIN manufacturers as m on orders.manufacture_id = m.id        
		left JOIN brands as b on orders.brand_id = b.id        
		left JOIN models on orders.model_id = models.id 
		left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       
		left JOIN brands as bb on orders.b_brand_id = bb.id  
		left JOIN models as mob on orders.b_model_id = mob.id 
		left JOIN other_users ON orders.surgeon_id = other_users.user_id 
		where  masterBin_mac_id = '${macID}' AND slots.slot_ID = ${slotID}`;

		conn.query(sql, function (err, binresults){
			if(err){
				console.log("Error", err);
				res.status(500).json({ message: "Error"});
			}
			// console.log(binresults)
			res.status(200).send(binresults);
		});
	});



	// Endpoints for  related to add Master Bins
	router.post('/addbin', async function(req, res, next) {
		reqs = req.body;
		const bin_mac_id = req.body.bin_mac_id;
		const socket_id = req.body.socket_id;
		console.log("Bin Mac_ID is: ====="+bin_mac_id);
		console.log("Bin socket_ID is: ====="+socket_id);
		//if(!checkToken(req)){ res.send({'message':'Please login with valid credentials'}); return; }
		
		sql = 'insert into bins (binstatus, comments,fact_id, firmware , mac_id ,mandate ,model,removed_bins,socket_id) values(0,'+
		'"","'+reqs.fact_id+'","'+reqs.firmware+'","'+reqs.macid+'","'+reqs.mandate+'","'+reqs.model+'",0,"'+socket_id+'")';
		//docClient.put(params, function(err, data) {
		console.log(sql);
		conn.query(sql, function (err, binresults) {
		if (err) {
			console.log("Error", err);
			res.send({results:"Error"});
		} else {
			console.log("Success", binresults);
			res.status(200).json({ message: "Success", socket_id: socket_id }); // Include socket_id in the response
		}
		});
	});

	//incase of password forgets
	router.post('/resetpassword', async function(req, res, next) {
		var reqs = req.body;
		console.log(reqs);

		if (reqs && reqs.email) {
			var pass = generatePassword();

			var sql = `SELECT id, name FROM users WHERE name = '${reqs.email}'`;
			console.log(sql);

			conn.query(sql, function(err, result) {
				console.log(result);
				if (err) {
					console.log(err);
				} else {
					if (result && result.length > 0) {
						sql = `UPDATE users SET passcode = '${pass}' WHERE id = ${result[0].id}`;
						console.log(sql);
						sendEmail(
							result[0].name,
							'Temporary password for surgicalbooking.com',
							`<b><i>Hi <br></i></b>Your temporary password for surgical booking is ${pass}`
						);

						conn.query(sql, function(err, result1) {
							if (err) {
								console.log(err);
							}
						});
					} else {
						console.log('User not found');
					}
				}
				res.send({});
			});
		} else {
			console.log('Email not provided');
			res.send({}); // or res.status(400).send('Email not provided');
		}
	});
	// // upload master bin details
	// router.post('/uploadbin',async function(req, res, next) {
	// 	reqs = req.body;
	// 	console.log(reqs);
		
	// 	data = reqs;
	// /*
	// Expected output
	// ------------------
	// [{
	// 	"masterBin_mac_id":"CC:DB:A7:12:91:2C",
	// 	"Slot_mac_id":"Slot 0",
	// 	"manufacturer_id":"",
	// 	"brand_id":"",
	// 	"model_id":"",
	// 	"status":"empty",
	// 	"order_id":"",
	// 	"power_id":"3",
	// 	"slotjson":""
	// }]
	// */

	// for(i=0;i<data.length;i++){
	// 	obj = data[i];
	// 	query = `INSERT INTO slots(masterBin_mac_id, Slot_id, manufacturer_id, brand_id, model_id, power_of_lens, status, order_id) 
	// 	VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
	// const values = [obj.masterBin_mac_id, obj.Slot_id, obj.manufacturer_id, obj.brand_id, obj.model_id, obj.power_of_lens, obj.status, obj.order_id];

	// await conn.query(query, values, function (err, result) {
	// 	console.log(err);
	// });

		
	// }

	// console.log('Sending success response');
	// res.json({"message":"success"});

	// });

			
	//change password
	router.post('/save_password',async function(req, res, next) {	
		// query2 = "select id, first_name,  selected_sc,  used_sc from other_users where user_id="+req.session.userid;
		reqs = req.body;
		console.log(reqs);
		old= reqs.old;
		console.log(old);
		//reqs.p
		//reqs.uid   sid = req.session.userid;   p:p,uid:o('uid').value,path:'sc'
		sql = 'select passcode from users where id='+reqs.uid;
		conn.query(sql, async function (err, result){
			if(result && result.length > 0 && result[0].passcode === old){
				if(reqs.path && reqs.path == 'sc'){

				sql = 'update users set passcode = "'+reqs.p+'" where id='+reqs.uid;
				console.log(sql);
				
				conn.query(sql, function (err, result1) {
					res.send({});
				});
			}else{
				sql = 'update users set passcode = "'+reqs.p+'" where id='+reqs.uid;
				console.log(sql);
				
				conn.query(sql, function (err, result1) {
					res.send({});
				});
			}
			}else{
				res.status(401).send({message: 'Unauthorized access.Old password is incorrect'})
			}
			
		})
		
	});

	// removing a bin
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

	//to check status of masterBin
	router.post('/showstatus', async function(req, res, next) {
		const userMacId = req.body.mac_id; // Assuming the user sends the mac_id in the request body
		console.log('Received mac_id:', userMacId);
		const sql = 'SELECT * FROM bin_logs WHERE mac_id = ? ORDER BY timestamp DESC LIMIT 1';
	
		// Current time
		const currentTime = moment(); // Use moment to get the current time
	
		conn.query(sql, [userMacId], function (err, binresults) {
		if (err) {
			console.error('SQL Query Error:', err);
			return res.status(500).json({ error: 'An error occurred while fetching data' });
		}
		
		if (binresults.length === 0) {
			console.log('Bin status is not available');
			return res.status(400).json({ message: 'Bin status is not available' });
		} else {
			const lastHeartbeatTime = moment(binresults[0].timestamp, 'YYYY-MM-DD HH:mm:ss'); // Specify the format
			// Calculate time difference in minutes
			const timeDifference = currentTime.diff(lastHeartbeatTime, 'minutes');
			// if (timeDifference <= 10) {
			// 	console.log('Bins are online');
			// 	io.emit('statusUpdate', { mac_id: userMacId, status: 'online' });
			// } else {
			// 	console.log('Bins are offline');
			// 	io.emit('statusUpdate', { mac_id: userMacId, status: 'offline' });
			// }
			if (timeDifference <= 10) {
				console.log('Bins are online');
				console.log(binresults);
				res.status(200).json({ message: 'Bins are online', status: 'online', data: binresults });
			} else {
				console.log('Bins are offline');
				console.log(binresults);
				res.status(200).json({ message: 'Bins are offline', status: 'offline', data: binresults });
			}
		}
		});
	});
// ========<<<<<<<<>>>>>>>>>>>>>>>>>>>>=====================HARDWARE Related=========================================================== 


// Endpoint Related to Hardware communication 
	//Hardware Use Only. Updating the status send by the hardware 
	router.post('/save_slot_info',async function(req, res, next) {
		/*{
			"mac_id":"CC:DB:A7:12:91:2C",
			"slot_status":101010101010101010
		}
		const myArray = text.split("");
		*/
		reqs = req.body;
		console.log(reqs);
		macID= reqs.mac_id.trim();
		sstaArr = reqs.slot_status.split('');
		console.log(sstaArr);
		sql = 'select * from slots where masterBin_mac_id = "'+macID+'"';
		console.log(sql);
		await conn.query(sql, function (err, dbresult) {
				//res.send({"message":"success"});
				// console.log(dbresult)
			dcount = dbresult.length;
			//if(dcount<sstaArr.length){
				for(si=0;si<sstaArr.length;si++){
					if(dcount>si){// In range{
											// slot_ID='"+si+"', PUT this after set if going to update slot_ID
						sql = "update slots set  status='"+ssstr(sstaArr[si])+"' where id = "+dbresult[si].id;
					}else{
						sql = "insert into slots(masterBin_mac_id,slot_ID,status) values('"+macID+"', '"+si+"', '"+ssstr(sstaArr[si])+"')";
					}
					
					conn.query(sql, function (err, dbresult) {});
				
				}
				
				res.send({"message":"success"});
			//}
		});
		
		// reqs.mac_id reqs.slot_status | id | Slot_mac_id | masterBin_mac_id  | order_id  | manufacturer_id | brand_id | power_id | model_id | status | slotjson
	});

	// function to define status on basis of 0,1 and 2 send by Hardware.
	function ssstr(id){
		switch(id){
			case 0: case '0': return 'empty';
			case 1: case '1': return 'occupied';
			case 2: case '2': return 'due';
		}
	}

	/*
	router.get('/getbinUpdate',async function(req, res, next) {	
		
		var bin_mac_id = req.query.bin_mac_id;
		console.log(bin_mac_id + ' in getbinUpdate');
		
		var sql = "SELECT orders.id,orders.surgery_date, orders.patient_dob, orders.side AS Surgery_Side, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name, CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, CONCAT(mb.mname, ' : ', bb.bname, ' : ', b_power_id ) As BackupIOL FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id  WHERE orders.bin_mac_id = '"+bin_mac_id+"' AND surgery_date = DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y')";
				
		console.log(sql);
		conn.query(sql, function (err, result) {
			if(err){
				res.status(400).send("Not Found");
			}else{
				res.status(200).json(result);
				var updateSql = "INSERT INTO bin_logs (mac_id, timestamp, connection_status) VALUES (?, NOW(), ?)";
				conn.query(updateSql, [bin_mac_id, true], function (err, updateResult) {
					if (err) {
						console.error("Error updating bin_logs:", err);
					} else {
						console.log("bin_logs updated with last heartbeat time and connection_status");
						return updateResult;
					}
				});
				
			}
		});
	});
	*/
	// Endpoint to send order details to hardware that is requested against the MasterBin MacID.
	//Hardware Use Only 
	router.get('/getbinUpdate',async function(req, res, next) {	
		
		var bin_mac_id = req.query.bin_mac_id;
		console.log(bin_mac_id + ' in getbinUpdate ----');
		var sql1= `Select * from bins where mac_id = "${bin_mac_id}"`;
		conn.query(sql1, function (err, binresults){
			if(err){
				console.log(err)
				res.status(500).json({ message: "Internal Server Error",err})
			}else if(binresults.length == 0){
				res.status(202).json({message: "No master bin is found against your given mac address"})
			}else{
				var sql = "SELECT  slots.slot_ID,orders.surgery_date, orders.patient_dob, orders.side AS Surgery_Side, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name, CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, CONCAT(mb.mname, ' : ', mob.model_name, ' : ', b_power_id ) As BackupIOL FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id left JOIN slots on orders.id = slots.order_id WHERE orders.bin_mac_id = '"+bin_mac_id+"' AND surgery_date = DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y')";
				
				console.log(sql);
				conn.query(sql, function (err, result) {
					if(err){
						res.status(400).send("Not Found");
					}else{
						var updateSql = "UPDATE bin_logs SET timestamp = NOW(), connection_status = ? WHERE mac_id = ?";
						conn.query(updateSql, [true, bin_mac_id], function (err, updateResult) {
							if (err) {
								console.error("Error updating bin_logs:", err);
								res.status(500).json({message: "Internal Server Error"})
							} else {
								console.log("bin_logs updated with last heartbeat time and connection_status");
								return updateResult;
							}
						});
						if(result.length == 0){
							res.status(200).json({message: "No new Order is available. "})
						}else{

							res.status(200).json(result);
						}
					}
				});
			}
		});	
	});

	// send live ping from hardware to assure connection with server
	router.post('/heartbeat', (req, res) => {
		const { mac_id } = req.body; // Extract MAC ID from the request body

		// Check if the bin with the provided MAC ID exists in the database
		conn.query('SELECT * FROM bins WHERE mac_id = ?', [mac_id], (err, results) => {
			if (err) {
				console.log('Error querying the database:', err);
				res.status(500).json({ message: 'Internal Server Error' });
				return;
			}

			if (results.length === 0) {
				// Bin not found
				res.status(404).json({ message: 'Bin not found' });
			} else {
				// Bin found, update its last heartbeat timestamp
				const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

				// Insert the heartbeat data into the bin_logs table
				conn.query(
					'UPDATE bin_logs SET timestamp = ?, connection_status = ? WHERE mac_id = ?',
					[currentTimestamp, true, mac_id],
					(updateErr) => {
						if (updateErr) {
							console.log('Error updating the heartbeat timestamp:', updateErr);
							res.status(500).json({ message: 'Internal Server Error' });
							return;
						}

						res.status(200).json({ message: 'Heartbeat received, bin is connected to the server' });
					}
				);
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







// General Function to remove past date orders from slots table at every night 12:00 AM 
	function slotsTBupdate() {
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);

		const updateSql = `
		UPDATE slots
		SET order_id = 0, status = 'empty'
		WHERE order_id IN (
			SELECT orders.id
			FROM orders
			WHERE orders.surgery_date < DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y')
		)
		AND status != 'due';`;
		conn.query(updateSql, function (err, updateSql) {
			if (err) {
				console.error("Error updating slots based on surgery date:", err);
				return;
			}
			console.log(updateSql);
			console.log("Slots updated successfully:", updateSql.affectedRows);
		});
	}

	async function orderPlace() {
		console.log("Updating slots table with new orders");
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);
		const sql = `SELECT id, bin_mac_id FROM orders WHERE surgery_date = DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y')`;
		console.log("Query is ", sql);
	
		try {
			const result = await new Promise((resolve, reject) => {
				conn.query(sql, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			});
	
			if (!result || result.length === 0) {
				console.log("No master bin is available with the mac address");
				console.log("No slot is available to get an order. All the slots are occupied.");
				return; // No orders to process, exit function
			}
	
			for (const row of result) {
				console.log("Row is id", row.id);
				console.log("Row is id", row.bin_mac_id);
	
				const checkExistingOrderSql = `SELECT COUNT(*) AS count FROM slots WHERE order_id = ${row.id}`;
				const existingOrderResult = await new Promise((resolve, reject) => {
					conn.query(checkExistingOrderSql, (err, result) => {
						if (err) {
							reject(err);
						} else {
							resolve(result[0].count);
						}
					});
				});
	
				if (existingOrderResult === 0) {
					const updateSql = `UPDATE slots
										SET order_id = ${row.id}
										WHERE masterBin_mac_id = '${row.bin_mac_id}'
										AND (status = '0' OR status = 'empty')
										AND order_id = 0
										ORDER BY slot_ID ASC
										LIMIT 1`;
	
					const updateResult = await new Promise((resolve, reject) => {
						conn.query(updateSql, (err, result) => {
							if (err) {
								reject(err);
							} else {
								resolve(result);
							}
						});
					});
	
					if (updateResult && updateResult.affectedRows > 0) {
						console.log(`Updated slots for bin_mac_id '${row.bin_mac_id}' with order_id ${row.id}`);
					} else {
						console.log(`No available slot for bin_mac_id '${row.bin_mac_id}' to assign order_id ${row.id}`);
						// Handle case where the slot was not updated (all slots might be occupied)
					}
				} else {
					console.log(`Order ID ${row.id} already exists in slots table. Skipping update.`);
				}
			}
		} catch (err) {
			console.error("Error:", err);
		}
	};
	
	
	// Schedule the task to run at 12:01 AM every day
	const task1 = cron.schedule('0 0 * * *', () => {
		slotsTBupdate();
	}, {
		scheduled: true,
		timezone: 'America/New_York' // Replace with your timezone, e.g., 'America/New_York'
	});

	const task2 = cron.schedule('1 0 * * *', () => {
		orderPlace();
	}, {
		scheduled: true,
		timezone: 'America/New_York' // Replace with your timezone, e.g., 'America/New_York'
	});
module.exports = router;
