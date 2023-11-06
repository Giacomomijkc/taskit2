const session = require('express-session');
const express = require('express');
const passport = require('passport');
const google = express.Router();
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/UserModel')
const transporter = require('../config/emailConfig')
require('dotenv').config();


google.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
      done(err, user);
    });
  });
  

  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: '/auth/google/callback', // L'URL di reindirizzamento che hai configurato in Google Developers Console
}, (accessToken, refreshToken, profile, done) => {
    // Funzione di callback per la strategia di Google. Qui puoi creare o cercare un utente nel tuo database
    // basato su `profile` e gestire la registrazione o il login.

    const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    console.log(userEmail);

    if (!userEmail) {
        return done(new Error('Email not found in Google profile'), null);
    }

    UserModel.findOne({ email: userEmail })
        .then(user => {
            if (user) {
                console.log('Utente già registrato. Effettua il login.');
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                console.log(token)
                user.token = token;
                return done(null, user, { token, newUser: false }); // Indica che l'utente non è nuovo
            } else {
                // Utente non registrato, crea un nuovo account
                console.log('Utente non registrato. Crea un nuovo account.');
                const newUser = new UserModel({
                    method: 'google',
                    avatar: profile.photos[0].value,
                    nickname: profile.displayName,
                    email: userEmail,
                    verified: true,
                });
                newUser.save()
                    .then(savedUser => {
                        console.log('Nuovo utente registrato.');

                        // Invia l'email di benvenuto solo per i nuovi utenti
                        const mailOptions = {
                            from: 'TASKIT',
                            to: userEmail,
                            subject: 'Welcome on Board',
                            text: 'Thank you for having subscribed to our service!',
                        };
                        
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('Errore nell\'invio dell\'email di benvenuto:', error);
                            } else {
                                console.log('Email di benvenuto inviata:', info.response);
                            }
                        });

                        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                        savedUser.token = token;
                        return done(null, savedUser, { token, newUser: true }); // Indica che l'utente è nuovo
                    });
            }
        })
        .catch(err => {
            return done(err);
        });
}));


google.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

google.get('/auth/google/callback',
    passport.authenticate('google', {
        //successRedirect: 'http://localhost:3000/auth/success', // La pagina a cui reindirizzare dopo l'autenticazione
        failureRedirect: 'http://localhost:3000/auth/fail', // La pagina a cui reindirizzare in caso di errore
    }), (req, res) => {
        // Redirect to the frontend with the token
        res.redirect(`http://localhost:3000/auth/success?token=${req.user.token}`);
    }
);

module.exports = google;