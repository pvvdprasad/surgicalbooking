var express = require('express');
const nodemailer = require('nodemailer');
var conn = require('../model/db').conn;
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
	 req.session.destroy();
  res.render('admin/login', { BASE_PATH: '../' });
});



router.get('/iolsetup',async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	var sql = "select id,mname,cell from manufacturers";
	//console.log(req.session);
	console.log('userid:'+req.session.userid);
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		res.render('admin/iolsetup', { BASE_PATH: '../',results:result,userid: req.session.userid});
	  });
	  
  
});

router.post('/getfavs',async function(req, res, next) {	
	var reqs = req.body;
	uid = reqs.uid;
	opt=reqs.opt;
	// id,fav_type,surgeon_id,manufacture,model,brand from fav_iols where surgeon_id=
	var sql = 'select id,fav_type,surgeon_id,manufacture,model,brand from fav_iols where surgeon_id='+uid+' and fav_type="'+opt+'"';
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
		res.send({ result: result });
		}
	});
});

router.get('/neworder',async function(req, res, next) {	
	/*
	facilities (id INT NOT NULL AUTO_INCREMENT, fname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150), PRIMARY KEY (id))
	*/
	if(checkAuth(req,res)) return;
	
	var sql = 'select id,fname,fax,cell from facilities';
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
		//res.render('admin/dashboard', { BASE_PATH: '../' });
		}
		sql = "select id, mname, cell from manufacturers";
		conn.query(sql, function (err, result111) {
		if (err) console.log( err);
			console.log("User query created");
			res.render('admin/new_order', { BASE_PATH: '../',results2:result111,results:result,uid:req.session.userid });
		});
	  });
});


router.get('/order_history', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
		res.render('admin/order_history', { BASE_PATH: '../' });
});

router.post('/selefav', async function(req, res, next) {
	reqs = req.body;
	
	sql = 'select id,fav_type,surgeon_id,manufacture,model,brand from fav_iols where surgeon_id='+reqs.userid+' and fav_type='+reqs.id;
	console.log(sql);
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
			res.send({result:result});
		}
	});
});


router.post('/get_order', async function(req, res, next) {
	reqs = req.body;
	/*
	id INT NOT NULL AUTO_INCREMENT, surgery_center_id INT NOT NULL,surgery_date CHAR(10) NOT NULL, first_name CHAR(50),middle_name CHAR(50),last_name CHAR(50), patient_dob CHAR(20), side CHAR(10), manufacture_id INT, brand_id INT, model_id INT, power_id CHAR(5),surgeon_id INT,practise_id INT
	
	models (id INT NOT NULL AUTO_INCREMENT, model_name CHAR(200) NOT NULL, bid INT NOT NULL , PRIMARY KEY (id));";
  //var sql = "CREATE TABLE manufacturers (id INT NOT NULL AUTO_INCREMENT, mname CHAR(200) NOT NULL, cell CHAR(50), PRIMARY KEY (id));";
  
  facilities (id INT NOT NULL AUTO_INCREMENT, fname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150), PRIMARY KEY (id));"; id, bname, mid from brands
  
	*/
	sql = 'select f.fname, surgery_date,first_name,middle_name,last_name,patient_dob,side,bname,mname,model_name, power_id from orders o  LEFT JOIN facilities f on f.id=o.surgery_center_id LEFT JOIN manufacturers m on m.id= o.manufacture_id left join brands b on b.id = o.brand_id left join models mm on mm.id = model_id where o.id = '+reqs.id;
	
	console.log(sql);
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
			res.send({result:result});
		}
	});
});

router.post('/updatefacili', async function(req, res, next) {
	reqs = req.body;
	sql = 'update facilities set fname="'+reqs.namee+'",fax="'+reqs.fax+'", cell="'+reqs.phone+'", website="'+reqs.website+'" where id='+reqs.id; //   
	console.log('updatefacili---------------');
	// id: id, fax:o('facility_fax').value,phone: o('facility_phone').value,website:o('facility_website').value,namee:o('facility_name').value
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{
		}
		res.send({});
		//res.render('admin/order_history', { BASE_PATH: '../',results:result });
	});
});

router.post('/resetpassword', async function(req, res, next) {
	reqs = req.body;
	var pass = generatePassword();
	
		
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
		res.send({});
		//res.render('admin/order_history', { BASE_PATH: '../',results:result });
	});
});

router.post('/updatepractise', async function(req, res, next) {
	reqs = req.body;
	sql = 'update practises set pname="'+reqs.namee+'",fax="'+reqs.fax+'", cell="'+reqs.phone+'", website="'+reqs.website+'",npi="'+reqs.npi+'" where id='+reqs.id; //   
	console.log('updatefacili---------------');
	// id: id, fax:o('facility_fax').value,phone: o('facility_phone').value,website:o('facility_website').value,namee:o('facility_name').value
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{
		}
		res.send({});
		//res.render('admin/order_history', { BASE_PATH: '../',results:result });
	});
});

router.post('/get_day_records', async function(req, res, next) {
	

	reqs = req.body;
	reqs.m++;
	reqs.m=reqs.m<10?'0'+reqs.m:reqs.m;
	reqs.d=reqs.d<10?'0'+reqs.d:reqs.d;
	//sql = 'select * from orders where surgery_date like "'+reqs.m+'/%/'+reqs.y+'"';
	sql = 'select * from orders where surgery_date like "'+reqs.m+'/'+reqs.d+'/'+reqs.y+'"';
	console.log(sql);
	console.log(reqs.m+':'+reqs.y); // 6:2023
	/*
	id: 3,
    surgery_center_id: 1,
    surgery_date: '07/24/2023',
    first_name: 'kkhjhkjkjh',
    middle_name: 'jkhkjhkjkhkhk',
    last_name: 'khkhkhkhkhj',
    patient_dob: '07/28/2023',
    side: 'left',
    manufacture_id: 2,
    brand_id: 1,
    model_id: 2,
    power_id: '11',
    surgeon_id: 0,
    practise_id: 0 
	*/
	html='<table style="width:100%;margin:auto">';
	spanhtml='';
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
			for(i=0;i<result.length;i++){
				//result[i]
				html+='<tr><td>'+((i+1 < 10)?"0":'') + (i+1)+'</td>';
				html+='<td><span style="color:#999">Patient Name: </span><span>'+result[i].first_name + ' ' +result[i].middle_name+ ' ' +result[i].last_name+'</td>';
				html+='<td><span style="color:#999">DOB: </span><span>'+result[i].patient_dob+'</span></td>';
				html+='<td><img src="../images/uparrow.png" class="uparrow" onclick="popo('+result[i].id+')"/></td></tr>';
				spanhtml+='<input name="inputhid" type="hidden" value='+result[i].surgery_date+'/>';
			}
			html+='</table>';
		}
		res.send({html:html,spanhtml:spanhtml});
		//res.render('admin/order_history', { BASE_PATH: '../',results:result });
	});
	
});

router.post('/get_month_records', async function(req, res, next) {
	reqs = req.body;
	reqs.m++;
	reqs.m=reqs.m<10?'0'+reqs.m:reqs.m;
	sql = 'select * from orders where surgery_date like "'+reqs.m+'/%/'+reqs.y+'"';
	//sql = 'select * from orders where surgery_date like "'+reqs.m+'/'+reqs.d+'/'+reqs.y+'"';
	console.log(sql);
	console.log(reqs.m+':'+reqs.y); // 6:2023
	/*
	id: 3,
    surgery_center_id: 1,
    surgery_date: '07/24/2023',
    first_name: 'kkhjhkjkjh',
    middle_name: 'jkhkjhkjkhkhk',
    last_name: 'khkhkhkhkhj',
    patient_dob: '07/28/2023',
    side: 'left',
    manufacture_id: 2,
    brand_id: 1,
    model_id: 2,
    power_id: '11',
    surgeon_id: 0,
    practise_id: 0 
	*/
	html='<table style="width:100%;margin:auto">';
	spanhtml='';
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
			for(i=0;i<result.length;i++){
				//result[i]
			/*	html+='<tr><td>'+((i+1 < 10)?"0":'') + (i+1)+'</td>';
				html+='<td><span style="color:#999">Patient Name: </span><span>'+result[i].first_name + ' ' +result[i].middle_name+ ' ' +result[i].last_name+'</td>';
				html+='<td><span style="color:#999">DOB: </span><span>'+result[i].patient_dob+'</span></td>';
				html+='<td><img src="../images/uparrow.png" class="uparrow" onclick="popo('+result[i].id+')"/></td></tr>'; */
				spanhtml+='<input name="inputhid" type="hidden" value='+result[i].surgery_date+'/>';
			}
			html+='</table>';
		}
		res.send({html:html,spanhtml:spanhtml});
		//res.render('admin/order_history', { BASE_PATH: '../',results:result });
	});
	
});

router.post('/save_order', async function(req, res, next) {
	var reqs = req.body;
	
	console.log('2-----------------');
	console.log(reqs);
	console.log('2-----------------');
	console.log(reqs.sucenter);
	console.log('1-----------------');
	/*
	sc:o('surgery_center').value,start_dt:o('datepicker').value,fn:o('pat_first_name').value,
		mn:o('pat_middle_name').value,ln:o('pat_last_name').value,dob:o('datepicker2').value,side:o('select_side').value,sele:val
		
		CREATE TABLE orders (id INT NOT NULL AUTO_INCREMENT, surgery_center_id INT NOT NULL,surgery_date CHAR(10) NOT NULL, first_name CHAR(50),middle_name CHAR(50),last_name CHAR(50), patient_dob CHAR(20), side CHAR(10), manufacture_id INT, brand_id INT, model_id INT, power_id CHAR(5),surgeon_id INT,practise_id INT, PRIMARY KEY (id)
	*/
	
	var sql = 'INSERT INTO orders(surgery_center_id, surgery_date, first_name, middle_name, last_name, patient_dob, side, manufacture_id, brand_id, model_id, power_id,surgeon_id ,practise_id) VALUES('+reqs.sucenter+', "'+reqs.start_dt+'", "'+reqs.fn+'", "'+reqs.mn+'", "'+reqs.ln+'", "'+reqs.dob+'", "'+reqs.side+'", '+reqs.manu+', '+reqs.brand+', '+reqs.model+', "'+reqs.power+'", 0, 0)'; 
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
		}
		console.log("User query created");
		res.send({results:result});
	  });
});

router.post('/loadoptt', async function(req, res, next) {
	var reqs = req.body;
	// val:val,snam:snam
	/*
	models (id INT NOT NULL AUTO_INCREMENT, model_name CHAR(200) NOT NULL, bid
	manufacturers (id INT NOT NULL AUTO_INCREMENT, mname CHAR(200) NOT NULL, cell
	"select id, bname, mid from brands
	*/
	sql = '';
	if(reqs.snam == 'manu'){
		sql = 'select id, bname, mid from brands where mid = '+reqs.val;
	}else if(reqs.snam == 'brand'){
		sql = 'select id, model_name, bid from models where bid = '+reqs.val;
	}
	
	conn.query(sql, function (err, result) {
    if (err) console.log( err);
	else{console.log(result);
	}
    console.log("User query created");
	res.send({results:result});
  });
});

router.post('/get_fav_iol', async function(req, res, next) {
	var reqs = req.body;
	sql = 'select id,fav_type,surgeon_id,manufacture,model,brand from fav_iols where surgeon_id ='+reqs.id;
	
	console.log(sql);
	
	conn.query(sql, function (err, result) {
    if (err) console.log( err);
	else{console.log(result);
	//res.render('admin/dashboard', { BASE_PATH: '../' });
	}
    console.log("User query created");
	res.send({result:result});
  });
  
  
});


router.post('/save_fav_iol', async function(req, res, next) {
	var reqs = req.body;
	console.log(reqs);
	model = reqs.model;
	brand = reqs.brand;
	manu = reqs.manu;
	fav = reqs.fav;
	gid = reqs.gid;
	
	/*
	dashboard
	*/
	if(gid == ''){
	var sql = "INSERT into fav_iols(fav_type,surgeon_id,manufacture,model,brand ) values('"+fav+"','"+req.session.userid+"','"+manu+"','"+model+"','"+brand+"')";
	}else{
		sql = 'update fav_iols set manufacture='+manu+', model='+model+',brand='+brand+' where id='+gid;
	}
	
	console.log(sql);
	
	//sql = "INSERT INTO fav_iols (fav_type,surgeon_id,manufacture,model,brand ) VALUES ('"+fav+"','"+req.session.userid+"','"+manu+"','"+model+"','"+brand+"') ON DUPLICATE KEY UPDATE c=c+1;'";
	
	//var sql = "select role from users where name ='"+loginid+"' and passcode='"+passid+"'";
  // {model: modelsele, brand:brandsele, manu:manusele, fav:favsele}
  conn.query(sql, function (err, result) {
    if (err) console.log( err);
	else{console.log(result);
	//res.render('admin/dashboard', { BASE_PATH: '../' });
	}
    console.log("User query created");
  });
  
  res.send('respond with a resource');
});

router.get('/manumain', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	res.render('admin/manumain', { BASE_PATH: '../', results:[] });
});
router.post('/deleteEntity', async function(req, res, next) {
	reqs=req.body;
	/*
	'select id,mname,cell from manufacturers';
	// "select id, bname, mid from brands";"select id , model_name , bid from models "
	results = '';
	
	conn.query(sql, function (err, result) {
		console.log(result);
		sql = 'select id, bname, mid from brands';
		conn.query(sql, function (err, result) {
			console.log(result);
			sql = 'select id , model_name , bid from models ';
	*/
	if(reqs.ch==1){
		sql='select b.id as bid, mo.id as moid,m.mname from models mo left join brands b on b.id = mo.bid left join manufacturers m on m.id = b.mid where m.id='+reqs.id;
		console.log(sql);
		await conn.query(sql, function (err, result) {if (err) console.log( err);	
			//arr=[];
			hhh="";
			for(i=0;i<result.length;i++){
				//arr.push(result[i].moid);
				hhh+=result[i].moid;
				if(i<result.length-1)
					hhh+=",";
			}
			//console.log(arr);
			sql='delete from models where id in ('+hhh+')';
			console.log(sql);
			 conn.query(sql, function (err, result) {if (err) console.log( err);	
				sql='delete from brands where mid='+reqs.id;
				console.log(sql);
				conn.query(sql, function (err, result) {if (err) console.log( err);
					sql='delete from manufacturers where id='+reqs.id;
					console.log(sql);
					conn.query(sql, function (err, result) {if (err) console.log( err);
				});
			});
			});
		});
	}else if(reqs.ch==2){
		sql='delete from models where bid='+reqs.id;
		await conn.query(sql, function (err, result) {if (err) console.log( err);
			sql='delete from brands where id='+reqs.id;
			conn.query(sql, function (err, result) {if (err) console.log( err);});
		});
	}else if(reqs.ch==3){
		sql='delete from models where id='+reqs.id;
		await conn.query(sql, function (err, result) {if (err) console.log( err);
		});
	}
	//reqs.id
	res.send({results:''});
});
router.post('/addpractise', async function(req, res, next) {
	var reqs = req.body;
	console.log('In addpractise...........');
	console.log(reqs);
	/*
	pname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150), npi char(50),
	prac_name: o('first_name').value,website: o('website').value,fax: o('fax').value,cell: o('cell').value,email: o('email').value,npi: o('npi').value
	*/
	var sql = "INSERT INTO practises(pname,fax,cell,website, npi) VALUES('"+reqs.prac_name+"','"+reqs.fax+"','"+reqs.cell+"','"+reqs.website+"','"+reqs.npi+"')";
	console.log(sql);
	
	await conn.query(sql, function (err, result) {
    if (err) console.log( err);
	else{
	}
	res.send({results:''});
	});
});

router.get('/testtable', async function(req, res, next) {
	sql = 'select id,mname,cell from manufacturers';
	// "select id, bname, mid from brands";"select id , model_name , bid from models "
	results = '';
	
	conn.query(sql, function (err, result) {
		console.log(result);
		sql = 'select id, bname, mid from brands';
		conn.query(sql, function (err, result) {
			console.log(result);
			sql = 'select id , model_name , bid from models ';
			conn.query(sql, function (err, result) {
				console.log(result);
			});
		});
	});
	
	res.send('respond with a resource'); 
});

router.post('/editfacility', async function(req, res, next) {
	var reqs = req.body; // fac_id facilities (id INT NOT NULL AUTO_INCREMENT, fname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150)
	
	var sql = "select id,fname,fax ,cell,website from facilities where id="+reqs.fac_id;
	
	await conn.query(sql, function (err, results) {
		console.log(results);
	
	// AWS.config.update(config.aws_remote_config);
	/*
	var results = await scanTable(config.aws_facility_table_name);
	*/
	html = '<h2>Edit Facility</h2>';
	html += '<input class="form-control" id="facility_name" type="text" name="facility_name" placeholder="Enter Facility Name"  value="'+ results[0].fname +'" /><br><input class="form-control" id="facility_website" type="text" name="facility_website" placeholder="Enter Website" value="'+ results[0].website +'" /><br><input class="form-control" id="facility_phone" type="text" name="facility_phone" placeholder="Enter Phone" value="'+ results[0].cell +'" /><br><input class="form-control" id="facility_fax" type="text" name="facility_fax" placeholder="Enter Fax" value="'+ results[0].fax +'" />';
		
	html += '<br /><br /><input class="btn cbut grey" type="button" onclick="remove_facility(\''+reqs.fac_id+'\')" value="Remove"><input class="btn cbut blue" style="margin-left:40px" type="button" onclick="update_facility(\''+reqs.fac_id+'\')" value="Save">';
	});
	res.send({ html:html });
	
});

router.post('/editpractise', async function(req, res, next) {
	var reqs = req.body; // fac_id facilities (id INT NOT NULL AUTO_INCREMENT, fname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150)
	
	// practises(pname,fax,cell,website, npi)
	
	var sql = "select id,pname,fax,cell,website, npi from practises where id="+reqs.pra_id;
	
	await conn.query(sql, function (err, results) {
		console.log(results);
	
	// AWS.config.update(config.aws_remote_config);
	/*
	var results = await scanTable(config.aws_facility_table_name);
	*/
	html = '<h2>Edit Practise</h2>';
	html += '<input class="form-control" id="facility_name" type="text" name="facility_name" placeholder="Enter Facility Name"  value="'+ results[0].pname +'" /><br><input class="form-control" id="facility_website" type="text" name="facility_website" placeholder="Enter Website" value="'+ results[0].website +'" /><br><input class="form-control" id="facility_phone" type="text" name="facility_phone" placeholder="Enter Phone" value="'+ results[0].cell +'" /><br><input class="form-control" id="facility_fax" type="text" name="facility_fax" placeholder="Enter Fax" value="'+ results[0].fax +'" /><br><input class="form-control" id="npi" type="text" name="npi" placeholder="Enter NPI" value="'+ results[0].npi +'" />';
		
	html += '<br /><br /><input class="btn cbut grey" type="button" onclick="remove_practise(\''+reqs.pra_id+'\')" value="Remove"><input class="btn cbut blue" style="margin-left:40px" type="button" onclick="update_practise(\''+reqs.pra_id+'\')" value="Save">';
	});
	res.send({ html:html });
	
});
router.post('/removefacility', async function(req, res, next) {
	var reqs = req.body;
	
	var sql = 'delete from facilities where id='+reqs.fac_id;
	await conn.query(sql, function (err, result) {
    if (err) console.log( err);
	res.send({});
	});
});
router.post('/removepractise', async function(req, res, next) {
	var reqs = req.body;
	
	var sql = 'delete from practises where id='+reqs.fac_id;
	await conn.query(sql, function (err, result) {
    if (err) console.log( err);
	res.send({});
	});
});

router.post('/search_surgeon', async function(req, res, next) {
	var reqs=req.body;
	console.log(reqs);
	
	res.send({});
});

router.get('/settings', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	query = "select id,fname,fax,cell,website from facilities";
	
	var reqs=req.body;
	console.log(reqs);
	
	await conn.query(query, function (err, result) {
    if (err) console.log( err);
	res.render('admin/settings', { BASE_PATH: '../', result:result});
	});
	
	//res.render('admin/settings', { BASE_PATH: '../'});
});

router.get('/admindash', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	sql = 'select id,fname,fax,cell,website from facilities';
	results = '';
	console.log(sql);
	
	await conn.query(sql, function (err, result) {
    if (err) console.log( err);
	else{
		console.log(result);
		results = result;
	
	/*for(i=0;i<result.length;i++){
		//console.log(result[i]);
		req.session.userid = result[i].id;
		break;
	}*/
	sql1 = 'select id,pname,fax,cell,website, npi from practises'; 
	console.log(sql1);
	conn.query(sql1, function (err, result2) {
    if (err) console.log( err);
	else{
	
	console.log(result2);
	res.render('admin/dashboard2', { BASE_PATH: '../', results:results, result2:result2 });
	}
	});
	}
	});
	//console.log('outside.........');
	//console.log(results);
	
	
});

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function sendEmail(to,sub, body){
	// send html in body
	var transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'info@surgislate.com',
    pass: 'Sbin@8924'
  }
});

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

router.get('/testq', async function(req, res, next) {
	
	sql = "select id from users order by id desc limit 1";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		
		res.send({html:result[0].id});
	  });
});

router.post('/addsurgeon', async function(req, res, next) {
	reqs = req.body;
	var pass = generatePassword();
	
	userid=0;
	sql = "";
	
	
	sql = "INSERT INTO users(name,passcode,role ) VALUES('"+reqs.first_name+"','"+pass+"',2)";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		
		
		
		console.log("Surgeon query created");	
		
	  });
	  
	  sql = 'select id from users order by id desc limit 1';
	await conn.query(sql, function (err, result) {
			console.log('----------------');
			console.log(result);
			console.log('----------------');
			userid=result[0].id;
			console.log('userid----------:'+userid);
			
			sql = "INSERT INTO other_users(user_id,first_name,middle_name,last_name,cell,email,npi,passcode,fact_id) VALUES('"+userid+"','"+reqs.first_name+"','"+reqs.middle_name+"','"+reqs.last_name+"','"+reqs.cell+"','"+reqs.email+"','"+reqs.npi+"','"+pass+"','"+reqs.facid+"')";
	
			console.log(sql);
	
		 conn.query(sql, function (err, result) {
			if (err) throw err;
			res.send('respond with a resource'); 
		  });
		});

	console.log(sql);	
	
		
	sendEmail(reqs.email,'Temporary password for surgicalbooking.com', '<b><i>Hi '+reqs.first_name+',<br></i></b>Your temporary password is '+pass);
	
	
});

router.post('/adduser', async function(req, res, next) {
	/*
	other_users user_id INT NOT NULL, first_name CHAR(50),  middle_name CHAR(50),  last_name CHAR(50),cell CHAR(50),email CHAR(150), npi char(50),passcode char(50)
	*/
	reqs = req.body;
	var pass = generatePassword();
	
	sql = "INSERT INTO other_users(user_id,first_name,middle_name,last_name,cell,email,npi,passcode) VALUES('"+reqs.facid+"','"+reqs.first_name+"','"+reqs.middle_name+"','"+reqs.last_name+"','"+reqs.cell+"','"+reqs.email+"','','"+pass+"')";
	
	console.log(sql);
	
		
	sendEmail(reqs.email,'Temporary password for surgicalbooking.com', '<b><i>Hi '+reqs.first_name+',<br></i></b>Your temporary password is '+pass);
	
	await conn.query(sql, function (err, result) {
			if (err) throw err;
			console.log("facilities query created");	
			res.send('respond with a resource'); 
		  });
	
	//res.send({results:{}});
});
router.post('/showRightSurgeon', async function(req, res, next) {
	id = req.body.userid;
	console.log(id+'<--->');
	
	var sql = 'select id,user_id,first_name,middle_name,last_name,cell,email,npi,passcode from other_users where id='+id;
	
	html = '';
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		
		// html += '<div style="background:grey;width:20px;height:20px;margin:0 auto"></div>';
		userresults = result[0];
		sbox = '<div style="background:green;width:20px;height:20px;margin:0 auto"></div>';
		html = '<table><tr><th>Status</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th>Cell</th><th>Email</th></tr>';
		html += '<tr><td style="text-align:center">'+sbox+'</td><td>'+userresults['first_name']+'</td><td>'+userresults['middle_name']+'</td><td>'+userresults['last_name']+'</td><td>'+userresults.cell+'</td><td>'+userresults.email+'</td></tr></table>';
			
		html += '<br><br><br><br><br>';
		html += '<a style="float:right" href="javascript:removesurgeon(\''+id+'\')">Remove Surgeon</a>';
		html += '<br><br><br><br><br>';
		html += '<input class="btn cbut grey" type="button" onclick="reset_password(\''+id+'\',\''+userresults.email+'\')" value="Reset Password" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button"  class="cbut btn blue" onclick="exit_screen()" value="Exit" />';
		res.send({results:html});
	  });
});
router.post('/removeuser', async function(req, res, next) {
	reqs=req.body;
	await conn.query('delete from other_users where id='+reqs.user_id, function (err, result) {
		res.send({});
	});
});

router.post('/showRightUser', async function(req, res, next) {
	//AWS.config.update(config.aws_remote_config);
	//const docClient = new AWS.DynamoDB.DocumentClient();
	id = req.body.userid;
	console.log(id+'<--->');
	
	var sql = 'select id,user_id,first_name,middle_name,last_name,cell,email,npi,passcode from other_users where id='+id;
	
	html = '';
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		
		// html += '<div style="background:grey;width:20px;height:20px;margin:0 auto"></div>';
		userresults = result[0];
		sbox = '<div style="background:green;width:20px;height:20px;margin:0 auto"></div>';
		html = '<table><tr><th>Status</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th>Cell</th><th>Email</th></tr>';
		html += '<tr><td style="text-align:center">'+sbox+'</td><td>'+userresults['first_name']+'</td><td>'+userresults['middle_name']+'</td><td>'+userresults['last_name']+'</td><td>'+userresults.cell+'</td><td>'+userresults.email+'</td></tr></table>';
			
		html += '<br><br><br><br><br>';
		html += '<a style="float:right" href="javascript:removeuser(\''+id+'\')">Remove User</a>';
		html += '<br><br><br><br><br>';
		html += '<input class="btn cbut grey" type="button" onclick="reset_password(\''+id+'\',\''+userresults.email+'\')" value="Reset Password" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button"  class="cbut btn blue" onclick="exit_screen()" value="Exit" />';
		res.send({results:html});
	  });
});

router.post('/allmanufacturers', async function(req, res, next) {
	var sql = "select id,mname,cell from manufacturers";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		res.send({results:result});
	  });
});

router.post('/allbrands', async function(req, res, next) {
	var sql = "select b.id, bname, mname from brands b left join manufacturers m on mid = m.id";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		res.send({results:result});
	  });
});

router.post('/brandbymid', async function(req, res, next) {
	reqs = req.body;
	var sql = "select id, bname, mid from brands where mid="+reqs.id;
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		res.send({results:result});
	  });
});
router.post('/allmodels', async function(req, res, next) {
	var sql = "select mo.id , model_name , bname,mname from models mo left join brands b on mo.bid = b.id left join manufacturers m on b.mid = m.id";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		res.send({results:result});
	  });
});
router.post('/modelbymid', async function(req, res, next) {
	reqs = req.body;
	var sql = "select id , model_name , bid from models where bid="+reqs.id;
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		res.send({results:result});
	  });
});



router.post('/addmanufacturer', async function(req, res, next) {
	var reqs = req.body;
	var sql = "INSERT INTO manufacturers(mname,cell) values('"+reqs.mname+"','"+reqs.cell+"')";//  id,mname,cell from manufacturers;
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");
		res.send({results:result});
	  });
});

/*
brands  -> id, bname, mid
var sql = "CREATE TABLE models (id INT NOT NULL AUTO_INCREMENT, model_name CHAR(200) NOT NULL, bid INT NOT NULL , PRIMARY KEY (id));";

*/
router.post('/addbrand', async function(req, res, next) {
	var reqs = req.body; // mid:msel,bname:bnam
	var sql = "INSERT INTO brands(bname,mid) values('"+reqs.bname+"','"+reqs.mid+"')";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("brand  created");
		res.send({results:result});
	  });
});

router.post('/addmodel', async function(req, res, next) {
	var reqs = req.body; // mid:msel,bname:bnam
	var sql = "INSERT INTO models(model_name,bid) values('"+reqs.bname+"','"+reqs.bid+"')";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Model  created");
		res.send({results:result});
	  });
});


router.post('/showSurgeons', async function(req, res, next) {
	
	//const docClient = new AWS.DynamoDB.DocumentClient();
	id = req.body.id;
	console.log(id+'<--->showSurgeons');
	var sql = "select id,user_id,first_name,middle_name,last_name,cell,email,npi from other_users where fact_id = " + id +" and npi != 'undefined' and npi !=''";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		//res.send('respond with a resource'); 
		res.send({results:result});
	  });
});

router.post('/showUsers', async function(req, res, next) {
	
	//const docClient = new AWS.DynamoDB.DocumentClient();
	id = req.body.id;
	console.log(id+'<--->');
	var sql = "select id,user_id,first_name,middle_name,last_name,cell,email,npi from other_users where user_id = " + id;
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");	
		//res.send('respond with a resource'); 
		res.send({results:result});
	  });
});

router.post('/addFacility', function(req, res, next) {
    console.log('in  the addFacility...');
    console.log(req.body);
	
	var pass = generatePassword();
	
	
	
	reqs = req.body;
	console.log(reqs.facility_name);
	

	try{
		var sql = "INSERT INTO facilities(fname,fax,cell,website) VALUES('"+reqs.facility_name+"','"+reqs.facility_fax+"','"+reqs.facility_phone+"','"+reqs.facility_website+"')";
		
		conn.query(sql, function (err, result) {
			if (err) throw err;
			console.log("facilities query created");
			
			
			
			res.send('respond with a resource'); 
		  });
		
	}catch(e){console.log(e);}
	
});


router.get('/logout',  function(req, res, next) {
	console.log('in the logout');
	//console.log(req.session);
	try{
	//if(typeof req.session === undefined){}else{
		req.session.destroy(); // 
	//}
	}catch(e){console.log(e);}
	res.render('admin/login', { BASE_PATH: '../' });
}); 



function checkAuth(req,res){
	rr = false;
	if(!req.session || !req.session.userid){
		rr = true;
		res.render('admin/login', { BASE_PATH: '../' });
	}
	return rr;
}

router.get('/dashboard',  function(req, res, next) {
res.render('admin/dashboard', { BASE_PATH: '../' });
});

router.post('/postlogin', function(req, res, next) {
  var reqs = req.body;
  var loginid =	reqs.loginid;
  var passid =	reqs.passid;
  var surgeonradio = reqs.surgeonradio;
  console.log(reqs);
 
  
  var sql = "select id,role from users where name ='"+loginid+"' and passcode='"+passid+"'";
  //VALUES('surgeon','surgeon',2)";
  conn.query(sql, function (err, result) {
    if (err) console.log( err);
	else{//console.log(result);
	
	for(i=0;i<result.length;i++){
		//console.log(result[i]);
		req.session.userid = result[i].id;
		break;
	}
	console.log(req.session);
	try{
	if(!req.session || !req.session.userid){res.render('admin/login', { BASE_PATH: '../' });
	}else{
	console.log('user id exists');
	//req.session.role_id = 2;
	if(surgeonradio==3){
		req.session.role_name = 'surgeon';
		res.render('admin/dashboard', { BASE_PATH: '../' });
	}else if(surgeonradio==1){
		req.session.role_name = 'admin';
		//res.render('admin/dashboard2', { BASE_PATH: '../' });
		res.redirect('admindash');
	}else if(surgeonradio==2){
		req.session.role_name = 'surgycenter';
	
		res.render('admin/dashboard', { BASE_PATH: '../' });
		}
	}
	}catch(e){}
    console.log("User query created");
  }});
  
  
});

module.exports = router;
