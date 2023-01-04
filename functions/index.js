const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const crypto = require('crypto');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors({ origin: true }));
admin.initializeApp();

const createUrl = async (req, res) => {
  const db = getFirestore();
  const { originalUrl } = req.body;

  const hash = crypto.createHash('md5').update(originalUrl).digest('hex');
  const shortUrl = hash.slice(0, 7);

  try {
    await db.collection('Shortened-Urls').add({
      shortened_url: shortUrl,
      original_url: originalUrl,
    });

    res.send(shortUrl);
  } catch (error) {
    functions.logger.info(`Error in creating a url ${error}`, {
      structuredData: true,
    });
    res.send(`Error in creating a url ${error}`);
  }
};

const redirectUrl = async (req, res) => {
  const db = getFirestore();
  const { shortUrl } = req.params;

  try {
    const doc = await db
      .collection('Shortened-Urls')
      .where('shortened_url', '==', shortUrl)
      .get();

    let redirectUrl = '';

    doc.forEach((doc) => {
      redirectUrl = doc.data().original_url;
    });

    res.redirect(redirectUrl);
  } catch (error) {
    functions.logger.info(`Error in redirecting to the url ${error}`, {
      structuredData: true,
    });
    res.send(`Error in redirecting to the url ${error}`);
  }
};

app.get('/:shortUrl', redirectUrl);
app.post('/', createUrl);

exports.url = functions.https.onRequest(app);
