const puppeteer = require('puppeteer');

export default async function handler(req, res) {
    const { extensionId } = req.query;

    if (!extensionId) {
        return res.status(400).json({ error: "Extension ID is required" });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,  // Can set to false to see the browser
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });

        const page = await browser.newPage();

        // Set User-Agent to avoid being blocked
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        );

        const extensionUrl = `https://chrome.google.com/webstore/detail/${extensionId}`;
        await page.goto(extensionUrl, { waitUntil: 'networkidle2' });

        // Get the full HTML content
        const htmlContent = await page.content();

        await browser.close();

        return res.send(htmlContent);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
