# SmartAssets

Open Source Asset Management software built with NodeJS, Vue, Express, MonogoDB.

API centric asset management providing easy integration with existing tools.

# Requirements
1. MongoDB Database
2. NodeJS Server

# Installation

1. Run `git clone https://github.com/cdgco/SmartAssets.git` to download SmartAssets.
2. Run `npm install` to install dependencies.
3. Edit `db.config.js` with your MongoDB server address.
4. If desired create a `.env` file with your desired port numbers like so:
  ```
  httpPort = 8082
httpsPort = 8443
  ```
5. If desired, add your SSL certificate in `server.js` lines 14 - 15:
```
var options = {
    key: pems['private'],
    cert: pems['cert']
};
```
6. Run `node server.js` to start the server.

# Building from source

SmartAssets is composed of two primary components, the Vue frontend and the Express backend.

The Vue frontend consists of the `src` and `public` folders, and is compiled to the `dist` folder with the entry point `src/main.js`.

To run the Vue development server, run `npm run serve`. By default, the Vue server runs on port 8082.
To configure the Vue server, edit `vue.config.js`.
To compile Vue, run `npm run build`.

The Express backend consists of the `api` folder with the entry point `server.js`. The backend does not need to be compiled.

To run the Express development server, run `node server.js`. By default, the Express server runs on ports 8080 & 8443.
To configure the Vue server, edit `server.js`.


