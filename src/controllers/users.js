const { sign } = require("jsonwebtoken");
const { genSalt, compare, hash } = require("bcryptjs");
const { find , save ,findOneAndUpdate , findOne} = require('../daos/index');
const User = require('../models/users.model');

module.exports = {
    get: async (req, res, next) => {
        try {
            const { email } = req.user;
            const user = await find(User, { email });
            res.status(200).send({
                email: user[0].email,
                displayName: user[0].displayName,
                bio: user[0].bio,
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // validate
            if (!email || !password)
                return res
                    .status(400)
                    .json({ msg: "Not all fields have been entered." });

            const user = await findOne(User,{ email }); 
            if (!user)
                return res.status(400).json({
                    msg: "No account with this email has been registered.",
                });

            const isMatch = await compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Invalid credentials." });

            const token = sign({ email: user.email }, process.env.JWT_SECRET);

            res.json({
                token,
                user: {
                    email: user.email,
                    displayName: user.displayName,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    register: async (req, res, next) => {
        try {
            let { email, password, displayName, bio } = req.body;

            if (!email || !password)
                return res
                    .status(400)
                    .json({ msg: "Not all fields have been entered." });

            if (password.length < 5)
                return res.status(400).json({
                    msg: "The password needs to be at least 5 characters long.",
                });

            const existingUser = await findOne(User,{ email }); 
            if (existingUser)
                return res.status(400).json({
                    msg: "An account with this email already exists.",
                });

            if (!displayName) displayName = email;

            if (!bio) bio = '';

            const salt = await genSalt();
            const passwordHash = await hash(password, salt);

            console.log(passwordHash);
            password = passwordHash;
            const newUser = await save(User,{ 
                email,
                password,
                displayName,
                bio
            });

            res.json(newUser);
        } catch (error) {
            next(error);
        }
    },
};
