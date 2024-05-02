import {
  el,
  setChildren,
} from 'redom';
import {
  isValid,
  isExpirationDateValid,
  isSecurityCodeValid,
} from 'creditcard.js';

// Логотипы

const logos = el('div', {
  class: 'cc-types',
}, [
  el('img', {
    class: 'cc-types__img cc-types__img--amex',
  }),
  el('img', {
    class: 'cc-types__img cc-types__img--visa',
  }),
  el('img', {
    class: 'cc-types__img cc-types__img--mastercard',
  }),
  el('img', {
    class: 'cc-types__img cc-types__img--disc',
  }),
  el('img', {
    class: 'cc-types__img cc-types__img--genric',
  }),
]);

// Создание формы

const form = el('form', [
  el('input', {
    placeholder: 'Номер карты',
    id: 'number-input',
    oninput() {
      document.getElementById('number-input').removeAttribute('style');
    },
    onblur(event) {
      if (event.target.value.trim()) {
        if (!isValid(event.target.value)) {
          document.getElementById('number-input').style.borderColor = 'red';
        } else {
          document.getElementById('number-input').removeAttribute('style');
        }
      }
    },
  }),
  el('input', {
    placeholder: 'ММ/ГГ',
    id: 'expiry-input',
    oninput() {
      document.getElementById('expiry-input').style.borderColor = '';
    },
    onblur(event) {
      const month = event.target.value.substr(0, 2);
      const year = event.target.value.substr(3, 2);
      if (event.target.value.trim()) {
        if (!isExpirationDateValid(month, year)) {
          document.getElementById('expiry-input').style.borderColor = 'red';
        } else document.getElementById('expiry-input').style.borderColor = '';
      }
    },
  }),
  el('input', {
    placeholder: 'CVC/CVV',
    id: 'cvc-input',
    maxlength: '3',
    oninput(event) {
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      document.getElementById('cvc-input').style.borderColor = '';
    },
    onblur(event) {
      if (event.target.value.trim()) {
        if (!isSecurityCodeValid(document.getElementById('number-input').value, event.target.value)) {
          document.getElementById('cvc-input').style.borderColor = 'red';
        } else document.getElementById('cvc-input').style.borderColor = '';
      }
    },
  }),
  el('input', {
    placeholder: 'E-mail',
    id: 'email',
    oninput() {
      document.getElementById('email').style.borderColor = '';
    },
    onblur(event) {
      if (event.target.value.trim()) {
        if (!(event.target.value.includes('@') && event.target.value.includes('.'))) {
          document.getElementById('email').style.borderColor = 'red';
        } else document.getElementById('email').style.borderColor = '';
      }
    },
  }),
  el('button', {
    id: 'button',
    disabled: 'true',
  }, 'Оплатить'),
]);

form.querySelectorAll('input').forEach((input) => {
  input.setAttribute('required', 'true');
  input.addEventListener('input', () => {
    document.getElementById('button').setAttribute('disabled', 'true');
  });
  input.addEventListener('blur', () => {
    let error = false;
    form.querySelectorAll('input').forEach((inputEl) => {
      if (inputEl.getAttribute('style') || !inputEl.value) error = true;
    });
    if (!error) {
      document.getElementById('button').removeAttribute('disabled');
    }
  });
});

setChildren(window.document.body, logos, form);

// Маска для полей

const ccNumberInput = document.getElementById('number-input');
const ccNumberPattern = /^\d{0,16}$/g;
const ccNumberSeparator = ' ';
let ccNumberInputOldValue;
let ccNumberInputOldCursor;

const ccExpiryInput = document.getElementById('expiry-input');
const ccExpiryPattern = /^\d{0,4}$/g;
const ccExpirySeparator = '/';
let ccExpiryInputOldValue;
let ccExpiryInputOldCursor;

const mask = (value, limit, separator) => {
  const output = [];
  for (let i = 0; i < value.length; i++) {
    if (i !== 0 && i % limit === 0) {
      output.push(separator);
    }

    output.push(value[i]);
  }

  return output.join('');
};
const unmask = (value) => value.replace(/[^\d]/g, '');
const checkSeparator = (position, interval) => Math.floor(position / (interval + 1));
const ccNumberInputKeyDownHandler = (e) => {
  const element = e.target;
  ccNumberInputOldValue = element.value;
  ccNumberInputOldCursor = element.selectionEnd;
};

const highlightCC = (ccValue) => {
  let ccCardType = '';
  const ccCardTypePatterns = {
    amex: /^3/,
    visa: /^4/,
    mastercard: /^5/,
    disc: /^6/,

    genric: /(^1|^2|^7|^8|^9|^0)/,
  };

  for (const cardType in ccCardTypePatterns) {
    if (ccCardTypePatterns[cardType].test(ccValue)) {
      ccCardType = cardType;
      break;
    }
  }

  const activeCC = document.querySelector('.cc-types__img--active');
  const newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

  if (activeCC) activeCC.classList.remove('cc-types__img--active');
  if (newActiveCC) newActiveCC.classList.add('cc-types__img--active');
};

const ccNumberInputInputHandler = (e) => {
  const element = e.target;
  let newValue = unmask(element.value);
  let newCursorPosition;

  if (newValue.match(ccNumberPattern)) {
    newValue = mask(newValue, 4, ccNumberSeparator);

    newCursorPosition = ccNumberInputOldCursor - checkSeparator(ccNumberInputOldCursor, 4)
      + checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4)
      + (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

    element.value = (newValue !== '') ? newValue : '';
  } else {
    element.value = ccNumberInputOldValue;
    newCursorPosition = ccNumberInputOldCursor;
  }

  element.setSelectionRange(newCursorPosition, newCursorPosition);

  highlightCC(element.value);
};

const ccExpiryInputKeyDownHandler = (e) => {
  const element = e.target;
  ccExpiryInputOldValue = element.value;
  ccExpiryInputOldCursor = element.selectionEnd;
};
const ccExpiryInputInputHandler = (e) => {
  const element = e.target;
  let newValue = element.value;

  newValue = unmask(newValue);
  if (newValue.match(ccExpiryPattern)) {
    newValue = mask(newValue, 2, ccExpirySeparator);
    element.value = newValue;
  } else {
    element.value = ccExpiryInputOldValue;
  }
};

ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler);
ccNumberInput.addEventListener('input', ccNumberInputInputHandler);

ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler);
ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler);
