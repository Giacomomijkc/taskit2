const mongoose = require('mongoose');
const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const transporter = require('../config/emailConfig');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel')
const TaskModel = require('../models/TaskModel')

const task = express.Router();

//post di una task
task.post('/tasks/create', verifyToken, async (req, res)=> {

    try {

        const {title, content, author, category, completed, deadLine, urgency} = req.body;

        const userId  = req.user._id;

        existingUser = await UserModel.findById(userId);

        if(!existingUser){
            return res.status(400).send({
                statusCode: 400,
                message: "user not found"
            })
        }

        if(!title || !content || !author || !category || !urgency ){
            return res.status(400).send({
                statusCode: 400,
                message: "required field missing"
            })
        }

        const newTask = new TaskModel({
            title,
            content,
            author: existingUser,
            category,
            deadLine,
            urgency,
            completed: false
        })

        await newTask.save();

        res.status(201).send({
            message: "Task created successfully",
            task: newTask
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error creating the task",
            error: error.message
        });
    }

});

task.get('/tasks/:taskId', verifyToken, async (req, res) => {
    try {

        const authorId = req.user._id;
        const {taskId} = req.params;

        existingAuthor = await UserModel.findById(authorId);

        if(!existingAuthor){
            return res.status(400).send({
                statusCode: 400,
                message: "author not found"
            })
        }


        const task = await TaskModel.findById(taskId)  
        
        res.status(200).json({
            statusCode: 200,
            message: `Task with id ${taskId} fetched successfully`,
            task,
          });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error fetching the task",
            error: error.message
        });
    }
})

//get di tutte le tasks di un utente
task.get('/tasks', verifyToken, async (req, res) =>{
    try {

        const authorId = req.user._id;

        existingAuthor = await UserModel.findById(authorId);

        if(!existingAuthor){
            return res.status(400).send({
                statusCode: 400,
                message: "author not found"
            })
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        
        // Aggiungi qui i filtri
        let filterOptions = {
            author: authorId
        };
    
        if(req.query.urgency) {
            filterOptions.urgency = req.query.urgency;
        }
    
        if(req.query.category) {
            filterOptions.category = req.query.category;
        }
    
        if(req.query.deadline) {
            // Qui puoi aggiungere una logica specifica per filtrare per deadline
            filterOptions.deadline = { $lte: new Date(req.query.deadline) };
        }
    
        const tasks = await TaskModel.find(filterOptions)
                                      .sort({ [sortBy]: order })
                                      .skip((page - 1) * limit)
                                      .limit(limit);
        
        res.status(200).json({
            statusCode: 200,
            message: 'All author tasks fetched successfully',
            numberOfTasks: tasks.length,
            tasks,
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error fetching the tasks",
            error: error.message
        });
    }
})

/*task.post('/tasks/create', verifyToken, async (req, res) =>{
    try {
        const authorId = req.user._id;

        existingAuthor = await UserModel.findById(authorId);

        if(!existingAuthor){
            return res.status(400).send({
                statusCode: 400,
                message: "author not found"
            })
        }
        const {author, title, content, category, deadLine, urgency, completed} = req.body
        const newTask = new TaskModel({
            author: authorId,
            title,
            content,
            category,
            deadLine,
            urgency,
            completed: false
        })

        const task = await TaskModel.save(newTask);

        res.status(200).send({
            statusCode: 200,
            message: 'new Task successfully created',
            task
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message:'Internal Server Error'
        })
    }
})*/

task.delete('/tasks/delete/:taskId', verifyToken, async (req, res) =>{
    try {
        const authorId = req.user._id;
        const {taskId} = req.params

        existingAuthor = await UserModel.findById(authorId);

        if(!existingAuthor){
            return res.status(400).send({
                statusCode: 400,
                message: "author not found"
            })
        }

        existingTask = await TaskModel.findById(taskId);

        if(!existingTask){
            return res.status(400).send({
                statusCode: 400,
                message: "task not found"
            })
        }

        await TaskModel.findByIdAndDelete(taskId);

        res.status(200).send({
            statusCode: 200,
            message: 'task succesfully deleted'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message:'Internal Server Error'
        })
    }
})



module.exports = task;