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
        address: 'https://www.theguardian.com/',
        base: 'https://www.theguardian.com',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'timesofindia',
        address: 'https://timesofindia.indiatimes.com/',
        base: 'https://timesofindia.indiatimes.com',
    },
    {
        name: 'hindustantimes',
        address: 'https://www.hindustantimes.com/',
        base: 'https://www.hindustantimes.com',
    },
    {
        name: 'ndtv',
        address: 'https://www.ndtv.com/',
        base: 'https://www.ndtv.com',
    },
    {
        name: 'thehindu',
        address: 'https://www.thehindu.com/',
        base: 'https://www.thehindu.com',
    },
    {
        name: 'deccanherald',
        address: 'https://www.deccanherald.com/',
        base: 'https://www.deccanherald.com',
    },
    {
        name: 'scroll',
        address: 'https://scroll.in/',
        base: 'https://scroll.in',
    },
    {
        name: 'theprint',
        address: 'https://theprint.in/',
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
        address: 'https://www.independent.co.uk/',
        base: 'https://www.independent.co.uk',
    },
    {
        name: 'financialtimes',
        address: 'https://www.ft.com/',
        base: 'https://www.ft.com',
    },
    {
        name: 'lemonde',
        address: 'https://www.lemonde.fr/',
        base: 'https://www.lemonde.fr',
    },
    {
        name: 'indianexpress',
        address: 'https://indianexpress.com/',
        base: 'https://indianexpress.com',
    }
];

const articles = [];
newspapers.forEach(newspaper => {
    axios.get(newspaper.address).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        
        // General article links (without filtering to 'climate')
        $('a[href]', html).each(function () {
            const title = $(this).text();
            let url = $(this).attr('href');
            
            // Ensure the URL is valid and has some text
            if (title && url && url.startsWith('/')) {
                url = newspaper.base + url;
                articles.push({
                    title,
                    url,
                    source: newspaper.name,
                });
            }
        });
    }).catch(err => console.log(err));
});

app.get('/', (req, res) => {
    res.json('Welcome to my Latest News API');
});

app.get('/news', (req, res) => {
    res.json(articles);
});

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaper = newspapers.find(newspaper => newspaper.name == newspaperId);
    
    if (!newspaper) {
        return res.status(404).json({ message: 'Newspaper not found' });
    }

    axios
        .get(newspaper.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];

            // General article links for specific newspaper
            $('a[href]', html).each(function () {
                const title = $(this).text();
                let url = $(this).attr('href');

                if (title && url && url.startsWith('/')) {
                    url = newspaper.base + url;
                    specificArticles.push({
                        title,
                        url,
                        source: newspaperId,
                    });
                }
            });

            res.json(specificArticles);
        })
        .catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
