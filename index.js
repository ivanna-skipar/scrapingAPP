const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const clevercarsURL = 'https://clevercars.ebbinghaus-automobile.de/Ebbinghaus-am-Stadion/BMW/120/Gebrauchtfahrzeug/Benzin/Automatik/107cb12e771b4c10a1fd38ee60f3b062/1141';
//const clevercarsURL = 'https://clevercars.ebbinghaus-automobile.de/Ebbinghaus-Autozentrum-Dortmund-GmbH/Ford/Fiesta/Gebrauchtfahrzeug/Benzin/Schaltgetriebe/925c69ea1e794def82741c248378391b/1141'; //used it for testing correct data access

function Car (makeModel, fuel_type, mileage) {
    this.makeModel = makeModel;
    this.fuel_type = fuel_type;
    this.mileage = mileage;
}

rp(clevercarsURL)
    .then(function (html) {
        const $ = cheerio.load(html)
        makeModel = ($('h1>strong', html).text()).trim();
        fuel_type = ($('li>.fa-tint', html)[0].next.data).trim();
        mileage = ($('li>.fa-road', html)[0].next.data).trim();
        let cleverCars = new Car(makeModel, fuel_type, mileage);
        fs.writeFile(`resourses/$clevercars/data/${makeModel}.json`, JSON.stringify(cleverCars), (err) => {
            if (err) throw err;
        });
    })
    .catch(function (err) {
        throw err;
    })


//autoweller
const autowellerURL = 'https://www.autoweller.de/neuwagen/rx-450h-awd-f-sport-pano-hud-360deg-carplay-leder-766523?page=1&s%5Bref%5D=%2Ffahrzeugsuche%2F_%2Flexus%2Frx-330_rx-450_rx-400_rx-350_rx-300_rx-200%2F_%2Fauto-weller-alle%2Ffahrzeugtyp%2Fgelandewagen-pickup%2Ftueren%2F5-turer%3Fpage%3D1';
//const autowellerURL = 'https://www.autoweller.de/neuwagen/aygo-x-sofort-verfugbar-carplay-acc-klima-tempo-769067?s%5Bref%5D=%2Ffahrzeugsuche%2Fneuwagen%2F_%2F_%2F_%2Fauto-weller-alle'; //used it for testing correct data access
rp(autowellerURL)
    .then(function (html) {
        const $ = cheerio.load(html);
        makeModel = '';
        let label = $('.tres>.tres__col>dl>dt', html);
        for (i = 0; i < label.length; i++){
            label = $('.tres>.tres__col>dl>dt', html)[i].children[0].data;
            if (label == 'Marke') {
                if (makeModel.length = 0) {
                    makeModel += $('.tres>.tres__col>dl>dd', html)[i].children[0].data;
                } else {
                    makeModel = $('.tres>.tres__col>dl>dd', html)[i].children[0].data + makeModel;
                }
            } else if (label == 'Modell') {
                makeModel += ' ' + $('.tres>.tres__col>dl>dd', html)[i].children[0].data;
            } else if (label == 'Laufleistung') {
                mileage = $('.tres>.tres__col>dl>dd', html)[i].children[0].data;
            } else if (label == 'Kraftstoff') {
                fuel_type = $('.tres>.tres__col>dl>dd', html)[i].children[0].data;
            }
        } 
        let autowellerCar = new Car(makeModel, fuel_type, mileage);;
        fs.writeFile(`resourses/$autoweller/data/${makeModel}.json`, JSON.stringify(autowellerCar), (err) => {
            if (err) throw err;
        });
    })
    .catch(function (err) {
        throw err;
    })

// autoland 
const autolandURL = 'https://autoland.de/volvo/s90/meissen/123177/volvo-s90-d4-momentum-4-zonen-klima-navi-sitzheizung';
//const autolandURL = 'https://autoland.de/seat/leon/leon/schwerin/125620/seat-leon-fr-1.5-tsi-3-zonen-klima-navi-sitzheizung'; //used it for testing correct data access
rp(autolandURL)
    .then(function (html) {
        const $ = cheerio.load(html)
        makeModel = $('.product--title', html).last().text();
        let label;
        for (i = 0; i < $('.vehicle-details>li>span', html).length; i++){
            label = $('.vehicle-details>li>span', html)[i].children[0].data;
            if (label == 'Kilometerstand') {
                mileage = $('.vehicle-details>li>span', html)[i + 1].children[0].data;
            }
            if (label == 'Kraftstoff') {
                fuel_type = $('.vehicle-details>li>span', html)[i + 1].children[0].data;
            }
        }
        let autolandCar = new Car(makeModel, fuel_type, mileage);;
        fs.writeFile(`resourses/$autoland/data/${makeModel}.json`, JSON.stringify(autolandCar), (err) => {
            if (err) throw err;
        });
    })
    .catch(function (err) {
        throw err.response.statusMessage ;
    })