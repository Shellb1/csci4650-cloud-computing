const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');

app.get('/', (request, response) => {
        response.sendFile(path.join(__dirname, '/index.html'));
})
// what an example endpoint looks like for GET requests
app.get('/getEntries', (request, response) => {

    /* have to use a callback here -> JavaScript is 
     asynchronous and you can't just say result = getTableEntries() 
     in an asynchronous operation 
     You still have to set up to read the input parameters. I don't 
     really mind if it's a GET or POST request, it's up to you. 
     
     */
    getTableEntries('name', 'phone', function(result) { 
        console.log(result);
        response.json(result)
    }) 
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
    connection.query("SELECT * FROM assign4", function (err, result) {
        callback(result)
    }, err => {
        result = "ERROR OCCURRED";
        callback(result)
    });

}

function insertNewEntry() {
    var sql = "INSERT INTO assign4 VALUES ('TESTING', 'NOPE', 'YUP', '123', 'ANOTHER')";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    })
}

function removeReservation(name, phone) {
    var sql = "DELETE FROM assign4 WHERE Title IS NULL";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    })
}
