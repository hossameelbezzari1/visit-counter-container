# TP2 — Déploiement automatique d'une application conteneurisée sur Azure

## Test local

```powershell
docker build -t visit-counter-container .
docker run --rm -p 3000:3000 visit-counter-container
```

Ouvrir ensuite :

- http://localhost:3000
- http://localhost:3000/health

## Secrets GitHub nécessaires

- `AZURE_CREDENTIALS`
- `ACR_LOGIN_SERVER`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `AZURE_WEBAPP_NAME`

## Port Azure App Service

Dans Azure App Service, ajouter la variable d'environnement :

- Nom : `WEBSITES_PORT`
- Valeur : `3000`
