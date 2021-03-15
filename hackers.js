import sqlite3 from "sqlite3";
import Promise from "bluebird";

let db = new sqlite3.Database('hackers.db');

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT x.name, 
                      x.picture, 
                      x.company,
                      x.email,
                      x.phone,
                      GROUP_CONCAT(y.name) as skills,
                      GROUP_CONCAT(y.rating) as ratings
                FROM hackerdata x
                LEFT JOIN skills y ON y.hackerid = x.hackerid
                GROUP BY x.hackerid`
        var params = []
        db.all(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};

export const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT x.name, 
                      x.picture, 
                      x.company,
                      x.email,
                      x.phone,
                      GROUP_CONCAT(y.name) as skills,
                      GROUP_CONCAT(y.rating) as ratings
                FROM hackerdata x
                LEFT JOIN skills y ON y.hackerid = x.hackerid
                WHERE x.hackerid = ?
                GROUP BY x.hackerid`
        var params = [id]
        db.all(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};

export const createSkill = (id, name, rating) => {
    var sql = `INSERT INTO skills (hackerid, name, rating)
                VALUES (?, ?, ?)`;
    return db.run(sql, [id, name, rating], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
};

export const countSkillByIdAndName = (id, name) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(*) AS count FROM skills WHERE hackerid = ? AND name = ?`;
        db.get(sql, [id, name], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};

export const updateSkillByIdAndName = (id, name, rating) => {
    var sql = `UPDATE skills SET rating = ? WHERE hackerid = ? AND name = ?`;
    var params = [rating, id, name];                
    //var sql = `UPDATE skills SET rating = ? WHERE hackerid = ? AND name = ?`;
    return db.run(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
};

//data is a json
export const updateHacker = (id, data) => {
    return new Promise((resolve, reject) => {
        let columns = "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (key == "skills") {
                    //ignore for now;
                } else if (columns == "") {
                    columns += `${key} = '${data[key]}' `
                } else {
                    columns += `,${key} = '${data[key]}' `
                }
            }
        }
        if (data.hasOwnProperty("skills")) {
            for (var i = 0; i < data["skills"].length; i++) {
                let skills = data["skills"][i];
                countSkillByIdAndName(id, skills.name).then(function(result) {
                    JSON.stringify(result);
                    if (result.count == 0) {
                        createSkill(id, skills.name, skills.rating);
                    } else {
                        updateSkillByIdAndName(id, skills.name, skills.rating);
                    }
                }).catch(function(err) {
                    console.log("An error occured", err);
                    reject(err);
                })
            }
        }
        if (columns != "") {
            var sql = `UPDATE hackerdata SET ` + columns + `WHERE hackerid = ?`
            db.run(sql, [id], (err, result) => {
                if (err) {
                    console.log(err);
                }
                resolve(result);
            })
        }
        resolve(0);
    });
};

export const getSkillFrequency = (min, max) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT *
                   FROM
                   (    
                    SELECT name, COUNT(*) AS frequency 
                    FROM skills
                    GROUP BY name
                   ) X
                   WHERE frequency >= ` + min + ` AND frequency <= ` + max
        db.all(sql, [], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};

export const clearHackerData = () => {
    return db.run(`DELETE FROM hackerdata`);
};
