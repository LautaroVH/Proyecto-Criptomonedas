const selectCryptocurrencies = document.querySelector("#cryptocurrencies");
const selectCurrency = document.querySelector("#currency");
const form = document.querySelector("#form");
const result = document.querySelector("#result");

const searchObj = {
    currency: "",
    cryptocurrencies: ""
}

//create promise
const cryptoObtain = cryptoCurrencies => new Promise(resolve => {
    resolve(cryptoCurrencies)
});

document.addEventListener ("DOMContentLoaded", () => {
    consultCryptocurrencies();
    form.addEventListener("submit", formSubmit);

    selectCryptocurrencies.addEventListener("change", readValue);
    selectCurrency.addEventListener("change", readValue);

})

function consultCryptocurrencies() {
    const url = " https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
    .then(answer => answer.json ())
    .then(result => cryptoObtain(result.Data))
    .then(cryptoCurrencies => cryptocurrenciesSelect(cryptoCurrencies))
}

function cryptocurrenciesSelect (cryptoCurrencies) {
    cryptoCurrencies.forEach (crypto => {
        const { FullName, Name} = crypto.CoinInfo;

        const option = document.createElement(("option"));
        option.value = Name;
        option.textContent = FullName;
        selectCryptocurrencies.appendChild(option);

    })

}
function readValue(e){
    searchObj[e.target.name] = e.target.value;
}

function formSubmit(e){
    e.preventDefault();

    //validate
    
    const { currency, cryptocurrency} = searchObj;

    if ( currency === "" || cryptocurrency === "") {
        showAlert ("Both camps must be filled");
        return;
    } 

    //API consult
    APIConsult();

}

function showAlert (msj) {
    const errorExist = document.querySelector(".error");
    if(!errorExist) {                           //only 1 messaje of error
        const messajeDiv = document.createElement("div")    ;
        messajeDiv.classList.add("error");
    
        // error messaje
        messajeDiv.textContent = msj;
    
        form.appendChild(messajeDiv);
    
        setTimeout(() => {
            messajeDiv.remove();
        }, 3000);
    
    }
}

function APIConsult(){
    const {currency, cryptocurrency } = searchObj;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`
    // const url = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR`   // delete BTC from web and add variables js, also USD,JPY,EUR.. not done up

    showSpinner();
fetch(url)
    .then(answer => answer.json())
    .then(quote => {
        showQuoteHTML(quote.DISPLAY[cryptocurrency][currency]);   //dynamic way [] []
    })

}

function showQuoteHTML (quote){

    cleanHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = quote;
    const price = document.createElement('p');
    price.classList.add('price');
    price.innerHTML = `Actual price: <span>${PRICE}</span>`;

    const highDay = document.createElement('p');
    highDay.innerHTML =`<p> Highest  price of the day <span>${HIGHDAY}</span>`;

    const lowDay = document.createElement('p');
    lowDay.innerHTML =`<p> Lowest  price of the day <span>${LOWDAY}</span>`;

    const last24Hours = document.createElement('p');
    last24Hours.innerHTML =`<p> Last 24 hours <span>${CHANGEPCT24HOUR} % </span>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML =`<p> Last update <span>${LASTUPDATE}</span>`;




    result.appendChild(price);
    result.appendChild(highDay);
    result.appendChild(lowDay);
    result.appendChild(last24Hours);
    result.appendChild(lastUpdate);
}

function cleanHTML(){
    while (result.firstChild)
        result.removeChild(result.firstChild);
}

function showSpinner(){
    cleanHTML();
    const spinner = document.createElement('div');
    spinner.classList.add("spinner");

    spinner.innerHTML = `
     <div class="bounce1"></div>
     <div class="bounce2"></div>
     <div class="bounce3"></div>
    
    `;

    result.appendChild(spinner);
}