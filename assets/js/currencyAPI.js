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
        this.getCurrencyList();
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

    addCurrenciesToDatabase(currencies) {
        this.openDatabase().then(db => {
            if (!db) return;

            const tx = db.transaction('currencies', 'readwrite');
            const store = tx.objectStore('currencies');

            Object.values(currencies.results).forEach((currency) => {
                store.put(currency);
            });

        }).catch(error => console.log('Something went wrong: '+ error));
    }

    showCurrenciesFromDatabase() {
        //const currencies = data;
        //get the first select component from the UI to populate it with the currency list
        const select = document.getElementById('currency-one');

        //get the second select component from the UI to populate it with the currency list
        const selectTwo = document.getElementById('currency-two');

        return this.openDatabase().then( db => {

            if (!db) return;

            let index = db.transaction('currencies')
                .objectStore('currencies').index('id');

            return index.getAll().then( currencies => {
                for(let currency of currencies){
                    //console.log(cryptoCurrencies[currency]);
                    //create option element dynamically
                    const option = document.createElement('option');
                    const optionTwo = document.createElement('option');
                    //this will add a value to the created option like: USD, GPB, BIR...
                    option.value = currency.id;
                    optionTwo.value = currency.id;
                    //this will add a full name of the currency to the created option
                    option.appendChild(document.createTextNode(currency.currencyName));
                    optionTwo.appendChild(document.createTextNode(currency.currencyName));
                    //Finally append the created element to the select element
                    select.appendChild(option);
                    selectTwo.appendChild(optionTwo);
                    //Set USD the default currency for the select one
                    select.options[select.selectedIndex].value="USD";
                    selectTwo.options[selectTwo.selectedIndex].value="EUR";
                    select.options[select.selectedIndex].text="United States Dollar";
                    selectTwo.options[selectTwo.selectedIndex].text="Euro";
                    symbolOne.innerText = "USD";
                    symbolTwo.innerText = 'EUR';

                    this.queryAPI("USD", "EUR", "United States Dollar equals", "Euro", 1, "amountOne");
                }

            });
        });
    }


    //get the list of currencies from the API asynchronously
    getCurrencyList(){
        //fetch the list of currencies
        fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(response => {
            return response.json();
        }).then(response => {

            //const currencies = data;
            //get the first select component from the UI to populate it with the currency list
            const select = document.getElementById('currency-one');

            //get the second select component from the UI to populate it with the currency list
            const selectTwo = document.getElementById('currency-two');

            //Iterate through the returned list
            Object.values(response.results).forEach((currency) => {
                //console.log(cryptoCurrencies[currency]);
                //create option element dynamically
                const option = document.createElement('option');
                const optionTwo = document.createElement('option');
                //this will add a value to the created option like: USD, GPB, BIR...
                option.value = currency.id;
                optionTwo.value = currency.id;
                //this will add a full name of the currency to the created option
                option.appendChild(document.createTextNode(currency.currencyName));
                optionTwo.appendChild(document.createTextNode(currency.currencyName));
                //Finally append the created element to the select element
                select.appendChild(option);
                selectTwo.appendChild(optionTwo);
                //Set USD the default currency for the select one
                select.options[select.selectedIndex].value="USD";
                selectTwo.options[selectTwo.selectedIndex].value="EUR";
                select.options[select.selectedIndex].text="United States Dollar";
                selectTwo.options[selectTwo.selectedIndex].text="Euro";
                symbolOne.innerText = "USD";
                symbolTwo.innerText = 'EUR';

                this.queryAPI("USD", "EUR", "United States Dollar equals", "Euro", 1, "amountOne");
            });

            this.addCurrenciesToDatabase(currencies);

        }).catch( error => {
            console.log('It looks like your are offline or have a bad network: '+ error);
            this.showCurrenciesFromDatabase(); // get currencies from cache since user is offline.
        });

    }

    addCurrencyRatesToDatabase(rates){
        this.openDatabase().then(db => {
            if (!db) return;

            const tx = db.transaction('rates', 'readwrite');
            const store = tx.objectStore('rates');

            Object.values(rates.results).forEach((rate) => {
                store.put(rate);
            });

        }).catch(error => console.log('Something went wrong: '+ error));
    }

    showCurrencyRatesFromDatabase(currency_one, currency_two, textOne, textTwo, amountOne, indicator){
        //get the first price box
        const amountOneEle = document.getElementById('amount-one');
        //get the secon price box
        const amountTwoEle = document.getElementById('amount-two');

        const descriptionOne = document.getElementById('currency-info-one');
        const descriptionTwo = document.getElementById('currency-info-two');

        return this.openDatabase().then( db => {

            if (!db) return;

            let index = db.transaction('rates')
                .objectStore('rates').index('rates');

            return index.getAll().then( rates => {
                for(let rate of rates){
                    if(rate.id == `${currency_one}_${currency_two}`){

                        if(indicator == 'amountOne'){
                            amountOneEle.value = amountOne;
                            amountTwoEle.value = (amountOne) * (rate.val).toFixed(2);
                            descriptionOne.innerText = `${amountOneEle.value} ${textOne}`;
                            descriptionTwo.innerText = `${amountTwoEle.value} ${textTwo}`;

                        }else if(indicator == 'amountTwo'){
                            amountTwoEle.value = amountOne;
                            amountOneEle.value = (amountOne) * (rate.val).toFixed(2);
                            descriptionOne.innerText = `${amountOneEle.value} ${textOne}`;
                            descriptionTwo.innerText = `${amountTwoEle.value} ${textTwo}`;

                        }
                    }
                }

            });
        });

    }


    queryAPI(currency_one, currency_two, textOne, textTwo, amountOne, indicator){
        //query the API aycly
        fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${currency_one}_${currency_two},
        ${currency_two}_${currency_one}`).then(response => {
            return response.json();
        }).then(response => {

            //get the first price box
            const amountOneEle = document.getElementById('amount-one');
            //get the secon price box
            const amountTwoEle = document.getElementById('amount-two');

            const descriptionOne = document.getElementById('currency-info-one');
            const descriptionTwo = document.getElementById('currency-info-two');


            Object.values(response.results).forEach((rate) => {

                if(indicator == 'amountOne'){
                    amountOneEle.value = amountOne;
                    amountTwoEle.value = (amountOne) * (rate.val).toFixed(2);
                    descriptionOne.innerText = `${amountOneEle.value} ${textOne}`;
                    descriptionTwo.innerText = `${amountTwoEle.value} ${textTwo}`;

                }else if(indicator == 'amountTwo'){
                    amountTwoEle.value = amountOne;
                    amountOneEle.value = (amountOne) * (rate.val).toFixed(2);
                    descriptionOne.innerText = `${amountOneEle.value} ${textOne}`;
                    descriptionTwo.innerText = `${amountTwoEle.value} ${textTwo}`;

                }
            });

            this.addCurrencyRatesToDatabase(response);


        }).catch( error => {
            console.log('It looks like your are offline or have a bad network: '+ error);
            this.showCurrencyRatesFromDatabase(currency_one, currency_two, textOne, textTwo, amountOne, indicator); // get currencies from cache since user is offline.
        });
    }

    //check if the input is only number
    isNumberKey(evt)
    {
        const charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

    showUpdateUI(message){
        let htmlTemplate = '';

        htmlTemplate += `
                <div class="card update-indicator" style="width: 18rem;">
                   <div class="card-body">
                       <h5 class="card-title">${message}</h5>
                       <button id="btn-refresh" class="btn btn-primary">Refresh</button>
                       <button id="btn-cancel" class="btn btn-primary">Cancel</button>
                   </div>
               </div>
            `;

        const updateMessage = document.querySelector('#update-message');

        updateMessage.innerHTML = htmlTemplate;
    }
}
