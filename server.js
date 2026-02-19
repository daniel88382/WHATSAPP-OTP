//const express = require("express");
//const axios = require("axios");
//const cors = require("cors");
//const cron = require("node-cron");

//const app = express();

//app.use(express.json());
//app.use(cors());

//const licenseNumber = "73468001020";
//const apiKey = "3aDn2dXWszGFj4CoQOqB8LAey";

//let users = [];


///* =========================================
//   🔥 ALWAYS use verification_code template
//========================================= */

//async function sendWhatsApp(phone, message) {

//    if (!phone.startsWith("91")) {
//        phone = "91" + phone;
//    }

//    const url =
//        `https://web.chatinfy.in/api/sendtemplate.php?` +
//        `LicenseNumber=${licenseNumber}&` +
//        `APIKey=${apiKey}&` +
//        `Contact=${phone}&` +
//        `Template=verification_code&` +   // 🔥 IMPORTANT
//        `Param=${encodeURIComponent(message)}&` +
//        `URLParam=${encodeURIComponent(message)}`;

//    const res = await axios.get(url);

//    console.log("ChatInfy:", res.data);
//}


///* ================= OTP ================= */

//app.post("/send-otp", async (req, res) => {

//    const { phone, otp } = req.body;

//    await sendWhatsApp(phone, otp);

//    res.json({ success: true });
//});


///* ================= SAVE USER ================= */

//app.post("/save-user", (req, res) => {

//    let phone = req.body.phone;

//    if (!phone.startsWith("91")) phone = "91" + phone;

//    if (!users.includes(phone)) {
//        users.push(phone);
//        console.log("User added:", phone);
//    }

//    res.json({ success: true });
//});


///* ================= ALERT ================= */

//async function processUsers() {

//    if (users.length === 0) return;

//    let message =
//        `Greetings from GoldPE ✨
//Gold price update available.
//Open app to check prediction.`;

//    for (let phone of users) {
//        await sendWhatsApp(phone, message);
//    }

//    console.log("All users notified ✅");
//}


///* 🔥 every 1 minute test */
//cron.schedule("* * * * *", processUsers);


///* START */
//app.listen(3000, () => {
//    console.log("Server running on port 3000");
//});


//const express = require("express");
//const axios = require("axios");
//const cors = require("cors");

//const app = express();
//app.use(express.json());
//app.use(cors());

///*
//================================
//SEND OTP WHATSAPP
//================================
//*/
//app.post("/send-otp", async (req, res) => {

//    const { phone, otp } = req.body;

//    if (!phone || !otp)
//        return res.status(400).json({ error: "Phone and OTP required" });

//    try {

//        const message = `Your GoldPE verification OTP is ${otp}. Do not share this code.`;

//        const url = `https://web.chatinfy.in/api/sendtextmessage.php?LicenseNumber=73468001020&APIKey=SgsbD8ptMLWHQCdHmKx1RBYqz&Contact=91${phone}&Message=${encodeURIComponent(message)}`;

//        const response = await axios.get(url);

//        console.log("WhatsApp Response:", response.data);

//        res.json({
//            success: true,
//            chatinfy: response.data
//        });

//    } catch (err) {
//        console.log(err.message);
//        res.status(500).json({ error: "Failed to send WhatsApp OTP" });
//    }
//});

///*
//================================
//SERVER START
//================================
//*/
//app.listen(3000, "0.0.0.0", () =>
//    console.log("Server running on http://0.0.0.0:3000")
//);










//const express = require("express");
//const axios = require("axios");
//const cron = require("node-cron");

//const app = express();

///* ---------------- CONFIG ---------------- */
//const LICENSE = "73468001020";
//const APIKEY = "KfQPuWXtiEOUTdz6qRZnlDAbV";
//const PHONE = "918838272952"; // your number

//let lastPrice22 = null;

///* ---------------- DATE FORMAT ---------------- */
//function formatDateTime() {
//    const now = new Date();

//    const date = now.toLocaleDateString("en-GB");
//    const time = now.toLocaleTimeString("en-GB", { hour12: false });

//    return `${date} ${time}`; // space instead of comma
//}


///* ---------------- SEND WHATSAPP ---------------- */
//async function sendWhatsApp(template, price18, price22, price24) {

//    // template decide trend text
//    const trendText = template === "newtemp" ? "RISE 📈" : "FALL 📉";

//    const url =
//        `https://web.chatinfy.in/api/sendtemplate.php?LicenseNumber=${LICENSE}` +
//        `&APIKey=${APIKEY}` +
//        `&Contact=${PHONE}` +
//        `&Template=${template}` +
//        `&Param=${formatDateTime()},${trendText},${price18},${price22},${price24}`;

//    try {
//        const response = await axios.get(url);
//        console.log("WhatsApp Response:", JSON.stringify(response.data, null, 2));
//    } catch (err) {
//        console.log("WhatsApp Error:", err.message);
//    }
//}

///* ---------------- CHECK GOLD PRICE ---------------- */
//async function checkGoldAndSend() {

//    try {
//        console.log("Checking gold...");

//        const res = await axios.get("https://backend-2zvk.onrender.com/predict");
//        const data = res.data;

//        const price18 = data.today["18k"];
//        const price22 = data.today["22k"];
//        const price24 = data.today["24k"];

//        console.log("Current 22k:", price22);

//        // first run just store
//        if (lastPrice22 === null) {
//            lastPrice22 = price22;
//            console.log("First run saved. No message.");
//            return;
//        }

//        let template = null;

//        if (price22 > lastPrice22) {
//            template = "newtemp";      // increase template
//            console.log("Price Increased 📈");
//        }
//        else if (price22 < lastPrice22) {
//            template = "newtemp2";     // decrease template
//            console.log("Price Decreased 📉");
//        }
//        else {
//            console.log("No change");
//            return;
//        }

//        lastPrice22 = price22;

//        await sendWhatsApp(template, price18, price22, price24);

//    } catch (err) {
//        console.log("Gold API Error:", err.message);
//    }
//}

///* ---------------- MANUAL TEST ---------------- */
//app.get("/test", async (req, res) => {
//    await checkGoldAndSend();
//    res.send("Checked now");
//});

///* ---------------- AUTO EVERY 5 MIN ---------------- */
//cron.schedule("*/5 * * * *", () => {
//    checkGoldAndSend();
//});

///* ---------------- SERVER ---------------- */
//app.listen(3000, () => console.log("Server running on port 3000"));






//const express = require("express");
//const axios = require("axios");
//const cron = require("node-cron");

//const app = express();
//app.use(express.json());

///* CONFIG */
//const LICENSE = "73468001020";
//const APIKEY = "KfQPuWXtiEOUTdz6qRZnlDAbV";

///* MEMORY DATABASE */
//const otpStore = {};
//const subscribers = new Set();
//let lastPrice22 = null;

///* PHONE FORMAT */
//function normalizePhone(phone) {
//    phone = phone.replace(/\D/g, "");
//    if (phone.length === 10) phone = "91" + phone;
//    return phone;
//}

///* SEND WHATSAPP OTP */
//async function sendOtpWhatsapp(phone, otp) {

//    const paramValue = `dani,suresh,kavin,${otp}`;
//    const encodedParam = encodeURIComponent(paramValue);

//    const url =
//        `https://web.chatinfy.in/api/sendtemplate.php?` +
//        `LicenseNumber=${LICENSE}&APIKey=${APIKEY}&Contact=${phone}` +
//        `&Template=newotptemp&Param=${encodedParam}&URLParam=${otp}`;

//    try {
//        const res = await axios.get(url);
//        console.log("WA:", res.data);
//    } catch (e) {
//        console.log("WA ERROR:", e.message);
//    }
//}

///* SEND OTP */
//app.post("/send-otp", async (req, res) => {

//    const phone = normalizePhone(req.body.phone);

//    const otp = Math.floor(100000 + Math.random() * 900000);

//    otpStore[phone] = otp;

//    console.log("OTP SENT:", phone, otp);

//    await sendOtpWhatsapp(phone, otp);

//    res.json({ success: true });
//});

///* VERIFY OTP */
//app.post("/verify-otp", (req, res) => {

//    const phone = normalizePhone(req.body.phone);
//    const otp = req.body.otp;

//    if (otpStore[phone] && otpStore[phone].toString() === otp.toString()) {

//        delete otpStore[phone];
//        subscribers.add(phone);

//        console.log("VERIFIED:", phone);

//        res.json({ success: true });
//    } else {
//        res.json({ success: false });
//    }
//});

///* GOLD ALERT */
//async function sendGold(phone, trend, p18, p22, p24) {

//    const params = encodeURIComponent(
//        `${new Date().toLocaleString("en-GB")},${trend},${p18},${p22},${p24}`
//    );

//    const template = trend === "UP" ? "newtemp" : "newtemp2";

//    const url =
//        `https://web.chatinfy.in/api/sendtemplate.php?LicenseNumber=${LICENSE}` +
//        `&APIKey=${APIKEY}&Contact=${phone}&Template=${template}&Param=${params}`;

//    await axios.get(url);
//}

//async function checkGold() {

//    try {
//        const res = await axios.get("https://backend-2zvk.onrender.com/predict");
//        const data = res.data.today;

//        const p18 = data["18k"];
//        const p22 = data["22k"];
//        const p24 = data["24k"];

//        if (lastPrice22 === null) {
//            lastPrice22 = p22;
//            return;
//        }

//        let trend = null;

//        if (p22 > lastPrice22) trend = "UP";
//        else if (p22 < lastPrice22) trend = "DOWN";
//        else return;

//        lastPrice22 = p22;

//        for (const phone of subscribers) {
//            await sendGold(phone, trend, p18, p22, p24);
//        }

//        console.log("Gold Alert Sent:", trend);

//    } catch (e) {
//        console.log("Gold API error:", e.message);
//    }
//}

//cron.schedule("*/5 * * * *", checkGold);

//app.listen(3000, "0.0.0.0", () =>
//    console.log("SERVER RUNNING ON PORT 3000")
//);








//const express = require("express");
//const axios = require("axios");
//const cron = require("node-cron");

//const app = express();
//app.use(express.json());

///* CONFIG */
//const LICENSE = "73468001020";
//const APIKEY = "KfQPuWXtiEOUTdz6qRZnlDAbV";

///* MEMORY DATABASE */
//const otpStore = {};
//const subscribers = new Set();
//let lastPrice22 = null;

///* PHONE FORMAT */
//function normalizePhone(phone) {
//    phone = phone.replace(/\D/g, "");
//    if (phone.length === 10) phone = "91" + phone;
//    return phone;
//}

///* SEND WHATSAPP OTP */
//async function sendOtpWhatsapp(phone, otp) {

//    const paramValue = `Verification,GoldPE,WhatsApp,${otp}`;
//    const encodedParam = encodeURIComponent(paramValue);

//    const url =
//        `https://web.chatinfy.in/api/sendtemplate.php?` +
//        `LicenseNumber=${LICENSE}&APIKey=${APIKEY}&Contact=${phone}` +
//        `&Template=newotptemp&Param=${encodedParam}&URLParam=${otp}`;

//    try {
//        const res = await axios.get(url);
//        console.log("WA:", res.data);
//    } catch (e) {
//        console.log("WA ERROR:", e.message);
//    }
//}

///* SEND OTP */
//app.post("/send-otp", async (req, res) => {

//    const phone = normalizePhone(req.body.phone);

//    const otp = Math.floor(100000 + Math.random() * 900000);

//    otpStore[phone] = otp;

//    console.log("OTP SENT:", phone, otp);

//    await sendOtpWhatsapp(phone, otp);

//    res.json({ success: true });
//});

///* VERIFY OTP */
//app.post("/verify-otp", (req, res) => {

//    const phone = normalizePhone(req.body.phone);
//    const otp = req.body.otp;

//    if (otpStore[phone] && otpStore[phone].toString() === otp.toString()) {

//        delete otpStore[phone];
//        subscribers.add(phone);

//        console.log("VERIFIED:", phone);

//        res.json({ success: true });
//    } else {
//        res.json({ success: false });
//    }
//});

///* =====================================================
//                GOLD ALERT WHATSAPP
//===================================================== */

//async function sendGoldWhatsapp(phone, trend, p18, p22, p24) {

//    const template = trend === "UP" ? "newtemp" : "newtemp2";

//    // SAFE DATE FORMAT (Meta Approved)
//    const now = new Date();
//    const date =
//        now.getDate() + " " +
//        now.toLocaleString('en-US', { month: 'short' }) + " " +
//        now.getFullYear() + " " +
//        now.getHours() + ":" +
//        now.getMinutes();

//    // SAFE TEXT (NO EMOJI)
//    const trendText = trend === "UP" ? "RISE" : "FALL";

//    const paramString = `${date},${trendText},${p18},${p22},${p24}`;

//    const url =
//        `https://web.chatinfy.in/api/sendtemplate.php?` +
//        `LicenseNumber=${LICENSE}&APIKey=${APIKEY}&Contact=${phone}` +
//        `&Template=${template}&Param=${encodeURIComponent(paramString)}`;

//    try {
//        const res = await axios.get(url);
//        console.log("GOLD WA:", phone, trend, res.data);
//    } catch (e) {
//        console.log("GOLD ERROR:", e.message);
//    }
//}


///* ================= CHECK GOLD ================= */

//async function checkGold() {

//    try {

//        const res = await axios.get("https://backend-2zvk.onrender.com/predict");
//        const data = res.data.today;

//        // force decimal (Meta requirement)
//        const p18 = Number(data["18k"]).toFixed(2);
//        const p22 = Number(data["22k"]).toFixed(2);
//        const p24 = Number(data["24k"]).toFixed(2);

//        console.log("Current 22K:", p22);

//        // first run store only
//        if (lastPrice22 === null) {
//            lastPrice22 = p22;
//            console.log("First run skip");
//            return;
//        }

//        let trend = null;

//        if (p22 > lastPrice22) trend = "UP";
//        else if (p22 < lastPrice22) trend = "DOWN";
//        else return;

//        lastPrice22 = p22;

//        // send to all verified users
//        for (const phone of subscribers) {
//            await sendGoldWhatsapp(phone, trend, p18, p22, p24);
//        }

//        console.log("Gold Alert Sent:", trend);

//    } catch (e) {
//        console.log("Gold API ERROR:", e.message);
//    }
//}

///* ================= CRON EVERY 5 MIN ================= */

//// Morning 9 AM IST
//cron.schedule("0 9 * * *", checkGold, {
//    timezone: "Asia/Kolkata"
//});

//// Evening 6 PM IST
//cron.schedule("0 18 * * *", checkGold, {
//    timezone: "Asia/Kolkata"
//});


///* ================= TEST ROUTE ================= */

//app.get("/test", async (req, res) => {
//    await checkGold();
//    res.send("checked");
//});

///* ================= SERVER ================= */

//const PORT = process.env.PORT || 3000;

//app.listen(PORT, "0.0.0.0", () =>
//    console.log("SERVER RUNNING ON PORT", PORT)
//);




const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");

const app = express();
app.use(express.json());

/* CONFIG */
const LICENSE = "73468001020";
const APIKEY = "KfQPuWXtiEOUTdz6qRZnlDAbV";

/* ================= PRICE MEMORY FIX ================= */

const PRICE_FILE = "lastprice.json";

function loadLastPrice() {
    try {
        const data = fs.readFileSync(PRICE_FILE);
        return JSON.parse(data).price;
    } catch {
        return null;
    }
}

function saveLastPrice(price) {
    fs.writeFileSync(PRICE_FILE, JSON.stringify({ price }));
}

/* MEMORY DATABASE */
const otpStore = {};
const subscribers = new Set();
let lastPrice22 = loadLastPrice();

/* PHONE FORMAT */
function normalizePhone(phone) {
    phone = phone.replace(/\D/g, "");
    if (phone.length === 10) phone = "91" + phone;
    return phone;
}

/* SEND WHATSAPP OTP */
async function sendOtpWhatsapp(phone, otp) {

    const paramValue = `Verification,GoldPE,WhatsApp,${otp}`;
    const encodedParam = encodeURIComponent(paramValue);

    const url =
        `https://web.chatinfy.in/api/sendtemplate.php?` +
        `LicenseNumber=${LICENSE}&APIKey=${APIKEY}&Contact=${phone}` +
        `&Template=newotptemp&Param=${encodedParam}&URLParam=${otp}`;

    try {
        const res = await axios.get(url);
        console.log("WA OTP:", res.data);
    } catch (e) {
        console.log("WA ERROR:", e.message);
    }
}

/* SEND OTP */
app.post("/send-otp", async (req, res) => {

    const phone = normalizePhone(req.body.phone);
    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[phone] = otp;

    console.log("OTP SENT:", phone, otp);

    await sendOtpWhatsapp(phone, otp);

    res.json({ success: true });
});

/* VERIFY OTP */
app.post("/verify-otp", (req, res) => {

    const phone = normalizePhone(req.body.phone);
    const otp = req.body.otp;

    if (otpStore[phone] && otpStore[phone].toString() === otp.toString()) {

        delete otpStore[phone];
        subscribers.add(phone);

        console.log("VERIFIED:", phone);
        res.json({ success: true });

    } else {
        res.json({ success: false });
    }
});

/* ================= GOLD ALERT ================= */

async function sendGoldWhatsapp(phone, trend, p18, p22, p24) {

    const template = trend === "UP" ? "newtemp" : "newtemp2";

    const now = new Date();
    const date =
        now.getDate() + " " +
        now.toLocaleString('en-US', { month: 'short' }) + " " +
        now.getFullYear() + " " +
        now.getHours() + ":" +
        now.getMinutes();

    const trendText = trend === "UP" ? "RISE" : "FALL";

    const paramString = `${date},${trendText},${p18},${p22},${p24}`;

    const url =
        `https://web.chatinfy.in/api/sendtemplate.php?` +
        `LicenseNumber=${LICENSE}&APIKey=${APIKEY}&Contact=${phone}` +
        `&Template=${template}&Param=${encodeURIComponent(paramString)}`;

    try {
        const res = await axios.get(url);
        console.log("GOLD WA:", phone, trend, res.data);
    } catch (e) {
        console.log("GOLD ERROR:", e.message);
    }
}

/* ================= CHECK GOLD ================= */

async function checkGold() {

    try {

        const res = await axios.get("https://backend-2zvk.onrender.com/predict");
        const data = res.data.today;

        const p18 = Number(data["18k"]).toFixed(2);
        const p22 = Number(data["22k"]).toFixed(2);
        const p24 = Number(data["24k"]).toFixed(2);

        console.log("Current 22K:", p22);

        // first run store
        if (lastPrice22 === null) {
            lastPrice22 = p22;
            saveLastPrice(p22);
            console.log("First run stored");
            return;
        }

        let trend = null;

        if (p22 > lastPrice22) trend = "UP";
        else if (p22 < lastPrice22) trend = "DOWN";
        else return;

        lastPrice22 = p22;
        saveLastPrice(p22);

        for (const phone of subscribers) {
            await sendGoldWhatsapp(phone, trend, p18, p22, p24);
        }

        console.log("Gold Alert Sent:", trend);

    } catch (e) {
        console.log("Gold API ERROR:", e.message);
    }
}

/* ================= CRON ================= */

// 9 AM IST
cron.schedule("0 9 * * *", checkGold, {
    timezone: "Asia/Kolkata"
});

// 6 PM IST
cron.schedule("0 18 * * *", checkGold, {
    timezone: "Asia/Kolkata"
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () =>
    console.log("SERVER RUNNING ON PORT", PORT)
);


