const wordsRegex = /^[a-zA-Z\s]+$/

const ul = document.getElementById("toppings-list")

function addTopping() {
	const value = toppingsInput.value

	if (!wordsRegex.test(value)) {
		toppingsInput.setCustomValidity('Topping name can only contain words.')
		toppingsInput.reportValidity()
		return
	}

	const button = document.createElement("button")
	button.type = "button"
	button.innerText = "❌"
	button.onclick = removeTopping
	button.className = "remove-button"

	const li = document.createElement("li")
	li.className = "toppings-li"

	li.appendChild(document.createTextNode(value))
	li.appendChild(button)
	ul.appendChild(li)
	toppingsInput.value = ""
}

function removeTopping() {
	this.parentNode.remove()
}

const toppingsInput = document.getElementById("toppings-input")
toppingsInput.addEventListener('input', makeInputValid)

const nameInput = document.getElementById("name-input")
nameInput.addEventListener('input', makeInputValid)

function makeInputValid(e) {
	e.target.setCustomValidity('')
	e.target.checkValidity()
}

const sessionStorage = window.sessionStorage;

const form = document.forms["create-pizza-form"]
const toppingsLis = document.getElementsByClassName("toppings-li")

function submitForm(e) {
	if (!validateForm(e)) return

	if (sessionStorage.getItem(nameInput.value)) {
		nameInput.setCustomValidity('There already is a pizza with this name. Pizza name has to be unique.')
		nameInput.reportValidity()
		e.preventDefault
		return
	}

	const toppingsArray = []
	for (var i = 0; i < toppingsNum; i++) {
		toppingsArray.push(toppingsLis[i].childNodes[0].textContent)
	}

	const toppings = "toppings:" + toppingsArray.join(".")

	const formData = new FormData(form)

	const formattedFormData = []

	for (var pair of formData.entries()) {
		formattedPair = pair[0] + ':' + pair[1]
		formattedFormData.push(formattedPair)
	}

	formattedFormData.push(toppings)

	const name = formData.get("name")
	sessionStorage.setItem(name, formattedFormData);
	form.reset()
	document.documentElement.scrollTop = 0;
	alert('Pizza "' + name + '" added successfully.')
}

function clearForm() {
	ul.innerHTML = ""
}

function validateForm(e) {
	e.preventDefault()

	if (!wordsRegex.test(nameInput.value)) {
		nameInput.setCustomValidity('Pizza name can only contain words.')
		nameInput.reportValidity()
		e.preventDefault()
		return
	}

	toppingsNum = toppingsLis.length

	if (toppingsNum < 2) {
		toppingsInput.setCustomValidity('Add at least 2 toppings.')
		toppingsInput.reportValidity()
		e.preventDefault()
		return false
	}

	return true
}