# Piramida AI Server (NodeJS)

## Endpoints
### POST /predict
Input:
{
  "features": [1.23, 0.55, ...]
}

Response:
{
  "prediction": 1,
  "confidence": 0.84
}

## Run local:
node server.js

## Deploy on Render:
- Create new Web Service
- Connect this GitHub repo
- Build command: (leave empty)
- Start command: node server.js
- Runtime: NodeJS
