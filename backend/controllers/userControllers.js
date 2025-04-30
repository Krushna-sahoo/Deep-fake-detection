const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing details",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"User doesn't exist"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            return res.json({
                success:true,
                token,
                user:{name:user.name},
                message:"User Logged in Successfully"
            })
        } else {
            return res.json({
                success:false,
                message:"Invalid credentials"
            })
        }

    }
    catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })
    }
}
module.exports = { registerUser , loginUser};  // Export using CommonJS
