import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import { updateHacker, getAllUsers, getUserById, getSkillFrequency } from "./hackers.js";

const port = process.env.PORT || 5000;

const app = express();
const jsonParser = bodyParser.json();

//TODO: initialize database with initializedb.js script

//connect to database
let db = new sqlite3.Database('hackers.db');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example REST Express app listening at http://localhost:${port}`)
})

app.get('/users/', (req, res) => {
    getAllUsers().then(function(result) {
        res.status(200).json({result})
    }).catch(function(err) {
        console.log(err);
        res.status(400).json({"error":err.message});
    })
})

//takes in unique hackerid UUID
app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    getUserById(id).then(function(result) {
        res.status(200).json({result})
    }).catch(function(err) {
        console.log(err);
        res.status(400).json({"error":err.message});
    })
})

//takes in hacker name, returns hacker data
//for all hackers that share that name
app.get('/users/byname/:name', (req, res) => {
    let name = req.params.name;
    var sql = `SELECT x.hackerid,
                      x.name, 
                      x.picture, 
                      x.company,
                      x.email,
                      x.phone,
                      GROUP_CONCAT(y.name) as skills,
                      GROUP_CONCAT(y.rating) as ratings
                FROM hackerdata x
                LEFT JOIN skills y ON y.hackerid = x.hackerid
                WHERE x.name = ?
                GROUP BY x.hackerid`
    var params = [name];
    db.all(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(200).json({result})
    });
})

app.put('/users/:id', jsonParser, (req, res) => {
    let id = req.params.id;
    let request = req.body;
    updateHacker(id, request).then(function() {
        getUserById(id).then(function(result) {
            res.status(200).json({result})
        }).catch(function(err) {
            console.log(err);
        })
    }).catch(function(err) {
        console.log(err);
    });
})

//requires params min_frequency and max_frequency
app.get('/skills/', (req, res) => {
    let min = req.query.min_frequency;
    let max = req.query.max_frequency;
    getSkillFrequency(min, max).then(function(result) {
        res.status(200).json({result})
    }).catch(function(err) {
        console.log(err);
        res.status(400).json({"error:":err.message})
    })
})
