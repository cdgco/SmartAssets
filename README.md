# SmartAssets

Open Source Asset Management software built with NodeJS, Vue, Express, MonogoDB & Elasticsearch

API centric asset management providing easy integration with existing tools.

# Requirements
1. MongoDB
2. Elasticsearch 7.x
3. NodeJS / NPM

# Installation
1. Install MongoDB and Elasticsearch
2. Run `git clone https://github.com/cdgco/SmartAssets.git` to download SmartAssets.
3. Run `npm install` to install dependencies.
4. Edit `db.config.js` with your MongoDB server details.
5. Edit `elastic.config.js` with your Elasticsearch server details.
6. Copy `.env.example` to `.env` changing the port numbers and API url like so:
  ```
  httpPort = 8082
  httpsPort = 8443
  VUE_APP_API_URL = "http://localhost:8082/api"
  ```
7. If desired, add your SSL certificate in `server.js` lines 14 - 15:
```
  key: pems['private'],
  cert: pems['cert']
```
8. Run `npm run build` to compile the app.
9. Run `node server.js` to start the server.

