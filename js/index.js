;(function () {
	/* ========================================
	   Variables
	   ======================================== */

	const icon = document.querySelector('.main__time-section__icon')
	const greetingText = document.querySelector('.main__time-section__greeting')
	const timeText = document.querySelector('.main__time-section__time')
	const refreshQuoteButton = document.querySelector(
		'.main__quote-refresh-button'
	)
	const quoteText = document.querySelector('.main__quote-text')
	const quoteAuthor = document.querySelector('.main__quote-author')
	const locationText = document.querySelector('.main__time-section__location')
	const button = document.querySelector('.button')
	const hiddenSection = document.querySelector('.date-details')
	const timezoneText = document.querySelector('.timezone-value')
	const dayOfYearText = document.querySelector('.day-of-year-value')
	const dayOfWeekText = document.querySelector('.day-of-week-value')
	const weekNumberText = document.querySelector('.week-number-value')
	const mainElement = document.querySelector('.main')
	const htmlElement = document.documentElement

	// URLs for the endpoints on your server
	const serverTimeApiUrl = 'http://localhost:3000/api/time'
	const serverGeoApiUrl = 'http://localhost:3000/api/location'
	const serverQuotesApiUrl = 'http://localhost:3000/api/quote'

	/* ========================================
	   Methods
	   ======================================== */

	/*  Fetch the current time from your server. */

	async function timeApi() {
		const response = await fetch(serverTimeApiUrl)
		return response.json()
	}

	/* Fetch the geolocation data from your server. */

	async function geoApi() {
		const response = await fetch(serverGeoApiUrl)
		return response.json()
	}

	/* Fetch a random quote from your server. */

	async function fetchQuote() {
		const response = await fetch(serverQuotesApiUrl)
		return response.json()
	}

	/**
	 * Update the time displayed on the page and set the day/night attribute.
	 * This function synchronizes with the start of the next minute.
	 */
	async function updateTime() {
		const currentTime = await timeApi()
		if (currentTime && currentTime.datetime) {
			// Extract and display the "HH:MM" part of the current time
			const time = currentTime.datetime.slice(11, 16)
			timeText.innerHTML = `${time}<span class="heading-l abbreviation">${currentTime.abbreviation}</span>`

			// Extract hours from the current time
			const hours = parseInt(currentTime.datetime.slice(11, 13), 10)

			// Determine if it's day or night
			const isDay = hours >= 5 && hours < 18 // 5 AM to 6 PM

			// Set the data-day attribute based on the time of day
			htmlElement.setAttribute('data-day', isDay ? 'day' : 'night')

			// Set the correct src attribute based on the time of day

			icon.setAttribute(
				'src',
				isDay ? './assets/icons/icon-sun.svg' : './assets/icons/icon-moon.svg'
			)

			timezoneText.textContent = currentTime.timezone
			dayOfYearText.textContent = currentTime.day_of_year
			dayOfWeekText.textContent = currentTime.day_of_week
			weekNumberText.textContent = currentTime.week_number

			// Set the correct greeting based on the time of day
			greetingText.textContent = isDay
				? "GOOD MORNING, IT'S CURRENTLY"
				: 'GOOD EVENING, IT’S CURRENTLY'

			// Calculate milliseconds until the start of the next minute
			const seconds = new Date(currentTime.datetime).getSeconds()
			const millisecondsUntilNextMinute = (60 - seconds) * 1000

			// Sync update with the start of the next minute, then update every minute
			setTimeout(() => {
				updateTime() // Immediate update at the start of the next minute
				setInterval(updateTime, 60000) // Continue updating every minute
			}, millisecondsUntilNextMinute)
		}
	}

	/* Update the location displayed on the page. */

	async function updateLocation() {
		const locationData = await geoApi()
		if (locationData && locationData.city && locationData.country) {
			locationText.textContent = `IN ${locationData.city}, ${locationData.country}`
		} else {
			locationText.textContent = 'Location unavailable'
		}
	}

	/* Update the quote displayed on the page. */

	async function updateQuote() {
		const quoteData = await fetchQuote()
		if (quoteData && quoteData.quote) {
			quoteText.textContent = `"${quoteData.quote}"`
			quoteAuthor.textContent = `${quoteData.author}`
		}
	}

	function handleButtonClick() {
		button.classList.toggle('button--active')
		hiddenSection.classList.toggle('date-details--active')
		mainElement.classList.toggle('main--active')
		button.textContent = button.textContent === 'LESS' ? 'MORE' : 'LESS'
	}

	/* ========================================
	   Initializations & Event Listeners
	   ======================================== */

	updateTime()
	updateLocation()
	updateQuote()

	refreshQuoteButton.addEventListener('click', updateQuote)
	button.addEventListener('click', handleButtonClick)
})()
