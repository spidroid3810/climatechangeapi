const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newspapers = [
	{
		name: 'thetimes',
		address: 'https://www.thetimes.co.uk/',
		base: 'https://www.thetimes.co.uk',
	},
	{
		name: 'guardian',
		address: 'https://www.theguardian.com/international',
		base: 'https://www.theguardian.com',
	},
	{
		name: 'telegraph',
		address: 'https://www.telegraph.co.uk/news',
		base: 'https://www.telegraph.co.uk',
	},
	{
		name: 'timesofindia',
		address: 'https://timesofindia.indiatimes.com/',
		base: 'https://timesofindia.indiatimes.com',
	},
	{
		name: 'hindustantimes',
		address: 'https://www.hindustantimes.com/latest-news',
		base: 'https://www.hindustantimes.com',
	},
	{
		name: 'ndtv',
		address: 'https://www.ndtv.com/latest',
		base: 'https://www.ndtv.com',
	},
	{
		name: 'thehindu',
		address: 'https://www.thehindu.com/latest-news/',
		base: 'https://www.thehindu.com',
	},
	{
		name: 'deccanherald',
		address: 'https://www.deccanherald.com/latest-news',
		base: 'https://www.deccanherald.com',
	},
	{
		name: 'scroll',
		address: 'https://scroll.in/news',
		base: 'https://scroll.in',
	},
	{
		name: 'theprint',
		address: 'https://theprint.in/latest-news/',
		base: 'https://theprint.in',
	},
	{
		name: 'bbc',
		address: 'https://www.bbc.com/news',
		base: 'https://www.bbc.com',
	},
	{
		name: 'cnn',
		address: 'https://edition.cnn.com/',
		base: 'https://edition.cnn.com',
	},
	{
		name: 'independent',
		address: 'https://www.independent.co.uk/news',
		base: 'https://www.independent.co.uk',
	},
	{
		name: 'financialtimes',
		address: 'https://www.ft.com/news',
		base: 'https://www.ft.com',
	},
	{
		name: 'lemonde',
		address: 'https://www.lemonde.fr/',
		base: 'https://www.lemonde.fr',
	},
	{
		name: 'indianexpress',
		address: 'https://indianexpress.com/latest-news/',
		base: 'https://indianexpress.com',
	}
];

const articles = [];
newspapers.forEach(newspaper => {
	axios.get(newspaper.address).then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
		// General article fetching
		$('a', html).each(function () {
			const title = $(this).text();
			const url = $(this).attr('href');
			articles.push({
				title,
				url: newspaper.base ? newspaper.base + url : url,  // Append base URL if available
				source: newspaper.name,
			});
		});
	});
});

app.get('/', (req, res) => {
	res.json('Welcome to the Latest News API');
});

app.get('/news', (req, res) => {
	res.json(articles);
});

app.get('/news/:newspaperId', (req, res) => {
	const newspaperId = req.params.newspaperId;
	const newspaper = newspapers.find(newspaper => newspaper.name == newspaperId);
	if (newspaper) {
		axios.get(newspaper.address)
			.then(response => {
				const html = response.data;
				const $ = cheerio.load(html);
				const specificArticles = [];
				// Fetch latest articles
				$('a', html).each(function () {
					const title = $(this).text();
					const url = $(this).attr('href');
					specificArticles.push({
						title,
						url: newspaper.base ? newspaper.base + url : url,
						source: newspaperId,
					});
				});
				res.json(specificArticles);
			})
			.catch(err => console.log(err));
	} else {
		res.status(404).json({ message: "Newspaper not found" });
	}
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
