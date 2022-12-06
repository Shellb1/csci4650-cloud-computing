var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

const { get } = require('https');
var mysql = require('mysql');

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

function getTableEntries(name, phone) {
    connection.query("SELECT * FROM assign4", function (err, result) {
        if (err) throw err;
        console.log(result)
    });

    /*connection.query(`SELECT * FROM entries WHERE name = '${name}' AND 'Phone Number = '${phone}'`, function (err, result) {
        if (err) throw err;
        console.log(result)
    });*/

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

    /*var sql = `DELETE FROM reservations WHERE name = '${name}' AND 'Phone Number' = '${phone}'`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    })*/
}

getTableEntries();
//insertNewEntry();
removeReservation();
getTableEntries();

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
