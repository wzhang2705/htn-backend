import fs from "fs";

export const loadJSON = (filename) => {
    let rawdata = fs.readFileSync(filename);
    let hacker = JSON.parse(rawdata);
    return hacker;
};
