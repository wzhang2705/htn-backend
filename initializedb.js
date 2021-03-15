import sqlite3 from "sqlite3";

// Create a database if none exists
let database = new sqlite3.Database('hackers.db');

export const initializeTables = () => {
    database.run('CREATE TABLE IF NOT EXISTS hackerdata (hackerid UUID, name varchar(100), ' + 
             'picture varchar(100), company varchar(100), email varchar(100), phone varchar(100));', function(err) {
        if (err) {
            return console.log(err.message)
        }
        console.log('Created hackerdata table')
    })

    database.run('CREATE TABLE IF NOT EXISTS skills (hackerid UUID, name varchar(100), rating int);', function(err) {
        if (err) {
            return console.log(err.message)
        }
        console.log('Created skills table')
    })
}

initializeTables();
database.close();
