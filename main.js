import binking from "binking";
import IMask from 'imask';

//logo
function initBinking () {
  binking.setDefaultOptions({
    strategy: 'api',
    apiKey: 'cbc67c2bdcead308498918a694bb8d77' // Replace it with your API key
  })
}

function cardNumberChangeHandler () {
  binking($cardNumberField.value, function (result) {
    // …
    if (result.formBankLogoBigSvg) {
      $bankLogo.src = result.formBankLogoBigSvg
      $bankLogo.classList.remove('binking__hide')
    } else {
      $bankLogo.classList.add('binking__hide')
    }
    // …
  })
}
//цвета
function cardNumberChangeHandler () {
  binking($cardNumberField.value, function (result) {
    // …
    $frontPanel.style.background = result.formBackgroundColor
    $frontPanel.style.color = result.formTextColor
    // …
  })
}
//лого системы
function cardNumberChangeHandler () {
  binking($cardNumberField.value, function (result) {
    // …
    if (result.formBrandLogoSvg) {
      $brandLogo.src = result.formBrandLogoSvg
      $brandLogo.classList.remove('binking__hide')
    } else {
      $brandLogo.classList.add('binking__hide')
    }
    // …
  })
}

// автофокус
var $cardNumberField = document.querySelector('.binking__number-field')
$cardNumberField.focus()

//валидатор
function validate () {
  var validationResult = binking.validate($cardNumberField.value, $monthField.value, $yearField.value, $codeField.value)
  if (validationResult.errors.cardNumber && cardNumberTouched) {
    cardNumberTip.setContent(validationResult.errors.cardNumber.message)
    cardNumberTip.show()
  } else {
    cardNumberTip.hide()
  }
  var monthHasError = validationResult.errors.month && monthTouched
  if (monthHasError) {
    monthTip.setContent(validationResult.errors.month.message)
    monthTip.show()
  } else {
    monthTip.hide()
  }
  if (!monthHasError && validationResult.errors.year && yearTouched) {
    yearTip.setContent(validationResult.errors.year.message)
    yearTip.show()
  } else {
    yearTip.hide()
  }
  if (validationResult.errors.code && codeTouched) {
    codeTip.setContent(validationResult.errors.code.message)
    codeTip.show()
  } else {
    codeTip.hide()
  }
  return validationResult
}
//маски
// Считываем поле ввода
let cardNumberInput = document.querySelector(".card-number");
let cardMonthInput = document.querySelector(".card-month");
let cardYearInput = document.querySelector(".card-year");
let cardSecretCodeInput = document.querySelector(".card-secret-code");
// Считываем кнопку
let btn = document.querySelector(".btn");

const cardNumberMask = new IMask(cardNumberMask, {
  mask: "0000 0000 0000 0000",
});
const cardMonthMask = new IMask(cardMonthMask, {
  mask: IMask.MaskedRange,
  from: 1,
  to: 12,
  maxLength: 2,
  autofix: true
});
const cardYearMask = new IMask(cardYearMask, {
  mask: '00',
});
const cardSecretCodeMask = new IMask(cardSecretCodeMask, {
  mask: '000',
});

cardNumberInput.addEventListener("input", cardNumberInputHandler);
function cardNumberInputHandler() {
  if (cardNumberMask.masked.isComplete) {
    btn.classList.add("btn--active");
  } else {
    btn.classList.remove("btn--active");
  }
}
cardMonthInput.addEventListener("input", cardMonthInputHandler);
function cardMonthInputHandler() {
  if (cardMonthMask.masked.isComplete) {
    btn.classList.add("btn--active");
  } else {
    btn.classList.remove("btn--active");
  }
}
cardYearInput.addEventListener("input", cardYearInputHandler);
function cardYearInputHandler() {
  if (cardYearMask.masked.isComplete) {
    btn.classList.add("btn--active");
  } else {
    btn.classList.remove("btn--active");
  }
}
cardSecretCodeInput.addEventListener("input", cardSecretCodeInputHandler);
function cardSecretCodeInputHandler() {
  if (cardSecretCodeMask.masked.isComplete) {
    btn.classList.add("btn--active");
  } else {
    btn.classList.remove("btn--active");
  }
}
