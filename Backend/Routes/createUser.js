const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "MynameisAbhijitJoshi"
router.post("/createuser",
    [
        body('email').isEmail(),
        body('password', 'Incorrect Password').isLength({ min: 5 })

    ]
    , async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array });
        }

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);
        try {
            // Check if the user with the given email already exists
            let existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ errors: "User with this email already exists" });
            }
            const user = await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            })

            const data = {
                user: {
                    id: user.id
                }
            };
            const authToken = jwt.sign(data, jwtSecret);
            console.log(authToken);
            res.json({ success: true, authToken: authToken });

            // const data = {
            //     user: {
            //         id: user.id
            //     }
            // };
            // const authToken = jwt.sign(data, jwtSecret);
            // // console.log(localStorage.getItem("authToken"));
            // res.json({ success: true, authToken: authToken });
            // res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

router.post("/loginuser",
    [
        body('email').isEmail(),
        body('password').isLength({ min: 5 })

    ], async (req, res) => {
        let email = req.body.email

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array });
        }

        try {
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: "Try logging with correct credentials" });
            }
            const pwdCompare = await bcrypt.compare(req.body.password, userData.password)
            if (!pwdCompare) {
                return res.status(400).json({ errors: "Try logging with correct credentials" });
            }
            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret)
            return res.json({ success: true, authToken: authToken, name: userData.name });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

module.exports = router