var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var conn = require('../model/db').conn;
const config = process.env;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const io = require('../bin/www').io;
const moment = require('moment');

  
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

    const sql = 'SELECT * FROM orders WHERE surgery_date = ? AND surgery_center_id = ?';

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
        return res.status(400).json({ error: 'Missing fact_id in the request body' });
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
// Endpoints for  related to show assigned Master Bins
router.post('/assignedBins', async function(req, res, next) {
    const { fact_id } = req.body;

    if (!fact_id) {
        return res.status(400).json({ error: 'Missing fact_id in the request body' });
    }

    const sql = 'SELECT * FROM bins WHERE binstatus = 1 AND fact_id = ?';
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
	
	var sql = "SELECT  orders.surgery_date, orders.patient_dob, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name, CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, CONCAT(mb.mname, ' : ', bb.bname, ' : ', b_power_id ) As BackupIOL FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id  WHERE orders.bin_mac_id = '"+bin_mac_id+"' AND surgery_date = DATE_FORMAT(CURRENT_DATE(),'%m/%d/%Y')";
			 
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
                'INSERT INTO bin_logs (mac_id, timestamp, connection_status) VALUES (?, ?, ?)',
                [mac_id, currentTimestamp, true],
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



module.exports = router;
