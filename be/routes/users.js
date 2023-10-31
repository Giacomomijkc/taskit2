const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const cloudinary = require ('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');
const verifyToken = require('../middlewares/verifyToken');
const {userBodyParams, validatePostUser} = require('../middlewares/userPostValidation');
const transporter = require('../config/emailConfig')

const UserModel = require('../models/UserModel')
const TaskModel = require('../models/TaskModel')

const user = express.Router()

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
    const {nickname, email} = req.body;

    /*if (!nickname || !email || !password || !avatar) {
        console.log(res)
        return res.status(400).json({
            statusCode: 400,
            message: 'Please fill al the fields'
        });
    }*/

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

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new UserModel({
            nickname: req.body.nickname,
            email: req.body.email,
            password: hashedPassword,
            avatar: req.body.avatar
        })

        const user = await newUser.save();

                // Invia l'email di benvenuto solo se la registrazione è riuscita
                const mailOptions = {
                    from: 'TASKIT',
                    to: req.body.email, // Utilizza l'indirizzo email dell'utente registrato
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

module.exports = user;