const display = document.getElementById("display-inner");
const display2nd = document.getElementById("display-inner-2ndLine");
const displayMode = document.getElementById("display-mode");
const displayExternal = document.getElementById("display-external");
const buttons = [...document.getElementsByTagName("button")];


const numberButtons = [];
const controlButtons = [];
const historyItems = [];
const maximumValue = 999_999_999_999_999;

let finalNumber = null;
let currentNumber = null;
let lastChar = "";
let hasDot = false;

let isShifted = false;
let addingToRegister = false;
let retrievingFromRegister = false;


const numberConcat = (button, num) => {
  if (isShifted === true) {
    if (addingToRegister === true) {
      addingToRegister = false;
      if (finalNumber === null && currentNumber !== null) {
        button.value = currentNumber;
      } else if (finalNumber !== null && currentNumber === null) {
        button.value = finalNumber;
      }
      updateDisplays();
      return;
    }

    if (retrievingFromRegister === true) {
      retrievingFromRegister = false;
      if (button.value) {
        currentNumber = button.value;
      }
      updateDisplays();
      return;
    }
  }

  if (currentNumber < maximumValue) {
    if (hasDot === true) {
      currentNumber = Number(currentNumber + "." + num);
      hasDot = false;
    } else {
      if (currentNumber === null)
        currentNumber = 0;
      currentNumber = Number("" + Number(currentNumber) + Number(num));
    }
    updateDisplays();
  } else {
    currentNumber = maximumValue;
  }
};


const calculate = (button, simbol) => {
  switch (simbol) {
    case "C":
      currentNumber = null;
      finalNumber = null;
      lastChar = "";
      break;

    case "CE":
      currentNumber = null;
      break;

    case "square":
      if (isShifted) {
        if (currentNumber !== null) {
          currentNumber = Math.sqrt(currentNumber);
        } else if (finalNumber !== null) {
          finalNumber = Math.sqrt(finalNumber);
        }
        break;
      }

      if (currentNumber !== null) {
        currentNumber *= currentNumber;
      } else if (finalNumber !== null) {
        finalNumber *= finalNumber;
      }
      break;

    case "+":
      if (isShifted) {
        let factor = 0;
        if (currentNumber !== null) {
          factor = Math.round(currentNumber);
        } else if (finalNumber !== null) {
          factor = Math.round(finalNumber);
        }

        finalNumber = 1;

        while (factor >= 1 && finalNumber < maximumValue) {
          finalNumber *= factor;
          factor--;
        }

        currentNumber = null;
        lastChar = "";
        break;
      }

      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(button, lastChar);
        return;
      }

      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else {
        finalNumber += currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    case "-":
      if (isShifted) {
        if (currentNumber === null && finalNumber !== null) {
          finalNumber = Math.log10(finalNumber);
          currentNumber = null;
        } else if (currentNumber !== null && finalNumber === null) {
          currentNumber = Math.log10(currentNumber);
        } else if (currentNumber !== null && finalNumber !== null) {
          finalNumber = Math.log10(finalNumber) / Math.log10(currentNumber);
          currentNumber = null;
        }

        lastChar = ""
        break;
      }

      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(button, lastChar);
        return;
      }

      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else {
        finalNumber -= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    case "*":
      if (isShifted) {
        if (currentNumber === null && finalNumber !== null) {
          finalNumber = Math.pow(finalNumber, 0);
          currentNumber = null;
        } else if (currentNumber !== null && finalNumber === null) {
          currentNumber = Math.pow(currentNumber, 0);
        } else if (currentNumber !== null && finalNumber !== null) {
          finalNumber = Math.pow(finalNumber, currentNumber);
          currentNumber = null;
        }
        lastChar = "";
        break;
      }

      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(button, lastChar);
        return;
      }

      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else {
        finalNumber *= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    case "/":
      if (isShifted) {
        if (currentNumber === null && finalNumber !== null) {
          finalNumber = Math.pow(finalNumber, 1 / 3);
          currentNumber = null;
        } else if (currentNumber !== null && finalNumber === null) {
          currentNumber = Math.pow(currentNumber, 1 / 3);
        } else if (currentNumber !== null && finalNumber !== null) {
          finalNumber = Math.pow(finalNumber, 1 / currentNumber);
          currentNumber = null;
        }
        lastChar = "";
        break;
      }

      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(button, lastChar);
      }

      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else if (finalNumber !== 0 && currentNumber !== null) {
        finalNumber /= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    case "%":
      if (isShifted) {
        currentNumber = Math.PI;
        break;
      }

      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(button, lastChar);
        return;
      }

      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else if (finalNumber !== 0 && currentNumber !== null) {
        finalNumber %= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    case "inv":
      if (isShifted) {
        retrievingFromRegister = !retrievingFromRegister;
        addingToRegister = false;
        break;
      }

      if (currentNumber !== null) {
        currentNumber *= -1;
      } else if (finalNumber !== null) {
        finalNumber *= -1;
      }

      break;

    case "E":
      if (lastChar === "") {
        finalNumber = currentNumber;
        currentNumber = null;
        break;
      }

      calculate(button, lastChar);
      lastChar = "";

      addtoHistory(finalNumber);
      
      break;

    case "S":
      switchShift();
      break;

    case ".":
      if (isShifted) {
        addingToRegister = !addingToRegister;
        retrievingFromRegister = false;
        break;
      }

      if (hasDot === false && String(currentNumber).includes(".")) {
        break;
      }

      if (hasDot === false && currentNumber != null) {
        display2nd.innerHTML += ".";
        hasDot = true;
      }
      break;
  }

  if (hasDot === false) {
    updateDisplays();
  }
};

const addtoHistory = (number) => {
  let retrieveButton = document.createElement("button");
  retrieveButton.innerHTML = number;
  retrieveButton.addEventListener("click", () => {
    returnFromHistory(number);
  });
  displayExternal.appendChild(retrieveButton);
};

const returnFromHistory = (number) => {
  currentNumber = Number(number);
  updateDisplays();
}


const addShortcuts = () => {
  window.addEventListener("keydown", (event) => {
    let key = event.key;
    let button = controlButtons.find((button) => {
      if (key == "Control") key = "%";
      if (key == "Delete") key = "C";
      if (key == "Enter") key = "E";
      if (key == "Backspace") key = "CE";
      if (key == "Shift") key = "S";
      return button.id === String(key);
    });

    if (button) {
      calculate(button, key);
      button.focus();
      return;
    }

    if (!button) {
      button = numberButtons.find((button) => {
        return button.id === String(key);
      });
    }

    if (button) {
      numberConcat(button, key);
      button.focus();

      if (hasDot === false) {
        updateDisplays();
      }
    }
  });
};


const updateDisplays = () => {
  if (finalNumber === null) {
    display.innerHTML = "0 " + lastChar;
  } else {
    display.innerHTML = finalNumber + " " + lastChar;
  }

  if (currentNumber === null) {
    display2nd.innerHTML = "";
  } else {
    display2nd.innerHTML = currentNumber;
  }



  if (isShifted === false) {
    displayMode.innerHTML = "BASIC";
  } else if (isShifted === true) {
    if (addingToRegister === true) {
      displayMode.innerHTML = "X TO MEMORY";
      return;
    } else if (retrievingFromRegister === true) {
      displayMode.innerHTML = "MEMORY TO X";
      return;
    }
    displayMode.innerHTML = "SHIFTED";
  }
};

const switchShift = () => {
  isShifted = !isShifted;
  buttons.forEach((button) => {
    if (isShifted === true) {
      button.classList.add("sft");
      display.classList.add("sft");
      display2nd.classList.add("sft");
      displayMode.classList.add("sft");
    } else {
      button.classList.remove("sft");
      display.classList.remove("sft");
      display2nd.classList.remove("sft");
      displayMode.classList.remove("sft");
    }
  });

  updateDisplays();
}


buttons.forEach((button) => {
  if (button.classList.contains("number")) {
    numberButtons.push(button);
  }

  if (button.classList.contains("control")) {
    controlButtons.push(button);
  }
});

numberButtons.forEach((numBtn) => {
  numBtn.addEventListener("click", () => {
    numberConcat(numBtn, Number(numBtn.id));
  })
});

controlButtons.forEach((ctrlBtn) => {
  ctrlBtn.addEventListener("click", () => {
    calculate(ctrlBtn, ctrlBtn.id);
  });
});

updateDisplays();
addShortcuts();