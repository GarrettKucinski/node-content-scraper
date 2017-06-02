const fs = require('fs');
const jsonToCsv = require('json2csv');
const scrapeIt = require('scrape-it');

const url = 'http://www.shirts4mike.com';

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

const shirtLinks = [];
const shirtData = [];
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
    for (let link of links.products) {
        shirtLinks.push(link.links);
    }
    for (let query of shirtLinks) {
        //@ts-ignore
        scrapeIt(`${url}/${query}`, {
            shirtName: {
                selector: '.shirt-details h1',
                how: 'text'
            },
            // requestUrl: `${url}/${query}`,
            price: {
                selector: '.price',
                how: 'html'
            },
            imgUrl: {
                selector: '.shirt-picture img',
                attr: 'src'
            }
        }).then(data => {
            data.shirtName = data.shirtName.split(' ');
            data.shirtName.shift();
            data.shirtName = data.shirtName.join(' ');

            data.requestUrl = `${url}/${query}`;

            shirtData.push(data);
        });
    }
});


setTimeout(() => {
    console.log(shirtData);
    const fields = ['shirtName', 'requestUrl', 'price', 'imgUrl'];

    var csv = jsonToCsv({ data: shirtData, fields: fields });

    fs.writeFile('./data/out.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
}, 300);