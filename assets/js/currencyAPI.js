/**
 * Created by mikigv on 6/25/2018.
 */

class CurrencyAPI {

    constructor(){
        this.init();
    }


    init(){
        //initialize the db
        this.openDatabase();
    }

    openDatabase() {
        // If the browser doesn't support service worker,
        // we don't care about having a database
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }

        return idb.open('currency-converter', 2, (upgradeDb) => {

            switch(upgradeDb.oldVersion) {
                case 0:
                    const currencyStore = upgradeDb.createObjectStore('currencies', {
                        keyPath: 'id'
                    });
                    currencyStore.createIndex('id', 'id');
                case 1:
                    var exchangeRateStore = upgradeDb.createObjectStore('rates', {
                        keyPath: 'id'
                    });
                    exchangeRateStore.createIndex('rates', 'id');
            }
        });
    }


    //get the list of currencies from the API asynchronously
    async getCurrencyList(){
        //fetch the list of currencies asynclly
        const url = await fetch('https://free.currencyconverterapi.com/api/v5/currencies');

        //converting the list to json
        const currencies = await url.json();

        let currencyArr = [];
        Object.values(currencies.results).forEach((currency) => {
            currencyArr.push(currency);
        });

        //add currencies to the db
        this.openDatabase().then((db) => {
            if (!db) return;

            const tx = db.transaction('currencies', 'readwrite');
            const store = tx.objectStore('currencies');
            Object.values(currencies.results).forEach((currency) => {
                store.put(currency);
            });

        });

        return {//return the concerted list

            currencyArr
        };


    }

    getCurrenciesFromDB(){
        let checkArr = [];
        this.openDatabase().then(function(db) {
            const index = db.transaction('currencies')
                .objectStore('currencies').index('id');

            checkArr.push(index.getAll());

            if(checkArr.length){
                //console.log('form db');
                return index.getAll();
            }
        });

        //console.log('form API')
        return this.getCurrencyList();
    }

    async queryAPI(currency_one, currency_two){
        //query the API aycly
        const url = await fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${currency_one}_${currency_two},
        ${currency_two}_${currency_one}`);

        //converting the list to json
        const conversonResult = await url.json();

        let exchangeArr = [];
        Object.values(conversonResult.results).forEach((rate) => {
            exchangeArr.push(rate);
        });

        //add currencies to the db
        this.openDatabase().then((db) => {
            if (!db) return;

            const tx = db.transaction('rates', 'readwrite');
            const store = tx.objectStore('rates');
            Object.values(conversonResult.results).forEach((rate) => {
                store.put(rate);
            });

        });

        return {
            exchangeArr
        };
    }

    queryAPIFromDB(currency_one, currency_two){
        let checkArr = [];
        this.openDatabase().then(function(db) {
            const index = db.transaction('rates')
                .objectStore('rates').index('rates');

            checkArr.push(index.getAll());

            if(checkArr.length){
                index.getAll().then(data => {
                    if(data.id == (currency_one + '_' + currency_two)){
                        return data;
                    }
                });
            }
        });

        return this.queryAPI(currency_one, currency_two);
    }

    //check if the input is only number
    isNumberKey(evt)
    {
        const charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
}
