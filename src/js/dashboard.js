const currencyRates = document.querySelectorAll(".currency__box-rate")
const currencyPercentages = document.querySelectorAll(
	".currency__box-percentage "
)

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
