/**
 * Created by mikigv on 6/25/2018.
 */

class CurrencyAPI {

    async queryAPI(currency_one, currency_two){
        const url = await fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${currency_one}_${currency_two},
        ${currency_two}_${currency_one}`);

        //converting the list to json
        const conversonResult = await url.json();

        return {
            conversonResult
        };
    }

    //get the list of currencies from the API asynchronously
    async getCurrencyList(){
        //fetch the list
        const url = await fetch('https://free.currencyconverterapi.com/api/v5/currencies');

        //converting the list to json
        const currencies = await url.json();

        return {//return the concerted list

            currencies
        }
    }

    isNumberKey(evt)
    {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
}
