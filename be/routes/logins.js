const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const UsersModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');

login.post('/login', async (req,res) => {

    const user = await UsersModel.findOne({email: req.body.email});

    if(!user){
        return res.status(404).send({
            statusCode: 404,
            message: 'Email or password not valid'
        });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword){
        return res.status(404).send({
            statusCode: 404,
            message: 'Email or password not valid'
        });
    }

    const token = jwt.sign({
        _id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '24h' });


    return res.header('Authorization', token).status(200).send({
        statusCode: 200,
        message:'Login successfully executed',
        token
    });
})

module.exports = login;