const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');

let stream = fs.createReadStream("../public/csvToInsert/rainbowCat_noprimkey.csv");
let myData = [];
let csvStream = csv
    .parse()
    .on("data", function (data) {
        myData.push(data);
    })
    .on("end", function () {
        myData.shift();

        // create a new connection to the database
        const connection = mysql.createConnection({
            host: process.env.RB_HOST,
            user: process.env.RB_USER,
            password: process.env.RB_PW,
            database: process.env.RB_DB,
            multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
        })

        // open the connection
        connection.connect((error) => {
            if (error) {
                console.error(error);
            } else {
                let query = 'INSERT INTO rainbowcat (vendorName, ediName, issueDate, needNewCat, updatedWLatest, reporter, comments, andrea, vendorEmail, vendorTestEmail) VALUES ?';
                connection.query(query, [myData], (error, response) => {
                    console.log(error || response);
                });
            }
        });
    });


stream.pipe(csvStream);