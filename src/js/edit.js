import buyedStocks from "./buyedStocks.min.js"

const addPurchaseBtn = document.querySelector(".edit__btns-btn")
const addPurchaseBox = document.querySelector(".edit__buy")
const symbol = document.querySelector(".edit__buy-symbol")
const price = document.querySelector(".edit__buy-price")
const quantity = document.querySelector(".edit__buy-quantity")
const currency = document.querySelector(".edit__buy-currency")
const confirmBtn = document.querySelector(".edit__buy-confirm")
const errorBox = document.querySelector(".error")
const errorBoxText = document.querySelector(".error-text")
const errorBoxBtn = document.querySelector(".error-btn")

const addSaleBox = document.querySelector(".edit__sale")
const addSaleBtn = document.querySelector(".edit__btns-btn2")
const selectStock = document.querySelector(".edit__sale-stocks")
const sellingPrice = document.querySelector(".edit__sale-price")
const confirmBtn2 = document.querySelector(".edit__sale-confirm")

const stock = JSON.parse(localStorage.getItem("buyedStocks")) || buyedStocks

const message = document.querySelector(".message")

function addToggle() {
	addPurchaseBox.classList.toggle("edit__buy--active")
	addSaleBox.classList.remove("edit__sale--active")
}
function addToggle2() {
	addSaleBox.classList.toggle("edit__sale--active")
	addPurchaseBox.classList.remove("edit__buy--active")
}

function checkSymbol() {
	const typedSymbol = symbol.value

	const options = {
		method: "GET",
		url: "https://yfapi.net/v11/finance/quoteSummary/AAPL",
		params: { modules: "defaultKeyStatistics,assetProfile" },
		headers: {
			"x-api-key": "iaBdYXYIhL97Olk4auG8C4rfZTaOgzsa9J1g4pab",
		},
	}

	fetch(`https://yfapi.net/v7/finance/options/${typedSymbol}`, options)
		.then(response => response.json())
		.then(response => {
			if (response.optionChain.result[0] == undefined) {
				errorBox.classList.add("error--active")
				errorBoxText.innerHTML = `Please enter a <b>valid symbol!</b>`
			} else {
				addPurchase(
					response.optionChain.result[0].quote.shortName,
					response.optionChain.result[0].quote.fullExchangeName
				)
				clearInputs()
				message.classList.add("message--active")
				setTimeout(() => window.location.reload(true), 2000)
			}
		})
		.catch(err => console.error(err))
}

function checkInputs() {
	if (
		symbol.value == "" ||
		price.value == "" ||
		quantity.value == "" ||
		currency.value == "-"
	) {
		errorBox.classList.add("error--active")
		errorBoxText.textContent = "Fill in all fields!"
	} else {
		checkSymbol()
	}
}

function clearInputs() {
	addToggle()
	symbol.value = ""
	price.value = ""
	quantity.value = ""
	currency.value = "-"
}

function addPurchase(stockName, exchangeName) {
	const newStock = {
		symbol: symbol.value,
		purchasePrice: price.value,
		quantity: quantity.value,
		currency: currency.value,
		status: "open",
		salesValue: "",
		stockName: stockName,
		exchangeName: exchangeName,
	}
	stock.push(newStock)
	localStorage.setItem("buyedStocks", JSON.stringify(buyedStocks))
}

function displayStocks() {
	stock.forEach(el => {
		if (el.status == "open") {
			const newOption = document.createElement("option")
			selectStock.appendChild(newOption)
			newOption.setAttribute("value", el.symbol)
			newOption.innerHTML = `
			${el.symbol.toUpperCase()}, quantity: ${el.quantity}
			`
		} else {
			return
		}
	})
}

displayStocks()

const selectValue = () => {
	const selectedValue = selectStock.options[selectStock.selectedIndex].value
	console.log(selectedValue)
	return selectedValue
}

function addSales() {
	if (sellingPrice.value == "" || selectStock.value == "-") {
		errorBox.classList.add("error--active")
		errorBoxText.textContent = "Fill in all fields!"
	} else {
		const selectedStock = selectValue()
		console.log(selectedStock)
		stock.forEach(el => {
			if (el.symbol == selectedStock) {
				el.status = "close"
				el.salesValue = (el.quantity * sellingPrice.value).toFixed(2)
				message.classList.add("message--active")
				console.log(buyedStocks)
				// setTimeout(() => window.location.reload(true), 2000)
			}
		})
		localStorage.setItem("buyedStocks", JSON.stringify(stock))
	}
}

confirmBtn.addEventListener("click", checkInputs)
confirmBtn2.addEventListener("click", addSales)

addPurchaseBtn.addEventListener("click", addToggle)

addSaleBtn.addEventListener("click", addToggle2)

errorBoxBtn.addEventListener("click", () => {
	errorBox.classList.remove("error--active")
	errorBoxText.textContent = ""
})

selectStock.addEventListener("change", selectValue)
