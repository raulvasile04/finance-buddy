const startingBalanceInput = document.getElementById("starting-balance");
const transactionDescription = document.getElementById("transaction-description");
const transactionAmount = document.getElementById("transaction-amount");
const transactionDate = document.getElementById("transaction-date");
const transactionButton = document.querySelector("#add-transaction");
const transactionList = document.querySelector("#transaction-list");
const startingBalanceAmount = document.getElementById("starting-balance-amount");
const addStartingBalanceButton = document.getElementById("starting-balance-button");
const transactionType = document.getElementById("transaction-type");
const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");
const currencySelector = document.getElementById("exchange");
const changeCurrencyButton = document.getElementById("exchange-button");

let transactions = [];
let isDown = false;
let startX;
let scrollLeft;

const slider = document.documentElement;
slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.clientX;
    scrollLeft = window.scrollX;
});

function displayTransactions(exchangeRate = 1) {
    transactionList.innerHTML = "";
    document.querySelectorAll(".transaction-lists:not(#original-list)").forEach(card => card.remove());
    transactions.forEach((transaction, index) => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString("default", {month: "long"});
        const existingCard = document.getElementById(`${month}-card`);
        const li = document.createElement("li");
        const updatedAmount = transaction.amount * exchangeRate;
        const selectedCurrency = currencySelector.value;
        li.textContent = `Your transaction : ${transaction.description} , ${transaction.type} ${updatedAmount.toFixed(2)} ${selectedCurrency} , ${transaction.date}`;
        transactionList.appendChild(li);
        if (existingCard === null) {
            createMonthCard(month);
        } else {

        }

        const monthCard = document.getElementById(`${month}-card`);
        const ul = monthCard.querySelector("ul");
        ul.appendChild(li)

        if(transaction.type === "income"){
            li.className = "transaction-income";
        }
        else if(transaction.type === "expense"){
            li.className = "transaction-expense";
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.dataset.index = index;
        deleteButton.addEventListener("click", () => {
            transactions.splice(index, 1);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            displayTransactions();
        });
        li.appendChild(deleteButton);
    });

    incomeAmount.textContent = `$${calculatorIncome()}`;
    expenseAmount.textContent = `$${calculatorExpense()}`;
}

function calculatorIncome(){
    let startingB = Number(startingBalanceInput.value);
    const filteredIncomes = transactions.filter(transaction => transaction.type === "income");
    const total = filteredIncomes.reduce((total , transaction) => total + Number(transaction.amount) , 0);
    return total + startingB;
}

function calculatorExpense(){
    let total = 0 ;
    const filteredExpenses = transactions.filter(transaction => transaction.type === "expense");
    total = filteredExpenses.reduce((total , transaction) => total + Number(transaction.amount) , 0);
    return total;
}

function createMonthCard(month){
    const monthCard = document.createElement("div");
    const whiteBox = document.createElement("div");
    monthCard.id = `${month}-card`;
    monthCard.className = "transaction-lists"
    whiteBox.className = "transaction-list";
    const h3 = document.createElement("h3");
    h3.textContent = month;
    whiteBox.appendChild(h3);
    const ul = document.createElement("ul");
    whiteBox.appendChild(ul);
    monthCard.appendChild(whiteBox);
    document.querySelector(".container").appendChild(monthCard);
}

async function loadSavedCurrency(){
    if(localStorage.getItem("currency") != null){
        const savedCurrency = localStorage.getItem("currency");
        const fetchedCurrency = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await fetchedCurrency.json();
        const exchangeRate = data.rates[savedCurrency];
        displayTransactions(exchangeRate);
        incomeAmount.textContent = `${(calculatorIncome() * exchangeRate).toFixed(2)} ${savedCurrency}`;
        expenseAmount.textContent = `${(calculatorExpense() * exchangeRate).toFixed(2)} ${savedCurrency}`;
    }
}

if(localStorage.getItem("transactions") != null){
    transactions = JSON.parse(localStorage.getItem("transactions"));
    displayTransactions();
}
loadSavedCurrency();

changeCurrencyButton.addEventListener("click", async(e) => {
    const selectedCurrency = currencySelector.value;
    const currency = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await currency.json();
    const exchangeRate = data.rates[selectedCurrency];
    const convertedIncome = calculatorIncome() * exchangeRate;
    const convertedExpense = calculatorExpense() * exchangeRate;
    displayTransactions(exchangeRate);
    incomeAmount.textContent = `${convertedIncome.toFixed(2)} ${selectedCurrency}`;
    expenseAmount.textContent = `${convertedExpense.toFixed(2)} ${selectedCurrency}`;
    localStorage.setItem("currency", selectedCurrency);
});

addEventListener("mouseup", (e) => {
    isDown = false;
});

addEventListener("mousemove", (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.clientX - startX;
    window.scrollTo(scrollLeft - x, 0);
});

const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
modal.style.display = "flex";
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

addStartingBalanceButton.addEventListener("click", () => {
    let startingBalance = {
        startingBalanceNumber : startingBalanceInput.value
    };
    const p = document.createElement("p");
    startingBalanceAmount.textContent = `Your starting balance : $${startingBalance.startingBalanceNumber}`;

    startingBalanceInput.style.display = "none";
    addStartingBalanceButton.style.display = "none";
});

transactionButton.addEventListener("click", () => {
    if(transactionDescription.value === "" || transactionAmount.value === "" || transactionDate.value === ""){
        alert("Please fill in all fields!");
        return;
    }
    let newTransaction = {
        description: transactionDescription.value,
        amount: transactionAmount.value,
        date: transactionDate.value,
        type: transactionType.value
    };
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    displayTransactions();
    transactionDescription.value = "";
    transactionAmount.value = "";
    transactionDate.value = "";
});

