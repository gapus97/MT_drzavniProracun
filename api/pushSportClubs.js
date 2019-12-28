'use strict'

require('array.prototype.flatmap').shim();
var elasticsearch = require('elasticsearch');

const puppeteer = require('puppeteer');

const dataset=[];
(async() => {
    
    let sportPageInfo ='https://www.bizi.si/seznam/SKD/D/dejavnost-sportnih-klubov/';
    let browser = await puppeteer.launch({devtools:true});
    let page = await browser.newPage();
    await page.goto(sportPageInfo);
    var dataset = await page.evaluate(() => {
        tdBody = document.querySelector('div[class="columns no-padding"] table tbody tr');
        let arrayOfClubs=[];
        for(var i=0; i<tdBody.cells.length;++i){
            ul=tdBody.cells[i].querySelector('ul');
            lAll=ul.getElementsByTagName('li');
            for(var j=0;j<lAll.length;j++){
                arrayOfClubs.push(lAll[j].getElementsByTagName('a')[0].href);
            }
        }
        return arrayOfClubs;
    });
    console.log(dataset);
    var data=[];
    for(var i=0;i<dataset.length;i++){
        let page=await browser.newPage();
        await page.goto(dataset[i]);
        let club=await page.evaluate(() => {
            var location=document.getElementsByClassName('i-location')[0].innerText.split(',');
            stateOfClub=location[2].slice(5,location[2].length);
            let clubObject={
                state:stateOfClub,
                url:document.location.href
            };
            return clubObject;
        });
        data.push(club);
    }
    
})();

'use strict'
async function run (data) {
require('array.prototype.flatmap').shim()
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://localhost:9200'
})
await client.indices.create({
    index: 'sportClubsByState',
    body: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          sportClub_state: { type: 'text' },
          sportClub_url: { type: 'text' },
        }
      }
    }
  }, { ignore: [400] })
const dataset=[];
var sportClub;
for(var i=0; i<data.length;i++){
    var sportClub={
        id:i,
        sportClub_state:data[i].state,
        sportClub_url:data[i].url
    }
    dataset.push(sportClub);  
}
const body = dataset.flatMap(doc => [{ index: { _index: 'sportClubsByState' } }, doc])
const { body: bulkResponse } = await client.bulk({ refresh: true, body })
}
