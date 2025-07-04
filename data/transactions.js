const transactions = [];

function addTransaction(txn) {
  transactions.push(txn);
}

function getTransactions() {
  return transactions;
}

function clearTransactions() {
  transactions.length = 0;
}

module.exports = { addTransaction, getTransactions, clearTransactions };
