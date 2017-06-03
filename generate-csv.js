"use strict";

// Require node_modules
const fs = require('fs');
const jsonfile = require('jsonfile');
const jsonToCsv = require('json2csv');
const utils = require('./utils');

// Read json file for parsing into csv
jsonfile.readFile('./data/site-data.json', (error, data) => {
    if (!error) {
        // get current date in proper format for file naming
        const currentDate = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10);

        // Set fields for csv headers
        const fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
        // Convert json file to csv
        var csv = jsonToCsv({ data: data, fields: fields });
        // Write csv file with current date as file name
        fs.writeFile(`./data/${currentDate}.csv`, csv, function(error) {
            if (error) {
                utils.fileError(error, `${currentDate}.csv`, 'write');
            }
            // After writing csv file, cleanup and remove json file
            fs.unlink('./data/site-data.json', (error) => {
                if (error) {
                    utils.fileError(error, 'site-data.json', 'remove');
                }
            });
            console.log('file saved');
        });
    } else {
        utils.fileError(error, 'site-name.json', 'read');
    }
});