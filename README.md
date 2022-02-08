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
3. Copy `.env.example` to `.env` changing the port numbers and API url to match your desired port and installation URL
4. Copy `db.config.example.js` to `db.config.js` editing the database name to your desired database and changing the connection string to match your MongoDB instance.
5. Copy `elastic.config.example.js` to `elastic.config.js` editing the details to match your Elasticsearch instance.
6. If desired, add your SSL certificate in `server.js` lines 14 - 15.
7. Run `npm run deploy` to compile the app.
8. Run `npm run start` to start the server.

# Updating
1. Run `npm run update`

