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

addStartingBalanceButton.addEventListener("click", () => {
    let startingBalance = {
        startingBalanceNumber : startingBalanceInput.value
    };
    const p = document.createElement("p");
    startingBalanceAmount.textContent = `Your starting balance : $${startingBalance.startingBalanceNumber}`;
})

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

transactionButton.addEventListener("click", () => {
    let newTransaction = {
        description: transactionDescription.value,
        amount: transactionAmount.value,
        date: transactionDate.value,
        type: transactionType.value
    };
    transactions.push(newTransaction);
    console.log(transactions);

    if(transactionType.value === "income"){
        const li = document.createElement("li");
        li.textContent = `Your transaction : ${newTransaction.description} , ${newTransaction.type} $${newTransaction.amount} , ${newTransaction.date}`;
        transactionList.appendChild(li);
        incomeAmount.textContent = `$${calculatorIncome()}`;
    }
    else if(transactionType.value === "expense"){
        const li = document.createElement("li");
        li.textContent = `Your transaction : ${newTransaction.description} , ${newTransaction.type} $${newTransaction.amount} , ${newTransaction.date}`;
        transactionList.appendChild(li);
        expenseAmount.textContent = `$${calculatorExpense()}`;
    }

    transactionDescription.value = "";
    transactionAmount.value = "";
    transactionDate.value = "";
});
