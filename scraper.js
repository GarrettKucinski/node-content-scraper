"use strict";

const fs = require('fs');
const jsonfile = require('jsonfile');
const scrapeIt = require('scrape-it');
const utils = require('./utils');

const url = 'http://www.shirts4mike.com';
const shirtLinks = [];

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

//@ts-ignore
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
    const shirtData = [];
    for (let link of links.products) {
        shirtLinks.push(link.links);
    }
    for (let query of shirtLinks) {
        //@ts-ignore
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
            data.Title = data.Title.split(' ');
            data.Title.shift();
            data.Title = data.Title.join(' ');
            data.URL = `${url}/${query}`;
            data.Time = new Date().toLocaleTimeString();

            shirtData.push(data);

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