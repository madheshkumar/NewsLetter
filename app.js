require("dotenv");
const express = require("express"); //express module
const bodyParser = require("body-parser"); //body-parser module
const request = require("request");
const https = require("https"); //request module

const app = express();
app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.mail;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge: {
          FNAME: firstname,
          LNAME: lastname,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const options = {
    method: "post",
    auth: process.env.API_ID,
  };
  const url = process.env.LIST_ID;

  const request = https.request(url, options, function (response) {
    
    if(response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
    }else{
        res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",function (req,res) { 
    res.redirect("/");
 })

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at port 3000");
});

