const puppeteer = require("puppeteer")

const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch({
            // headless: true, // false: display ui - true: hide ui
            headless: "new",
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        })

        // console.log("typeof browser: ", typeof (browser));
    } catch (error) {
        console.log("==> Unable to create browser: ", error);
    }
    return browser
}

module.exports = startBrowser