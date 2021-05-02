const sessionStorage = window.sessionStorage;

const heading =
	`<div>
		<h1 class="menu-heading">Visma Pizzeria Menu</h1>
	</div>`

const emptyHeading =
	`<div>
		<h1>Sorry, we are currently out of pizzas 🙁</h1>
	</div>`

const menuArticle = document.getElementById("menu-article")

let currentPizzas = []

function loadPizzaItems() {
	let keys = Object.keys(sessionStorage)

	if (keys.length == 0) {
		menuArticle.innerHTML = emptyHeading
		return
	}

	let data = ""
	pizzasDicts = []

	for (var k of keys) {
		csvData = sessionStorage.getItem(k)
		data = csvData.split(",");

		let dict = {}
		for (var entry of data) {
			data = entry.split(":");
			dict[data[0]] = data[1]
		}
		pizzasDicts.push(dict)
	}

	currentPizzas = pizzasDicts
	sortAndDisplayPizzas()
}

function sortAndDisplayPizzas() {
	currentPizzas = sortPizzas(currentPizzas)
	menuArticle.innerHTML = heading

	for (d of currentPizzas) {
		createPizzaItem(d)
	}
}

const form = document.getElementById("radio-form")

function sortPizzas(dictsArray) {
	const sorting = form.elements["sorting"].value
	switch (sorting) {
		case "byName":
			sortedPizzas = dictsArray.sort(function (a, b) { return a["name"].localeCompare(b["name"]) })
			break

		case "byPrice":
			sortedPizzas = dictsArray.sort(function (a, b) { return a["price"] - b["price"] })
			break

		case "byHeat":
			sortedPizzas = dictsArray.sort(function (a, b) { return b["heat"] - a["heat"] })
			break

		default:
			break
	}
	return sortedPizzas
}

const pepperHtml = `<img class="pepper" src="../img/chili-pepper.svg" alt="hot-pepper"></img>`

function createPizzaItem(dict) {
	const name = dict["name"]
	const price = dict["price"]
	const heat = dict["heat"]
	const toppings = dict["toppings"]
	const photo = dict["photo"]

	const formattedToppings = toppings.replace(/\./g, ", ")

	const peppersOnPizza = pepperHtml.repeat(heat)

	let pizzaItem =
		`<div>
		<section class="pizza-item">`
		+ (photo ? (`<img src=` + photo + ` alt="pizza-photo">`) : "") +
		`<div class="pizza-div">
			<button class="pizza-delete-button" onclick="deletePizza(this)">🗑</button>
			<div class="pizza-name-div">
				<div class="name-and-pepper">
					<h1 class="pizza-name">` + name + `</h1>
					<div class="peppers-div">` + peppersOnPizza + `</div>
				</div>
				<div class="pizza-price-div">` + parseFloat(price).toFixed(2) + ` €</div>
			</div>
			<div class="pizza-info-div">
				<label for="toppings-par">Toppings:</label>
				<p class="toppings-par"> ` + formattedToppings + `</p>
			</div>
		</div>
		</section>
		<hr />
	</div>`

	menuArticle.innerHTML += pizzaItem
}

function deletePizza(button) {
	if (confirm('Are you sure you want to delete this pizza from menu?')) {
		const pizzaName = button.parentNode.childNodes[3]
			.childNodes[1].childNodes[1].textContent

		sessionStorage.removeItem(pizzaName)
		loadPizzaItems()
	}
}