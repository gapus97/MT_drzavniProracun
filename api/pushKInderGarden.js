'use strict'

require('array.prototype.flatmap').shim();
var elasticsearch = require('elasticsearch');

const puppeteer = require('puppeteer');

const dataset=[];
(async() => {
    
    let kindeGarden ='https://paka3.mss.edus.si/registriweb/SeznamVrtci.aspx';
    let browser = await puppeteer.launch({devtools:true});
    let page = await browser.newPage();
    await page.goto(kindeGarden);
    var dataset = await page.evaluate(() => {
        trBody = document.querySelector('div:not([class])>table>tbody>tr>td>table>tbody');
        
        let arrayOfKinders=[];
        for(i=1; i<trBody.rows.length-3;++i){
            var kinderObject={
                stateCountryName:trBody.rows[i].cells[1].innerText,
                nameOfKinderGarden:trBody.rows[i].cells[2].innerText
            }
            arrayOfKinders.push(kinderObject);
        }
        return arrayOfKinders;
    });
    run(dataset);
})();

'use strict'
async function run (data) {
require('array.prototype.flatmap').shim()
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://localhost:9200'
})
await client.indices.create({
    index: 'kindergartensbystate',
    body: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          kindergarten_state: { type: 'text' },
          kindergarten_name: { type: 'text' },
        }
      }
    }
  }, { ignore: [400] })
const dataset=[];
var kindergartenObject;
for(var i=0; i<data.length;i++){
    var kindergartenObject={
        id:i,
        kindergarten_state:data[i].stateCountryName,
        kindergarten_name:data[i].nameOfKinderGarden
    }
    dataset.push(kindergartenObject);  
}
const body = dataset.flatMap(doc => [{ index: { _index: 'kindergartensbystate' } }, doc])
const { body: bulkResponse } = await client.bulk({ refresh: true, body })
debugger;
}
