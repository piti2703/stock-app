const indexesBoxes = document.querySelectorAll(".indexes__grid--index")

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

function setValue() {
	indexesBoxes.forEach(async el => {
		const symbol = el.dataset.symbol
		const data = await getData(symbol)
		const dataResult = data.optionChain.result[0].quote

		let indexRate = dataResult.regularMarketChangePercent.toFixed(2)
		let color

		console.log(dataResult)

		if (indexRate > 0) {
			color = "plus-color"
			indexRate = `+${indexRate}%`
		} else if (indexRate == 0) {
			color = "stagnation-color"
			indexRate = `${indexRate}%`
		} else {
			color = "minus-color"
			indexRate = `${indexRate}%`
		}

		const percentage = el.querySelector(".change")
		percentage.textContent = indexRate
		percentage.classList.add(color)

		const rate = el.querySelector(".price")
		rate.textContent = dataResult.regularMarketPrice.toFixed(2)
	})
}

setValue()
