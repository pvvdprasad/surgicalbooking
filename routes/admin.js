var express = require('express');
const nodemailer = require('nodemailer');
var conn = require('../model/db').conn;
var router = express.Router();
const moment = require('moment');
const io = require('socket.io');
// Update of November 28
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
	 req.session.destroy();
  res.render('admin/login', { BASE_PATH: '../' });
});

router.get('/forgetpassword', function(req,res, next){
	res.render('admin/forgetpassword', { BASE_PATH: '../', results:[] });
});


router.post('/save_favsg',async function(req, res, next) {
	var reqs = req.body;
	console.log(reqs);
	var sql = 'update other_users set selected_sc = "'+reqs.ttt+'" where user_id='+reqs.id;
	console.log(sql);
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("updated query");	
		res.send({});
	  });
});

router.get('/iolsetup',async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	var sql = "select id,mname,cell from manufacturers";
	//console.log(req.session);
	//console.log('userid:'+req.session.userid);
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
	fav_type = 'fav_type = "'+opt+'"';
	
	if('backupIoL' == opt || 'fav3' == opt)
		fav_type='fav_type = "fav3" or fav_type = "backupIoL"'; 
	// id,fav_type,surgeon_id,manufacture,model,brand from fav_iols where surgeon_id=
	var sql = 'select id,fav_type,surgeon_id,manufacture,model,brand from fav_iols where surgeon_id='+uid+' and ('+fav_type+')';
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
		res.send({ result: result });
		}
	});
});

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

router.get('/neworder',async function(req, res, next) {	
	/*
	facilities (id INT NOT NULL AUTO_INCREMENT, fname CHAR(200) NOT NULL,fax CHAR(50),cell CHAR(50),website CHAR(150), PRIMARY KEY (id))
	*/
	if(checkAuth(req,res)) return;
	
	sql = 'select id,facility_id,status from surgeon_facility where surgeon_id='+req.session.userid;
	console.log(sql);
	conn.query(sql, function (err, result) {
		/*
		selected_sc=result[0].selected_sc;
	if(selected_sc != ''){
		sf=selected_sc.split('|');
		ttt = '';
		for(i=0;i<sf.length;i++){
			if(sf[i] != ''){
				ttt += sf[i].split(':')[0]+',';
			}
		}
		var ttt = ttt.slice(0, -1);
		*/
		arr = [];
		for(i=0;i<result.length;i++){
			ff=result[i].facility_id;
			if(!arr.includes(ff)){
				arr.push(ff);
			}
		}
	
	sql = 'select id,fname,fax,cell from facilities where id in ('+arr.toString()+')';
	console.log(sql);
	conn.query(sql, function (err, fresult) {
		if (err) console.log( err);
		else{console.log(result);
		//res.render('admin/dashboard', { BASE_PATH: '../' });
		}
		sql = "select id, mname, cell from manufacturers";
		conn.query(sql, function (err, result111) {
		if (err) console.log( err);
			console.log("User query created");
			console.log(fresult);
			res.render('admin/new_order', { BASE_PATH: '../',results2:result111,results:fresult,uid:req.session.userid });
		});
	  });
	  
	 // }else{
		//sql = 'select id,fname,fax,cell from facilities';
		//conn.query(sql, function (err, fresult) {
		//	if (err) console.log( err);
		//	else{console.log(result);
			//res.render('admin/dashboard', { BASE_PATH: '../' });
		//}
		/*
	sql = "select id, mname, cell from manufacturers";
	conn.query(sql, function (err, result111) {
	if (err) console.log( err);
		console.log("User query created");
		res.render('admin/new_order', { BASE_PATH: '../',results2:result111,results:[],uid:req.session.userid });
	}); */
		//  });
	  // }
	  
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
	sql = 'select f.fname, surgery_date,first_name,middle_name,last_name,patient_dob,side,b.bname,m.mname,mm.model_name, power_id,mb.mname as back_manu ,mmb.model_name as back_model_name,b_power_id from orders o  LEFT JOIN facilities f on f.id=o.surgery_center_id LEFT JOIN manufacturers m on m.id= o.manufacture_id left join brands b on b.id = o.brand_id left join models mm on mm.id = model_id LEFT JOIN manufacturers mb on mb.id= o.manufacture_id left join brands bb on bb.id = o.brand_id left join models mmb on mmb.id = model_id where o.id = '+reqs.id;
	
	console.log(sql);
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
			res.send({result:result});
		}
	});
});

router.post('/get_orders', async function(req, res, next) {
	reqs = req.body;
	ids = reqs.ids;
	
	console.log(ids);
	
	sql = 'select f.fname, surgery_date,first_name,middle_name,last_name,patient_dob,side,b.bname,m.mname,mm.model_name, power_id, mb.mname as back_manu ,bb.bname as back_bname,mmb.model_name as back_model_name,b_power_id from orders o  LEFT JOIN facilities f on f.id=o.surgery_center_id LEFT JOIN manufacturers m on m.id= o.manufacture_id left join brands b on b.id = o.brand_id left join models mm on mm.id = model_id LEFT JOIN manufacturers mb on mb.id= o.manufacture_id left join brands bb on bb.id = o.brand_id left join models mmb on mmb.id = model_id where o.id IN ('+reqs.ids+')';
	
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
	console.log(reqs);
	sql = 'update facilities set fname="'+reqs.namee+'",fax="'+reqs.fax+'", email="'+reqs.email+'", cell="'+reqs.phone+'", website="'+reqs.website+'" where id='+reqs.id; //   
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
	console.log(reqs)
	var pass = generatePassword();
	
		
	sql = `select id,name from users where name= '${reqs.email}'`;
	console.log(sql);
	conn.query(sql, function (err, result) {
		console.log(result)
		if (err) console.log( err);
		else{
			sql = 'update users set passcode ="'+pass+'" where id='+result[0].id;	
			console.log(sql);
			sendEmail(result[0].name,'Temporary password for surgicalbooking.com', '<b><i>Hi <br></i></b>Your temporary password for surgical booking is '+pass);
			conn.query(sql, function (err, result1) {
			
			});
		}
		res.render('admin/login', { BASE_PATH: '../',results:result , message : " Mail is sent to given email."});
		// res.send({});
	});
});

router.post('/updatepractise', async function(req, res, next) {
	reqs = req.body;
	sql = 'update practises set pname="'+reqs.namee+'",fax="'+reqs.fax+'", cell="'+reqs.phone+'", website="'+reqs.website+'",npi="'+reqs.npi+'" where id='+reqs.id; //   
	console.log('updatepractise---------------');
	// id: id, fax:o('facility_fax').value,phone: o('facility_phone').value,website:o('facility_website').value,namee:o('facility_name').value
	
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{
		}
		res.send({});
		//res.render('admin/order_history', { BASE_PATH: '../',results:result });
	});
});

router.post('/get_day_records_nnnn', async function(req, res, next) {
	
	reqs = req.body;
		reqs.m++;
	reqs.m=reqs.m<10?'0'+reqs.m:reqs.m;
	reqs.d=reqs.d<10?'0'+reqs.d:reqs.d;
	sid=reqs.sid;
	
	sql = 'select  id from facilities where email = (select name from users where id = '+sid+')';
	
	await conn.query(sql, function (err, result) {
		sid = result[0].id;
				sql = 'select o.id,u.first_name,u.middle_name,u.last_name,surgery_date,o.surgeon_id from orders o  left join other_users u on u.user_id = o.surgeon_id where status= 0 AND surgery_date like "'+reqs.m+'/'+reqs.d+'/'+reqs.y+'" and surgery_center_id='+sid+' order by surgery_date';
	
	
	
	
		console.log(sql);
	
		conn.query(sql, function (err, result) {
			if (err) console.log( err);
			else{console.log(result);
				html='<table class="table"><tr><th>Surgeon Name</th><th>Surgery Date</th><th>Cases</th></tr>';
				dd='';count=0;
				for(i=0;i<result.length;i++){
					if(dd==result[i].surgeon_id){
						count++;
					}else{
						if(count>0){
							html+='<td>'+(count)+' case(s)</td>';html+='</tr>';
						}
						count=0;count++;
//						dd=result[i].surgery_date;
						dd=result[i].surgeon_id;
						//html+='<tr><td><input type="checkbox" name="chdnames" value="'+result[i].id+'" /></td>';
						html+='<tr style="cursor:pointer" onclick="showindiv('+reqs.m+','+reqs.d+','+reqs.y+','+sid+','+result[i].surgeon_id+')"><td><span style="color:#333">'+result[i].first_name + ' ' +result[i].middle_name+ ' ' +result[i].last_name+'</td>';
						html += '<td>'+result[i].surgery_date+'</td>';
						//html += '<td><a href="javascript:void(0);" onclick="popo('+result[i].id+')" class="view-detail-link" data-order-id="' + result[i].id + '">View Detail</a></td>';
					//spanhtml+='<input name="inputhid" type="hidden" value='+result[i].surgery_date+'/>';
					}
				}
				html+='<td>'+(count)+' case(s)</td></tr>';
				res.send({html:html});
			}
	
		});
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
	html=`<table style="width:100%;margin:auto" class="table">
			<tr>
				<th>#</th>
				<th> Patient Name: </th>
				<th> DOB: </th>
				<th> Action </th> 
			</tr>`;
	spanhtml='';
	conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{console.log(result);
			for(i=0;i<result.length;i++){
				//result[i]
				html+='<tr><td><input type="checkbox" name="chdnames" value="'+result[i].id+'" /></td>';
				html+='<td><span style="color:#999">'+result[i].first_name + ' ' +result[i].middle_name+ ' ' +result[i].last_name+'</td>';
				html+='<td><span>'+result[i].patient_dob+'</span></td>';
				html+='<td><img src="../images/uparrow.png" class="uparrow" onclick="popo1('+result[i].id+')"/></td>';
				html += '<td><a href="javascript:void(0);" onclick="popo('+result[i].id+')" class="view-detail-link" data-order-id="' + result[i].id + '">View Detail</a></td></tr>';
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
	/*sucenter:o('surgery_center').value,start_dt:o('datepicker').value,fn:o('pat_first_name').value,
        mn:o('pat_middle_name').value,ln:o('pat_last_name').value,dob:o('datepicker2').value,side:o('select_side').value,sele:val,manu:o('select_manu').value,brand:o('select_brand').value,model:o('select_model').value,power:o('select_power').value,pri_iol:val,back_iol:val1,manu2:o('select_manu2').value,brand2:o('select_brand2').value,model2:o('select_model2').value,power2:o('select_power2').value
	*/
	
	// ,b_manufacture_id,b_brand_id ,b_model_id ,b_power_id
	var sql = 'INSERT INTO orders(surgery_center_id, surgery_date, first_name, middle_name, last_name, patient_dob, side, manufacture_id, brand_id, model_id, power_id,surgeon_id ,practise_id,first_sel_type,second_sel_type,status,b_manufacture_id, b_brand_id , b_model_id , b_power_id , bin_mac_id) VALUES('+reqs.sucenter+', "'+reqs.start_dt+'", "'+reqs.fn+'", "'+reqs.mn+'", "'+reqs.ln+'", "'+reqs.dob+'", "'+reqs.side+'", '+reqs.manu+', '+reqs.brand+', '+reqs.model+', "'+reqs.power+'", '+req.session.userid+', '+reqs.sucenter+', "'+reqs.back_iol+'", "'+reqs.pri_iol+'",0, '+reqs.manu2+', '+reqs.brand2+', '+reqs.model2+', "'+reqs.power2+'","")'; 
	console.log(sql);
	
	await conn.query(sql, function (err, result) {
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
router.post('/assignbins3', async function(req, res, next) {
	reqs = req.body;
	sql = 'select * from bins where binstatus = 1 and fact_id = '+reqs.id;
	await conn.query(sql, function (err, result) {
		if (err) console.log( err);
		
		res.send({ results: result});
		/*
		for(i=0;i<result.length;i++){
			
		}
		*/
	});	
});
router.post('/loadFacDropdown', async function(req, res, next) {
	
	tarr = [];
	sql = 'select fact_id from bins where binstatus = 1 group by fact_id;';
	await conn.query(sql, function (err, result) {
		if (err) console.log( err);
		for(i=0;i<result.length;i++){
			tarr.push(result[i].fact_id);
		}
	});
	
	sql = 'select * from facilities where id like "%'+tarr+'%"';
	await conn.query(sql, function (err, result) {
		if (err) console.log( err);
		
		res.send({ results: result});
	});	
	
	//var facresults = await scanTable(config.aws_facility_table_name);
	//html = '<option value="">Select Facility</option>';
	// console.log(facresults)
	// res.send({facresults:facresults});
});
router.post('/assignbins2', async function(req, res, next) {
	reqs = req.body;
	
	console.log('In the assign bins serrvice.........');
	console.log(reqs);
	
	
	sparr = reqs.ff.split('|');
	id = reqs.id;tarr = [];
	
	for(i=0;i<sparr.length;i++){
		if(sparr[i] != '')
		tarr.push(sparr[i]);
	}
	sql = 'update bins set  binstatus = 1,fact_id = '+id+' where uid in ('+tarr+')';
	console.log(sql);
		
	//}
	
	await conn.query(sql, function (err, result) {
			if (err) console.log( err);
		});	
	
	res.render('admin/binsearch', { BASE_PATH: '../', results: {}});
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

router.post('/viewAllSurgeons', async function(req, res, next) {
	var reqs = req.body;
	console.log('In addpractise...........');
	console.log(reqs);
	sql = `select id,user_id,first_name,middle_name,last_name,cell,email,npi,selected_sc,used_sc from other_users where npi != '' && removed_users= False`;
	
	await conn.query(sql, function (err, result) {
		if (err){
			console.log( err);
			res.status(500).send({ error: 'Internal Server Error' });
		} else{
			console.log(result)
			res.status(200).send({ data: result }); // Send a success response with the data
		}
		
	});
});

router.post('/addpractise', async function(req, res, next) {
	var reqs = req.body;
	console.log('In addpractise...........');
	console.log(reqs);
	var pass = generatePassword();
	var sql = 'INSERT INTO users (name,passcode,role) values("'+reqs.email+'","'+pass+'",2)';
	
	/*
		{
	  prac_name: 'uuhuhukhkhj',
	  website: 'kjkhkhkkj.jhb',
	  fax: '788676887',
	  cell: '8787877876',
	  email: 'jksfjhkjdsfkjdsf@sffdg.dff',
	  npi: '908089'
		}
	*/
	console.log(sql);
	await conn.query(sql, function (err, result) {
		if (err) console.log( err);
		else{
		}
		sql = "select id, name from users where passcode = '"+pass+"'";
		console.log(sql);
		conn.query(sql, function (err, result1) {
		if (err) console.log( err);
		else{
			if(result1){
				for(i=0;i<result1.length;i++){
					console.log(result1[i]);
					var userid = result1[i].id;
					sql = "INSERT INTO other_users(user_id,first_name,middle_name,last_name,cell,email,npi,passcode,selected_sc,used_sc) VALUES('"+userid+"','"+reqs.prac_name+"','"+reqs.middle_name+"','"+reqs.last_name+"','"+reqs.cell+"','"+reqs.email+"','"+reqs.npi+"','"+pass+"','','')";
					console.log(sql);
					conn.query(sql, function (err, result1) {
					if (err) console.log( err);
					
					else{
					}
					sendEmail(reqs.email,'Temporary password for surgicalbooking.com', '<b><i>Hi '+reqs.prac_name+',<br></i></b>Your temporary password is '+pass);
					});
					break;
				}
				res.send({results:''});
			}
		}
		/*
		sql = "INSERT INTO other_users(user_id,first_name,middle_name,last_name,cell,email,npi,passcode,fact_id,selected_sc,used_sc) VALUES('"+userid+"','"+reqs.first_name+"','"+reqs.middle_name+"','"+reqs.last_name+"','"+reqs.cell+"','"+reqs.email+"','"+reqs.npi+"','"+pass+"','"+reqs.facid+"','','')";
		
		console.log(result);
		*/
	});
//	var sql = "INSERT INTO practises(pname,fax,cell,website, npi) VALUES('"+reqs.prac_name+"','"+reqs.fax+"','"+reqs.cell+"','"+reqs.website+"','"+reqs.npi+"')";
//	console.log(sql);
	
	/*
	await conn.query(sql, function (err, result) {
    if (err) console.log( err);
	else{
	}
	res.send({results:''});
	});
	*/
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
	
	var sql = "select id,fname,fax,email ,cell,website from facilities where id="+reqs.fac_id;
	console.log(sql);
	
	await conn.query(sql, function (err, results) {
		console.log(results);
		
	// 	html = '<h2>Edit Facility</h2>';
	// html += '<input class="form-control" id="facility_name" type="text" name="facility_name" placeholder="Enter Facility Name"  value="'+ results[0].fname +'" /><br><input class="form-control" id="facility_website" type="text" name="facility_website" placeholder="Enter Website" value="'+ results[0].website +'" /><br><input class="form-control" id="facility_phone" type="text" name="facility_phone" placeholder="Enter Phone" value="'+ results[0].cell +'" /><br><input class="form-control" id="facility_fax" type="text" name="facility_fax" placeholder="Enter Fax" value="'+ results[0].fax +'" /><br><input class="form-control" id="facility_email" type="text" name="facility_email" placeholder="Enter Email" value="'+ (undefined ==results[0].email?"":results[0].email) +'" />';
		
	// html += '<br /><br /><input class="btn cbut grey" type="button" onclick="remove_facility(\''+reqs.fac_id+'\')" value="Remove"><input class="btn cbut blue" style="margin-left:40px" type="button" onclick="update_facility(\''+reqs.fac_id+'\')" value="Save">';
	//res.send({ facility:html });

		var facilityData = {
			id: results[0].id,
			fname: results[0].fname,
			fax: results[0].fax,
			email: results[0].email || '', // Handle undefined case
			cell: results[0].cell,
			website: results[0].website
	  };
	  res.status(200).send({ facility: facilityData });
	  
	});
	
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
	html += '<input class="form-control" id="facility_name" type="text" name="facility_name" placeholder="Enter Facility Name"  value="'+ results[0].pname +'" /><br><input class="form-control" id="facility_website" type="text" name="facility_website" placeholder="Enter Website" oninput="validateURL(this)" value="'+ results[0].website +'" /><br><input class="form-control" id="facility_phone" type="text" name="facility_phone" placeholder="Enter Phone" value="'+ results[0].cell +'" /><br><input class="form-control" id="facility_fax" type="text" name="facility_fax" placeholder="Enter Fax" value="'+ results[0].fax +'" /><br><input class="form-control" id="npi" type="text" name="npi" placeholder="Enter NPI" value="'+ results[0].npi +'" />';
		
	html += '<br /><br /><input class="btn cbut grey" type="button" onclick="remove_practise(\''+reqs.pra_id+'\')" value="Remove"><input class="btn cbut blue" style="margin-left:40px" type="button" onclick="update_practise(\''+reqs.pra_id+'\')" value="Save">';
	});
	res.send({ html:html });
	
});
router.post('/removefacility', async function(req, res, next) {
	var reqs = req.body;
	
	//var sql = 'delete from facilities where id='+reqs.fac_id;
	var sql = 'UPDATE facilities SET removed_users= True where id='+reqs.fac_id ;
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

router.post('/save_search_surgeon', async function(req, res, next) {
	var reqs=req.body;
	console.log(reqs);
	sids=reqs.sids;
	//sids = sids.replace(/\|/g, '');
	sidArr = sids.split('|');
	/*sArr = [];
	for(i=0;i<sidArr.length;i++){
		if(sidArr[i] != '')
			sArr.push(sidArr[i]);
	}*/
	//  fid,sids
	// reqs.fid 
	
	//sql = 'select id,surgeons from facilities where id='+reqs.fid;
	for(i=0;i<sidArr.length;i++){
		if(sidArr[i] != ''){
			sql = 'insert into surgeon_facility(surgeon_id,status,facility_id) values('+sidArr[i]+',0,'+reqs.fid+')';
			await conn.query(sql, function (err, result) {
			if (err) console.log(err);
			});
		}
	}
	res.send({});
});

function mergeResult(surgeons, sids){
	surarr = []; siarr = [];
	if(surgeons=='' || surgeons == null) surarr = [];
	else surarr = surgeons.split('|');
	if(sids!='')
	siarr = sids.split('|');
	
	for(i=0;i<siarr.length;i++)
	if(!surarr.includes(siarr[i]))
		surarr.push(siarr[i]);
	
	su = '|';
	for(i=0;i<surarr.length;i++)
		if(surarr[i] != '')
		su += surarr[i] + '|';
	
	return su;
}

function getStatus(linkids,surarr,strrr,id){
	console.log('id is:----:'+id);
	console.log(surarr);
	console.log(strrr);
	for(j=0;j<surarr.length;j++){
		if(surarr[j] == id){
			return strrr[j]+'|'+linkids[j];
		}
	}
}


router.post('/showsurgeons1', async function(req, res, next) {
    var reqs = req.body;
    console.log(reqs);

    sql = 'select id,fname,surgeons from facilities where id=' + reqs.fid;
    html = '<h2 style="text-align:center">Surgeons</h2><br><p style="text-align:left">';
    
    await conn.query(sql, function(err, result) {
        if (result != undefined && result.length > 0) {
            var obj = result[0]; // Assuming you only expect one result
            html += obj.fname + '</p><table class="table"><tr><th>Select</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th>NPI</th></tr>';
			html += '<style>table{width:100% !important;} th{color:#FFF !important; background:#003595 !important; padding:6px !important;}</style>';
            
            if (obj.surgeons != null && obj.surgeons != '') {
                oarr = obj.surgeons.split('|');
                o = '';
                for (j = 0; j < oarr.length; j++) {
                    if (oarr[j] != '')
                        o += oarr[j] + ',';
                }
                var answer = o.slice(0, -1);
                
                sql = 'select id,first_name,middle_name,last_name,npi from other_users where id in (' + answer + ')';
                
                conn.query(sql, function(err, result2) {
                    if (result2 != undefined && result2.length > 0) {
                        for (i = 0; i < result2.length; i++) {
                            console.log(result2[i]);
                            html += '<tr><td><input type="checkbox" name="dlinkchs" value=' + result2[i].id + ' /></td><td>' + result2[i].first_name + '</td><td>' + result2[i].middle_name + '</td><td>' + result2[i].last_name + '</td><td>' + result2[i].npi + '</td></tr>';
                        }
                        console.log('End...........');
                        html += '</table><br><input type="button" class="btn cbut blue bbbutons" style="position:relative" onclick="dlink(' + reqs.fid + ')" value="Dlink" />';
                    } else {
                        html += '<tr><td colspan="5">No surgeons found</td></tr>';
                    }
                    res.send({ html: html });
                });
            } else {
                html += '<tr><td colspan="5">No surgeons found</td></tr>';
                res.send({ html: html });
            }
        } else {
            res.send({ noSurgeons: true }); // Send a flag indicating no surgeons were found
        }
    });
});


router.post('/dlink', async function(req, res, next) {
	var reqs=req.body;
	console.log(reqs);
	console.log('dlink-------------');
	// arr = str.split(',');
	// { fid: '1', tarr: '24,30' }
	tarr = reqs.tarr.split(',');

	for(i=0;i<tarr.length;i++){
		if(tarr[i] != ''){
			sql = 'delete from surgeon_facility where facility_id ='+reqs.fid+' and surgeon_id = '+tarr[i];
			console.log(sql);
			await conn.query(sql, function (err, result) {
				
			});
		}
	}
	res.send({});
	// reqs.fid reqs.tarr
	/*
	 var ttt = reqs.tarr.split(',');
	for(i=0;i<ttt.length;i++){
	}
	// sql = 'update facilities set id,surgeons from facilities where id ='+reqs.fid;
	sql = 'select id,surgeons from facilities where id ='+reqs.fid;
	await conn.query(sql, function (err, result) {
		
		if (err) console.log( err);
		console.log('result-----------');
		console.log(result);
		oor=[];
		obj = '';
		 if(result.length > 0){
			obj = result[0];
			var ttt = reqs.tarr.split(',');
			for(i=0;i<ttt.length;i++){
				console.log(i+':--------------:'+ttt[i]+':');
				obj.surgeons=obj.surgeons.replace(ttt[i], "");
				console.log(obj.surgeons);
			}
		} 
		sql = 'update facilities set surgeons = "'+obj.surgeons+'" where id ='+reqs.fid;
		conn.query(sql, function (err, result) {
			res.send({result:result});
		});			
	}); 
	*/
});

router.post('/search_surgeon', async function(req, res, next) {
	var reqs=req.body;
	console.log(reqs);
	
	id = reqs.fid;
	txt = reqs.text;
	
	// var sql = 'select id,first_name,last_name,middle_name,npi from other_users where selected_sc like "%|'+id+':%" AND( first_name like "%'+txt+'%" OR middle_name like "%'+txt+'%" OR last_name like "%'+txt+'%" OR npi like "%'+txt+'%")';
	
	sql = 'select id,user_id,first_name,last_name,middle_name,npi from other_users where (first_name like "%'+txt+'%" or last_name like "%'+txt+'%" or middle_name like "%'+txt+'%" or npi like "%'+txt+'%" ) AND (npi != \'\')';
	console.log(sql);
	await conn.query(sql, function (err, result) {
    if (err) console.log( err);
	console.log(result);
		
	res.send({result:result});
	});
	
});
/*
 id | surgery_center_id | surgery_date | first_name | middle_name | last_name     | patient_dob | side  | manufacture_id | brand_id | model_id | power_id | surgeon_id | practise_id | first_sel_type | second_sel_type | b_manufacture_id | b_brand_id | b_model_id | b_power_id | status |
*/
router.post('/scorderhistory', async function(req, res, next) {
	var reqs = req.body;
	console.log(reqs); // reqs.fid
	fid = reqs.fid;
	fffid = 0;
	
	/*
		new order ---> 0
		approved ---> 1
		not approved ->2
		completed ---> 3 
		not completed -> 4
	*/
	
	sql = 'select id, name from users where id='+reqs.fid;
	console.log(sql);
	await conn.query(sql, function (err, result) {
		if(undefined != result){
			sql = 'select id,fname,cell,email,fax,website from facilities where email = "'+result[0].name+'"';
			console.log(':-------------'+sql);
			conn.query(sql, function (err, result2) {
				if(undefined != result2){
					fffid = result2[0].id;
					fobj = result2[0];
					
					sql = 'select o.id,surgery_date,patient_dob,side ,status,manufacture_id,brand_id,model_id,power_id,surgeon_id,practise_id,first_sel_type,second_sel_type, u.npi, u.first_name,u.middle_name,u.last_name  from orders o left join other_users u on u.user_id = o.surgeon_id where surgery_center_id='+fffid+' and (status=3 or status = 4 or status = 1)';
					console.log(':-'+sql);
					html = '<h2 style="width:100%;text-align:center">Completed Orders</h2><table class="table"><tr><th class="thdd">Sr#</th><th class="thdd">Surgeon NPI</th><th class="thdd">Surgeon Name</th><th class="thdd">DOS</th><th class="thdd">Status</th></tr>';
	
					conn.query(sql, function (err, result33) {
						if (err) console.log( err);
						if(undefined != result33){
							//console.log(result33);
							for(i=0;i<result33.length;i++){
								obj = result33[i];
								//console.log(obj);
								html += '<tr class="cp" onclick="printorder('+obj.id+')"><td>'+(i+1)+'</td><td>'+(obj.npi)+'</td><td>'+(obj.first_name +' '+ obj.middle_name + ' ' +obj.last_name)+'</td><td>'+(obj.surgery_date)+'</td>';
								if(obj.status == 3){ // completed
									html += '<td style="color:green">Completed</td>';
								}else{
									html += '<td style="color:red">UnCompleted</td>';
								}
								
								html += '</tr>';
								console.log(html);
							}
							html += '</table>';
					
							res.send({html:html});
						}
					});
					
					
				}
			});
		}
	});
});

router.post('/loaddates', async function(req, res, next) {
	var reqs = req.body;
	fid = reqs.fid;
	
	sql = 'select id, name from users where id='+reqs.fid;
	console.log(sql);
	await conn.query(sql, function (err, result) {
		if(undefined != result){
			sql = 'select id,fname,cell,email,fax,website from facilities where email = "'+result[0].name+'"';
			console.log(':-------------'+sql);
			conn.query(sql, function (err, result2) {
				if(undefined != result2){
					fffid = result2[0].id;
					fobj = result2[0];
					
					sql = 'select o.id,surgery_date,patient_dob,side ,manufacture_id,brand_id,model_id,power_id,surgeon_id,practise_id,first_sel_type,second_sel_type, u.npi, u.first_name,u.middle_name,u.last_name  from orders o left join other_users u on u.user_id = o.surgeon_id where surgery_center_id='+fffid+' and status=0';
					cases = new Map([]);
					caseArr = [];
					console.log(sql);
										
					conn.query(sql, function (err, result33) {
						if (err) console.log( err);
						if(undefined != result33){
							console.log(result33);							
							for(i=0;i<result33.length;i++){
								obj = result33[i];
								caseArr.push(obj);
								key = obj['surgeon_id'] + '_' + obj['surgery_date'];
								console.log('key is'+key);
								if(!cases.has(key)){
									cases.set(key, []);
								//	console.log('no key');
								}
							//	console.log(cases);
								temparr = cases.get(key);
								temparr.push(obj);
								cases.delete(key);
								//console.log(cases);
								cases.set(key, temparr);
								//console.log(cases);
							}
							
						}
						console.log('Before sending...........');
						console.log(cases);
						res.send({'cases':caseArr});
						
					});
					
				}
			});
		}
	});
});

router.post('/scneworders', async function(req, res, next) {
	
	var reqs = req.body;
	console.log(reqs); // reqs.fid
	fid = reqs.fid;
	fffid = 0;
	fobj = {};
	gresult = '';
	
	sql = 'select id, name from users where id='+reqs.fid;
	console.log(sql);
	await conn.query(sql, function (err, result) {
		if(undefined != result){
			sql = 'select id,fname,cell,email,fax,website from facilities where email = "'+result[0].name+'"';
			console.log(':-------------'+sql);
			conn.query(sql, function (err, result2) {
				if(undefined != result2){
					fffid = result2[0].id;
					fobj = result2[0];
					
					sql = 'select o.id,surgery_date,patient_dob,side ,manufacture_id,brand_id,model_id,power_id,surgeon_id,practise_id,first_sel_type,second_sel_type, u.npi, u.first_name,u.middle_name,u.last_name  from orders o left join other_users u on u.user_id = o.surgeon_id where surgery_center_id='+fffid+' and status=0';
					console.log(':-'+sql);
					html = '<h2 style="width:100%;text-align:center">New Orders</h2><table class="table"><tr><th class="thdd">Sr#</th><th class="thdd">Surgeon NPI</th><th class="thdd">Surgeon Name</th><th class="thdd">DOS</th></tr>';
	
					conn.query(sql, function (err, result33) {
						if (err) console.log( err);
						if(undefined != result33){
							//console.log(result33);
							for(i=0;i<result33.length;i++){
								obj = result33[i];
								//console.log(obj);
								html += '<tr class="cp" onclick="openorder('+obj.id+')"><td>'+(i+1)+'</td><td>'+(obj.npi)+'</td><td>'+(obj.first_name +' '+ obj.middle_name + ' ' +obj.last_name)+'</td><td>'+(obj.surgery_date)+'</td></tr>';
								console.log(html);
							}
							html += '</table>';
					
							res.send({html:html});
						}
					});
					
					
				}
			});
		}
	});
	
	 
	
	
	
	/*
	select surgery_date,patient_dob,side ,manufacture_id,brand_id,model_id,power_id,surgeon_id,practise_id,first_sel_type,second_sel_type, u.npi, u.first_name,u.middle_name,u.last_name  from orders o left join other_users u on u.user_id = o.surgeon_id where surgery_center_id=13 and status=0 and o.surgeon_id = 25;
	*/

	
	//console.log(sql);
	
});

router.post('/scneworders2', async function(req, res, next) {
	
	var reqs = req.body;
	console.log(reqs); // reqs.fid
	// fid = reqs.fid;
	m = reqs.m;
	d = reqs.d;
	y = reqs.y;
	sid = reqs.sid;
	surid = reqs.surid;
	
	fffid = 0;
	fobj = {};
	gresult = '';
	
	/*
	//sql = 'select id, name from users where id='+reqs.fid;
	console.log(sql);
	await conn.query(sql, function (err, result) {
		if(undefined != result){
			//sql = 'select id,fname,cell,email,fax,website from facilities where email = "'+result[0].name+'"';
			console.log(':-------------'+sql);
			conn.query(sql, function (err, result2) {
				if(undefined != result2){
					fffid = result2[0].id;
					fobj = result2[0];
					
					
					*/
					sql = 'select o.id,surgery_date,patient_dob,side,o.first_name as fn,o.middle_name as mn,o.last_name   as ln,manufacture_id,brand_id,model_id,power_id,surgeon_id,practise_id,first_sel_type,second_sel_type, u.npi, u.first_name,u.middle_name,u.last_name  from orders o left join other_users u on u.user_id = o.surgeon_id where surgery_center_id = '+sid+' and surgeon_id='+surid+' and surgery_date like "'+m+'/'+d+'/'+y+'" ';
					console.log(':-'+sql);
					html = '<h2 style="width:100%;text-align:center"></h2><table class="table"><tr><th class="thdd">Sr#</th><th class="thdd">Patient Name</th><th class="thdd">Surgeon Name</th><th class="thdd">DOS</th></tr>';
	
					await conn.query(sql, function (err, result33) {
						if (err) console.log( err);
						if(undefined != result33){
							//console.log(result33);
							for(i=0;i<result33.length;i++){
								obj = result33[i];
								//console.log(obj);
								html += '<tr class="cp" onclick="openorder('+obj.id+')"><td>'+(i+1)+'</td><td>'+(obj.fn+' '+obj.mn+' '+obj.ln)+'</td><td>'+(obj.first_name +' '+ obj.middle_name + ' ' +obj.last_name)+'</td><td>'+(obj.surgery_date)+'</td></tr>';
								console.log(html);
							}
							html += '</table>';
					
							res.send({html:html});
						}
					});
					
				/*	
				}
			});
		}
	});*/
});


router.post('/getbindeta', async function(req, res, next) {
	reqs = req.body;
	
	html = '<table class="">';
	
	sql = "SELECT  orders.id,slots.slot_ID,orders.surgery_date, orders.patient_dob, orders.side AS Surgery_Side, CONCAT(other_users.first_name, ' ', other_users.last_name) As Surgeon_Name, CONCAT(orders.first_name, ' ', orders.last_name) As Patient_Name, CONCAT(m.mname , ':', models.model_name, ':' , orders.power_id) As PrimaryIOL, CONCAT(mb.mname, ' : ', mob.model_name, ' : ', b_power_id ) As BackupIOL FROM  bins left JOIN orders ON  bins.mac_id = orders.bin_mac_id left JOIN other_users ON orders.surgeon_id = other_users.user_id left JOIN manufacturers as m on orders.manufacture_id = m.id        left JOIN brands as b on orders.brand_id = b.id        left JOIN models on orders.model_id = models.id left JOIN manufacturers as mb on orders.b_manufacture_id = mb.id       left JOIN brands as bb on orders.b_brand_id = bb.id  left JOIN models as mob on orders.b_model_id = mob.id left JOIN slots on orders.id = slots.order_id WHERE orders.id = '"+reqs.id+"'";
	
	await conn.query(sql, function (err, result) {
		for(i=0;i<result.length;i++){
			obj = result[0];
			html += '<tr><td>'+obj.Surgeon_Name+'</td><td>DOS:'+obj.surgery_date+'</td></tr>';
			html += '<tr><td>'+obj.Patient_Name+'</td><td>DOB:'+obj.patient_dob+'</td></tr>';
			html += '<tr><td colspan=2>IOL(P):'+obj.PrimaryIOL+'</td></tr>';
			html += '<tr><td colspan=2>IOL(B):'+obj.BackupIOL+'</td></tr>';
		}
		html += '</table>';
	
		res.send({html:html});
	});
});

router.post('/openbin', async function(req, res, next) {
	reqs = req.body;
	
	sql = 'select id,slot_ID,masterBin_mac_id,order_id,status from slots where masterBin_mac_id="'+reqs.bid+'"';
	
	html = '<table class="table">';tc='style="border-left:1px solid #000"';
	html += '<tr><td>Master Bin</td><td colspan=5>'+reqs.bid+'('+(reqs.isalive=='yes'?'Online':'Offline')+')</td></tr>';
	html += '<tr><th>Slave #</th><th>Display Info</th><th>Status</th><th '+tc+'>Slave #</th><th>Display Info</th><th>Status</th></tr>'
	await conn.query(sql, function (err, result) {
		for(i=0;i<result.length;i++){
			tc='';
			if(i==0||i==2||i==4||i==6||i==8||i==10||i==12||i==14) html += '<tr>';
			else tc='style="border-left:1px solid #000"';
			html += '<td '+tc+'>Slot'+result[i].slot_ID+'</td>';
			if(result[i].order_id == 0)
				html += '<td>Available</td><td>Empty</td>';
			else
				html += '<td name="orids">'+result[i].order_id+'</td><td>Full</td>';
			if(i==1||i==5||i==7||i==9||i==11||i==13||i==15||i==3) 
			html += '</tr>';
		}
		html += '</table>';
	
		res.send({html:html});
	});
	
		
});

router.post('/loadbins', async function(req, res, next) {
	reqs = req.body;
	// sql = 'select binstatus,comments,fact_id,firmware, b.mac_id    , mandate,model  from bins  b left join users u on u.name=f.email left join facilities f on f.email = u.name where removed_bins =0 and u.id='+reqs.fid+' and f.id=b.fact_id';
	
	sql = 'select uid,binstatus,comments,fact_id,firmware, b.mac_id, mandate,model,connection_status  from bins  b left join facilities f on f.id=b.fact_id  left join users u on u.name=f.email left join bin_logs l on l.mac_id= b.mac_id where removed_bins =0 and u.id='+reqs.fid;
	
	console.log(sql);
	await conn.query(sql, function (err, result) {
	console.log(result);
	html = '';
	for(i=0;i<result.length;i++){
		html += '<div class="bindivs" onclick="openbin(\''+result[i].mac_id+'\')">';
		html += result[i].mac_id;
		html += '<div style="float:right;margin-left:5px;width:20px;height:20px;background:';
		html += result[i].connection_status==1?'green':'red';
		
		html += '"></div>';
		html += '</div>';
		if(result[i].connection_status==1)
			html +='<input type="hidden" id="hidlive" value="yes"/>';
		else
			html +='<input type="hidden" id="hidlive" value="no"/>';
	}
	
	res.send({html:html});
	
	});
	
});

router.post('/printorder', async function(req, res, next) {
	reqs = req.body;
	console.log(reqs);
	
	sql = 'select surgery_date,patient_dob,side, m.mname, b.bname, d.model_name ,manufacture_id,brand_id,model_id,power_id,surgeon_id, practise_id,first_sel_type,second_sel_type, u.npi, o.first_name,o.middle_name,o.last_name,u.first_name as sfname, u.last_name as lfname, u.middle_name as mfname  from orders o	left join manufacturers m on m.id = o.manufacture_id left join brands b on b.id = o.brand_id left join models d on d.id = o.model_id left join other_users u on u.user_id = o.surgeon_id where o.id='+reqs.oid;
	
	await conn.query(sql, function (err, result) {
		obj = result[0];
		html = '<table class="table"><tr><td colspan="2" style="font-size:25px;text-align:center"><b>Information</b></td></tr><tr><td>Surgeon Name</td><td>'+(obj.sfname+' '+obj.mfname+' '+obj.lfname)+'</td></tr>'
		+'<tr><td>Surgeon NPI</td><td>'+(obj.npi)+'</td></tr>'
		
		+'<tr><td>Surgeon Date</td><td>'+(obj.surgery_date)+'</td></tr>'
		+'<tr><td>Patient First Name</td><td>'+(obj.first_name)+'</td></tr>'
		+'<tr><td>Patient Middle Name</td><td>'+(obj.middle_name)+'</td></tr>'
		+'<tr><td>Patient Last Name</td><td>'+(obj.last_name)+'</td></tr>'
		+'<tr><td>Date of Birth</td><td>'+(obj.patient_dob)+'</td></tr>'
		
		+'<tr><td>Selected side</td><td>'+(obj.side)+'</td></tr>'
		+'<tr><td>Manufacture</td><td>'+(obj.mname)+'</td></tr>'
		+'<tr><td>Brand</td><td>'+(obj.bname)+'</td></tr>'
		+'<tr><td>Power</td><td>'+(obj.power_id)+'</td></tr>'
		+'<tr><td>Stock Level</td><td>2</td></tr>'
		//+'<tr><td colspan="2" style="color:red;text-align:center">Please check all the information for accuracy<td></tr>'
		+'<tr><td colspan="2" style="text-align:center"><input type="button" class="btn cbut blue bbbutons" value="Print" onclick="printorder2('+reqs.oid+')"/><td></tr>'
		+'</table>';
		res.send({html:html});
	});
	
	

});

router.post('/openorder', async function(req, res, next) {
	reqs = req.body;
	console.log(reqs);
	
	
	
	//reqs.oid;
	sql = 'select surgery_date,patient_dob,side, m.mname, b.bname, d.model_name  , o.surgery_center_id,manufacture_id,brand_id,model_id,power_id,surgeon_id, practise_id,first_sel_type,second_sel_type, u.npi, o.first_name,o.middle_name,o.last_name,u.first_name as sfname, u.last_name as lfname, u.middle_name as mfname  from orders o	left join manufacturers m on m.id = o.manufacture_id left join brands b on b.id = o.brand_id left join models d on d.id = o.model_id left join other_users u on u.user_id = o.surgeon_id where o.id='+reqs.oid;
	fid=0;html = '';occu=0;
	await conn.query(sql, function (err, result) {
		obj = result[0];
		if(fid==0){fid=obj.surgery_center_id;}
		html = '<table class="table"><tr><td colspan="2" style="font-size:25px;text-align:center"><b>Information</b></td></tr><tr><td>Surgeon Name</td><td>'+(obj.sfname+' '+obj.mfname+' '+obj.lfname)+'</td></tr>'
		+'<tr><td>Surgeon NPI</td><td>'+(obj.npi)+'</td></tr>'
		
		+'<tr><td>Surgeon Date</td><td>'+(obj.surgery_date)+'</td></tr>'
		+'<tr><td>Patient First Name</td><td>'+(obj.first_name)+'</td></tr>'
		+'<tr><td>Patient Middle Name</td><td>'+(obj.middle_name)+'</td></tr>'
		+'<tr><td>Patient Last Name</td><td>'+(obj.last_name)+'</td></tr>'
		+'<tr><td>Date of Birth</td><td>'+(obj.patient_dob)+'</td></tr>'
		
		+'<tr><td>Selected side</td><td>'+(obj.side)+'</td></tr>'
		+'<tr><td>Manufacture</td><td>'+(obj.mname)+'</td></tr>'
		+'<tr><td>Brand</td><td>'+(obj.bname)+'</td></tr>'
		+'<tr><td>Power</td><td>'+(obj.power_id)+'</td></tr>'
		+'<tr><td>Stock Level</td><td>2</td></tr>'
		+'<tr><td colspan="2" style="color:red;text-align:center">Please check all the information for accuracy<td></tr>'
		
		// if(obj.bin_mac_id != '') occu++;
		
		sql = 'select binstatus,comments,fact_id,firmware, mac_id    , mandate,model  from bins where removed_bins =0 and fact_id='+fid;
		console.log(sql);
		
		conn.query(sql, function (err, result) {
			
			sql = 'select count(bin_mac_id) as cb  from orders where surgery_center_id='+fid+' and (bin_mac_id is null or bin_mac_id="")';
			total_bins = result.length;
		
			conn.query(sql, function (err, result) {
				oooo = result[0];
				occu = oooo.cb;
				
				console.log('occu----'+occu+':total_bins------'+total_bins);
				
				html+='<tr><td colspan="2" style="text-align:center"><input type="button" class="btn cbut blue bbbutons" value="Approve" onclick="approveorder('+reqs.oid+')"/><td></tr>'
				+'</table>';
				
				if(total_bins < occu){ occu = 0; }
				else { occu = total_bins - occu; }
				
				//html += '<div style="position: absolute;padding:10px;background:red;color:#FFF;top:28%;right:5%">'+(occu)+' Bin(s) Available</div>';
				
				res.send({html:html});
			});
			
			
			
		
			/*
			sql = 'select surgery_dt from bins_logs where facility_id='+fid+' and surgery_dt="'+obj.surgery_date+'"';
			conn.query(sql, function (err, resultbb) {
				occu=0;
				if(undefined ==resultbb){}else{occu=resultbb.length}
				occu = result.length-occu;
				if(occu>0)
				html+='<tr><td colspan="2" style="text-align:center"><input type="button" class="btn cbut blue bbbutons" value="Approve" onclick="approveorder('+reqs.oid+')"/><td></tr>'
		+'</table>';
		else
			html+='<tr><td colspan="2" style="text-align:center"><input type="button" class="btn cbut blue bbbutons" value="Cancel" /><td></tr></table>'; // onclick="approveorder('+reqs.oid+')"
		
			html += '<div style="position: absolute;padding:10px;background:red;color:#FFF;top:28%;right:5%">'+(occu)+' Bin(s) Available</div>';
			res.send({html:html});
			}); */
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
					})
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
			});
		});
		}else{res.send({});}
	});
	
});
router.get('/sc_neworders', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	sid = req.session.userid;
	
	sql = '';
	
	res.render('admin/dashboard3', { BASE_PATH: '../', pageid:'neworder', uid:sid});
});

router.get('/sc_orderhistory', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	sid = req.session.userid;
	
	res.render('admin/dashboard3', { BASE_PATH: '../', pageid:'orderhistory', uid:sid});
});

router.get('/sc_reports', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	sid = req.session.userid;
	
	// query = "select id,fname,fax,cell,website from facilities";
	res.render('admin/dashboard3', { BASE_PATH: '../', pageid:'reports', uid:sid});
});



router.get('/sc_bins', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	sid = req.session.userid;
	
	// query = "select id,fname,fax,cell,website from facilities";
	res.render('admin/dashboard3', { BASE_PATH: '../', pageid:'bins', uid:sid});
});

router.get('/settings', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	sid = req.session.userid;
	role = req.session.role;
	
	if(req.session.role == 3){ // surgy center
		
		console.log('sid:-----:'+sid);
		
		res.render('admin/dashboard3', { BASE_PATH: '../', pageid:'settings', uid:sid, role:role});
	}else if(req.session.role == 1){
		res.render('admin/settings', { BASE_PATH: '../', pageid:'settings', uid:sid, role:role, result:[],  result2:[]});
	}else{
	query = "select id,fname,fax,cell,website from facilities";

	arr=[];varr=[];
	query2 = "select id, first_name,  selected_sc,  used_sc from other_users where user_id="+req.session.userid;
	//console.log(req.session.userid, query2) req.session.userid = result[i].id;
	//		req.session.role = result[i].role;
	//console.log(query2);
	await conn.query(query, function (err, result) {
		if (err) console.log( err);
		farr=[];
		
		conn.query(query2, function (err, result2) {
			// |2:Mason Surgery Center|4:ttttttttttt||
			console.log('query 2---------------');
			if(result2 != undefined && result2.length > 0){
				sc = result2[0]['selected_sc'];
				ss = sc.split('|');
				for(i=1;i<ss.length-1;i++){						
					ts=ss[i].split(':');				
					arr.push(parseInt(ts[0]));
					varr.push({id:ts[0],val:ts[1]});
				}
				
				console.log('arr console 1------------------');
				console.log(arr);
				for(i=0;i<result.length;i++){
					if(!arr.includes(parseInt(result[i]['id']))){farr.push(result[i]);}
				}
			}
			
			res.render('admin/settings', { BASE_PATH: '../', result:farr,  result2:varr,  uid:sid, role:role});
			});
		});
	//});
	}
	//res.render('admin/settings', { BASE_PATH: '../'});
});

router.post('/showBinsList', async function(req, res, next) {
	reqs = req.body;
	console.log(reqs);
	// var results = await scanTable(config.aws_bins_table_name);
	sql = 'select * from bins where binstatus = 0 and (model like "%'+reqs.word+'%" or firmware like "%'+reqs.word+'%" or mac_id like "%'+reqs.word+'%")';
	console.log(sql);
	temparr = [];
	await conn.query(sql, function (err, result) {
		console.log('results.length:'+result.length);
		for(i=0;i<result.length;i++){
			// if(results[i].binstatus == 0)
			temparr.push(result[i]);
		}
		
		res.send({ BASE_PATH: '../', results: temparr});
	});
});


router.get('/admindash', async function(req, res, next) {
	if(checkAuth(req,res)) return;
	
	sql = 'select id,fname,fax,cell,website,email from facilities where removed_users = 0';
	results = '';
	console.log(sql);
	
	var role = req.session.role;
	var uid = req.session.userid;
	
	/*
	req.session.role == 3){ // surgy center
		sid = req.session.userid;
		console.log('sid:-----:'+sid);
		*/
	
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
	res.render('admin/dashboard2', { BASE_PATH: '../', results:results, result2:result2, uid:uid, role:role });
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
	
	
	sql = "INSERT INTO users(name,passcode,role ) VALUES('"+reqs.email+"','"+pass+"',2)";
	console.log(sql)
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
			
			sql = "INSERT INTO other_users(user_id,first_name,middle_name,last_name,cell,email,npi,passcode,fact_id,selected_sc,used_sc) VALUES('"+userid+"','"+reqs.first_name+"','"+reqs.middle_name+"','"+reqs.last_name+"','"+reqs.cell+"','"+reqs.email+"','"+reqs.npi+"','"+pass+"','"+reqs.facid+"','','')";
	
			console.log(sql);
	
		 conn.query(sql, function (err, result) {
			if (err) throw err;
			sendEmail(reqs.email,'Temporary password for surgicalbooking.com', '<b><i>Hi '+reqs.first_name+',<br></i></b>Your temporary password is '+pass);
			res.send('respond with a resource'); 
		  });
		});

	console.log(sql);	
	
		
	
	
	
});

router.post('/adduser', async function(req, res, next) {
	/*
	other_users user_id INT NOT NULL, first_name CHAR(50),  middle_name CHAR(50),  last_name CHAR(50),cell CHAR(50),email CHAR(150), npi char(50),passcode char(50)
	*/
	reqs = req.body;
	var pass = generatePassword();
	
	sql = "INSERT INTO other_users(user_id,first_name,middle_name,last_name,cell,email,npi,passcode,selected_sc,used_sc,removed_users) VALUES('"+reqs.facid+"','"+reqs.first_name+"','"+reqs.middle_name+"','"+reqs.last_name+"','"+reqs.cell+"','"+reqs.email+"','','"+pass+"','','',False)";
	
	console.log(sql);
	
		
	sendEmail(reqs.email,'Temporary password for surgicalbooking.com', '<b><i>Hi '+reqs.first_name+',<br></i></b>Your temporary password is '+pass);
	
	await conn.query(sql, function (err, result) {
			if (err) throw err;
			console.log("facilities query created");	
			res.send('respond with a resource'); 
		  });
	
	//res.send({results:{}});
});

router.get('/testMail', async function(req, res, next) {
sendEmail('pvvdprasad@gmail.com','Temporary password for surgicalbooking.com', '<b><i>Hi ,<br></i></b>Your temporary password is ');
res.send('respond with a resource'); 
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

router.post('/viewAllFacilityUser', async function(req, res, next) {
	const id = req.body.id;
	console.log("Facility ID is:::::::::::" + id + "===============");
	console.log("In the facility Users View=================");
	sql= `SELECT id, user_id, first_name, middle_name, last_name, cell, email, npi, selected_sc, used_sc FROM other_users WHERE user_id = ${id} && npi= '' && removed_users= False`;
	console.log(sql);

	await conn.query(sql, function (err, result){
		if(err){
			console.log(err);
			res.status(500).send({ error: 'Internal Server Error' }); // Send an error response
		}
			console.log(result)
			res.status(200).send({ data: result }); // Send a success response with the data
		
	})
})

router.post('/removefacilityuser', async function(req, res, next) {
    const user_ids = req.body.user_ids;
	console.log(user_ids)
    await conn.query('UPDATE other_users SET removed_users= True WHERE id IN (?)', [user_ids], function (err, result) {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Internal Server Error' });
        } else {
            res.send({ success: true,  successMessage: 'User removed successfully'  });
        }
    });
});

router.post('/removeuser', async function(req, res, next) {
	console.log("Remove user facility is created")
	reqs=req.body;
	await conn.query('delete from other_users where id='+reqs.user_id, function (err, result) {
		res.send({});
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
	var sql = "select b.id, bname, mname from brands b left join manufacturers m on mid = m.id order by b.bname";
	
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
	id = req.body.fid;
	console.log(id+'<--->showSurgeons');
	/*
	----+------------+-------------+--------+
| id | surgeon_id | facility_id | status 
	*/
	var sql = "select id,surgeon_id,status from surgeon_facility where facility_id = " + id;
	//var sql = "select id,user_id,first_name,middle_name,last_name,cell,email,npi from other_users where selected_sc like '%|" + id +":%'";
	console.log(sql);
	await conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("facilities query created");
		if(undefined != result){
			sur_arr = [];
			for(i=0;i<result.length;i++){
				sur_arr.push(result[i].surgeon_id);
			}
			console.log(sur_arr);
			var sql = "select id,user_id,first_name,middle_name,last_name,cell,email,npi from other_users where user_id in (" + sur_arr +")";
			console.log(sql);
			html = 'No Surgeons Found';
			conn.query(sql, function (err, result2) {
				if(undefined == result2)
					html = 'No Surgeons Found';
				else{
					html = '<table class="table"><tr><th>#</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th>NPI</th></tr>';
					for(i=0;i<result2.length;i++){
						html += '<tr><td><input type="checkbox" name="dlinkchs" value="'+result2[i].user_id+'" /></td><td>'+result2[i].first_name+'</td><td>'+result2[i].middle_name+'</td><td>'+result2[i].last_name+'</td><td>'+result2[i].npi+'</td></tr>';
					}
					html += '<tr><td colspan=5 align="center"><input type="button" style="position:relative" class="btn cbut blue bbbutons" value="Dlink" onclick="mmmdlink('+id+')" /></td></tr></table>';
				}
			res.send({results:result2,html:html});
			});
		}else{
			html = 'No Surgeons Found';
			res.send({results:[],html:html});
		}
		//res.send('respond with a resource'); 
		
	  });
});

router.post('/showleftSurgeons', async function(req, res, next) {
	
	//const docClient = new AWS.DynamoDB.DocumentClient();
	id = req.body.id;
	console.log(id+'<--->showSurgeons');
	var sql = "select id,user_id,first_name,middle_name,last_name,cell,email,npi from other_users where fact_id = " + id;
	console.log(sql);
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

router.post('/addFacility', async function(req, res, next) {
    console.log('in  the addFacility...');

	reqs = req.body;
    console.log(reqs);	
	var pass = generatePassword();
	
	sql = "INSERT INTO users(name,passcode,role ) VALUES('"+reqs.facility_email+"','"+pass+"',3)";
	
	await conn.query(sql, function (err, result) {
		if (err) throw err;
	
	// Send email with temp password
	

	try{
		sql = "INSERT INTO facilities(fname,fax,cell,website,email,removed_users) VALUES('"+reqs.facility_name+"','"+reqs.facility_fax+"','"+reqs.facility_phone+"','"+reqs.facility_website+"','"+reqs.facility_email+"',0)";
		
		conn.query(sql, function (err, result) {
			if (err) throw err;
			console.log("facilities query created");
			
			sendEmail(reqs.facility_email,'Temporary password for surgicalbooking.com', '<b><i>Hi '+reqs.facility_name+',<br></i></b>Your temporary password is '+pass);
			
			res.send('respond with a resource'); 
		  });
		
	}catch(e){console.log(e);}
	
	});
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
  console.log(reqs);
 
  
  var sql = "select id,name,role from users where name ='"+loginid+"' and passcode='"+passid+"'";
  //VALUES('surgeon','surgeon',2)";
  conn.query(sql, function (err, result) {
    if (err){
		res.render('admin/login', { BASE_PATH: '../', message: 'Database error. Please try again later.' });
	}else{
		 if(!result || result.length === 0){
			// If no user with the given credentials is found, render the login view with an error message
			res.status(401).render('admin/login', { BASE_PATH: '../', message: 'Unauthorized access. Please login with valid credentials.' });
			//console.log(result);
		}else{
			for(i=0;i<result.length;i++){
				//console.log(result[i]);
				req.session.userid = result[i].id;
				req.session.role = result[i].role;
				req.session.name = result[i].name;
				console.log(req.session.role)
				break;
			}
			console.log(req.session);
			try{
				if(!req.session || !req.session.userid ){
					res.status(401).render('admin/login', { BASE_PATH: '../', message: 'Unauthorized access. Please login with valid credentials.' });
				}else{
					console.log('user id exists');
					//req.session.role_id = 2;
					if(req.session.role==2){
						req.session.role_name = 'surgeon';
						res.status(200).render('admin/dashboard', { BASE_PATH: '../' });
					}else if(req.session.role==1){
						req.session.role_name = 'admin';
						// res.render('admin/dashboard2', { BASE_PATH: '../' });
						res.status(200).redirect('admindash');
					}else if(req.session.role==3){
						sql = 'select id from facilities where email = "'+req.session.name+'"';
						console.log(sql);
						/*conn.query(sql, function (err, result1111) {
							req.session.userid = result1111[0].id;
							
						}); */
						//req.session.userid = result[i].id;
						req.session.role_name = 'surgycenter';
						res.status(200).redirect('sc_neworders');
						// res.render('admin/dashboard3', { BASE_PATH: '../' });
					}else{
						res.status(401).render('admin/login', { BASE_PATH: '../', message: 'Unauthorized access. Please login with valid credentials.' });	
					}
				}
			}catch(e){
				console.log("User query cannot be created");
			}
   			console.log("PostLogin Completed");
		}
	}
	});
});

router.post('/unassignedBins', async function(req, res, next) {
	
	//var results = await scanTable(config.aws_users_table_name);
	//var binresults = await scanTable(config.aws_bins_table_name);
	
	arrbin = [];
	sql = 'select * from bins where binstatus = 0';
	html = '<h2>Unassigned Bins</h2><table id="righttable"><tr><th>Model</th><th>Mac ID</th><th>Firmware</th><th>Manufactured Date</th></tr>';
	conn.query(sql, function (err, binresults) {
		for(i=0;i<binresults.length;i++){
			//if(binresults[i].binstatus == 0)
				//arrbin.push(binresults[i]);
			html += '<tr><td>'+binresults[i].model+'</td><td>'+binresults[i].mac_id+'</td><td>'+binresults[i].firmware+'</td><td>'+binresults[i].mandate+'</td></tr>';
		}
		html += '</table>';
		
		res.send({html:html});
	});
	
	
	
	
});
router.post('/moveBinTo', async function(req, res, next) {
	reqs = req.body;
	console.log(reqs);
	
	sql = 'update bins set binstatus=0 where uid='+reqs.id;
	
	conn.query(sql, function (err, results) {
	//for(i=0;i<results.length;i++){
		res.send({});		
	});
	//AWS.config.update(config.aws_remote_config);
	/*
	const docClient = new AWS.DynamoDB.DocumentClient();
	const params = {
        TableName: config.aws_bins_table_name,
        Key: {
            "uuid": reqs.id
        },
       UpdateExpression: "set binstatus=:binstatus ",
    ExpressionAttributeValues:{
        ":binstatus":0
    },
    ReturnValues:"UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
		console.log('Update query executed.........');
        if (err) console.log(err);
        else console.log(data);
		res.send({});
		//domultiupdatee(index+1,sparr,results);
    });
	*/
});
router.post('/changefacildd', async function(req, res, next) {
	//var binresults = await scanTable(config.aws_bins_table_name);
	
	arrbin = []; fff = true;
	console.log('req.body.id---------------:'+req.body.id);
	sql = 'select * from bins where fact_id = '+req.body.id+' AND binstatus= 1 ';
	//html = '<h2>Decommissioned Bins</h2><table><tr><th>Model / Bin no</th><th>Mac ID</th><th>Firmware</th><th>Manufactured Date</th><th>Comments</th><th>Action</th></tr>';
	
	// html = '<table><tr><th>Model</th><th>Mac ID</th><th>Firmware</th><th>Status</th><th>Manufactured Date</th><th>Action</th></tr>';
	conn.query(sql, function (err, binresults) {
	// for(i=0;i<binresults.length;i++)
	// 	//if(binresults[i].fac_id == req.body.id){
	// 		//arrbin.push(binresults[i]);
	// 			html += '<tr><td>'+binresults[i].model+'</td><td>'+binresults[i].mac_id+'</td><td>'+binresults[i].firmware+'</td><td><img style="width:22px" src="../images/signal.png" onclick="showslots()" /></td><td>'+binresults[i].mandate+'</td><td><a href="javascript:decommi(\''+binresults[i].uid+'\')">Decommission</a><div class="hidassdiv" id="'+binresults[i].uid+'_hid"><span class="spanclose" onclick="closediv(\''+binresults[i].uid+'_hid\')">X</span><a href="javascript:seleop(1,'+binresults[i].uid+')">Malfunction</a><br><a href="javascript:seleop(2,'+binresults[i].uid+')">Damaged</a><br><a href="javascript:seleop(3,'+binresults[i].uid+')">Other</a></div></td></tr>';				
	// 	//}
	
	// html += '</table>';
		console.log(binresults)
		res.send(binresults)
	});
});


router.post('/showdecommissioned', async function(req, res, next) {
	//AWS.config.update(config.aws_remote_config);
	//var results = await scanTable(config.aws_bins_table_name);
	sql = 'select * from bins where binstatus = 3';
	html = '<h2>Decommissioned Bins</h2><table><tr><th>Model / Bin no</th><th>Mac ID</th><th>Firmware</th><th>Manufactured Date</th><th>Comments</th><th>Action</th></tr>';
	conn.query(sql, function (err, results) {
	for(i=0;i<results.length;i++){
		if(results[i].binstatus == 3){
			html += '<tr><td>'+ results[i].model + '/'+results[i].binname+'</td><td>'+ results[i].mac_id +'</td><td>'+ results[i].firmware +'</td><td>'+ results[i].mandate +'</td><td>Comment '+i+'</td><td><a href="javascript:recommission(\''+results[i].uid+'\')">Recommission</a></td></tr>';
			
			// break;
		}
	}html += '</table>';
	res.send({ html:html });
	});
	
	
});

router.post('/changetodecom', async function(req, res, next) {
	// AWS.config.update(config.aws_remote_config);
	reqs = req.body;
	console.log(reqs);
	
	sql = 'update bins set binstatus = 3,comments="'+reqs.ans+'" where uid = '+reqs.id;
	conn.query(sql, function (err, binresults) {
		res.send({});
	});
	// const docClient = new AWS.DynamoDB.DocumentClient();
	/*
	const params = {
        TableName: config.aws_bins_table_name,
        Key: {
            "uuid": reqs.id
        },
       UpdateExpression: "set binstatus=:bstatus , comments=:comment",
    ExpressionAttributeValues:{
        ":bstatus":3,
		":comment":reqs.ans
    },
    ReturnValues:"UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
		console.log('Update query executed.........');
        if (err) console.log(err);
        else console.log(data);
		res.send({});
		//domultiupdatee(index+1,sparr,results);
    });
	*/
});

router.post('/assignedBins', async function(req, res, next) {
	
	sql = 'select * from bins where binstatus = 1';
	conn.query(sql, function (err, binresults) {
		console.log(binresults)
		res.send(binresults)
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
		// console.error('SQL Query Error:', err);
		return res.status(500).json({ error: 'An error occurred while fetching data' });
	  }
	  
	  if (binresults.length === 0) {
		// console.log('Bin status is not available');
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
			// console.log('Bins are online');
			// console.log(binresults);
			res.status(200).json({ message: 'Bins are online', status: 'online', data: binresults });
		} else {
			// console.log('Bins are offline');
			// console.log(binresults);
			res.status(200).json({ message: 'Bins are offline', status: 'offline', data: binresults });
		}
	  }
	});
});


router.post('/showslots', async function(req, res, next) {
	const userMacId = req.body.id; // Assuming the user sends the mac_id in the request body
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
		res.status(202).json({ message: 'No Order is available on any of the slots', data: binresults });
	  } else {
		// console.log(binresults)
		res.status(200).json({ message: 'Bins are online', status: 'online', data: binresults });
	  }
	});
});

router.post('/addbin', async function(req, res, next) {
	// {model:o('model_name'),mac_id:o('mac_id'),firmware:o('firmware'),mandate:o('man_date')
	reqs = req.body;
	// model:o('model_name'),mac_id:o('mac_id'),firmware:o('firmware'),mandate:
	//AWS.config.update(config.aws_remote_config);
	/*
	var params = {
    TableName: config.aws_bins_table_name,
	
	Item: {
      'uuid' :  ''+Date.now(),
		'model' :  reqs.model,
		'mac_id' :  reqs.mac_id,
		'firmware' : reqs.firmware,
		'mandate' :  reqs.mandate,
		'binstatus':0
	}
    };
	
	const docClient = new AWS.DynamoDB.DocumentClient();
	*/
	sql = 'insert into bins (binstatus, comments,fact_id, firmware , mac_id ,mandate ,model,removed_bins) values(0,'+
	'"",0,"'+reqs.firmware+'","'+reqs.macid+'","'+reqs.mandate+'","'+reqs.model+'",0)';
	//docClient.put(params, function(err, data) {
		// console.log(sql);
	conn.query(sql, function (err, binresults) {
	  if (err) {
		// console.log("Error", err);
		res.status(500).json({ message: "Error" });
	  } else {
		for(i=0; i<=15; i++){
			sql1='insert into slots(slot_ID, masterBin_mac_id, order_id, status) values("'+i+'","'+reqs.macid+'",0,0)';
			// console.log(sql1);
			conn.query(sql1, function(err, slots){
				if(err){
					// console.log("Error", err);
					res.status(500).json({ message: "Error" });
				}
				console.log("Slots are created against the Added Master Bin MacID.")
			})
		}
		sql2='INSERT INTO bin_logs (mac_id, timestamp, connection_status) VALUES ("'+reqs.macid+'", NOW(), 0)';
		console.log(sql2);
		conn.query(sql2, function(err, slots){
			if(err){
				// console.log("Error", err);
				res.status(500).json({ message: "Error" });
			}else{
				console.log("Bins_log entry is filled")
			}	
		})
		// console.log("Success", binresults);
		res.status(200).json({ message: "Success" });
	  }
	});
});


router.get('/equipmain', async function(req, res, next) {
	// AWS.config.update(config.aws_remote_config);
	// const docClient = new AWS.DynamoDB.DocumentClient();
	if(checkAuth(req,res)) return;
 // var results = await scanTable(config.aws_facility_table_name);
 // console.log(results);
  res.render('admin/equipmain', { BASE_PATH: '../', results: {}});
});

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

module.exports = router;
