// Variables to track transactions and filter type
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let filterType = 'all';

// Load initial transactions and calculate balance
document.addEventListener('DOMContentLoaded', () => {
  displayTransactions();
  calculateTotals();
});

// Function to calculate and display total income, expenses, and balance
function calculateTotals() {
  const income = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const balance = income - expenses;

  document.getElementById('total-income').innerText = `₹${income}`;
  document.getElementById('total-expenses').innerText = `₹${expenses}`;
  document.getElementById('balance').innerText = `₹${balance}`;
}

// Function to display transactions based on filter
function displayTransactions() {
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = '';

  transactions
    .filter(transaction => {
      if (filterType === 'income') return transaction.amount > 0;
      if (filterType === 'expense') return transaction.amount < 0;
      return true;
    })
    .forEach((transaction, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${transaction.description} - ₹${transaction.amount}</span>
        <div class="actions">
          <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
          <button onclick="deleteTransaction(${index})">Delete</button>
        </div>`;
      transactionList.appendChild(li);
    });
}

// Function to add a new transaction
document.getElementById('add-btn').addEventListener('click', () => {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (description && amount) {
    transactions.push({ description, amount });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions();
    calculateTotals();
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
  } else {
    alert('Please enter valid description and amount.');
  }
});

// Function to edit a transaction
function editTransaction(index) {
  const transaction = transactions[index];
  const newDescription = prompt('Edit Description:', transaction.description);
  const newAmount = parseFloat(prompt('Edit Amount:', transaction.amount));

  if (newDescription && newAmount) {
    transactions[index] = { description: newDescription, amount: newAmount };
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions();
    calculateTotals();
  } else {
    alert('Invalid input');
  }
}

// Function to delete a transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  displayTransactions();
  calculateTotals();
}

// Function to filter transactions
document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    filterType = e.target.value;
    displayTransactions();
  });
});
