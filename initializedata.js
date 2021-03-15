import sqlite3 from "sqlite3";
import { loadJSON } from "./parsejson.js";
import { v4 as uuidv4 } from 'uuid';

// Connect to database
let database = new sqlite3.Database('hackers.db');

//initialize two tables to store hacker information
export const initializeData = (filename) => {
    let hackerjson = loadJSON('./json/hacker-data-2021.json');

    for (var i = 0; i < hackerjson.length; i++) {
        let data = hackerjson[i];
        let id = uuidv4();
        create(id, data.name, data.picture, data.company, data.email, data.phone);
        for (var j = 0; j < data.skills.length; j++) {
            let skill = data.skills[j];
            createSkill(id, skill.name, skill.rating);
        }
    }
    console.log("Initializing data...");
};

const create = (id, name, picture, company, email, phone) => {
    return database.run(`INSERT INTO hackerdata (hackerid, name, picture, company, email, phone)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [id, name, picture, company, email, phone], function(err) {
        if (err) {
            return console.log(err.message)
        }
    })
};

const createSkill = (id, name, rating) => {
    return database.run(`INSERT INTO skills (hackerid, name, rating)
                    VALUES (?, ?, ?)`,
                    [id, name, rating], function(err) {
        if (err) {
            return console.log(err.message)
        }
    })
};

const clearData = () => {
    database.run(`DELETE FROM hackerdata`);
    database.run(`DELETE FROM skills`);
};

initializeData('./json/hacker-data-2021.json');
database.close();
