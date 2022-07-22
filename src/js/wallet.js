const buyedStocks = JSON.parse(localStorage.getItem("buyedStocks")) || []
const wallet = document.querySelector(".wallet__stocks")

async function getData(symbol) {
	const options = {
		method: "GET",
		url: "https://yfapi.net/v11/finance/quoteSummary/AAPL",
		params: { modules: "defaultKeyStatistics,assetProfile" },
		headers: {
			"x-api-key": "VhcanQxrrj46M9QxaP1s06hfYeVr8LDO7KIr1g1x",
		},
	}
	const data = await fetch(
		`https://yfapi.net/v7/finance/options/${symbol}`,
		options
	)
	return data.json()
}

function displayWallet() {
	buyedStocks.forEach(async el => {
		if (el.status !== "open") {
			return
		}
		const data = await getData(el.symbol)
		const dataResult = data.optionChain.result[0].quote
		const currentValue = (dataResult.ask * el.quantity).toFixed(2)
		let change = (dataResult.ask - el.purchasePrice).toFixed(2)
		let changePercentage = (
			((dataResult.ask - el.purchasePrice) / el.purchasePrice) *
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

		const newStock = document.createElement("div")
		wallet.appendChild(newStock)
		newStock.classList.add("wallet__grid")
		newStock.innerHTML = `
		<p class="wallet__grid-text product">${dataResult.shortName}</p>
		<p class="wallet__grid-text quantity">${el.quantity}</p>
		<p class="wallet__grid-text value">${currentValue} ${el.currency.toUpperCase()}</p>
		<p class="wallet__grid-text purchase-price">${el.purchasePrice}</p>
		<p class="wallet__grid-text current-price">${dataResult.ask}</p>
		<p class="wallet__grid-text earning-lose ${color}">${change}</p>
		<p class="wallet__grid-text earning-lose-percentage ${color}">${changePercentage}%</p>
		`
	})
}

displayWallet()
