const mongoose = require('mongoose');
const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const transporter = require('../config/emailConfig');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_SECRET
});

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

task.patch('/tasks/complete/:taskId', verifyToken, async (req, res) =>{
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

        if(existingTask.completed){
            return res.status(400).send({
                statusCode: 400,
                message: "you can't complete an already completed task"
            })
        }

        dataToUpdate = {
            completed: true
        }
        options = {new: true}

        const completedTask = await TaskModel.findByIdAndUpdate(taskId, dataToUpdate, options)

        res.status(201).send({
            statusCode: 200,
            message: `Task with id ${existingTask._id} successfully completed`,
            completedTask
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message:'Internal Server Error'
        })
    }
})

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

//post via AI di una task
/*task.post('/tasks/create/ai', verifyToken, async (req, res) =>{
    try {
        const authorId = req.user._id;
        existingAuthor = await UserModel.findById(authorId);
        if(!existingAuthor){
            return res.status(400).send({
                statusCode: 400,
                message: "author not found"
            })
        }

        const {textTask} = req.body;
        const allTextData = {...textTask, authorId: authorId}

        getTaskPayload()

        async function getTaskPayload(allTextData) {
            if(allTextData){
                try {
                    const messages = [
                        {
                            role: 'system',
                            content: `Sei un assistente di Taskit, 
                                il tuo compito è trasformare il testo ricevuto in un formato json per poterlo poi usare
                                come payload per fare una chiamata di tipo post. 
                                Il testo ricevuto è un oggetto composto da una stringa e da una proprietà authorId.
                                Dalla stringa di testo devi estrarre delle stringhe di valore coerente con le proprietà da riempire della struttura json
                                e usare la stringa della proprietà authorId ricevuta per popolare la proprietà author del json.
                                Questa è la struttura json che devi resituire nel tuo message:
                                {
                                "title": //inserire una parole appropriata in base al testo ricevuto
                                "content": //inserire una parole appropriata in base al testo ricevuto
                                "category": //inserire una parole appropriata in base al testo ricevuto
                                "author": //inserire la stringa presente nella proprietà authorId che ricevi oltre alla stringa di testo
                                "urgency": //inserire una parole appropriata in base al testo ricevuto
                                "completed": //inserire il valore false
                                }`
                        },
                        {
                            role: 'user',
                            content: `${taskData}`
                        }
                    ];
                
                    const openaAiresponse = await openai.chat.completions.create({
                        model: 'gpt-4',
                        messages: messages
                    });

                    console.log(openaAiresponse.choices[0].message);

                    const {payload} = openaAiresponse.choices[0].message
                    
                    try {
                        const {title, content, author, category, completed, deadLine, urgency} = payload;

                        existingUser = await UserModel.findById(author);

                        if(!existingUser){
                            return res.status(400).send({
                                statusCode: 400,
                                message: "user not found"
                            })
                        }

                        const newTask = new TaskModel({
                            title,
                            content,
                            author,
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
                            statusCode: 500,
                            message: 'Internal Server Error'
                        })
                    }
                    
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log('AlltaskData non è presente')
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error'
        })
    }
})*/

// POST via AI to create a task
task.post('/tasks/create/ai', verifyToken, async (req, res) => {
    try {
        const authorId = req.user._id;
        const existingAuthor = await UserModel.findById(authorId);
        if (!existingAuthor) {
            return res.status(400).send({
                statusCode: 400,
                message: "author not found"
            });
        }

        const { textTask } = req.body;

        // Call the function to get the AI response
        console.log(textTask, authorId)
        const taskPayload = await getTaskPayload(textTask, authorId);

        // Extract the properties from the AI-generated task data
        const { title, content, category, urgency, deadLine } = JSON.parse(taskPayload);

        const newTask = new TaskModel({
            title,
            content,
            author: authorId,
            deadLine,
            category,
            urgency,
            completed: false
        });

        await newTask.save();

        res.status(201).send({
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
});

async function getTaskPayload(text, authorId) {
    try {
        const messages = [
            {
                role: 'system',
                content: `Sei un assistente di Taskit, 
                il tuo compito è trasformare il testo ricevuto in un formato json per poterlo poi usare
                come payload per fare una chiamata di tipo post. 
                Il testo ricevuto è un oggetto composto da una stringa e da una proprietà authorId.
                Dalla stringa di testo devi estrarre delle stringhe di valore coerente con le proprietà da riempire della struttura json
                e usare la stringa della proprietà authorId ricevuta per popolare la proprietà author del json.
                Questa è la struttura json che devi resituire nel tuo message:
                {
                "title": //inserire una parola appropriata in base al testo ricevuto
                "content": //inserire una parola appropriata in base al testo ricevuto
                "author": //inserire la stringa presente nella proprietà authorId che ricevi oltre alla stringa di testo
                "deadLine": //inserire valore in formato ISODate("2023-12-19T14:20:00.000Z") di mongoDb solo se presente un riferimento alla scadenza nel testo altrimenti non includere la proprietà
                "category": //inserire una parola appropriata in base al testo ricevuto
                "urgency": //inserire una parola appropriata tra "low", "mid", "high", "extreme" in base al testo ricevuto
                "completed": //inserire il valore false
                }`
            },
            {
                role: 'user',
                content: `${text}, authorId: ${authorId}`
            }
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages
        });

        // Assuming the AI response contains the JSON string
        if(response && response.choices && response.choices.length > 0 && response.choices[0] && response.choices[0].message && response.choices[0].message.content){
            console.log(response.choices[0].message.content)
            return response.choices[0].message.content;
        } else {
            console.log('no message from AI')
        }

    } catch (error) {
        console.error('Error in AI processing:', error);
        throw error;
    }
}




module.exports = task;