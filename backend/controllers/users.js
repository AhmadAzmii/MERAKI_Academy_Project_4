const usersModel = require("../models/users")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const Role=require('../models/role')
const client = new OAuth2Client("562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com");

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


const login = (req, res) => {
    const password = req.body.password
    const email = req.body.email.toLowerCase()

    usersModel
        .findOne({ email })
        .populate("role", "-_id -__v")
        .populate("specialist")
        .then(async (result) => {
            if (!result) {
                return res.status(403).json({
                    success: false,
                    message: `The email doesn't exist or The password you’ve entered is incorrect`,
                });
            }
            try {
                const valid = await bcrypt.compare(password, result.password);
                if (!valid) {
                    return res.status(403).json({
                        success: false,
                        message: `The email doesn't exist or The password you’ve entered is incorrect`,
                    });
                }
                const payload = {
                    userId: result.id,
                    user: result.userName,
                    specialist: result.specialist,
                    phoneNumber: result.phoneNumber,
                    role: result.role,
                    image:result.image
                }
                const options = {
                    expiresIn: "60m",
                }
                const token = jwt.sign(payload, process.env.SECRET, options)
                res.status(200).json({
                    success: true,
                    message: `Valid login credentials`,
                    token: token,
                })
            }
            catch (error) {

                throw new Error(error.message);
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                err: err.message,
            });
        })

}

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
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience:"562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com"
        });
        const payload = ticket.getPayload();

        console.log(payload);
        
        // Fetch role details from the database
        const role = await Role.findById("6664b711c97330a23805e283").populate('role');
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

   

        const jwtPayload = { 
            user: payload.given_name + " " + payload.family_name,
            firstName: payload.given_name,
            lastName: payload.family_name,
            userId: payload.sub,
            email: payload.email,
            role: role,
            permissions: role.permissions,
            specialist: null,
            image:payload.picture
        };

        const appToken = jwt.sign(jwtPayload, process.env.SECRET, { expiresIn: '1h' });

        res.status(200).json({ token: appToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to authenticate Google token' });
    }
};

module.exports = { register, login ,getAllUsers,googleLogin}