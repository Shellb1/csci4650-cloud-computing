const express = require('express');
const app = express();
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine","jade");
const mysql = require('mysql');
const path = require('path');

app.get('/', (request, response) => {
        response.sendFile(path.join(__dirname, '/index.html'));
})


app.get('/getEntries', (request, response) => {

    const values = request.query;
    const name = values['name'];
    const phone = values['phoneNumber']

    getTableEntries(name, phone, function(result) { 
        console.log(result);
        response.render('existing', {returnedEntries: result, name: name})
    }) 
})

app.get('/getAllEntries', (request, response) => {

    // USED FOR TESTING 

    getAllTableEntries(function(result) { 
        console.log(result);
        response.render('existing_all', {returnedEntries: result})
    }) 
})

app.post('/insertNewEntry', (request, response) => {

    const values = request.body;

    const resName = values['resName'];
    const resPhone = values['resName'];
    const resDate = values['resName'];
    const resTime = values['resName'];
    const resGuests = values['resName'];

     insertNewEntry(resName, resPhone, resDate, resTime, resGuests, function(result) { 
        console.log(values);
        console.log(result); 
    }); 
})

app.get('/insertNewEntry', (request, response) => {
    response.render('thanks')
})

// set the app to listen on the right port
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

connection = mysql.createConnection( {
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
    var sql = `INSERT INTO entries VALUES ('${name}', '${phone}', '${date}', '${time}', '${guests}')`;
    connection.query(sql, function (err, result) {
        callback(result);
    }, err=> {
        result = "ERROR OCCURRED";
        callback(result);
    })
}

function removeReservation(name, phone) {
    var sql = "DELETE FROM assign4 WHERE Title IS NULL";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    })
}
