import { chromium } from 'playwright';
import { connect } from 'amqplib';
import amqp from "amqplib"

// Use RABBIT_URL environment variable or default to 'amqp://rabbitmq:5672'
const RABBIT_URL = "amqp://rabbitmq:5672";

// amqp.connect(RABBIT_URL)
//     .then((conn) => {
//         console.log("Connected to RabbitMQ!");
//         return conn.createChannel();
//     })
//     /* The code block you provided is using promises in JavaScript to handle the asynchronous
//     connection and channel creation process for RabbitMQ. Here's a breakdown of what it does: */
//     .then((channel) => {
//         console.log("Channel created!");
//         // Further RabbitMQ setup...
//     })
//     .catch((err) => {
//         console.error("Error setting up RabbitMQ consumer:", err);
//     });

const QUEUE_NAME = 'button_actions';
let browser = null;
let page = null;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function connectWithRetry(url, retries = 10) {
    for (let i = 0; i < retries; i++) {
        try {
            return await connect(url);
        } catch (err) {
            console.error(`Connection attempt ${i + 1} failed. Retrying...`);
            await sleep(3000);
        }
    }
    throw new Error('Max retries reached');
}
async function startBrowser() {
    try {
        if (!browser) {
            console.log('Starting browser...');

            // 1) Fetch /json/version from host.docker.internal:9222
            // const response = await fetch('http://host.docker.internal:9222/json/version');
            // const { webSocketDebuggerUrl } = await response.json();
            // console.log('Got WebSocket URL:', webSocketDebuggerUrl);

            // 2) Connect to the *host* Chrome using connectOverCDP
            browser = await chromium.connectOverCDP('http://host.docker.internal:9222');

            if (browser) console.log('BROWSER NOT NULL');

            // 3) Create context/page as usual
            const context = await browser.newContext();
            if (context) console.log('CONTEXT NOT NULL');

            page = await context.newPage();
            if (page) console.log('PAGE NOT NULL');

            // 4) Navigate to your host's website
            //    Since it's on your Mac's localhost:3000, use host.docker.internal
            //    if you need Docker to reach it
            await page.goto('http://host.docker.internal:3000');

            // 5) Optional: Listen for any dialogs
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
        }
    } catch (error) {
        console.error('Error starting browser:', error);
    }
}

async function closeBrowser() {
    try {
        if (browser) {
            // console.log('Closing browser...');
            await browser.close();
            browser = null;
            page = null;
            // console.log('Browser closed.');
        }
    } catch (error) {
        console.error('Error closing browser:', error);
    }
}

async function handleAutomation(data) {
    try {
        if (data) {
            let uid = data
            let input = "NONE"
            if (data.includes("input")) {
                // console.log("split")
                const parts = data.split(":")
                uid = parts[0]
                const match = uid.match(/input-\d+/);
                if (match[0]) {
                    uid = match[0]
                }
                input = parts[1]
                console.log(uid)
            }
            else {
                const match = uid.match(/btn-\d+/);
                if (match[0]) {
                    uid = match[0]
                }
            }

            // console.log(page)
            const cleanedUid = uid.trim().replace(/[^a-zA-Z0-9-]/g, '');
            const selector = `#${cleanedUid}`;
            // console.log(`selector: ${selector}`);

            try {
                // console.log(selector)
                if (selector.includes("input")) {
                    await page.locator(selector).fill(input);
                }
                else {
                    await page.locator(selector).click();

                }

            } catch (error) {
                console.error(`Failed to click button with selector: ${selector}`, error);
            }
        } else {
            console.error('No valid button UIDs provided.');
        }
    } catch (error) {
        console.error('Error handling automation:', error);
    }
}

async function processMessages() {
    console.log("IN PROCESS MESSAGES")
    try {
        console.log("BEFORE CONNETING")
        const connection = await connectWithRetry('amqp://rabbitmq');
        //const connection = await connectWithRetry('amqp://localhost');
        console.log("AFTER CONNECTING")
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);
        //process 1 message at a time
        channel.prefetch(1);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg) {
                const content = msg.content.toString();
                console.log(`Message Consumed: ${content}`);

                try {
                    const data = JSON.parse(content);
                    if (data === 'DONE') {
                        await closeBrowser();
                    } else if (data === 'START') {
                        await startBrowser();
                    } else {
                        await handleAutomation(data);
                    }

                    // Acknowledge the message
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(msg, false, true); // Optionally requeue the message
                }
            }
        });
    } catch (error) {
        console.error('Error setting up RabbitMQ consumer:', error);
    }
}

// Start processing messages
processMessages();