const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const nodemailer = require('nodemailer');


const oauth2Client = new OAuth2(
    process.env.CLIENT_ID_GOOGLE,
    process.env.CLIENT_SECRET_GOOGLE,
    'https://developers.google.com/oauthplayground' // Redirect URL
  );
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: 'gcasolo.csisrls@gmail.com',
      clientId: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE,
      refreshToken: process.env.REFRESH_TOKEN_GOOGLE,
      accessToken: process.env.ACCESS_TOKEN_GOOGLE
    },
  });

  module.exports = transporter;