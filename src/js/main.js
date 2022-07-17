const navMobile = document.querySelector(".nav-mobile")
const navMobileItem = document.querySelectorAll(".nav-mobile__list-item")
const menuBtn = document.querySelector(".header__btn")

const currencyRates = document.querySelectorAll(".currency__box-rate")
const currencyPercentages = document.querySelectorAll(
	".currency__box-percentage "
)

const favoriteAddBtn = document.querySelector(".favorite__add-btn")
const stocks = JSON.parse(localStorage.getItem("stocks")) || []
const favorite = document.querySelector(".favorite__stocks")
const favoriteInput = document.querySelector(".favorite__add-input")
const favoriteErrorBox = document.querySelector(".favorite__error")
const favoriteErrorBoxBtn = document.querySelector(".favorite__error-btn")

// NAV MOBILE
const toggleNav = () => {
	navMobile.classList.toggle("nav-mobile--active")
}

menuBtn.addEventListener("click", toggleNav)
navMobileItem.forEach(el => {
	el.addEventListener("click", toggleNav)
})

function getPreviousDay(date = new Date()) {
	let month

	const previous = new Date(date.getTime())
	previous.setDate(date.getDate() - 1)

	const day = previous.getDate()
	const monthBeta = previous.getMonth() + 1
	const year = previous.getFullYear()

	if (monthBeta < 10) {
		month = "0" + monthBeta
	} else {
		month = monthBeta
	}

	const yesterday = `${year}-${month}-${day}`

	return yesterday
}

function getToday() {
	const now = new Date()
	let month
	const day = now.getDate()
	const monthBeta = now.getMonth() + 1
	const year = now.getFullYear()

	if (monthBeta < 10) {
		month = "0" + monthBeta
	} else {
		month = monthBeta
	}

	const today = `${year}-${month}-${day}`

	return today
}

// CURRENCY RATE

function getCurrencyRate(currency1, currency2, date = getToday()) {
	const fetchedData = fetch(
		`https://api.exchangerate.host/convert?from=${currency1}&to=${currency2}&date=${date}`
	)
		.then(res => {
			if (res.ok) {
				return res.json()
			} else {
				throw new Error()
			}
		})
		.then(res => {
			return res.info.rate
		})
		.catch(() => {
			console.log("API ERROR!!!")
		})

	return fetchedData
}

function setCurrencyRate() {
	currencyRates.forEach(el => {
		const currency1 = el.dataset.currency1
		const currency2 = el.dataset.currency2

		const valuePromise = getCurrencyRate(currency1, currency2)
		valuePromise.then(value => {
			el.textContent = value.toFixed(4)
		})
	})
}

setCurrencyRate()

function calcChange() {
	currencyPercentages.forEach(el => {
		const currency1 = el.dataset.currency1
		const currency2 = el.dataset.currency2

		let value1
		let value2

		const yesterdaysValue = getCurrencyRate(
			currency1,
			currency2,
			getPreviousDay()
		)
		yesterdaysValue.then(value => (value1 = value))

		const todaysValue = getCurrencyRate(currency1, currency2)
		todaysValue.then(value => (value2 = value))

		setTimeout(() => {
			const percentage = (((value2 - value1) / value1) * 100).toFixed(2)

			if (percentage > 0) {
				el.classList.add("plus-color")
				el.textContent = `+${percentage}%`
			} else if (percentage == 0) {
				el.classList.add("stagnation-color")
				el.textContent = `${percentage}%`
			} else {
				el.classList.add("minus-color")
				el.textContent = `${percentage}%`
			}
		}, 1000)
	})
}

calcChange()

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
				favoriteErrorBox.classList.add("favorite__error--active")
			} else {
				favoriteErrorBox.classList.remove("favorite__error--active")
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
		<i class="fa-solid fa-xmark"></i>

		`
		console.log(dataResult)
	})
}
displayFavorites()

favoriteAddBtn.addEventListener("click", addFavoritesSymbol)
favoriteInput.addEventListener("keyup", e => {
	if (e.key === "Enter") {
		addFavoritesSymbol()
	}
})

// NAV MOBILE LISTENERS
menuBtn.addEventListener("click", toggleNav)
navMobileItem.forEach(el => {
	el.addEventListener("click", toggleNav)
})

favoriteErrorBoxBtn.addEventListener("click", () =>
	favoriteErrorBox.classList.remove("favorite__error--active")
)
