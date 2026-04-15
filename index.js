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

let transactions = [];

function displayTransactions() {
    transactionList.innerHTML = "";
    document.querySelectorAll(".transaction-lists:not(#original-list)").forEach(card => card.remove());
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString("default", {month: "long"});
        const existingCard = document.getElementById(`${month}-card`);
        const li = document.createElement("li");
        li.textContent = `Your transaction : ${transaction.description} , ${transaction.type} $${transaction.amount} , ${transaction.date}`;
        transactionList.appendChild(li);
        if (existingCard === null) {
            createMonthCard(month);
        } else {

        }

        const monthCard = document.getElementById(`${month}-card`);
        const ul = monthCard.querySelector("ul");
        ul.appendChild(li)
    });

    incomeAmount.textContent = `$${calculatorIncome()}`;
    expenseAmount.textContent = `$${calculatorExpense()}`;
}

if(localStorage.getItem("transactions") != null){
    transactions = JSON.parse(localStorage.getItem("transactions"));
    displayTransactions()
}

console.log(transactions);

function calculatorIncome(){
    let total = Number(startingBalanceInput.value);
    transactions.forEach(transaction => {
        if(transaction.type === "income") {
            total += Number(transaction.amount);
        }
    });
    return total;
}

function calculatorExpense(){
    let total = 0 ;
    transactions.forEach(transaction => {
        if(transaction.type === "expense") {
            total += Number(transaction.amount);
        }
    });
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

