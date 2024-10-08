const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const randomstring=require('randomstring');
var useragent = require('express-useragent');



let app = express();


//ROUTE FILES REQUIRING
var user = require("./Routes/userRoute");
var admin=require("./Routes/adminRoute");
var pet=require("./Routes/petRoute");
var success=require("./Routes/successRoute");
var volunteer=require("./Routes/volunteerRoute");
var foradoption=require("./Routes/forAdoptRoute");
var toadopt=require("./Routes/toadoptRoute");
var forgot=require("./Routes/forgotRoute");


//BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true, limit: '150mb'
}));
app.use(bodyParser.json({ limit: '150mb' }));

//DATABASE URL
mongoose.connect(process.env.MONGOURL || 'mongodb+srv://happytailsmini2024:qSPZ2T7iPjpLtSjL@cluster0.z44euyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', )
.then(() => { 
    console.log("Data Base connected")
}).catch((ex) => {
    console.log("Db connection error")
    console.log(ex)
});

//database connection
var db = mongoose.connection;



//Port Declaration
var port = process.env.PORT || 4000;

//Cors 
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


//Cors and helmet use
app.use(cors());

//Consoles the user information and API calls into the server Environment
app.use(useragent.express());
app.use((req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)
    next();
})

//APP.USE FUNCTIONS

app.use(user);
app.use(admin);
app.use(pet);
app.use(success);
app.use(volunteer);
app.use(foradoption);
app.use(toadopt);
app.use(forgot);

//Route for checking the server health
app.get('/health', async(req, res) => {
    res.status(200).json({
        status: true
    });
    return
});

//Server Environment set up
const server = app.listen(port, function () {
    console.log("Running Server on port " + port);
});
