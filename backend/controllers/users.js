const usersModel=require("../models/users")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register =(req,res)=>{
    const {firstName,lastName,email,password,role,image,userName,age,speciality}=req.body
    const userDb=new usersModel({
        firstName,lastName,email,password,role,image,userName,age,speciality
    })

    userDb
    .save()
    .then(()=>{
    res.status(201).json({
        success: true,
        message: `Account Created Successfully`,
    })
    })
    .catch((err)=>{
    
    })
}


const Login =(req,res)=>{
    const password=req.body.password
    const email=req.body.email.toLowerCase()
    
    usersModel
    .findOne({email})
    .then((result)=>{
    
    })
    .catch((err)=>{

    })

}