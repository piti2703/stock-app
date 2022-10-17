const indexesBoxes = document.querySelectorAll(".indexes__grid--index")
import getData from "./apiRequest.min.js"

function setValue() {
	indexesBoxes.forEach(async el => {
		const symbol = el.dataset.symbol
		const data = await getData(symbol)
		const dataResult = data.optionChain.result[0].quote

		let indexRate = dataResult.regularMarketChangePercent.toFixed(2)
		let color

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
