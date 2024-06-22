    const usersModel = require("../models/users")
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const { OAuth2Client } = require('google-auth-library');
    const Role=require('../models/role')
    
    const client = new OAuth2Client("562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com");
    const sendSms =require("./twilioService")

    const otpStore = {};
    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    const forgotPassword = async (req, res) => {
        const { email } = req.body;
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    
        const otp = generateOtp();
        otpStore[email] = otp;
    
        await sendSms("+962772341720", `Your OTP for password reset is ${otp}`);
        res.status(200).json({ success: true, message: "OTP sent to your phone number" });
    };
    
    const verifyOtp = (req, res) => {
        const { email, otp } = req.body;
        if (otpStore[email] === otp) {
            delete otpStore[email];
            const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '15m' }); 
            res.status(200).json({ success: true, message: "OTP verified", token });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    };
    
    const resetPassword = async (req, res) => {
        const { token, newPassword } = req.body;
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            const email = decoded.email;
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await usersModel.findOneAndUpdate({ email }, { password: hashedPassword });
    
            res.status(200).json({ success: true, message: "Password reset successfully" });
        } catch (err) {
            res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
    };
    
    const getUserById = (req, res) => {
        const { id } = req.params;

        usersModel
            .findById(id)
            .populate("role")
            .populate("specialist")
            .then((result) => {
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: `User with id => ${id} not found`,
                    });
                }
                res.status(200).json({
                    success: true,
                    message: `User found`,
                    user: result,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: "Server Error",
                    err: err.message,
                });
            });
    };
    const register = async (req, res) => {
        let role = '6664b711c97330a23805e283'; 
        const { firstName, lastName, email, phoneNumber, password, image, userName, age, specialist } = req.body
        if (specialist) {
            role = '66659b79ca3cdb2fe0e92bc9';
        }
        const usersDb = new usersModel({
            firstName, lastName, email, phoneNumber, password, image, role, userName, age, specialist
        })
        usersDb.save()
            .then((result) => {
                usersModel.findById(result._id)
                    .populate('role', 'role-_id')
                    .then((populatedResult) => {
                        res.status(201).json({
                            success: true,
                            message: `Account Created Successfully`,
                            user: populatedResult
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            success: false,
                            message: `Error populating role`,
                            err: err.message
                        });
                    });
            })
            .catch((err) => {
                if (err.keyPattern && err.keyPattern.phoneNumber) {
                    return res.status(409).json({
                        success: false,
                        message: `The phoneNumber already exists`,
                    });
                } else if (err.keyPattern && err.keyPattern.email) {
                    return res.status(409).json({
                        success: false,
                        message: `The email already exists`,
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: `Server Error`,
                        err: err.message,
                    });
                    console.log(err);
                }
            });
    }

    const updateUser = async (req, res) => {
        const { id } = req.params;
        const updatedUser = req.body;
    
        
        if (updatedUser.password) {
            try {
                
                updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error hashing the password",
                    err: err.message
                });
            }
        }
    
        usersModel
            .findOneAndUpdate({ _id: id }, updatedUser, { new: true })  
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        success: true,
                        message: "User updated successfully",
                        updatedUser: result
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: `The user with id => ${id} not found`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: "Server Error",
                    err: err.message
                });
            });
    };
    

    const login = (req, res) => {
        const password = req.body.password;
        const email = req.body.email.toLowerCase();
    
        console.log("Login attempt for email:", email);
    
        usersModel
            .findOne({ email })
            .populate("role", "-_id -__v")
            .populate("specialist")
            .then(async (result) => {
                if (!result) {
                    console.log("User not found for email:", email);
                    return res.status(403).json({
                        success: false,
                        message: `The email doesn't exist or the password you’ve entered is incorrect`,
                    });
                }
                try {
                    const valid = await bcrypt.compare(password, result.password);
                    if (!valid) {
                        console.log("Invalid password for email:", email);
                        return res.status(403).json({
                            success: false,
                            message: `The email doesn't exist or the password you’ve entered is incorrect`,
                        });
                    }
                    const payload = {
                        userId: result.id,
                        user: result.userName,
                        specialist: result.specialist,
                        phoneNumber: result.phoneNumber,
                        role: result.role,
                    };
                    const options = {
                        expiresIn: "60m",
                    };
                    const token = jwt.sign(payload, process.env.SECRET, options);
    
                    console.log("Login successful for email:", email);
    
                    // await sendSms('+962772341720', 'Login successful! Welcome to our service.');
    
                    res.status(200).json({
                        success: true,
                        message: `Valid login credentials`,
                        token: token,
                    });
                } catch (error) {
                    console.error("Error during login process:", error.message);
                    res.status(500).json({
                        success: false,
                        message: `Server Error`,
                        err: error.message,
                    });
                }
            })
            .catch((err) => {
                console.error("Server error during login process:", err.message);
                res.status(500).json({
                    success: false,
                    message: `Server Error`,
                    err: err.message,
                });
            });
    };
    

    const getAllUsers=(req,res)=>{
        usersModel
        .find()
        .populate("role")
        .populate("specialist")
        .then((result)=>{
            if(result.length){
                res.status(200).json({
                    success: true,
                    message: `All USERS`,
                    Users: result
                })
            }
            else {
                res.status(200).json({
                    success: false,
                    message: `No Users Yet`,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,

            })
        })
    }

    const googleLogin = async (req, res) => {
        try {
            const { token } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com",
            });
    
            const payload = ticket.getPayload();
            const { email, given_name, family_name, picture } = payload;
    
            let user = await usersModel.findOne({ email });
    
            if (!user) {
                const role = await Role.findById("6664b711c97330a23805e283").populate('role');
                if (!role) {
                    return res.status(500).json({ success: false, message: "Default user role not found" });
                }
    
                const newUser = new usersModel({
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    image: picture,
                    role: role._id,
                    userName: given_name+""+family_name,
                    phoneNumber: "1",
                    password: "",
                    specialist: null 
                });
    
                user = await newUser.save();
            }
    
            const userWithRole = await usersModel.findOne({ email }).populate("role");
    
            if (!userWithRole) {
                return res.status(500).json({ success: false, message: "Failed to retrieve user after creation" });
            }
    
            const tokenPayload = {
                user: userWithRole.userName,
                email: userWithRole.email,
                userId: userWithRole._id,
                role: userWithRole.role,
                image: userWithRole.image,
            };
    
            if (userWithRole.role.role === 'serviceProvider') {
                tokenPayload.specialist = userWithRole.specialist;
            }
    
            const newToken = jwt.sign(tokenPayload, process.env.SECRET, { expiresIn: '1h' });
    
            res.status(200).json({
                success: true,
                message: "Logged in successfully",
                token: newToken,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Server Error",
                error: err.message,
            });
        }
    };
    

    const deleteUserById= (req,res)=>{
        const {id}=req.params
        usersModel
        .findOneAndDelete({_id:id})
        .then((result)=>{
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `user with id => ${id} not found`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `user deleted`,
                });
            }
        })
        .catch((err)=>{
            res.status(500).json({
                success: false,
                message: "Server Error",
                err: err.message
            })
        })
    }

    const getUserInfo = (req, res) => {
    const { id } = req.params;

    usersModel
        .findById({_id:id})
        .select('userName image')
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `User with id => ${id} not found`,
                });
            }
            res.status(200).json({
                success: true,
                message: `User info retrieved successfully`,
                user: result,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Server Error",
                err: err.message,
            });
        });
};



    module.exports = { register, login ,getAllUsers,googleLogin,deleteUserById,getUserById,updateUser,resetPassword,verifyOtp,forgotPassword,getUserInfo}