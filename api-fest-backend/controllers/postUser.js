const models = require('../model/model.js');
const Users = models.userModel;
const Employees = models.employeeModel;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const HTTPError = require('../HTTPError.js');

const hashPassword = function generateHash(password){
    try{
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password,salt);
        return hashedPassword;
    }
    catch(err){
        console.log(err);
    }
}

const postUser = (req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        let password = req.body.password;

        if(!email) throw new HTTPError(400, "Email not found");
        if(!password) throw new HTTPError(400, "Password not found");

        Users.findOne({email: email}, (err,user)=>{
            if(user) res.status(400).json({status: "error",message: "User already exists"});
            else{
                password=hashPassword(password);
                
                const newUser = new Users({
                    name,
                    email,
                    password
                });

                newUser.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.status(200).json({status: "success", message: "User Registered Successfully"});
                    }
                });
            }
        });
    }
    catch(err){
        return res.status(err.statusCode | 400).json({status: "error", message: err.message});
    }
};

module.exports = postUser;