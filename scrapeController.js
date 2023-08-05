const scrapers = require("./scraper")
const fs = require('fs')

const scrapeController = async (browserInstance) => {
    const url = "https://phongtro123.com/"
    const indexs = [1, 2, 3, 4]
    try {
        let browser = await browserInstance
        // gọi hàm cạo ở file scrape
        let categories = await scrapers.scrapeCategory(browser, url)
        const selectedCategories = categories.filter((category, index) => indexs.some(i => i === index))

        let result = await scrapers.scraper(browser, selectedCategories[0].link)
        fs.writeFile('data.json', JSON.stringify(result), (err) => {
            if (err) console.log('write data in to json file fail', err);
            console.log('write data successfully');
        })
    } catch (error) {
        console.log("!!! Error occurred in scrape controller: ", error);
    }
}

module.exports = scrapeController