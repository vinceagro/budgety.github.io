'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = acc => {
  containerMovements.innerHTML = '';
  acc.movements.forEach((el, i, arr) => {
    const type = el > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date"></div>
    <div class="movements__value">${el}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, el) => acc + el, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el);
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = acc.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  const interests = acc.movements
    .filter(el => el > 0)
    .map(el => (el * acc.interestRate) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el, 0);
  labelSumInterest.textContent = `${interests.toFixed(2)}€`;
};

const createUsername = accs => {
  accs.forEach(el => {
    el.username = el.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
createUsername(accounts);

let currentAccount;

const updateUI = acc => {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summery
  calcDisplaySummary(acc);
};

const login = e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.trim()
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Clear imput filds
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Display UI and welcome message
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    updateUI(currentAccount);
  }
};

const transfer = e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverUser = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverUser &&
    currentAccount.balance >= amount &&
    receiverUser?.username !== currentAccount.username
  ) {
    receiverUser.movements.push(amount);
    currentAccount.movements.push(-amount);
  }

  updateUI(currentAccount);
};

const closeAccount = e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
};

const requestLoan = e => {
  e.preventDefault();
  console.log('loan accepted');
};

//EVENT LISTENERS
btnLogin.addEventListener('click', login);
btnTransfer.addEventListener('click', transfer);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', requestLoan);

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
/////////////////////////////////////////////////

//Filter returns all the items that satidfies the condition while find will
//return only the first element that satisfies the contidion. ALSO the filter
//method returns an ARRAY while find returns the element itself.
