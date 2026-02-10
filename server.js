const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const licenseNumber = "73468001020";
const apiKey = "3aDn2dXWszGFj4CoQOqB8LAey";

app.post("/send-otp", async (req, res) => {

    const { phone, otp } = req.body;

    console.log("Phone:", phone);
    console.log("OTP:", otp);

    try {

        await axios.get(
            `https://web.chatinfy.in/api/sendtemplate.php?` +
            `LicenseNumber=${licenseNumber}&` +
            `APIKey=${apiKey}&` +
            `Contact=${phone}&` +
            `Template=verification_code&` +
            `Param=${otp}&` +
            `URLParam=${otp}`
        );

        res.json({ success: true });

    } catch (err) {
        console.log(err.response?.data || err.message);
        res.status(500).json({ success: false });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
