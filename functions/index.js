const functions = require("firebase-functions");
const { Nuxt } = require("nuxt-start");
const express = require("express");
const app = express();

const config = {
    dev: false,
    buildDir: "nuxt",
    build: {
        publicPath: (process.env.NODE_ENV === 'production' ? "//mpwei-2889f.firebaseapp.com" : "//localhost") + "/assets/"
    }
};
const nuxt = new Nuxt(config);

async function handleRequest(req, res) {
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    await nuxt.ready();
    await nuxt.render(req, res);
}

app.use(handleRequest);
exports.nuxtssr = functions.https.onRequest(app);