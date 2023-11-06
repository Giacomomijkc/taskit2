const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const cloudinary = require ('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');
const verifyToken = require('../middlewares/verifyToken');
const {userBodyParams, validatePostUser} = require('../middlewares/userPostValidation');
const transporter = require('../config/emailConfig');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel')
const TaskModel = require('../models/TaskModel')

const user = express.Router()

// Funzione per l'invio di email con gestione del token
const sendEmail = async (mailOptions) => {
    try {
        // Controlla se il token di accesso è ancora valido
        const isAccessTokenValid = await oauth2Client.getAccessToken();

        if (!isAccessTokenValid) {
            // Il token di accesso è scaduto, ottieni un nuovo token utilizzando il refresh token
            const tokens = await oauth2Client.refreshAccessToken();
            const newAccessToken = tokens.credentials.access_token;

            // Aggiorna il token di accesso nelle opzioni di autenticazione
            transporter.set('auth', {
                type: 'OAuth2',
                user: 'gcasolo.csisrls@gmail.com',
                clientId: process.env.CLIENT_ID_GOOGLE,
                clientSecret: process.env.CLIENT_SECRET_GOOGLE,
                refreshToken: process.env.REFRESH_TOKEN_GOOGLE,
                accessToken: newAccessToken
            });
        }

        // Invia l'email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email di benvenuto inviata:', info.response);
    } catch (error) {
        console.error('Errore nell\'invio dell\'email di benvenuto:', error);
    }
};

//configurazione cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'taskit',
        format: async (req, file) => {
            if (file.mimetype === 'image/jpeg') {
                return 'jpg';
            } else if (file.mimetype === 'image/png') {
                return 'png';
            } else {
                return 'jpg'; // Default format if not JPG or PNG
            }
        },
        public_id: (req, file) => file.name,
    },
})

const cloudUpload = multer({storage: cloudStorage});

//user post avatar
user.post('/users/cloudUpload', cloudUpload.single('avatar'), async (req,res)=> {
    try {
        res.status(200).json({avatar: req.file.path})
        console.log(req.file.path)
    } catch (error) {
        console.error('File upload failed',error);
        res.status(500).json({error: 'File upload failed'});
    }
})

//user creation

user.post('/users/create', [userBodyParams, validatePostUser], async(req,res) =>{
    const {nickname, email, method} = req.body;

    try {
        const existingUser = await UserModel.findOne({nickname})
        if(existingUser){
            return res.status(400).json({
                statusCode: 400,
                message: `${nickname} already exists`
            })
        }
        const existingEmail = await UserModel.findOne({email})
        if(existingEmail){
            console.log(res.data)
            return res.status(400).json({
                statusCode: 400,
                message:`${email} already exists, try to login`
            })
        }

        if (method === 'local') {
            if (!req.body.password || req.body.password < 7) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Password is required, min 7 characters'
                });
            }
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new UserModel({
            nickname: req.body.nickname,
            email: req.body.email,
            password: hashedPassword,
            avatar: req.body.avatar,
            method: req.body.method,
            verified: false,
        })

        const user = await newUser.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const mailOptionsVerify = {
            from: 'YOUR_EMAIL',
            to: req.body.email,
            subject: 'Verify Your Email Address',
            text: `Click on the following link to verify your email: ${process.env.APP_URL}/users/verify?token=${token}`,
        };
        transporter.sendMail(mailOptionsVerify, (error, info) => {
            if (error) {
                console.log('Error sending verification email:', error);
            } else {
                console.log('Verification email sent:', info.response);
            }
        });

        // Invia l'email di benvenuto solo se la registrazione è riuscita
        const mailOptionsWelcome = {
            from: 'TASKIT',
            to: req.body.email, // Utilizza l'indirizzo email dell'utente registrato
            subject: 'Welcome on Board',
            text: 'Thank you for having subscribed to our service!',
        };
        
        transporter.sendMail(mailOptionsWelcome, (error, info) => {
            if (error) {
                console.log('Errore nell\'invio dell\'email di benvenuto:', error);
            } else {
                console.log('Email di benvenuto inviata:', info.response);
            }
        });

        console.log(res.data)
        res.status(201).send({
            statusCode: 201,
            message: 'new user succesfully created',
            payload: user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
})

//metodo GAPI registrazione con google
user.post('/users/google', async (req, res) => {
    try {
        const tokenObject = req.body;

    let decodedToken;

    try {
        decodedToken = jwt_decode(tokenObject.token);
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }

    const existingUser = await UserModel.findOne({email: decodedToken.email});

    if(!existingUser){
        console.log('decodedToken', decodedToken);
        const newUser = new UserModel({
            nickname: decodedToken.given_name,
            email: decodedToken.email,
            avatar: decodedToken.picture,
            method: 'google',
            verified: true
        })
        const user = await newUser.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '24h' })
        return res.header('Authorization', token).status(200).send({
            statusCode: 200,
            message: 'new user registered',
            payload: token
        })
    } else {
        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, { expiresIn: '24h' })
        return res.header('Authorization', token).status(200).send({
            statusCode: 200,
            message: 'user already registered logged in',
            payload: token
        })
    }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }
    
    
  
    // Cerca l'utente nel database
    let user = await UserModel.findOne({ email });
  
    // Se l'utente non esiste, crea un nuovo utente
    if (!user) {
      user = new UserModel({
        nickname,
        email,
        avatar,
        method: 'google',
        verified: true,
      });
  
      user = await user.save();
  
      // Invia una mail di benvenuto
      // ...
    }
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
    res.status(200).send({
      statusCode: 200,
      message: 'User logged in successfully',
      token,
    });
  });
  

user.get('/users/verify', async (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log('Invalid or expired token:', err);
        res.status(400).json({ message: 'Invalid or expired token' });
      } else {
        // Il token è valido, puoi impostare il campo "verified" su "true" per l'utente
        const userId = decoded.userId;
        try {
          const user = await UserModel.findByIdAndUpdate(userId, { verified: true }, { new: true });
          console.log('Email verified for user:', user.email);
          res.status(200).json({ message: 'Email verified successfully' });
        } catch (updateErr) {
          console.log('Error updating user:', updateErr);
          res.status(500).json({ message: 'Error updating user' });
        }
      }
    });
  });
  

user.get('/users/:userId', verifyToken, async (req, res) => {
    const {userId} = req.params;

    try {
        const user = await UserModel.findById(userId);

        if (!user){
            return res.status(404).json({ message: `User with id ${userId} not found` });
        }

        res.status(200).json({
            statusCode: 200,
            message: `User with id ${userId} fetched successfully`,
            user
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error
        });
    }
})

module.exports = user;