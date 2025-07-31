import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";


export const signUp =async(req,res)=>{

    try{
    const {name,email,password}=req.body;

    const existEmail=await User.findOne({email});
    if(existEmail){
        return res.status(400).json({message:"email already exists!"});
    }
    if(password.length<6){
        return res.status(400).json({message:"password must be at least 6 characters long!"});
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const user=await User.create({
        name,
        email,
        password:hashedPassword
    })

    const token = await genToken(user._id)

    res.cookie("token", token, {
        httpOnly: true,
        maxAge:7*24*60*60*1000, // 7 days
        sameSite: "strict",
        secure:false
    })  

    return res.status(201).json(user)
}

catch(error){
    return res.status(500).json({message:`sign up error`})
}}




export const Login =async(req,res)=>{

    try{
    const {email,password}=req.body;

    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"email does not exists!"});
    }
    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.status(400).json({message:"incorrect Password"});
    }
   

    const token = await genToken(user._id)

    res.cookie("token", token, {
        httpOnly: true,
        maxAge:7*24*60*60*1000, // 7 days
        sameSite: "strict",
        secure:false
    })  

    return res.status(200).json(user)
}

catch(error){
    return res.status(500).json({message:`login error $(error)`})
}}




export const Logout =async(req,res)=>{
    try{
res.clearCookie("token")
return res.status(200).json({message:"logout successful"})
    }
    catch(error){
return res.status(500).json({message:`logout error $(error)`})  
    }
}