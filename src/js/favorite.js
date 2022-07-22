const favoriteAddBtn = document.querySelector(".favorite__add-btn")
const stocks = JSON.parse(localStorage.getItem("stocks")) || []
const favorite = document.querySelector(".favorite__stocks")
const favoriteInput = document.querySelector(".favorite__add-input")
const favoriteErrorBox = document.querySelector(".error")
const favoriteErrorBoxBtn = document.querySelector(".error-btn")
const favoriteMarks = document.querySelectorAll(".favorite__grid-mark")

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
				stocks.push(response.optionChain.result[0].quote.symbol)
				localStorage.setItem("stocks", JSON.stringify(stocks))
				window.location.reload(true)
			}
		})
		.catch(err => console.error(err))

	favoriteInput.value = ""
}

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

async function displayFavorites() {
	stocks.map(async el => {
		const data = await getData(el)
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

		const newStock = document.createElement("div")
		favorite.appendChild(newStock)
		newStock.classList.add("favorite__grid")
		newStock.innerHTML = `
		<p class="favorite__grid-text product">${dataResult.shortName}</p>
		<p class="favorite__grid-text change ${color}">${stockPrice}</p>
		<p class="favorite__grid-text price">${dataResult.ask}</p>
		<p class="favorite__grid-text stock-currency">${dataResult.currency}</p>
		<p class="favorite__grid-text exchange">${dataResult.fullExchangeName}</p>
		<p class="favorite__grid-text p-e">${dataResult.trailingPE.toFixed(2)}</p>
		<p class="favorite__grid-text symbol">${dataResult.symbol}</p>
		<i class="favorite__grid-mark fa-solid fa-xmark"></i>

		`
		console.log(dataResult)
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
