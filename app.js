const express = require('express');
const app = express();
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "jade");
const mysql = require('mysql');
const path = require('path');

var resName;
var resPhone;
var resDate;
var resTime;
var resGuests;

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/index.html'));
})


app.get('/getEntries', (request, response) => {

    const values = request.query;
    const name = values['name'];
    const phone = values['phoneNumber']

    getTableEntries(name, phone, function (result) {
        console.log(result);
        if (result.length == 0) {
            response.render("no_existing", { name: name })
        } else {
            response.render('existing', { returnedEntries: result, name: name, phone: phone })
        }
    })
})

app.get('/getAllEntries', (request, response) => {

    // USED FOR TESTING 

    getAllTableEntries(function (result) {
        console.log(result);
        response.render('existing_all', { returnedEntries: result })
    })
})

app.get('/deletePage', (request, response) => {
    response.sendFile(path.join(__dirname, '/delete.html'));
})

app.post('/deleteEntry', (request, response) => {

    const values = request.body;

    const resName = values['resName'];
    const resPhone = values['resPhoneNumber'];
    const resDate = values['date'];
    const resTime = values['time'];

    deleteEntry(resName, resPhone, resDate, resTime, function (result) {
        console.log(values);
        console.log(result);
    });

}) 

app.post('/insertNewEntry', (request, response) => {

    const values = request.body;

    resName = values['resName'];
    resPhone = values['resPhoneNumber'];
    resDate = values['date'];
    resTime = values['time'];
    resGuests = values['guests'];

    insertNewEntry(resName, resPhone, resDate, resTime, resGuests, function (result) {
        console.log(values);
        console.log(result);
    });
    response.send()
})

app.get('/insertNewEntry', (request, response) => {
    response.render('thanks', { name: resName, phone: resPhone, date: resDate, time: resTime, guests: resGuests })
})

// set the app to listen on the right port
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

connection = mysql.createConnection({
    host: "ec2-54-152-168-195.compute-1.amazonaws.com",
    port: "3306",
    user: "root",
    password: "adminStuff",
    database: "myDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// have to have this callback parameter because of the 
// asynchronous operation
function getTableEntries(name, phone, callback) {
    console.log(name, phone)
    //connection.query(`SELECT * FROM entries WHERE name = '${name}' AND phone = '${phone}'`, function (err, result) {
    connection.query(`SELECT * FROM entries WHERE name = '${name}' AND  phone = '${phone}'`, function (err, result) {
        callback(result)
    }, err => {
        result = "ERROR OCCURRED";
        callback(result)
    });

}

function getAllTableEntries(callback) {
    connection.query(`SELECT * FROM entries`, function (err, result) {
        callback(result)
    }, err => {
        result = "ERROR OCCURRED";
        callback(result)
    });

}

function insertNewEntry(name, phone, date, time, guests, callback) {
    var sql = `INSERT INTO entries VALUES ('${name}', '${phone}', '${date}', '${time}', ${guests})`;
    console.log(sql)
    //var sql = `INSERT INTO entries VALUES ('test', 'test', 'test', 'test', 10)`;
    connection.query(sql, function (err, result) {
        callback(result);
    }, err => {
        result = "ERROR OCCURRED";
        console.log(err)
        callback(result);
    })
}

function deleteEntry(name, phone, date, time, callback) {
    var sql = `DELETE FROM entries WHERE name = '${name}' AND phone = '${phone}' AND date = '${date}' AND time = '${time}'`;
    console.log(sql)
    connection.query(sql, function (err, result) {
        callback(result);
    }, err => {
        result = "ERROR OCCURRED";
        console.log(err)
        callback(result);
    })
}
