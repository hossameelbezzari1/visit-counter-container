const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const VISITS_FILE = path.join(__dirname, "visits.json");

// File d'attente pour éviter plusieurs écritures simultanées.
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
        console.error(
            "Erreur pendant la lecture de visits.json :",
            error
        );

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

                    <meta
                        name="description"
                        content="Application Node.js conteneurisée et déployée automatiquement sur Azure"
                    >

                    <title>
                        Visit Counter Container - Hossame El Bezzari
                    </title>

                    <style>
                        * {
                            box-sizing: border-box;
                        }

                        html {
                            scroll-behavior: smooth;
                        }

                        body {
                            min-height: 100vh;
                            margin: 0;
                            padding: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow-x: hidden;
                            font-family:
                                Inter,
                                Arial,
                                Helvetica,
                                sans-serif;
                            color: #172033;
                            background:
                                radial-gradient(
                                    circle at 10% 10%,
                                    rgba(5, 150, 105, 0.22),
                                    transparent 35%
                                ),
                                radial-gradient(
                                    circle at 90% 90%,
                                    rgba(6, 182, 212, 0.2),
                                    transparent 35%
                                ),
                                linear-gradient(
                                    135deg,
                                    #ecfdf5 0%,
                                    #ffffff 48%,
                                    #ecfeff 100%
                                );
                        }

                        .background-shape {
                            position: fixed;
                            border-radius: 50%;
                            filter: blur(8px);
                            pointer-events: none;
                            z-index: 0;
                        }

                        .shape-one {
                            width: 230px;
                            height: 230px;
                            top: -70px;
                            left: -70px;
                            background: rgba(16, 185, 129, 0.18);
                        }

                        .shape-two {
                            width: 280px;
                            height: 280px;
                            right: -100px;
                            bottom: -110px;
                            background: rgba(6, 182, 212, 0.16);
                        }

                        main {
                            position: relative;
                            z-index: 1;
                            width: min(640px, 100%);
                            padding: 18px;
                            border: 1px solid rgba(255, 255, 255, 0.8);
                            border-radius: 32px;
                            background: rgba(255, 255, 255, 0.55);
                            backdrop-filter: blur(20px);
                            -webkit-backdrop-filter: blur(20px);
                            box-shadow:
                                0 30px 80px rgba(5, 150, 105, 0.16),
                                inset 0 1px 0 rgba(255, 255, 255, 0.8);
                        }

                        .card {
                            padding: 46px 34px 32px;
                            text-align: center;
                            border-radius: 24px;
                            background: rgba(255, 255, 255, 0.94);
                            box-shadow:
                                0 16px 50px rgba(15, 23, 42, 0.08);
                        }

                        .status {
                            width: fit-content;
                            margin: 0 auto 28px;
                            padding: 9px 15px;
                            display: flex;
                            align-items: center;
                            gap: 9px;
                            border-radius: 999px;
                            font-size: 13px;
                            font-weight: 700;
                            color: #047857;
                            background: #ecfdf5;
                            border: 1px solid #a7f3d0;
                        }

                        .status-dot {
                            width: 9px;
                            height: 9px;
                            border-radius: 50%;
                            background: #10b981;
                            box-shadow:
                                0 0 0 5px rgba(16, 185, 129, 0.13);
                        }

                        .icon-container {
                            width: 78px;
                            height: 78px;
                            margin: 0 auto 22px;
                            display: grid;
                            place-items: center;
                            border-radius: 24px;
                            font-size: 38px;
                            background:
                                linear-gradient(
                                    135deg,
                                    #059669,
                                    #06b6d4
                                );
                            box-shadow:
                                0 16px 30px rgba(5, 150, 105, 0.25);
                            transform: rotate(-4deg);
                        }

                        h1 {
                            margin: 0;
                            font-size: clamp(30px, 6vw, 46px);
                            line-height: 1.1;
                            letter-spacing: -1.5px;
                            color: #0f172a;
                        }

                        .subtitle {
                            max-width: 500px;
                            margin: 15px auto 0;
                            color: #64748b;
                            font-size: 16px;
                            line-height: 1.7;
                        }

                        .counter-container {
                            margin: 34px auto 28px;
                            padding: 28px 20px;
                            border-radius: 24px;
                            background:
                                linear-gradient(
                                    135deg,
                                    #ecfdf5,
                                    #ecfeff
                                );
                            border: 1px solid #a7f3d0;
                        }

                        .counter-label {
                            margin-bottom: 8px;
                            font-size: 13px;
                            font-weight: 800;
                            letter-spacing: 2px;
                            text-transform: uppercase;
                            color: #64748b;
                        }

                        .count {
                            margin: 0;
                            font-size: clamp(68px, 16vw, 112px);
                            font-weight: 900;
                            line-height: 1;
                            letter-spacing: -5px;
                            color: transparent;
                            background:
                                linear-gradient(
                                    135deg,
                                    #047857,
                                    #0891b2
                                );
                            background-clip: text;
                            -webkit-background-clip: text;
                        }

                        .visitor-text {
                            margin-top: 10px;
                            color: #475569;
                            font-size: 15px;
                            font-weight: 600;
                        }

                        .reload-button {
                            width: 100%;
                            padding: 15px 22px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            border: none;
                            border-radius: 16px;
                            cursor: pointer;
                            font-size: 15px;
                            font-weight: 800;
                            color: #ffffff;
                            background:
                                linear-gradient(
                                    135deg,
                                    #059669,
                                    #0891b2
                                );
                            box-shadow:
                                0 14px 25px rgba(5, 150, 105, 0.22);
                            transition:
                                transform 0.2s ease,
                                box-shadow 0.2s ease;
                        }

                        .reload-button:hover {
                            transform: translateY(-2px);
                            box-shadow:
                                0 18px 30px rgba(5, 150, 105, 0.3);
                        }

                        .reload-button:active {
                            transform: translateY(0);
                        }

                        .info-grid {
                            margin-top: 26px;
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 12px;
                        }

                        .info-item {
                            padding: 17px 12px;
                            text-align: left;
                            border-radius: 17px;
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                        }

                        .info-title {
                            margin-bottom: 5px;
                            font-size: 11px;
                            font-weight: 800;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: #94a3b8;
                        }

                        .info-value {
                            font-size: 14px;
                            font-weight: 700;
                            color: #334155;
                        }

                        footer {
                            margin-top: 26px;
                            padding-top: 22px;
                            border-top: 1px solid #e2e8f0;
                            color: #64748b;
                            font-size: 14px;
                            line-height: 1.7;
                        }

                        footer strong {
                            color: #059669;
                        }

                        @media (max-width: 600px) {
                            body {
                                padding: 14px;
                            }

                            main {
                                padding: 10px;
                                border-radius: 25px;
                            }

                            .card {
                                padding: 36px 20px 25px;
                                border-radius: 20px;
                            }

                            .info-grid {
                                grid-template-columns: 1fr;
                            }

                            .count {
                                letter-spacing: -3px;
                            }
                        }
                    </style>
                </head>

                <body>
                    <div class="background-shape shape-one"></div>
                    <div class="background-shape shape-two"></div>

                    <main>
                        <section class="card">
                            <div class="status">
                                <span class="status-dot"></span>
                                Conteneur Docker opérationnel
                            </div>

                            <div class="icon-container">
                                🐳
                            </div>

                            <h1>Compteur de visites</h1>

                            <p class="subtitle">
                                Application Node.js construite dans une image
                                Docker et déployée automatiquement sur Azure.
                            </p>

                            <div class="counter-container">
                                <div class="counter-label">
                                    Nombre de visites
                                </div>

                                <div class="count">
                                    ${count}
                                </div>

                                <div class="visitor-text">
                                    ${
                                        count > 1
                                            ? "visiteurs enregistrés"
                                            : "visiteur enregistré"
                                    }
                                </div>
                            </div>

                            <button
                                class="reload-button"
                                type="button"
                                onclick="window.location.reload()"
                            >
                                <span>↻</span>
                                Actualiser la page
                            </button>

                            <div class="info-grid">
                                <div class="info-item">
                                    <div class="info-title">
                                        Conteneur
                                    </div>

                                    <div class="info-value">
                                        Docker
                                    </div>
                                </div>

                                <div class="info-item">
                                    <div class="info-title">
                                        Registre
                                    </div>

                                    <div class="info-value">
                                        Azure Container Registry
                                    </div>
                                </div>

                                <div class="info-item">
                                    <div class="info-title">
                                        Déploiement
                                    </div>

                                    <div class="info-value">
                                        GitHub Actions
                                    </div>
                                </div>
                            </div>

                            <footer>
                                Application réalisée par
                                <strong>Hossame El Bezzari</strong>
                                <br>

                                Déploiement automatique avec Docker,
                                Azure App Service et GitHub Actions.
                            </footer>
                        </section>
                    </main>
                </body>
            </html>
        `);
    } catch (error) {
        console.error(
            "Erreur pendant la mise à jour du compteur :",
            error
        );

        response.status(500).send(`
            <!DOCTYPE html>
            <html lang="fr">
                <head>
                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >

                    <title>Erreur serveur</title>
                </head>

                <body
                    style="
                        min-height: 100vh;
                        margin: 0;
                        display: grid;
                        place-items: center;
                        padding: 24px;
                        font-family: Arial, sans-serif;
                        background: #f8fafc;
                    "
                >
                    <div
                        style="
                            width: min(500px, 100%);
                            padding: 40px;
                            text-align: center;
                            background: white;
                            border-radius: 20px;
                            box-shadow:
                                0 20px 50px rgba(0, 0, 0, 0.08);
                        "
                    >
                        <h1 style="color: #dc2626;">
                            Erreur interne du serveur
                        </h1>

                        <p style="color: #64748b;">
                            Une erreur est survenue pendant la mise à jour
                            du compteur.
                        </p>
                    </div>
                </body>
            </html>
        `);
    }
});

// Vérifie l'état du conteneur sans augmenter le compteur.
app.get("/health", (request, response) => {
    response.status(200).json({
        status: "ok",
        application: "visit-counter-container",
        author: "Hossame El Bezzari",
        containerized: true,
        technology: "Docker",
    });
});

initializeVisitsFile();


// 0.0.0.0 permet à l'application d'être accessible depuis le conteneur.
app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Visit Counter Container de Hossame El Bezzari démarré sur le port ${PORT}`
    );
});