# SmartAssets

Open Source Asset Management software built with NodeJS, Vue, Express, MonogoDB.

API centric asset management providing easy integration with existing tools.

# Requirements
1. MongoDB
2. Elasticsearch
3. Node / NPM

# Installation

1. Run `git clone https://github.com/cdgco/SmartAssets.git` to download SmartAssets.
2. Run `npm install` to install dependencies.
3. Edit `db.config.js` with your MongoDB server address.
4. If desired create a `.env` file with your desired port numbers like so:
  ```
  httpPort = 8082
  httpsPort = 8443
  VUE_APP_API_URL = "http://localhost:8082/api"
  ```
5. If desired, add your SSL certificate in `server.js` lines 14 - 15:
```
  key: pems['private'],
  cert: pems['cert']
```
6. Run `npm run build` to compile the app.
7. Run `node server.js` to start the server.

