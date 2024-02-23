
// Setting Game Name
let gameName = "Guess The Word"
document.querySelector("h1").innerHTML = gameName
document.querySelector("footer").innerHTML = `${gameName} Game Created By Mina`


// Manage Words
let wordToGuess = ""
let word = ["Create","Update","Delete","Master","Branch","Mainly","School","Basket","Laptop","Banana"]
wordToGuess = word[Math.floor(Math.random() * word.length)].toUpperCase()
console.log(wordToGuess)


// Setting Game Options
let numberOfTries = 5
let numberOfLetters = 6
let currentTry = 1
let hintsNumber = 2


// Manage Hints
let hints = document.querySelector(".hint")
document.querySelector(".hint span").innerHTML = hintsNumber
hints.addEventListener("click", getHint)


function generateInput() {
    const inputContainer = document.querySelector(".inputs")
    // Create Main Try Div
    for(let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div")
        tryDiv.classList.add(`try-${i}`)
        tryDiv.classList.add(`try-box`)
        tryDiv.innerHTML = `<span>Try ${i}</span>`

        if(i !== 1) tryDiv.classList.add("disabled-inputs")

        // Create Inputs
        for(let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input")
            input.type = "text"
            input.setAttribute("style", "text-transform: uppercase")
            input.id = `guess-${i}-letter-${j}`
            input.setAttribute("maxlength","1")
            tryDiv.appendChild(input)
        }
        inputContainer.appendChild(tryDiv)
    }
    // Focus on first input field
    inputContainer.children[0].children[1].focus()

    // Disable All Inputs Except First One
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input")
    inputsInDisabledDiv.forEach((input) => (input.disabled = true))

    const inputs = document.querySelectorAll("input")
    inputs.forEach((input,index) => {
        input.addEventListener("input", function() {
            const nextInput = inputs[index + 1]
            if(nextInput) nextInput.focus()
        })
        // Make The Keyboard clickable
        input.addEventListener("keydown", function(event) {
            const currentIndex = Array.from(inputs).indexOf(event.target)
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1
                if (nextInput < inputs.length) inputs[nextInput].focus()
            }
            if (event.key === "ArrowLeft") {
                const preInput = currentIndex - 1
                if (preInput >= 0) inputs[preInput].focus()
            }
        })
    })
}

// Check Button
let check = document.querySelector(".check")
check.addEventListener("click", handelGuesses)
function handelGuesses() {
    let successGuess = true
    // Check Letters
    for(let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
        const letter = inputField.value.toUpperCase()
        if (letter === wordToGuess[i - 1]) {
            inputField.classList.add("yes-in-place")
        } else if(wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place")
            successGuess = false
        } else if(letter === ""){
            inputField.style.backgroundColor = "gray"
            successGuess = false
        } else {
            inputField.classList.add("no")
            successGuess = false
        }
    }

    // Check if User Win Of Lose
    if (successGuess === true) {
        // Add Disabled Class On All Try Divs
        let allTries = document.querySelectorAll(".inputs > div")
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"))
        // Disable All Buttons
        check.innerHTML = "Play Again !"
        check.style.backgroundColor = "#f89e13"
        check.addEventListener("click", function() {
            window.location.reload()
        })
        hints.style.display = "none"
        // Success Message
        successMessage = document.querySelector(".message")
        successMessage.style.backgroundColor = "#f89e13"
        successMessage.innerHTML = "You Are A Winner"
    } else {
        
        if (numberOfTries !== currentTry) {
            // Disable the current field and Go to the next
            document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs")
            document.querySelector(`.try-${currentTry + 1}`).classList.remove("disabled-inputs")
            let currentInput = document.querySelectorAll(`.try-${currentTry} input`)
            let nextInputField = document.querySelectorAll(`.try-${currentTry + 1} input`)
            currentInput.forEach((input) => (input.disabled = true))
            nextInputField.forEach((input) => (input.disabled = false))
            currentTry++
            document.querySelector(`.try-${currentTry}`).children[1].focus()
        } else {
            console.log(currentTry)
            // Add Disabled Class On All Try Divs
            let allTries = document.querySelectorAll(".inputs > div")
            allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"))
            // Disable All Buttons
            check.innerHTML = "Replay"
            check.addEventListener("click", function() {
                window.location.reload()
            })
            hints.style.display = "none"
            // Lose Message
            loseMessage = document.querySelector(".message")
            loseMessage.style.backgroundColor = "#f44336"
            loseMessage.innerHTML = `You Failed, The Word Is: ${wordToGuess.toUpperCase()}`
        }
    }
}

function getHint() {
    if (hintsNumber > 0) {
        hintsNumber--
        document.querySelector(`.hint span`).innerHTML = hintsNumber
    }
    if (hintsNumber === 0) {
        hints.classList.add(`btn-disabled`)
    }
    const enabledInputs = document.querySelectorAll(`input:not([disabled])`)
    console.log(enabledInputs)
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "")

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length)
        const randomInput = emptyEnabledInputs[randomIndex]
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput)
        console.log(randomInput)
        console.log(indexToFill)
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill]
        }
    }
}
// Backspace button
function handelBackspace(event) {
    if(event.key === "Backspace") {
        const inputs = document.querySelectorAll(`input:not([disabled])`)
        currentIndex = Array.from(inputs).indexOf(event.target)
        console.log(currentIndex)
        const preInput = currentIndex - 1
        if (preInput >= 0) {
            inputs[preInput].focus()
            inputs[currentIndex].value = ""
            inputs[preInput].value = ""
        }
    }
}

document.addEventListener("keydown", handelBackspace)

window.onload = function() {
    generateInput()
}