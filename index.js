
const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newspapers = [
	{
		name: 'thetimes',
		address: 'https://www.thetimes.co.uk/environment/climate-change',
		base: 'https://www.thetimes.co.uk',
	},
	{
		name: 'guardian',
		address: 'https://www.theguardian.com/environment/climate-crisis',
		base: 'https://www.theguardian.com',
	},
	{
		name: 'telegraph',
		address: 'https://www.telegraph.co.uk/climate-change',
		base: 'https://www.telegraph.co.uk',
	},
	{
		name: 'timesofindia',
		address: 'https://timesofindia.indiatimes.com/home/environment',
		base: 'https://timesofindia.indiatimes.com',
	},
	{
		name: 'hindustantimes',
		address: 'https://www.hindustantimes.com/environment',
		base: 'https://www.hindustantimes.com',
	},
	{
		name: 'ndtv',
		address: 'https://www.ndtv.com/environment',
		base: 'https://www.ndtv.com',
	},
	{
		name: 'thehindu',
		address: 'https://www.thehindu.com/sci-tech/energy-and-environment',
		base: 'https://www.thehindu.com',
	},
	{
		name: 'deccanherald',
		address: 'https://www.deccanherald.com/opinion/environment',
		base: 'https://www.deccanherald.com',
	},
	{
		name: 'scroll',
		address: 'https://scroll.in/topic/environment',
		base: 'https://scroll.in',
	},
	{
		name: 'theprint',
		address: 'https://theprint.in/india/environment/',
		base: 'https://theprint.in',
	},
	{
		name: 'bbc',
		address: 'https://www.bbc.com/news/science_and_environment',
		base: 'https://www.bbc.com',
	},
	{
		name: 'cnn',
		address: 'https://edition.cnn.com/specials/world/cnn-climate',
		base: 'https://edition.cnn.com',
	},
	{
		name: 'independent',
		address: 'https://www.independent.co.uk/environment',
		base: 'https://www.independent.co.uk',
	},
	{
		name: 'financialtimes',
		address: 'https://www.ft.com/climate-capital',
		base: 'https://www.ft.com',
	},
	{
		name: 'lemonde',
		address: 'https://www.lemonde.fr/planete',
		base: 'https://www.lemonde.fr',
	},
	{
		name: 'indianexpress',
		address: 'https://indianexpress.com/about/climate-change-3/',
		base: 'https://indianexpress.com',
	}
];

const articles = [];
newspapers.forEach(newspaper => {
	axios.get(newspaper.address).then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
		$('a:contains("news")', html).each(function () {
			const title = $(this).text();
			const url = $(this).attr('href');
			articles.push({
				title,
				url: newspaper.base + url,
				source: newspaper.name,
			});
		});
	});
});
app.get('/', (req, res) => {
	res.json('Welcome to my Latest News API');
});
app.get('/news', (req, res) => {
	res.json(articles);
});
app.get('/news/:newspaperId', (req, res) => {
	const newspaperId = req.params.newspaperId;
	const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
	const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base;
	axios
		.get(newspaperAddress)
		.then(response => {
			const html = response.data;
			const $ = cheerio.load(html);
			const specificArticles = [];
			$('a:contains("news")', html).each(function () {
				const title = $(this).text();
				const url = $(this).attr('href');
				specificArticles.push({
					title,
					url: newspaperBase + url,
					source: newspaperId,
				});
			});
			res.json(specificArticles);
		})
		.catch(err => console.log(err));
});
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));


