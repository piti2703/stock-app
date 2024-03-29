import buyedStocks from "./buyedStocks.min.js"
import getData from "./apiRequest.min.js"

const stocks = JSON.parse(localStorage.getItem("buyedStocks")) || buyedStocks
const wallet = document.querySelector(".wallet__stocks")

function displayWallet() {
	stocks.forEach(el => {
		if (el.status !== "open") {
			return
		}

		const newWalletItem = document.createElement("div")
		newWalletItem.classList.add("wallet__grid")
		newWalletItem.classList.add("wallet__grid--stock")
		newWalletItem.setAttribute("data-symbol", el.symbol)
		wallet.appendChild(newWalletItem)

		newWalletItem.innerHTML = `
		<p class="wallet__grid-text product">${el.stockName}</p>
		<p class="wallet__grid-text quantity">${el.quantity}</p>
		<p class="wallet__grid-text purchase-price">${el.purchasePrice}</p>
		<p class="wallet__grid-text current-price">0</p>
		<p class="wallet__grid-text earning-lose">0</p>
		<p class="wallet__grid-text earning-lose-percentage">0</p>
		<p class="wallet__grid-text value">0</p>
		`
	})
	displayValues()
}

function displayValues() {
	const allWalletBox = document.querySelectorAll(".wallet__grid--stock")

	allWalletBox.forEach(async el => {
		const symbol = el.dataset.symbol
		const data = await getData(symbol)
		const dataResult = data.optionChain.result[0].quote

		let objLocalStorage = stocks.find(el => el.symbol == symbol)
		const currentValue = (
			dataResult.regularMarketPrice * objLocalStorage.quantity
		).toFixed(2)
		let purchaseValue = objLocalStorage.purchasePrice * objLocalStorage.quantity
		let change = (currentValue - purchaseValue).toFixed(2)
		let changePercentage = (
			((currentValue - purchaseValue) / purchaseValue) *
			100
		).toFixed(2)
		let color

		if (change > 0) {
			color = "plus-color"
			change = `+${change}`
		} else if (change == 0) {
			color = "stagnation-color"
			change = `${change}`
		} else {
			color = "minus-color"
			change = `${change}`
		}

		if (changePercentage > 0) {
			color = "plus-color"
			changePercentage = `+${changePercentage}`
		} else if (change == 0) {
			color = "stagnation-color"
			changePercentage = `${changePercentage}`
		} else {
			color = "minus-color"
			changePercentage = `${changePercentage}`
		}
		const currentValueDiv = el.querySelector(".value")
		currentValueDiv.textContent = `${currentValue} ${objLocalStorage.currency.toUpperCase()}`

		const currentPrice = el.querySelector(".current-price")
		currentPrice.textContent = dataResult.regularMarketPrice

		const changeDiv = el.querySelector(".earning-lose")
		changeDiv.textContent = change
		changeDiv.classList.add(color)

		const changePercentageDiv = el.querySelector(".earning-lose-percentage")
		changePercentageDiv.textContent = `${changePercentage}%`
		changePercentageDiv.classList.add(color)
	})
}

displayWallet()
