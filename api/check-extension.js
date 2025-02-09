const puppeteer = require('puppeteer');

export default async function handler(req, res) {
    const { extensionId } = req.query;

    if (!extensionId) {
        return res.status(400).json({ error: "Extension ID is required" });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const extensionUrl = `https://chrome.google.com/webstore/detail/${extensionId}`;
        await page.goto(extensionUrl, { waitUntil: 'domcontentloaded' });

        // Check if the "Add to Chrome" button is enabled or disabled
        const isAvailable = await page.evaluate(() => {
            const button = document.querySelector('button.UywwFc-LgbsSe');
            return button && !button.disabled; // If disabled, it has the `disabled` attribute.
        });

        await browser.close();
        return res.json({ available: isAvailable });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
