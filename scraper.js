"use strict";

// Require node_modules
const fs = require('fs');
const jsonfile = require('jsonfile');
const scrapeIt = require('scrape-it');
const utils = require('./utils');

// Set base url
const url = 'http://www.shirts4mike.com';
// Create array to hold link data
const shirtLinks = [];

// If /data directory does not exist create it
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

//@ts-ignore
// Scrape shirts archive for links to individual shirts
scrapeIt(`${url}/shirts.php`, {
    products: {
        listItem: ".products li",
        data: {
            links: {
                selector: "a",
                attr: "href"
            }
        }
    }
}).then(links => {
    // Create array to hold individual shirt data objects
    const shirtData = [];
    // Loop through links object to grab individual links
    for (let link of links.products) {
        shirtLinks.push(link.links);
    }
    // Loop through shirt links
    for (let query of shirtLinks) {
        //@ts-ignore
        // Scrape each individual shirt url for data on each shirt
        scrapeIt(`${url}/${query}`, {
            Title: {
                selector: '.shirt-details h1',
                how: 'text'
            },
            Price: {
                selector: '.price',
                how: 'html'
            },
            ImageURL: {
                selector: '.shirt-picture img',
                attr: 'src'
            }
        }, (error, data) => {
            // Parse title data to remove price from string
            data.Title = data.Title.split(' ');
            data.Title.shift();
            data.Title = data.Title.join(' ');

            // Set url for each individual shirt object
            data.URL = `${url}/${query}`;
            // Create time stamp for each shirt
            data.Time = new Date().toLocaleTimeString();
            // push shirt data onto array for writing out to .json file
            shirtData.push(data);
            // Write site-data.json for conversion into .csv
            jsonfile.writeFile('./data/site-data.json', shirtData, 'utf-8', (error) => {
                if (error) {
                    utils.fileError(error, 'site-name.json', 'write');
                }
                console.log('data written');
            });

            if (error) {
                utils.connectionError(error, `${url}/${query}`);
            }
        });
    }
}).catch(error => {
    utils.connectionError(error);
});