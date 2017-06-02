"use strict";

const fs = require('fs');
const jsonfile = require('jsonfile');
const jsonToCsv = require('json2csv');

jsonfile.readFile('./data/site-data.json', (error, data) => {
    if (!error) {
        const fields = ['shirtName', 'requestUrl', 'price', 'imgUrl'];
        var csv = jsonToCsv({ data: data, fields: fields });

        fs.writeFile('./data/out.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });
    } else {
        console.error(error.message);
    }
});