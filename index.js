const dns = require("dns").promises;
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

async function getDnsRecords(domain) {
    const types = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV", "PTR"];
    let results = {};

    for (const type of types) {
        try {
            results[type] = await dns.resolve(domain, type);
        } catch (error) {
            results[type] = `No result found`;
        }
    }
    return results;
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/dns-lookup", async (req, res) => {
    const { domain } = req.query;
    if (!domain) return res.status(400).json({ error: "Please provide a domain" });

    try {
        const records = await getDnsRecords(domain);
        res.json({ domain, records });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));