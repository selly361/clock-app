const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = 3000

app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'development'
				? true
				: process.env.NODE_ENV === 'production'
				? process.env.ORIGIN
				: false,
	})
)

/* Route to fetch time data */

app.get('/api/time', async (req, res) => {
	try {
		const response = await fetch('https://worldtimeapi.org/api/ip')
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = await response.json()
		res.json(data)
	} catch (error) {
		console.error('Failed to fetch time data:', error)
		res.status(500).json({ error: 'Failed to fetch time data' })
	}
})

/* Route to fetch geolocation data */

app.get('/api/location', async (req, res) => {
	try {
		const response = await fetch(
			`https://api.ipbase.com/v2/info?apikey=${process.env.IPBASE_API_KEY}`
		)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const { data } = await response.json()
		res.json(data.location)
	} catch (error) {
		console.error('Failed to fetch geolocation data:', error)
		res.status(500).json({ error: 'Failed to fetch geolocation data' })
	}
})

/* Route to fetch a quote */

app.get('/api/quote', async (req, res) => {
	try {
		const response = await fetch(
			'https://api.api-ninjas.com/v1/quotes?category=computers',
			{
				headers: {
					'X-Api-Key': process.env.QUOTE_API_KEY
				}
			}
		)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = await response.json()
		res.json(data[0]) 
	} catch (error) {
		console.error('Failed to fetch quote:', error)
		res.status(500).json({ error: 'Failed to fetch quote' })
	}
})

/* Start the server */

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
