const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
const port = process.env.PORT || 8000;
//const file//Upload = require('express-fileupload')

//app.use(express.json())
//app.use(express.static(path.resolve(__dirname, 'static')))
//app.use(fileUpload({}))

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
require('./config/sessions')(app);


app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static('public'))

app.set('view engine', 'ejs');

var routes_setter = require('./config/routes.js');
routes_setter(app);

app.listen(port, function() {
    console.log('Listening on', port);
});
