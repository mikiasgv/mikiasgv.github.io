/**
 * Created by mikigv on 6/25/2018.
 */

class View {
    constructor(){
        this.init();
    }

    init(){
        this.printCurrencies();
    }


    printCurrencies(){

        //call the method will return a list with a promise
        currencyAPI.getCurrencyList()
            .then(data => {
                //console.log(data);
                //get the returned result to the deepest level
                const currencies = data.currencies.results;
                //get the first select component from the UI to populate it with the currency list
                const select = document.getElementById('currency-one');

                //get the second select component from the UI to populate it with the currency list
                const selectTwo = document.getElementById('currency-two');

                //get the first price box
                const amountOne = document.getElementById('amount-one');
                //get the secon price box
                const amountTwo = document.getElementById('amount-two');

                const symbolOne = document.getElementById('amount-one-currency');
                const symbolTwo = document.getElementById('amount-two-currency');

                const descriptionOne = document.getElementById('currency-info-one');
                const descriptionTwo = document.getElementById('currency-info-two');

                //Iterate through the returned list
                Object.keys(currencies).forEach(function (currency) {
                    //console.log(cryptoCurrencies[currency]);
                    //create option element dynamically
                    const option = document.createElement('option');
                    //this will add a value to the created option like: USD, GPB, BIR...
                    option.value = currencies[currency].id;
                    //this will add a full name of the currency to the created option
                    option.appendChild(document.createTextNode(currencies[currency].currencyName));
                    //Finally append the created element to the select element
                    select.appendChild(option);
                    //Set USD the default currency for the select one
                    select.options[select.selectedIndex].value="USD";
                    select.options[select.selectedIndex].text="United States Dollar";
                    symbolOne.innerText = "USD";
                });

                //Iterate through the returned list
                Object.keys(currencies).forEach(function (currency) {
                    //console.log(cryptoCurrencies[currency]);
                    //create option element dynamically
                    const option = document.createElement('option');
                    //this will add a value to the created option like: USD, GPB, BIR...
                    option.value = currencies[currency].id;
                    //this will add a full name of the currency to the created option
                    option.appendChild(document.createTextNode(currencies[currency].currencyName));
                    //Finally append the created element to the select element
                    selectTwo.appendChild(option);
                    //Set EYR the def.ault currency for the select two
                    selectTwo.options[selectTwo.selectedIndex].value="EUR";
                    selectTwo.options[selectTwo.selectedIndex].text="Euro";
                    symbolTwo.innerText = 'EUR';
                });

                currencyAPI.queryAPI('USD', 'EUR')
                    .then(data => {
                        const finalResults = data.conversonResult.results;
                        Object.values(finalResults).forEach(function (result) {
                            amountOne.value = 1;
                            amountTwo.value = (result.val).toFixed(2);
                            descriptionOne.innerText = `1 United States Dollar equals`;
                            descriptionTwo.innerText = `${(result.val).toFixed(2)} Euro`;
                        });
                    });

            })

    }
}
