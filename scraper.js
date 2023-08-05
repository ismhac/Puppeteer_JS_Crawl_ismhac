
const scrapeCategory = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        console.log("==> A new tab has been opened...");
        await page.goto(url)
        console.log("==> Accessed the link: ", url);
        await page.waitForSelector("#webpage")
        console.log("==> Website has finished loading...");

        const dataCategory = await page.$$eval('#navbar-menu > ul > li', (element) => {
            dataCategory = element.map(element => {
                return {
                    category: element.querySelector('a').innerText,
                    link: element.querySelector('a').href
                }
            })
            return dataCategory
        })

        await page.close()
        console.log("==> Tab closed");
        resolve(dataCategory)
    } catch (error) {
        // console.log("Error occurred in scrape category: ", error);
        reject("!!! Error occurred in scrape category: ", error)
    }
})

const scraper = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        let newPage = await browser.newPage()
        console.log("==> A new tab has been opened...");
        await newPage.goto(url)
        console.log("==> Accessed the link: ", url);
        await newPage.waitForSelector('#main')
        console.log(">>> Website has finished loading...");

        const scrapeData = {}

        // lay Header
        const headerData = await newPage.$eval("header", (element) => {
            return {
                title: element.querySelector("h1").innerText,
                description: element.querySelector("p").innerText
            }
        })

        // console.log(headerData);
        scrapeData.header = headerData

        // lay link detail item
        const detailLinks = await newPage.$$eval("#left-col > section.section-post-listing > ul > li", (els) => {
            detailLinks = els.map(el => {
                return el.querySelector('.post-meta > h3 > a').href
            })
            return detailLinks
        })



        // console.log(detailLinks);

        const scraperDetail = async (link) => new Promise(async (resolve, reject) => {
            try {
                let pageDetail = await browser.newPage()
                await pageDetail.goto(link)
                console.log("==> Accessed the link: ", link);
                await pageDetail.waitForSelector("#main")

                const detailData = {}
                // Bat dau cao
                // Cao anh
                const images = await pageDetail.$$eval('#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide', (els) => {
                    images = els.map(el => {
                        return el.querySelector('img')?.src
                    })
                    return images.filter(i => !i === false)
                })

                detailData.images = images

                // header detail
                const header = await pageDetail.$eval("header.page-header", (el) => {
                    return {
                        title: el.querySelector('h1 > a').innerText,
                        star: el.querySelector('h1 > span').className.replace(/^\D+/g, ''),
                        class: {
                            content: el.querySelector('p').innerText,
                            classType: el.querySelector('p > a > strong').innerText
                        },
                        address: el.querySelector('address').innerText,
                        attributes: {
                            price: el.querySelector('div.post-attributes > div.price > span').innerText,
                            acreage: el.querySelector('div.post-attributes > div.acreage > span').innerText,
                            published: el.querySelector('div.post-attributes > div.published > span').innerText,
                            hashtag: el.querySelector('div.post-attributes > div.hashtag > span').innerText
                        }
                    }
                })

                detailData.header = header

                // description information
                const mainContentHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-main-content', (el) => el.querySelector("div.section-header > h2").innerText)
                const mainContentDetail = await pageDetail.$$eval('#left-col > article.the-post > section.post-main-content > div.section-content > p', (els) => els.map(el => el.innerText))

                detailData.mainContent = {
                    header: mainContentHeader,
                    content: mainContentDetail
                }

                // dac diem tin dang
                const overviewHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-overview', (el) => el.querySelector("div.section-header > h3").innerText)
                const overviewContent = await pageDetail.$$eval('#left-col > article.the-post > section.post-overview > div.section-content > table.table > tbody > tr', (els) => els.map(el => (
                    {
                        name: el.querySelector('td:first-child').innerText,
                        content: el.querySelector('td:nth-of-type(2)').innerText
                    }
                )))

                detailData.overview = {
                    header: overviewHeader,
                    content: overviewContent
                }

                // Contact Info
                const contactHeader = await pageDetail.$eval('#left-col > article > section.post-contact', (el) => el.querySelector('div.section-header > h3').innerText)
                const contactContent = await pageDetail.$$eval('#left-col > article > section.post-contact > div.section-content > table.table > tbody > tr', (els) => els.map(el => (
                    {
                        name: el.querySelector('td:nth-of-type(1)').innerText,
                        content: el.querySelector('td:nth-of-type(2)').innerText
                    }
                )))

                detailData.contact = {
                    header: contactHeader,
                    content: contactContent
                }

                await pageDetail.close()
                console.log("==> Tab closed", link);
                resolve(detailData)
            } catch (error) {
                // console.log("!!! There was an error retrieving detailed data: ", error);
                reject("!!! There was an error retrieving detailed data: ", error)
            }
        })

        const details = []
        for (let link of detailLinks) {
            const detail = await scraperDetail(link)
            details.push(detail)
        }
        scrapeData.body = details
        await browser.close()
        console.log("==> Browser closed");
        resolve(scrapeData)
    } catch (error) {
        reject(error)
    }
})

module.exports = {
    scrapeCategory,
    scraper
}