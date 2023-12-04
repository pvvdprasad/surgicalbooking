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
	console.log(reqs);
	sid= reqs.sid
	sql = 'select  id from facilities where email = (select name from users where id = '+sid+')';

	await conn.query(sql, function (err, result) {
		sid = result[0].id;
		console.log(sid);
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
		console.log(sql);
	
		conn.query(sql, function (err, result) {
			if (err){
			
				console.log( err);
				res.status(500).send("Not Found")
			}else{
				if(result.length > 0){
					console.log(result);
					res.status(200).json(result);
				}else{
					res.json({ message: "No New order available"})
				}
			}
				
		});
	});
});

router.post('/approveorder', async function(req, res, next) {
	reqs = req.body;
	console.log(reqs);
	
	sql = 'select surgery_date,surgery_center_id,bin_mac_id from orders where id='+reqs.oid;
	//sql = 'update orders set status = 1 where id='+reqs.oid;
	await conn.query(sql, function (err, result) {
		fact_id = 0;
		if(result[0].bin_mac_id == ''){
			fact_id = result[0].surgery_center_id;
			surg_id = result[0].surgery_date;
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
					const selectAvailableSlotQuery = 'SELECT slot_ID FROM slots WHERE masterBin_mac_id = "'+selected_bin+'" AND status = 0 AND order_id= 0  ORDER BY slot_ID ASC LIMIT 1';
					conn.query(selectAvailableSlotQuery, function (err, availableSlots){
						if (err) {
							console.error(err);
							res.status(500).json({ message: "Error in finding available slots" });
							return;
						}
						if(availableSlots.length > 0){
							const availableSlot = availableSlots[0].slot_ID;
							// Now, store order details into the first available slot
							const storeOrderDetailsQuery = 'UPDATE slots SET order_id= "'+reqs.oid+'", status = "occupied" WHERE masterBin_mac_id = "'+selected_bin+'" AND slot_ID = "'+availableSlot+'"';
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
					})
					res.status(200).json({ message : "Successfully Approved;"});
				});
			});
		});
		}else{res.send({});}
	});
	
});
// Endpoint for view order history as month
router.post('/get_month_records', async function(req, res, next) {
    const { surgery_center_id, month, year } = req.body;
    const formattedMonth = month < 10 ? '0' + month : month;

    const sql = 'SELECT * FROM orders WHERE surgery_date LIKE ? AND surgery_center_id = ?';
    const sqlParams = [`${formattedMonth}/%/${year}`, surgery_center_id];

    console.log(sql);
    console.log("Month =" + formattedMonth + " &&&&&&& " + "Year =" + year);
    console.log("Surgery Center ID = " + surgery_center_id);

    conn.query(sql, sqlParams, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'An error occurred while fetching data' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: 'No orders found for the specified date and surgery center.' });
            } else {
                console.log(result);
                res.status(200).json(result);
            }
        }
    });
});

// Endpoint for view order history as day
router.post('/get_day_records', async function (req, res, next) {
    const { m, d, y, surgery_center_id } = req.body;

    // Ensure proper formatting of month and day with leading zeros.
    const month = m < 10 ? '0' + m : m;
    const day = d < 10 ? '0' + d : d;

    const formattedDate = `${month}/${day}/${y}`;

    const sql = `select o.id,surgery_date, 
				CONCAT(o.first_name, ' ', o.middle_name, ' ', o.last_name) As Patient_Name,
				o.patient_dob,o.side as Surgery_Side,
				CONCAT(u.first_name, ' ', u.middle_name, ' ', u.last_name) As Surgeon_Name,
				CONCAT(m.mname , ' : ', models.model_name, ' : ' , o.power_id) As PrimaryIOL,   
				CONCAT(mb.mname, ' : ', bb.bname, ' : ', o.b_power_id ) As BackupIOL 
				from orders o 
				left join other_users u on u.user_id = o.surgeon_id 
				left JOIN manufacturers as m on o.manufacture_id = m.id  
				left JOIN models on o.model_id = models.id 
				left JOIN manufacturers as mb on o.b_manufacture_id = mb.id 
				left JOIN brands as bb on o.b_brand_id = bb.id 
				left JOIN facilities as f on o.surgery_center_id= f.id 
				WHERE 
				surgery_date = ? AND surgery_center_id = ?`;

    console.log(sql);
    console.log(formattedDate); // Example: 10/24/2023
    console.log(surgery_center_id);

    conn.query(sql, [formattedDate, surgery_center_id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'An error occurred while fetching data' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: 'No orders found for the specified date against your surgery center.' });
            } else {
                console.log(result);
                res.status(200).json(result);
            }
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

// Mobile View USe
// Endpoints for  related to see Master Bins
router.post('/mastersBins', async function(req, res, next) {
    const { fact_id } = req.body;

    if (!fact_id) {
        return res.status(400).json({ error: 'Missing fact_id in the request body' });
    }

    const sql = 'SELECT binname, binstatus, firmware, mac_id, mandate, model FROM bins WHERE binstatus = 1 AND fact_id = ?';
	console.log('SQL Query:', sql);

    conn.query(sql, [fact_id], function (err, binresults) {
        if (err) {
            console.error('SQL Query Error:', err);
            return res.status(500).json({ error: 'An error occurred while fetching data' });
        }

        console.log('Fact ID:', fact_id);
        console.log('Data:', binresults);
        res.status(200).json({ data: binresults });
    });
});
// EndPoint to check slots info of selected Master Bins 
router.post('/viewslots', async function(req, res, next) {
	const userMacId = req.body.mac_id; // Assuming the user sends the mac_id in the request body
	console.log('Received mac_id:', userMacId);
	const sql = 'SELECT * FROM slots WHERE masterBin_mac_id = ? AND order_id != 0';
	// console.log(sql);
	conn.query(sql, [userMacId], function (err, binresults) {
	  if (err) {
		// console.error('SQL Query Error:', err);
		return res.status(500).json({ error: 'An error occurred while fetching data' });
	  }
	  
	  if (binresults.length === 0) {
		// console.log('Bin status is not available');
		return res.status(400).json({ message: 'Bin status is not available' });
	  } else {
		// console.log(binresults)
		res.status(200).json({ message: 'Bins are online', status: 'online', data: binresults });
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

router.post('/uploadbin',async function(req, res, next) {
	reqs = req.body;
	console.log(reqs);
	
	data = reqs;
/*
Expected output
------------------
[{
	"masterBin_mac_id":"CC:DB:A7:12:91:2C",
	"Slot_mac_id":"Slot 0",
	"manufacturer_id":"",
	"brand_id":"",
	"model_id":"",
	"status":"empty",
	"order_id":"",
	"power_id":"3",
	"slotjson":""
}]
*/

for(i=0;i<data.length;i++){
	obj = data[i];
	query = `INSERT INTO slots(masterBin_mac_id, Slot_id, manufacturer_id, brand_id, model_id, power_of_lens, status, order_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const values = [obj.masterBin_mac_id, obj.Slot_id, obj.manufacturer_id, obj.brand_id, obj.model_id, obj.power_of_lens, obj.status, obj.order_id];

await conn.query(query, values, function (err, result) {
    console.log(err);
});

	
}

console.log('Sending success response');
res.json({"message":"success"});

});


//Hardware Use Only 
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

function ssstr(id){
	switch(id){
		case 0: case '0': return 'empty';
		case 1: case '1': return 'occupied';
		case 2: case '2': return 'due';
	}
}

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
//Hardware Use Only 
router.get('/getbinUpdate',async function(req, res, next) {	
	
    var bin_mac_id = req.query.bin_mac_id;
    console.log(bin_mac_id + ' in getbinUpdate ----');
	
	var sql = "SELECT  orders.id,slots.slot_ID,orders.surgery_date, orders.patient_dob, orders.side AS Surgery_Side, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name, CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, CONCAT(mb.mname, ' : ', mob.model_name, ' : ', b_power_id ) As BackupIOL FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id left JOIN slots on orders.id = slots.order_id WHERE orders.bin_mac_id = '"+bin_mac_id+"' AND surgery_date = DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y')";
			 
	console.log(sql);
	conn.query(sql, function (err, result) {
		if(err){
			res.status(400).send("Not Found");
		}else{
			res.status(200).json(result);
			var updateSql = "UPDATE bin_logs SET timestamp = NOW(), connection_status = ? WHERE mac_id = ?";
			conn.query(updateSql, [true, bin_mac_id], function (err, updateResult) {
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

// Schedule the task to run at 12:01 AM every day
cron.schedule('1 0 * * *', () => {
    slotsTBupdate();
}, {
    scheduled: true,
    timezone: 'America/New_York' // Replace with your timezone, e.g., 'America/New_York'
});

module.exports = router;
