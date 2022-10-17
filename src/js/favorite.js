import favStocks from "./favStocks.min.js"
import getData from "./apiRequest.min.js"

const favoriteAddBtn = document.querySelector(".favorite__add-btn")
const stocks = JSON.parse(localStorage.getItem("stocks")) || favStocks
const favorite = document.querySelector(".favorite__stocks")
const favoriteInput = document.querySelector(".favorite__add-input")
const favoriteErrorBox = document.querySelector(".error")
const favoriteErrorBoxBtn = document.querySelector(".error-btn")

function addFavoritesSymbol() {
	const typedText = favoriteInput.value

	const options = {
		method: "GET",
		url: "https://yfapi.net/v11/finance/quoteSummary/AAPL",
		params: { modules: "defaultKeyStatistics,assetProfile" },
		headers: {
			"x-api-key": "VhcanQxrrj46M9QxaP1s06hfYeVr8LDO7KIr1g1x",
		},
	}

	fetch(`https://yfapi.net/v7/finance/options/${typedText}`, options)
		.then(response => response.json())
		.then(response => {
			if (response.optionChain.result[0] == undefined) {
				console.error("symbol nie jest ok")
				favoriteErrorBox.classList.add("error--active")
			} else {
				favoriteErrorBox.classList.remove("error--active")
				const newFavorite = {
					symbol: response.optionChain.result[0].quote.symbol,
					currency: response.optionChain.result[0].quote.currency,
					stockName: response.optionChain.result[0].quote.shortName,
					exchangeName: response.optionChain.result[0].quote.fullExchangeName,
				}

				stocks.push(newFavorite)
				localStorage.setItem("stocks", JSON.stringify(stocks))
				window.location.reload(true)
			}
		})
		.catch(err => console.error(err))

	favoriteInput.value = ""
}

function displayFavorites() {
	stocks.forEach(el => {
		const newFavoriteItem = document.createElement("div")
		newFavoriteItem.classList.add("favorite__grid")
		newFavoriteItem.classList.add("favorite__grid--stock")
		newFavoriteItem.setAttribute("data-symbol", el.symbol)
		favorite.appendChild(newFavoriteItem)

		newFavoriteItem.innerHTML = `
		<p class="favorite__grid-text product">${el.stockName}</p>
		<p class="favorite__grid-text change">0</p>
		<p class="favorite__grid-text price">0</p>
		<p class="favorite__grid-text stock-currency">${el.currency}</p>
		<p class="favorite__grid-text exchange">${el.exchangeName}</p>
		<p class="favorite__grid-text p-e">0</p>
		<p class="favorite__grid-text symbol">${el.symbol}</p>
		<i class="favorite__grid-mark fa-solid fa-xmark"></i>
		`
	})
	displayValues()
}

function displayValues() {
	const allFavoriteBox = document.querySelectorAll(".favorite__grid--stock")

	allFavoriteBox.forEach(async el => {
		const symbol = el.dataset.symbol
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

		const change = el.querySelector(".change")
		change.textContent = stockPrice
		change.classList.add(color)

		const price = el.querySelector(".price")
		price.textContent = dataResult.regularMarketPrice.toFixed(2)

		const priceEarning = el.querySelector(".p-e")
		priceEarning.textContent = dataResult.trailingPE.toFixed(2)
	})
}
displayFavorites()

function removeFavorite(e) {
	if (!e.target.matches("i")) return
	const stockBox = e.target.parentElement
	favorite.removeChild(stockBox)
	const symbol = e.target.previousElementSibling.textContent
	const index = stocks.indexOf(symbol)
	stocks.splice(index, 1)
	localStorage.setItem("stocks", JSON.stringify(stocks))
}

favorite.addEventListener("click", removeFavorite)

favoriteAddBtn.addEventListener("click", addFavoritesSymbol)
favoriteInput.addEventListener("keyup", e => {
	if (e.key === "Enter") {
		addFavoritesSymbol()
	}
})

favoriteErrorBoxBtn.addEventListener("click", () =>
	favoriteErrorBox.classList.remove("error--active")
)
