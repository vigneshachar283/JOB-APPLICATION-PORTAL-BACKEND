const express= require('express');

const User=require('../model/user');

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

require("dotenv").config();


const registerUser=async(req,res)=>{

    const {name,email,password}=req.body;

    try{
        const userexists=await User.findOne({email});

        if(userexists){
            return res.status(400).json({message:"user already exists"});
            
        }

        const hashedpassword=await bcrypt.hash(password,10);

        const newUser =new User({
            name:name,
            email:email,
            password:hashedpassword
        })

        await newUser.save();

        res.status(201).json({message:"user registered successfully"});


    }catch(err){
        res.status(500).json({message:"server error",error:err.message});
    }
}


const loginUser = async(req,res)=>{
try{
    const {email , password}=req.body;
    const userExits= await User.findOne({email})

    if(!userExits){
        res.status(401).send("User doesnot exists")
        return
    }
    const login = await bcrypt.compare(password,userExits.password)

    if(login)
    {
const token = jwt.sign(
    { userId: userExits._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);
    

    res.status(200).json({
        "message":"login succesful",
        "token":token
    })
}
}

catch(err)
{
     res.status(500).json({
        "message":" Internal server Error",
        error:err.message
    })
}
}

module.exports={registerUser,loginUser}
