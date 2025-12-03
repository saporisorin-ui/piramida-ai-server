// server.js

const http = require("http");
const { loadModel, predictForest } = require("./random_forest_predictor");

const model = loadModel("model.json");   // load at startup
console.log("Model loaded. Features:", model.n_features);

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/predict") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                if (!data.features || !Array.isArray(data.features)) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: "Missing features[]" }));
                }

                const result = predictForest(model, data.features);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result));

            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: "Server error", details: err.message }));
            }
        });
    } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Piramida AI Server Running");
    }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`AI Server running on port ${PORT}`);
});
