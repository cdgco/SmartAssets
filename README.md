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

# Building from source
SmartAssets is built from source upon install, as well as every time you run `npm run deploy` or `npm run update`

In order to rebuild without running any other actions, run `npm run build`

# Useful Development Resources
* [Postman](https://www.postman.com/)
* [MongoDB Compass](https://www.mongodb.com/products/compass)
* [Kibana](https://www.elastic.co/kibana/)
* [Swagger Editor](https://swagger.io/tools/swagger-editor/)
* [Barcode to PC](https://barcodetopc.com/)
* [Ant Design of Vue Docs](https://www.antdv.com/docs/vue/introduce/)
* [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
* [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
* [OpenAPI Docs](https://swagger.io/docs/specification/about/)