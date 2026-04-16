const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDispaly]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMessage]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`"\'\\';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// handle slider to set the password length

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    // will come again
}

// fucntion to change the colour of the indicator 

function setIndicator(color) {
    indicator.style.background = color;
    // shadow
}

// random number generator 

function getRanIntger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
    return getRanIntger(0, 9).toString();
}
function generateLowerCase() {
    return String.fromCharCode(getRanIntger(97, 123));
}
function generateUppercase() {
    return String.fromCharCode(getRanIntger(65, 91));
}
function generateSymbols() {
    const randomNUm = getRanIntger(0, symbols.length);
    return symbols.charAt(randomNUm);
}

// calculate the strength of the password 

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumbers = false;
    let hasSymbols = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumbers = true;
    if (symbolsCheck.checked) hasSymbols = true;

    if (hasUpper && hasLower && hasNumbers && hasSymbols && passwordLength >= 12) {
        setIndicator("#0f0");
    } else if ((hasUpper || hasLower) && (hasNumbers || hasSymbols) && passwordLength >= 8) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// copy-content function

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // to make the copy wala span visble

    copyMsg.classList.add("active");
    setTimeout(() => { copyMsg.classList.remove("active"); }
        , 2000)
}

// fucntion tos shuffle the password

function shufflePassword(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let str = "";
    arr.forEach(function (el) {
        str += el;
    });
    return str;
}
// will need to track fo checkbox ticked or unticked 

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach(
        function (checkbox) {
            if (checkbox.checked) {
                checkCount++;
            }
        }
    )

    // special case

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(function (checkbox) {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// slider eventlistner

inputSlider.addEventListener('input', function (e) {
    passwordLength = +e.target.value;
    handleSlider();
})

// copy eventlistner

copyBtn.addEventListener('click', function () {
    if (passwordDisplay.value) {
        copyContent();
    }
})

// event listner for the generate password 

generateBtn.addEventListener('click', function () {
    // if none of checkbox are selected 
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // lets find the new password 

    // remove old password
    password = "";
    // lets put the stuff mentioned by the checkbox

    // if(uppercaseCheck.checked)
    // {
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked)
    // {
    //     password+=generateRandomNumber();
    // }

    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUppercase);
    }

    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbols);
    }

    // compulsary  addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRanIntger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password

    password = shufflePassword(Array.from(password));
    // show in UI
    passwordDisplay.value = password;

    // calculating the strength of password 

    calcStrength();


});



