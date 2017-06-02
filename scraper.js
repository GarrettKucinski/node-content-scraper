const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const jsonToCsv = require('json2csv');

const url = 'http://www.shirts4mike.com';

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

request(`${url}/shirts.php`, (error, response, body) => {

    if (error) {
        console.error('error', error.message);
        return;
    }

    const $ = cheerio.load(body);

    let products = $('.products a');

    products.each((i, link) => {

        let query = $(link).attr('href');

        request(`${url}/${query}`, (error, response, body) => {

            const $ = cheerio.load(body);

            let shirtInfo = $('.shirt-details h1').text();
            let shirtArray = shirtInfo.split(' ');

            shirtArray.shift();

            const shirtName = shirtArray.join(' ');

            const shirtData = [{
                "shirtName": shirtName,
                "requestUrl": `${url}/${query}`,
                "price": $('.price').html(),
                "imgUrl": $('.shirt-picture img').attr('src')
            }];

            console.log('shirt name: ', shirtData.shirtName);
            console.log('price: ', shirtData.price);
            console.log('image: ', shirtData.imgUrl);
            console.log('url: ', shirtData.requestUrl);
            console.log('\n');
            return shirtData;
        });
        const fields = ['shirtName', 'requestUrl', 'price', 'imgUrl'];
        var csv = jsonToCsv({ data: shirtData, fields: fields });

        fs.writeFile('./data/out.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });
    });
});