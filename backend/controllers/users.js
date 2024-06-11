const usersModel = require("../models/users")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    
    const { firstName, lastName, email, phoneNumber, password, image, isSpecialist, userName, age, specialist } = req.body
    const role = isSpecialist ? '66659b79ca3cdb2fe0e92bc9' : '6664b711c97330a23805e283';
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
        .populate("specialist","-_id -__v")
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
                    role: result.role
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


module.exports = { register, login }