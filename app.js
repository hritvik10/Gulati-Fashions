var express = require('express');
const alert = require("alert")
var mysql = require('mysql');
const bodyParser = require("body-parser");
var app = express();
const md5 = require("md5");



let cusname ;
let cus_id;
app.engine('html', require('ejs').renderFile);
app.use(express.static("public")) //to get access to our static folders
app.use(bodyParser.urlencoded({extended :true}));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    multipleStatements: true
    // database: 'dbms'
});



app.get("/register",function(req,res){
    res.sendFile(__dirname+"/register.html")
})

app.post("/register",function(req,res){
    console.log("success register");
    const newdetailfname = req.body.Fname;
    const newdetaillname = req.body.Lname;
    const newdetailnumber = req.body.Mobileno;
    const newdetailemail = req.body.email;
    const newdetailpassword = md5(req.body.Password);
    const newdetailaddress = req.body.address;
    console.log(newdetailfname );
    
    let queries = "use dbms;insert into data (fname, lname, number, email, password,address) values ('"+newdetailfname+"','"+newdetaillname+"','"+newdetailnumber+"','"+newdetailemail+"' ,'"+newdetailpassword+"','"+ newdetailaddress+"')";  

    connection.query(queries,function(error,result){
        if(error){
            console.log('error in query');
            alert("Invalid Entry")
            res.redirect("/register");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(result);
            res.redirect("/signin");
            
           
        }

    })
})


app.get("/signin",function(req,res){
    res.sendFile(__dirname+"/signin.html")
})

app.get("/home",function(req,res){
    res.render(__dirname+"/index.html",{list : {},name : cusname})
})
app.post("/home",function(req,res){
    console.log("success!");
    
    const newdetailemail = req.body.email;
    const newdetailpassword = md5(req.body.Password);
    console.log(newdetailemail );
    
    let queries = "use dbms;select password,fname,customer_id from data where email ='"+newdetailemail+"' ;"
    console.log(queries);
    connection.query(queries,function(error,result){
        if(error || result[1][0]==undefined){
            console.log('error in query');
            console.log(result);
            alert("Wrong Id or Password!")
            res.redirect("/signin");
            
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log(result[1][0]);
            console.log(result[1][0].password);
            const pass = result[1][0].password;
            cusname = result[1][0].fname;
            cus_id = result[1][0].customer_id;
            
            if(newdetailemail=== "admin" && newdetailpassword === pass)
            {
                res.redirect("/data");

            } else if(newdetailpassword === pass){
                
                    res.render(__dirname+"/index.html",{list : {},name : cusname})
                    
                
            } else {
                console.log("wrong password")
                alert("wrong password");
                res.redirect("/signin");
            }
            
            
           
        }

    })
})

app.get("/index",function(req,res){
    res.render(__dirname+"/index.html",{name:cusname,list : {}})
})

app.get("/data",function(req,res){
    res.render(__dirname+"/data.html",{list : {}})
})

app.post("/data",function(req,res){
    console.log("success register");
    const newdetailall= req.body.all;
    const newdetailtable = req.body.table;
    const newdetaildetail = req.body.detail;
    const newdetaildetailinfo = req.body.detailinfo;
    

    console.log(newdetailall );
    console.log(newdetailtable );
    console.log(newdetaildetail );
    console.log(newdetaildetailinfo);
    
    const queries = "use dbms; select "+newdetailall+" from "+newdetailtable +" where "+newdetaildetail+" = '"+newdetaildetailinfo+"'" ;
   
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            res.redirect("/data")
            alert("Invalid Entry/choice");
            
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.render(__dirname+"/data.html",{list : result[1]} )
            
           
        }

    })
})

app.post("/datadelete",function(req,res){
    
    const queries = "use dbms; delete from data where email = '"+req.body.delete+"'"
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Cannot Delete the Entry. Try again!");
            res.redirect("/data");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.redirect("/data" )
            
           
        }

    })
})


app.get("/shopping",function(req,res){
    // res.sendFile(__dirname+"/shopping.html")
    const queries = "use inverntoryDB; select * from stocks"
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Cannot fetch the data");
            res.redirect("/index");

        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result[1][0]);
            res.render(__dirname+"/shopping.html",{name:cusname,list: result[1]})
            
           
        }

    })
})

// app.post("/shopping",function(req,res){
    
//     res.redirect("/shopping");

    
// })


app.get("/inv",function(req,res){
    res.render(__dirname+"/inventory.html",{list : {}})
})

app.post("/invadd",function(req,res){
    console.log("success register");
    const newinvid = req.body.invid;
    const newdetailinvtype= req.body.invtype;
    const newdetaildetailinfo = req.body.detailinfo;
    const newimage = req.body.invimg;

    
    console.log(newdetailinvtype );
    console.log(newinvid);
    console.log(newdetaildetailinfo);
    
    const queries = "use inverntorydb; INSERT INTO stocks(stock_id,stock_type, stock_desc)VALUES('"+ newinvid+"','"+newdetailinvtype +"','"+ newdetaildetailinfo+"');use dbms; INSERT INTO stocks(stock_id,stock_type, stock_desc)VALUES('"+ newinvid+"','"+newdetailinvtype +"','"+ newdetaildetailinfo+"')";
   
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Data could not be inserted. Please try again!")
            res.redirect("/inv");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.render(__dirname+"/inventory.html",{list : result[1]} )
            
           
        }

    })
})


app.post("/invshow",function(req,res){
    console.log("success register");
    const newdetailinvtype= req.body.invtype;
    
    

    console.log(newdetailinvtype);
   
    
    const queries = "use dbms; select * from stocks where stock_type = '"+newdetailinvtype+"'";
   
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Unable to fetch data!")
            res.redirect("/inv");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.render(__dirname+"/inventory.html",{list : result[1]} )
            
           
        }

    })
})


app.post("/invdelete",function(req,res){
    
    const queries = "use inverntorydb; delete from stocks where stock_id = '"+req.body.delete+"';use dbms; delete from stocks where stock_id = '"+req.body.delete+"'"
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Deletion Failed!")
            res.redirect("/inv");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.redirect("/inv" )
           
        }

    })
})

app.post("/invupdate",function(req,res){
    const stocktype=req.body.type;
    const stockdesc=req.body.description;
    const stockid=req.body.update;

    
    const queries = "use inverntorydb; UPDATE stocks SET stock_type = '"+ stocktype+"', stock_desc = '"+ stockdesc+"' WHERE stock_id= "+ stockid+";use dbms; UPDATE stocks SET stock_type = '"+ stocktype+"', stock_desc = '"+ stockdesc+"' WHERE stock_id= "+ stockid+";";
        connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Invalid Entry! cannot be updated")
            res.redirect("/inv");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.redirect("/inv" )
           
        }

    })
})


app.post("/cart",function(req,res){
    
    const stockid = req.body.addcart;
    console.log(stockid);
    console.log(cusname);
    console.log(cus_id);
    const queries = "use dbms; INSERT INTO carts(stock_id,customer_id)VALUES("+ stockid +","+ cus_id +")";
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Sorry! Error occured")
            res.redirect("/index");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.redirect("/shopping" )
            
           
        }

    })
})



app.get("/viewcart",function(req,res){
    
    console.log(cusname);
    console.log(cus_id);
    const queries = "use dbms; select stocks.stock_id,stocks.stock_type,stocks.price,stocks.stock_desc from stocks,carts where stocks.stock_id=(select carts.stock_id where carts.customer_id="+ cus_id +");"


     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Sorry! Error occured")
            res.redirect("/index");
        } else {

            if(!result[1][0]){
                res.redirect("/shopping")
                alert("Cart is empty")

            } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result[1][0]);
            res.render(__dirname+"/cart.html",{name:cusname,list: result[1]})
            }
            
           
        }

    })
})



app.post("/cartdelete",function(req,res){
    
    
    console.log(cusname);
    console.log(cus_id);
    const queries = "use dbms; delete from carts where stock_id = '"+req.body.deletecart+"'";
     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Sorry! Error occured");
            res.redirect("/viewcart");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.redirect("/viewcart")
            
           
        }

    })
})


app.post("/placeorder",function(req,res){
    
    
    console.log(cusname);
    console.log(cus_id);
    const queries = "use dbms;INSERT INTO orders(stock_id,customer_id) select stock_id,customer_id from carts where customer_id = "+ cus_id+"; UPDATE stocks SET quantity = quantity-1 where stock_id in(select stock_id from carts where customer_id="+cus_id+" ); delete from carts where customer_id = "+ cus_id+";";
    connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries);
            console.log(error);
            alert("Sorry! Error occured");
            res.redirect("/viewcart");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            alert("Order Accepted");
            res.redirect("/placedorders")
            
           
        }

    })
})

app.get("/placedorders",function(req,res){
    
    console.log(cusname);
    console.log(cus_id);
    const queries = "use dbms; select stocks.stock_id,stocks.stock_type,stocks.stock_desc,orders.date,orders.time from stocks,orders where stocks.stock_id=(select orders.stock_id where orders.customer_id="+ cus_id +"); "


     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries)
            alert("Sorry! Error occured");
            res.redirect("/viewcart");
        } else {
            if(!result[1][0]){
                res.redirect("/shopping")
                alert("No Orders")

            } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.render(__dirname+"/orders.html",{name:cusname,list: result[1]})
            }
            
           
        }

    })
})


app.get("/vieworders",function(req,res){
    
    console.log(cusname);
    console.log(cus_id);
    const queries = "use dbms; select data.fname,data.address,data.number,stocks.stock_id,stocks.stock_type,stocks.stock_desc,orders.date,orders.time from data,stocks,orders where data.customer_id=(select orders.customer_id ) and stocks.stock_id=(select orders.stock_id ) "
    

     connection.query( queries,function(error,result){
        if(error){
            console.log('error in query');
            console.log(queries);
            alert("Sorry! Error occured");
            res.redirect("inv");
        } else {
            // resp.sendFile(__dirname+"/signup.html");
            console.log('successful query');
            console.log(queries);
            console.log(result);
            res.render(__dirname+"/invorders.html",{list: result[1]})
            
            
           
        }

    })
})

app.listen(5000); 