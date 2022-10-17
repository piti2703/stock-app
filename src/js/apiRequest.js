const getData = async symbol => {
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

export default getData
