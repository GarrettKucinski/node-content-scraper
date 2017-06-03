"use strict";

// Require node_modules
const fs = require('fs');

// Create function to template file error
function fileError(error, fileName, operation) {
    const now = new Date();
    const message = `[${now.toString()}] A (${error.code}) error has occured, could not ${operation} ${fileName}.\n`;
    fs.appendFile('./scraper-error.log', message, () => {
        console.error(message);
    });
}

// Create function to template connection error
function connectionError(error, url = '') {
    const now = new Date();
    const message = `[${now.toString()}] A (${error.code}) error has occured, could not connect to ${error.host}.\n`;
    fs.appendFile('./scraper-error.log', message, () => {
        console.error(message);
    });
}

module.exports.fileError = fileError;
module.exports.connectionError = connectionError;