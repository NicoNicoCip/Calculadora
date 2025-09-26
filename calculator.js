/*        
 *
 *        HOW TO USE:
 *
 * 1. Select the number. 
 * 2. Select the operation to perform.
 * 3. Select another number.
 * 4. Hit Enter, or another operation to perform something new.
 * 
 * For example, if you write 1 +, in the upper display the text
 * 1 + will appear. on typing 2 then Enter, the calculation will
 * be performed, and you will get 3. But if you want to perform 
 * more operations, lets say + 7, all you have to do is press the
 * + button, the last operation will conclude, and you can write
 * the 7 afterwards to continue.
 *
 * Extra funccionalaties.
 *
 * 1. Certain operations like "Change sign" and "increase by a 
 * power of 2 (^2)" perform the operation directly on the current
 * number, or the final numner (the one on top) if there is no
 * current.
 *
 * 2. Pressing the switch button allows you to get more functions
 * 
 *    These are:
 *        1. Square root -> squares the current or final.
 *
 *        2. Factorial -> performs a factorial operation on current
 *                        or final.
 *
 *        3. Logarithm -> performs log base 10 of current or final.
 *                        if both the current and final are filled,
 *                        the logarithm will do log base final of
 *                        current. You can press the enter button
 *                        with no operation to pass it to final
 *                        prematruely.
 *
 *        4. X to the power of N
 *                    -> performs current to the third or final to 
 *                       the third if they don't both exist allready.
 *                       if they do, it will perform final to the 
 *                       power of current.
 *
 *        5. n root of x -> performs current or final to the power
 *                          of 3 if they are not both present.
 *                          if they are, it will calculate lile
 *                          allways final root of current. Note:
 *                          it is inprecise due to divisions.
 *
 *        6. Pi -> replaces the current number with pi.
 *
 *        7. M+ and M- -> these are quick save memory options.
 *                        press the M+ then a number on the num pad
 *                        to save it, then M- and a number that has
 *                        a stored value, and it will override
 *                        current with the number in the memory.
 *
 *    Note tha the numbers allways work regardless of shifting.
 *
 *
 * 3. Keyboard shortcuts:
 * 
 *    Note that the keyboard shortcut system still has some wierd bugs
 *    that are too minor for me to fix. If you ever feel stuck, the C
 *    button resets the calculator to its default state, including any
 *    wierdness coming from this.
 *
 *    0 through 9 put number into current, note that untill you run an
 *                operation or press enter, the number is not final.
 *    
 *    + - * / do what they normally do.
 * 
 *    Home = sqare current
 *    End = modulus
 *    PageDown = negate
 *    PageUp = shift
 *
 *    Note that ins shifted mode even though the displayed value changes
 *    the key asociations dont. so + becomes n!, - becomes log, etc.
 */

/*
 *
 *        CONSTANT VARIABLES
 *
 */

// the upper display used for the finalNumber
const display = document.getElementById("display-inner");

// the lower display used for the currentNumber
const display2nd = document.getElementById("display-inner-2ndLine");

// the little display that shows the mode that sits between
// the anter and the shift. it also shows the register mode.
const displayMode = document.getElementById("display-mode");

// the external register used in the history preview.
const displayExternal = document.getElementById("display-external");

// an array of all the buttons in the html.
const buttons = [...document.getElementsByTagName("button")];

// the number buttons in the html that include on click events
const numberButtons = [];

// the control buttons in the html that include on click events 
const controlButtons = [];

// the history list. contains buttons whose name is the final
// value of the time, and clicking them restores the number into
// the currentNumber. Note, it overrides.
const historyItems = [];

// the maximum number achievable by this calculator, due to signed long number limit
// doesn't sound as cool as the intiger limit does it.
const maximumValue = 999_999_999_999_999;

/*
 *
 *        STATE VARIABLES
 *
 */

// the number at the end of a calculation.
let finalNumber = null;

// the number currently being prepared for calculation
let currentNumber = null;

// the last control char pressed.
let lastChar = "";

// does the current number have a dot?
let hasDot = false;

// is the calculator in shift mode?
let isShifted = false;

// is the calculator in add to memory/register mode?
let addingToRegister = false;

// is the calculator in get form memory/register mode?
let retrievingFromRegister = false;

/*
 *
 *        MAIN CALCULATOR FUNCTIONS
 *
 */

// this function is the callback on all number buttons.
// handles number input, dot concatenation, and memory register operations
const numberConcat = (button, num) => {
  // if it is in shift mode, it handles the add to and retrieve
  // from registers.
  if (isShifted === true) {
    // handle adding current value to memory register
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

    // handle retrieving value from memory register
    if (retrievingFromRegister === true) {
      retrievingFromRegister = false;
      if (button.value) {
        currentNumber = button.value;
      }
      updateDisplays();
      return;
    }
  }

  // regardless of shifting, concatenate the current number,
  // and display prepare it properly before the next calculation.
  if (currentNumber < maximumValue) {
    // handle decimal number concatenation
    if (hasDot === true) {
      currentNumber = Number(currentNumber + "." + num);
      hasDot = false;
    } else {
      // handle regular number concatenation
      if (currentNumber === null)
        currentNumber = 0;
      currentNumber = Number("" + Number(currentNumber) + Number(num));
    }
    updateDisplays();
  } else {
    // prevent overflow by capping at maximum value
    currentNumber = maximumValue;
  }
};

// this is basically just a huge switch statement with all the
// simbols and controls. This also takes care of the math part
// of the calculator.
const calculate = (simbol) => {
  switch (simbol) {
    // clear everything in the calculator
    case "C":
      currentNumber = null;
      finalNumber = null;
      lastChar = "";
      break;

    // clears only the current number.
    case "CE":
      currentNumber = null;
      break;

    // does the square or square root calculation
    case "square":
      // does the square root when in shifted mode
      if (isShifted) {
        if (currentNumber !== null) {
          currentNumber = Math.sqrt(currentNumber);
        } else if (finalNumber !== null) {
          finalNumber = Math.sqrt(finalNumber);
        }
        addtoHistory(finalNumber ? finalNumber : currentNumber);
        break;
      }

      // does square when not in shifted mode
      if (currentNumber !== null) {
        currentNumber *= currentNumber;
      } else if (finalNumber !== null) {
        finalNumber *= finalNumber;
      }
      addtoHistory(finalNumber ? finalNumber : currentNumber);
      break;

    // addition operation or factorial when shifted
    case "+":
      // factorial operation when in shifted mode
      if (isShifted) {
        let factor = 0;
        if (currentNumber !== null) {
          factor = Math.round(currentNumber);
        } else if (finalNumber !== null) {
          factor = Math.round(finalNumber);
        }

        finalNumber = 1;

        // calculate factorial while preventing overflow
        while (factor >= 1 && finalNumber < maximumValue) {
          finalNumber *= factor;
          factor--;
        }

        currentNumber = null;
        lastChar = "";
        addtoHistory(finalNumber ? finalNumber : currentNumber);
        break;
      }

      // handle chained operations by executing previous operation first
      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(lastChar);
        return;
      }

      // perform addition operation
      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else {
        finalNumber += currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    // subtraction operation or logarithm when shifted
    case "-":
      // logarithm operation when in shifted mode
      if (isShifted) {
        if (currentNumber === null && finalNumber !== null) {
          // log base 10 of final number
          finalNumber = Math.log10(finalNumber);
          currentNumber = null;
        } else if (currentNumber !== null && finalNumber === null) {
          // log base 10 of current number
          currentNumber = Math.log10(currentNumber);
        } else if (currentNumber !== null && finalNumber !== null) {
          // log base final of current (change of base formula)
          finalNumber = Math.log10(currentNumber) / Math.log10(finalNumber);
          currentNumber = null;
        }

        lastChar = "";
        addtoHistory(finalNumber ? finalNumber : currentNumber);
        break;
      }

      // handle chained operations by executing previous operation first
      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(lastChar);
        return;
      }

      // perform subtraction operation
      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else {
        finalNumber -= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    // multiplication operation or power when shifted
    case "*":
      // power operation when in shifted mode
      if (isShifted) {
        if (currentNumber === null && finalNumber !== null) {
          // raise final to power of 3 (cube)
          finalNumber = Math.pow(finalNumber, 3);
          currentNumber = null;
        } else if (currentNumber !== null && finalNumber === null) {
          // raise current to power of 3 (cube)
          currentNumber = Math.pow(currentNumber, 3);
        } else if (currentNumber !== null && finalNumber !== null) {
          // raise final to power of current
          finalNumber = Math.pow(finalNumber, currentNumber);
          currentNumber = null;
        }
        lastChar = "";
        addtoHistory(finalNumber ? finalNumber : currentNumber);
        break;
      }

      // handle chained operations by executing previous operation first
      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(lastChar);
        return;
      }

      // perform multiplication operation
      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else {
        finalNumber *= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    // division operation or nth root when shifted
    case "/":
      // nth root operation when in shifted mode
      if (isShifted) {
        if (currentNumber === null && finalNumber !== null) {
          // cube root of final number
          finalNumber = Math.pow(finalNumber, 1 / 3);
          currentNumber = null;
        } else if (currentNumber !== null && finalNumber === null) {
          // cube root of current number
          currentNumber = Math.pow(currentNumber, 1 / 3);
        } else if (currentNumber !== null && finalNumber !== null) {
          // final root of current number
          finalNumber = Math.pow(currentNumber, 1 / finalNumber);
          currentNumber = null;
        }
        lastChar = "";
        addtoHistory(finalNumber ? finalNumber : currentNumber);
        break;
      }

      // handle chained operations by executing previous operation first
      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(lastChar);
      }

      // perform division operation with zero division protection
      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else if (finalNumber !== 0 && currentNumber !== null) {
        finalNumber /= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    // modulus operation or pi when shifted
    case "%":
      // replace current number with pi when in shifted mode
      if (isShifted) {
        currentNumber = Math.PI;
        break;
      }

      // handle chained operations by executing previous operation first
      if (currentNumber !== null &&
        lastChar !== simbol &&
        finalNumber !== null) {
        calculate(lastChar);
        return;
      }

      // perform modulus operation with zero modulus protection
      if (finalNumber === null && lastChar === "") {
        finalNumber = currentNumber;
      } else if (finalNumber !== 0 && currentNumber !== null) {
        finalNumber %= currentNumber;
      }

      currentNumber = null;
      lastChar = simbol;
      break;

    // invert sign operation or retrieve from register when shifted
    case "inv":
      // toggle retrieve from register mode when in shifted mode
      if (isShifted) {
        retrievingFromRegister = !retrievingFromRegister;
        addingToRegister = false;
        break;
      }

      // invert the sign of current or final number
      if (currentNumber !== null) {
        currentNumber *= -1;
      } else if (finalNumber !== null) {
        finalNumber *= -1;
      }

      break;

    // enter/equals operation - finalize calculation
    case "E":
      // if no operation pending, move current to final
      if (lastChar === "") {
        finalNumber = currentNumber;
        currentNumber = null;
        break;
      }

      // execute the pending operation
      calculate(lastChar);
      lastChar = "";

      // add result to history
      addtoHistory(finalNumber ? finalNumber : currentNumber);

      break;

    // shift toggle - switches between basic and advanced modes
    case "S":
      switchShift();
      break;

    // decimal point or add to register when shifted
    case ".":
      // toggle add to register mode when in shifted mode
      if (isShifted) {
        addingToRegister = !addingToRegister;
        retrievingFromRegister = false;
        break;
      }

      // prevent multiple decimal points in the same number
      if (hasDot === false && String(currentNumber).includes(".")) {
        break;
      }

      // add decimal point to display and set flag
      if (hasDot === false && currentNumber != null) {
        display2nd.innerHTML += ".";
        hasDot = true;
      }
      break;
  }

  // update displays only if not in the middle of decimal input
  if (hasDot === false) {
    updateDisplays();
  }
};

/*
 *
 *        HISTORY MANAGEMENT FUNCTIONS
 *
 */

// adds a calculation result to the history panel
// creates clickable buttons that restore previous results
const addtoHistory = (number) => {
  // skip invalid numbers
  if (number === null || number === Infinity || number === NaN)
    return;

  // create clickable history button
  let retrieveButton = document.createElement("button");
  retrieveButton.innerHTML = number;
  retrieveButton.addEventListener("click", () => {
    returnFromHistory(number);
  });
  displayExternal.appendChild(retrieveButton);
};

// restores a number from history into current number
// allows reusing previous calculation results
const returnFromHistory = (number) => {
  currentNumber = Number(number);
  updateDisplays();
}

/*
 *
 *        KEYBOARD SHORTCUT SYSTEM
 *
 */

// sets up keyboard shortcuts for all calculator functions
// maps physical keys to calculator operations
const addShortcuts = () => {
  window.addEventListener("keydown", (event) => {
    let key = event.key;

    // map special keys to calculator operations
    let button = controlButtons.find((button) => {
      if (key == "End") key = "%";          // End key = modulus
      if (key == "Home") key = "square";    // Home key = square/square root
      if (key == "Delete") key = "C";       // Delete key = clear all
      if (key == "Enter") key = "E";        // Enter key = execute/move to final
      if (key == "Backspace") key = "CE";   // Backspace = clear current
      if (key == "PageUp") key = "S";       // Page Up = shift mode
      if (key == "PageDown") key = "inv"    // Page Down = invert sign
      return button.id === String(key);
    });

    // execute control operation if found
    if (button) {
      calculate(key);
      button.focus();
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // if not a control key, check if it's a number key
    if (!button) {
      button = numberButtons.find((button) => {
        return button.id === String(key);
      });
    }

    // execute number input if found
    if (button) {
      numberConcat(button, key);
      button.focus();
      event.preventDefault();
      event.stopPropagation();

      // update displays only if not in middle of decimal input
      if (hasDot === false) {
        updateDisplays();
      }
    }
  });
};

/*
 *
 *        DISPLAY UPDATE FUNCTIONS
 *
 */

// updates all calculator displays with current state
// handles final number, current number, and mode displays
const updateDisplays = () => {
  // update upper display with final number and operation
  if (finalNumber === null) {
    display.innerHTML = "0 " + lastChar;
  } else {
    display.innerHTML = finalNumber + " " + lastChar;
  }

  // update lower display with current number being typed
  if (currentNumber === null) {
    display2nd.innerHTML = "";
  } else {
    display2nd.innerHTML = currentNumber;
  }

  // update mode display based on current calculator state
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

// toggles between basic and shifted calculator modes
// changes visual appearance and function behavior
const switchShift = () => {
  isShifted = !isShifted;

  // apply or remove shift styling to all buttons and displays
  buttons.forEach((button) => {
    if (isShifted === true) {
      document.querySelector("html").classList.add("sft");
      button.classList.add("sft");
      display.classList.add("sft");
      display2nd.classList.add("sft");
      displayMode.classList.add("sft");
    } else {
      document.querySelector("html").classList.remove("sft");
      button.classList.remove("sft");
      display.classList.remove("sft");
      display2nd.classList.remove("sft");
      displayMode.classList.remove("sft");
    }
  });

  updateDisplays();
}

/*
 *
 *        INITIALIZATION CODE
 *
 */

// categorize all buttons into number buttons and control buttons
// based on their CSS classes
buttons.forEach((button) => {
  if (button.classList.contains("number")) {
    numberButtons.push(button);
  }

  if (button.classList.contains("control")) {
    controlButtons.push(button);
  }
});

// set up click event listeners for number buttons
// each number button calls numberConcat with its numeric value
numberButtons.forEach((numBtn) => {
  numBtn.addEventListener("click", () => {
    numberConcat(numBtn, Number(numBtn.id));
  })
});

// set up click event listeners for control buttons
controlButtons.forEach((ctrlBtn) => {
  ctrlBtn.addEventListener("click", () => {
    calculate(ctrlBtn.id);
  });
});

// initialize the calculator
updateDisplays();
addShortcuts();