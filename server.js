import express from "express";
import mongoose from "mongoose";
import formidable from "express-formidable";
import fs from 'fs'
import Photomodel from './uplodmodel.js'
import path from 'path'
import usermodules from "./usermodules.js";
import JWT from 'jsonwebtoken';
import cors from 'cors';
const app = express()
const connect = mongoose.connect('mongodb+srv://sabihop56:Mypassword12@cluster0.vfwnugr.mongodb.net/ecommerce?retryWrites=true&w=majority').then(() => { console.log('mongo db is connected 🌮') }).catch(() => { console.log('mongodb cant connected') })

// middelware
app.use(formidable())
app.use(cors())
app.post('/uplodimg', async (req, res) => {
    try {
            const {photo} = req.files
            const { title, description, comments,followers,likes } = req.fields
            const data = fs.readFileSync(photo.path)
            const Photo = new Photomodel({
                title: title,
                description: description,
                comments,
                followers,
                likes,
                photo: {
                    name: photo.originalFilename,
                    data: data,
                    contentType: photo.mimetype
                }
            })

            await Photo.save()

            res.status(200).send({
                sucess: true,
                message: 'file uploded sucessfully',
                Photo
            })
        }
    
     catch (error) {

        console.log(error)
        res.status(500).send({
            sucess: false,
            message: "failed to uplod data",
            error
        })
    }
    })


app.post('/register', async (req, res) => {
    try {
            const {photo} = req.files
            const { name, email, password } = req.fields
            const data = fs.readFileSync(photo.path)


            const token = JWT.sign({ name }, 'secretkey', { expiresIn: '7d' });
            const registeration = new usermodules({
              name,
              email,
              password,
                photo: {
                    name: photo.originalFilename,
                    data: data,
                    contentType: photo.mimetype
                }
            })

            await registeration.save()

            res.status(200).send({
                sucess: true,
                message: 'user sucessfully register',
               registeration,
               token
            })
        }
    
     catch (error) {

        console.log(error)
        res.status(500).send({
            sucess: false,
            message: "failed to uplod data user cant be register",
            error
        })
    }
    })

app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.fields
        const user = await usermodules.findOne({ email, password })
        const token = JWT.sign({ email: user.email }, 'secretkey', { expiresIn: '7d' });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
                token
            })
        }
        res.status(200).send({
            success: true,
            message: 'User logged in successfully',
            user
        })



    } catch (error) {
        console.log(error)
    }
})

app.post('/postcomment/:id', async (req,res)=>{
    try {
        const { text } = req.fields
        const postId = req.params.id
        const post = await Photomodel.findByIdAndUpdate(postId,{
            $push: {
                comments: {
                    text: text,
                    createdAt: new Date()
                }
            }
        })

res.status(200).send({sucess:true,
            message: 'Comment posted successfully',
            post
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Failed to post comment',
            error
        })
    }
})
app.post('/like/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Photomodel.findByIdAndUpdate(
      postId,{
          $inc: {likes:1}
            }); 

    res.send({
      success: true,
      message: 'Post liked',
      totalLikes: updatedPost.likes
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to like post',
      error
    });
  }
});
app.post('/follow/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Photomodel.findByIdAndUpdate(
      postId,{
          $inc: {followers:1}
            }); 

    res.send({
      success: true,
      message: 'Post followed',
      totalLikes: updatedPost.likes
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to followed post',
      error
    });
  }
});

app.get('/getallpost', async (req, res) => {
    try {   
        const posts = await Photomodel.find()
        res.status(200).send({
            success: true,
            message: 'All posts fetched successfully',
            posts
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Failed to fetch posts',
            error
        })
    }   
})

app.listen(3000, () => {
    console.log('server is started sccessfully')
})