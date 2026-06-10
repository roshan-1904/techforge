const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const THEMES = {
    gold: {
        primary: '#c9b37d',
        secondary: '#1B1F3B',
        bg: '#ffffff',
        text: '#1B1F3B',
        border: '#c9b37d',
        sealBg: 'rgba(201, 179, 125, 0.05)',
        line: '#c9b37d',
        accent: '#c9b37d'
    },
    emerald: {
        primary: '#10b981',
        secondary: '#064e3b',
        bg: '#ffffff',
        text: '#064e3b',
        border: '#10b981',
        sealBg: 'rgba(16, 185, 129, 0.05)',
        line: '#10b981',
        accent: '#10b981'
    },
    sapphire: {
        primary: '#3b82f6',
        secondary: '#1e3a8a',
        bg: '#ffffff',
        text: '#1e3a8a',
        border: '#3b82f6',
        sealBg: 'rgba(59, 130, 246, 0.05)',
        line: '#3b82f6',
        accent: '#3b82f6'
    },
    ruby: {
        primary: '#ef4444',
        secondary: '#7f1d1d',
        bg: '#ffffff',
        text: '#7f1d1d',
        border: '#ef4444',
        sealBg: 'rgba(239, 68, 68, 0.05)',
        line: '#ef4444',
        accent: '#ef4444'
    },
    midnight: {
        primary: '#94a3b8',
        secondary: '#f8fafc',
        bg: '#0f172a',
        text: '#ffffff',
        border: '#94a3b8',
        sealBg: 'rgba(148, 163, 184, 0.1)',
        line: '#94a3b8',
        accent: '#94a3b8'
    }
};

const generateCertificate = async (userData, certificateId) => {
    console.log("PDF Generation Started");
    
    const themeKey = userData.theme || 'gold';
    const currentTheme = THEMES[themeKey] || THEMES.gold;
    
    const verifyUrl = `${process.env.CLIENT_URL}/verify/${certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
        color: {
            dark: themeKey === 'midnight' ? '#ffffff' : '#000000',
            light: themeKey === 'midnight' ? '#1f2937' : '#ffffff'
        }
    });
    
    let logoBase64 = "";
    try {
        const logoPath = path.join(__dirname, '../public/logo.png');
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        }
    } catch (err) {
        console.error("Error reading logo file:", err.message);
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @page { size: 1123px 794px; margin: 0; }
            body { margin: 0; padding: 0; background: ${currentTheme.bg}; font-family: 'Helvetica', 'Arial', sans-serif; -webkit-print-color-adjust: exact; color: ${currentTheme.text}; }
            .cert-page { width: 1123px; height: 794px; background: ${currentTheme.bg}; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .cert-body { width: 100%; height: 100%; position: relative; padding: 60px; box-sizing: border-box; border: 24px solid ${themeKey === 'midnight' ? '#1e293b' : 'white'}; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; }
            
            .bg-decoration { position: absolute; inset: 0; opacity: 0.03; pointer-events: none; background-image: radial-gradient(circle at 2px 2px, ${currentTheme.text} 1px, transparent 0); background-size: 40px 40px; }
            
            .corner { position: absolute; width: 120px; height: 120px; opacity: 0.2; border-color: ${currentTheme.border}; }
            .corner-tl { top: 0; left: 0; border-top: 8px solid; border-left: 8px solid; }
            .corner-tr { top: 0; right: 0; border-top: 8px solid; border-right: 8px solid; }
            .corner-bl { bottom: 0; left: 0; border-bottom: 8px solid; border-left: 8px solid; }
            .corner-br { bottom: 0; right: 0; border-bottom: 8px solid; border-right: 8px solid; }

            .border-outer { position: absolute; top: 16px; bottom: 16px; left: 16px; right: 16px; border: 3px solid ${currentTheme.border}; opacity: 0.3; pointer-events: none; }
            .border-inner { position: absolute; top: 32px; bottom: 32px; left: 32px; right: 32px; border: 1px solid ${themeKey === 'midnight' ? '#334155' : '#e5e7eb'}; pointer-events: none; }
            
            .font-serif { font-family: 'Georgia', 'Times New Roman', serif; }
            
            .logo-section { display: flex; flex-direction: column; align-items: center; }
            .logo-img { height: 85px; margin-bottom: 12px; filter: ${themeKey === 'midnight' ? 'brightness(2)' : 'none'}; }
            .tagline { font-size: 11px; letter-spacing: 0.5em; text-transform: uppercase; color: #9ca3af; font-weight: bold; font-style: italic; margin: 0; }
            .gold-line { width: 224px; height: 1.5px; background: ${currentTheme.line}; margin-top: 32px; }
            
            .heading-main { font-size: 84px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 24px; margin-bottom: 0; line-height: 1; }
            .heading-sub { font-size: 24px; letter-spacing: 0.6em; text-transform: uppercase; color: ${currentTheme.accent}; font-weight: 600; margin-top: 16px; }
            
            .presented-text { font-size: 16px; letter-spacing: 0.4em; color: #9ca3af; font-weight: bold; text-transform: uppercase; margin-top: 0; }
            .student-name { font-size: 76px; font-weight: bold; font-style: italic; margin-top: 24px; margin-bottom: 16px; line-height: 1; }
            .desc-text { font-size: 24px; color: ${themeKey === 'midnight' ? '#cbd5e1' : '#4b5563'}; font-style: italic; line-height: 1.6; max-width: 900px; margin: 0 auto; }
            .college-name { font-weight: bold; color: ${themeKey === 'midnight' ? '#f8fafc' : '#111827'}; font-style: normal; text-transform: uppercase; letter-spacing: 0.05em; }
            .workshop-name { display: block; margin-top: 12px; font-size: 34px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-style: normal; }
            .duration-text { font-size: 20px; color: #6b7280; margin-top: 24px; }
            .date-highlight { font-weight: bold; color: ${themeKey === 'midnight' ? '#f8fafc' : '#1f2937'}; text-decoration: underline; text-decoration-color: ${currentTheme.primary}; text-decoration-thickness: 2px; text-underline-offset: 8px; }
            
            .footer-row { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 64px 8px 64px; box-sizing: border-box; }
            .qr-id-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }
            .qr-box { padding: 8px; border: 1px solid ${themeKey === 'midnight' ? '#334155' : '#f3f4f6'}; background: ${themeKey === 'midnight' ? '#1f2937' : 'white'}; }
            .id-label { font-size: 10px; color: #9ca3af; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; }
            .id-value { font-size: 12px; font-family: monospace; font-weight: bold; }
            
            .seal-col { position: relative; margin-bottom: 8px; }
            .seal-outer { width: 140px; height: 140px; border-radius: 50%; border: 6px solid ${currentTheme.border}; border-opacity: 0.2; display: flex; align-items: center; justify-content: center; position: relative; }
            .seal-bg { position: absolute; inset: 0; background: ${currentTheme.sealBg}; border-radius: 50%; }
            .seal-text { z-index: 10; font-size: 11px; font-weight: 900; color: ${currentTheme.accent}; text-align: center; text-transform: uppercase; line-height: 1.2; letter-spacing: -0.02em; }
            .seal-dashed { position: absolute; top: 8px; bottom: 8px; left: 8px; right: 8px; border: 1px dashed ${currentTheme.border}; opacity: 0.3; border-radius: 50%; }
            
            .sign-col { display: flex; flex-direction: column; align-items: center; }
            .sign-name-hand { font-size: 48px; font-style: italic; margin-bottom: 4px; line-height: 1; }
            .sign-line { height: 2px; width: 224px; background: ${themeKey === 'midnight' ? '#334155' : '#e5e7eb'}; margin-bottom: 12px; }
            .sign-name-print { font-size: 15px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; }
            .sign-title { font-size: 10px; font-weight: bold; letter-spacing: 0.2em; color: #9ca3af; text-transform: uppercase; margin-top: 4px; }
            
            .website-footer { position: absolute; bottom: 24px; left: 0; right: 0; font-size: 11px; letter-spacing: 0.6em; text-transform: uppercase; color: #9ca3af; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="cert-page">
            <div class="cert-body">
                <div class="bg-decoration"></div>
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>
                <div class="border-outer"></div>
                <div class="border-inner"></div>
                
                <div class="logo-section">
                    <img src="${logoBase64}" alt="Logo" class="logo-img" id="logo" />
                    <p class="tagline">"we are here to Make IT"</p>
                </div>

                <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                    <h1 class="heading-main font-serif">Certificate</h1>
                    <p class="heading-sub">of Completion</p>
                    <div class="gold-line"></div>
                </div>

                <div style="width: 100%;">
                    <p class="presented-text">PROUDLY PRESENTED TO</p>
                    <h3 class="student-name font-serif">${userData.name.toUpperCase()}</h3>
                    <p class="desc-text">
                        A student of <span class="college-name">${userData.college}</span> has successfully completed an Internship in 
                        <span class="workshop-name">${userData.workshop}</span>
                    </p>
                    <p class="duration-text">
                        from <span class="date-highlight">${userData.startDate}</span> to <span class="date-highlight">${userData.endDate}</span>
                    </p>
                </div>

                <div class="footer-row">
                    <div class="qr-id-col">
                        <div class="qr-box">
                            <img src="${qrCodeDataUrl}" width="95" height="95" id="qrcode" />
                        </div>
                        <div style="text-align: center">
                            <p class="id-label">Certificate ID</p>
                            <p class="id-value">${certificateId}</p>
                        </div>
                    </div>

                    <div class="seal-col">
                        <div class="seal-outer">
                            <div class="seal-bg"></div>
                            <div class="seal-text">OFFICIAL<br/>TECHFORGE<br/>VERIFIED SEAL</div>
                            <div class="seal-dashed"></div>
                        </div>
                    </div>

                    <div class="sign-col">
                        <p class="sign-name-hand font-serif">Hariprasad S</p>
                        <div class="sign-line"></div>
                        <p class="sign-name-print">Hariprasad S</p>
                        <p class="sign-title">Founder & CEO</p>
                    </div>
                </div>

                <div class="website-footer">www.techforgesolutions.com</div>
            </div>
        </div>
    </body>
    </html>
    `;

    console.log("HTML Rendered");

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
        
        // No network dependencies, but still wait for local render
        await page.setContent(htmlContent, { 
            waitUntil: ['load', 'domcontentloaded'],
            timeout: 30000 
        });

        // Verify images are loaded
        const imagesLoaded = await page.evaluate(async () => {
            const imgs = Array.from(document.querySelectorAll('img'));
            const promises = imgs.map(img => {
                if (img.complete) return Promise.resolve(true);
                return new Promise(resolve => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                });
            });
            return Promise.all(promises);
        });
        console.log("Images Loaded:", imagesLoaded.every(v => v) ? "Yes" : "Some failed");

        const pdfPath = path.join(__dirname, '../public/certificates', `${certificateId}.pdf`);
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            landscape: true,
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        const stats = fs.statSync(pdfPath);
        console.log("PDF Generated Successfully");
        console.log("PDF Size:", stats.size);

        if (stats.size < 50000) {
            throw new Error(`PDF generation failed - file size too small (${stats.size} bytes)`);
        }

        return `/certificates/${certificateId}.pdf`;
    } catch (error) {
        console.error("PDF Generation Failed:", error.message);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = { generateCertificate };