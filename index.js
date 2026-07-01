const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const VISITS_FILE = path.join(__dirname, "visits.json");

let updateQueue = Promise.resolve();

function initializeVisitsFile() {
    if (!fs.existsSync(VISITS_FILE)) {
        fs.writeFileSync(
            VISITS_FILE,
            JSON.stringify({ count: 0 }, null, 2),
            "utf8"
        );
    }
}

function readVisits() {
    initializeVisitsFile();

    try {
        const content = fs.readFileSync(VISITS_FILE, "utf8");
        const data = JSON.parse(content);

        return Number.isInteger(data.count) && data.count >= 0
            ? data.count
            : 0;
    } catch (error) {
        console.error("Erreur pendant la lecture de visits.json :", error);
        return 0;
    }
}

function writeVisits(count) {
    fs.writeFileSync(
        VISITS_FILE,
        JSON.stringify({ count }, null, 2),
        "utf8"
    );
}

function incrementVisits() {
    const operation = updateQueue.then(() => {
        const newCount = readVisits() + 1;
        writeVisits(newCount);
        return newCount;
    });

    updateQueue = operation.catch(() => undefined);

    return operation;
}

app.get("/", async (request, response) => {
    try {
        const count = await incrementVisits();

        response.status(200).send(`
            <!DOCTYPE html>
            <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >
                    <title>Compteur de visites conteneurisé</title>
                    <style>
                        * {
                            box-sizing: border-box;
                        }

                        body {
                            min-height: 100vh;
                            margin: 0;
                            display: grid;
                            place-items: center;
                            padding: 24px;
                            font-family: Arial, sans-serif;
                            background:
                                linear-gradient(135deg, #e9f8f2, #ffffff);
                            color: #172033;
                        }

                        main {
                            width: min(600px, 100%);
                            padding: 48px 32px;
                            text-align: center;
                            background: rgba(255, 255, 255, 0.94);
                            border-radius: 24px;
                            box-shadow:
                                0 20px 60px rgba(5, 150, 105, 0.15);
                        }

                        .badge {
                            display: inline-block;
                            margin-bottom: 18px;
                            padding: 8px 14px;
                            border-radius: 999px;
                            background: #d1fae5;
                            color: #047857;
                            font-size: 14px;
                            font-weight: 700;
                        }

                        h1 {
                            margin: 0 0 16px;
                            font-size: clamp(28px, 5vw, 44px);
                        }

                        .count {
                            margin: 24px 0;
                            font-size: clamp(56px, 12vw, 96px);
                            font-weight: 800;
                            color: #059669;
                        }

                        p {
                            margin: 0;
                            color: #5b6475;
                            line-height: 1.6;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <div class="badge">Docker + Azure + GitHub Actions</div>
                        <h1>Compteur de visites</h1>
                        <div class="count">${count}</div>
                        <p>
                            Cette application Node.js est construite comme une
                            image Docker, envoyée vers Azure Container Registry,
                            puis déployée sur Azure App Service.
                        </p>
                    </main>
                </body>
            </html>
        `);
    } catch (error) {
        console.error(
            "Erreur pendant la mise à jour du compteur :",
            error
        );

        response.status(500).send("Erreur interne du serveur.");
    }
});

app.get("/health", (request, response) => {
    response.status(200).json({
        status: "ok",
        application: "visit-counter-container",
        containerized: true,
    });
});

initializeVisitsFile();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Visit Counter Container démarré sur le port ${PORT}`);
});
