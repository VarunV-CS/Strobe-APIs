const user = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "CESTA";

// const {sendMail}  = require('../library/mail'); 

const signup = async(req ,res) =>{
    const {email , password, FirstName, LastName, phoneNumber,} = req.body;
    try{
      const existingUser = await user.findOne({email : email});
      if(existingUser){
        return res.status(400).json({message:"user already exists"});
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt); 
      console.log("paaaaaaaas",hashPassword);
      const result = await user.create({
          FirstName: FirstName,
          LastName: LastName,
          phoneNumber: phoneNumber,
          email:email,
          password:hashPassword
      });
  
      const token = jwt.sign({email: result.email , id : result._id},SECRET_KEY,{ expiresIn: '50m' });
  
      res.status(201).json({user:result,token:token});
    }
    catch(error){
      console.log(error);
      res.status(500).json({message:"fail"});
    }
  }
  

const signin = async(req ,res) =>{
    const {email , password} = req.body;
 try{
    const existingUser = await user.findOne({email : email});
    if(!existingUser){
   return res.status(404).json({message:"user not exist"});
    }

    const matchPassword = await bcrypt.compare(password,existingUser.password);
    if(!matchPassword){
        return res.status(400).json({message:"invalid password"});

    }

  const token = jwt.sign({email: existingUser.email , id : existingUser._id},SECRET_KEY,{ expiresIn: '10m' });


  res.status(201).json({user:existingUser,token:token});
 }
 catch(error){
console.log(error);
res.status(500).json({message:"fail"});
 }
}


const updatePassword = async (req, res) => {
  const { email, password, newPassword } = req.body;

  try {
    const existingUser = await user.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await user.updateOne({ email: email }, { $set:{ password: hashedPassword }});

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateForgotPassword = async (req, res) => {
  try {
    const {password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedPassword = await user.updateOne(
      { _id: req.params._id },
      { $set:{ password: hashedPassword }}
    );

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
      data: updatedPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};



const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    const { _id } = req.params;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const updatedUser = await user.updateOne(
      { _id },
      { $set: updates }
    );

    if (updatedUser.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update User",
      error: error.message,
    });
  }
};





const forgotPassword = async (req, res) => {
    // try {
    //     const { email } = req.body;

        
    //     const User = await user.findOne({ email });

    //     if (!User) {
    //         return res.status(404).json({ message: 'User not found' });
    //     }

    //     const token = jwt.sign({ userId: User._id }, SECRET_KEY, { expiresIn: '3m' });

    //     const mailRes = await sendMail(email);
    //     console.log("MMMMMMMMMMMMM",mailRes)

    //     if (!mailRes.success) {
    //         return res.status(500).json({ message: 'Error sending email' });
    //     }

    //     return res.status(200).json({link:`http://localhost:4200/forgotpassword?token=${token}&_id=${ User._id}`});
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ message: 'Server error' });
    // }
};



module.exports = {signin,signup,updatePassword,updateForgotPassword , updateUser};
