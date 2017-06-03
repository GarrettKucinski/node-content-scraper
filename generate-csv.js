"use strict";

const fs = require('fs');
const jsonfile = require('jsonfile');
const jsonToCsv = require('json2csv');
const utils = require('./utils');


jsonfile.readFile('./data/site-data.json', (error, data) => {
    if (!error) {
        const currentDate = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10);

        const fields = ['Title', 'Price', 'ImageURL', 'URL'];
        var csv = jsonToCsv({ data: data, fields: fields });

        fs.writeFile(`./data/${currentDate}.csv`, csv, function(error) {
            if (error) {
                utils.fileError(error, `${currentDate}.csv`, 'write');
            }
            console.log('file saved');
        });
    } else {
        utils.fileError(error, 'site-name.json', 'read');
    }
});