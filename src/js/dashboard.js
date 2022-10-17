import buyedStocks from "./buyedStocks.min.js"
import getData from "./apiRequest.min.js"

const currencyBoxes = document.querySelectorAll(".currency__box")

const stocksBoxes = document.querySelector(".stocks__boxes")
const stocks = JSON.parse(localStorage.getItem("buyedStocks")) || buyedStocks

let valueUSD = 0
let valueEUR = 0
let valuePLN = 0

const pln = document.querySelector(".balance__currency-pln")
const eur = document.querySelector(".balance__currency-eur")
const usd = document.querySelector(".balance__currency-usd")

function calcBalance() {
	stocks.forEach(async el => {
		if (el.status == "open") {
			const symbol = el.symbol

			const data = await getData(symbol)
			const dataResult = data.optionChain.result[0].quote
			const objLocalStorage = stocks.find(el => el.symbol == symbol)
			const currentValue =
				parseFloat(objLocalStorage.quantity) *
				parseFloat(dataResult.regularMarketPrice)
			if (el.currency == "usd") {
				valueUSD += currentValue
			} else if (el.currency == "eur") {
				valueEUR += parseFloat(currentValue)
			} else {
				valuePLN += parseFloat(currentValue)
			}
			displayBalance()
		}
	})
	// setTimeout(() => displayBalance(), 2000)
}

calcBalance()

function displayBalance() {
	pln.lastElementChild.textContent = valuePLN
	eur.lastElementChild.textContent = valueEUR
	usd.lastElementChild.textContent = valueUSD
}

function setCurrencyRate() {
	currencyBoxes.forEach(async el => {
		const symbol = el.dataset.symbol
		const data = await getData(symbol)
		const dataResult = data.optionChain.result[0].quote

		let currencyChange = dataResult.regularMarketChangePercent.toFixed(2)
		let color

		if (currencyChange > 0) {
			color = "plus-color"
			currencyChange = `+${currencyChange}%`
		} else if (currencyChange == 0) {
			color = "stagnation-color"
			currencyChange = `${currencyChange}%`
		} else {
			color = "minus-color"
			currencyChange = `${currencyChange}%`
		}

		const percentage = el.querySelector(".currency__box-percentage")
		percentage.textContent = currencyChange
		percentage.classList.add(color)

		const rate = el.querySelector(".currency__box-rate")
		rate.textContent = dataResult.regularMarketPrice.toFixed(4)
	})
}

setCurrencyRate()

function displayStocks() {
	stocks.forEach(el => {
		if (el.status !== "open") {
			return
		}

		const newBox = document.createElement("div")
		newBox.classList.add("stocks__box")
		stocksBoxes.appendChild(newBox)

		newBox.innerHTML = `
		<div class="stocks__box-name" data-symbol='${el.symbol}'>
		<p>${el.stockName}</p>
		<span>${el.exchangeName.toUpperCase()}</span>
		</div>
		<p class="stocks__box-quantity">-</p>
		<p class="stocks__box-percentage">0</p>
		<div class="stocks__box-price">
			<p>0 ${el.currency.toUpperCase()}</p>
			<span>0 ${el.currency.toUpperCase()}</span>
		</div>
		`
	})
	displayValues()
}

function displayValues() {
	const allStocksBox = document.querySelectorAll(".stocks__box")
	allStocksBox.forEach(async el => {
		const symbol = el.firstElementChild.dataset.symbol
		const data = await getData(symbol)
		const dataResult = data.optionChain.result[0].quote

		let stockPrice = dataResult.regularMarketChangePercent.toFixed(2)
		let color

		if (stockPrice > 0) {
			color = "plus-color"
			stockPrice = `+${stockPrice}%`
		} else if (stockPrice == 0) {
			color = "stagnation-color"
			stockPrice = `${stockPrice}%`
		} else {
			color = "minus-color"
			stockPrice = `${stockPrice}%`
		}

		const percentageBox = el.querySelector(".stocks__box-percentage")
		percentageBox.textContent = stockPrice
		percentageBox.classList.add(color)

		const priceBox = el.querySelector(".stocks__box-price")
		priceBox.firstElementChild.textContent = `${dataResult.regularMarketPrice} ${dataResult.currency}`

		const exchangeStatus = el.querySelector(".stocks__box-quantity")
		if (dataResult.triggerable) {
			exchangeStatus.classList.add("plus-color")
			exchangeStatus.textContent = "OPEN"
		} else {
			exchangeStatus.classList.add("minus-color")
			exchangeStatus.textContent = "CLOSE"
		}

		const objLocalStorage = stocks.find(el => el.symbol == symbol)
		const currentValue = (
			objLocalStorage.quantity * dataResult.regularMarketPrice
		).toFixed(2)
		priceBox.lastElementChild.textContent = `${currentValue} ${dataResult.currency}`
	})
}

displayStocks()
