const crypto = require('crypto');
const db = require("../models");
const User = db.users;
const Role = db.roles;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [err],
                "messages": [err],
                "result": null
            });
        }

        if (req.body.role) {
            Role.find({
                    name: { $in: req.body.role }
                },
                (err, roles) => {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            return res.json({
                                "success": false,
                                "code": 500,
                                "errors": [err],
                                "messages": [err],
                                "result": null
                            });
                        }
                        return res.json({
                            "success": true,
                            "code": 200,
                            "errors": [],
                            "messages": ["User was registered successfully!"],
                            "result": {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                            }
                        });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    return res.json({
                        "success": false,
                        "code": 500,
                        "errors": [err],
                        "messages": [err],
                        "result": null
                    });
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    }
                    return res.json({
                        "success": true,
                        "code": 200,
                        "errors": [],
                        "messages": ["User was registered successfully!"],
                        "result": {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                        }
                    });
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
            username: req.body.username
        })
        .populate("roles", "-__v")
        .exec((err, user) => {

            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!user) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["Invalid Credentials"],
                    "messages": [err],
                    "result": null
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.json({
                    "success": true,
                    "code": 401,
                    "errors": [],
                    "messages": ["Invalid Credentials"],
                    "result": null
                });
            }

            const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
                namedCurve: 'sect239k1'
            });

            // generate a signature of the payload
            const sign = crypto.createSign('SHA256');
            sign.write(`${user}`);
            sign.end();
            var signature = sign.sign(privateKey, 'hex');
            console.log(signature)


            // sign username
            var token = jwt.sign({ id: user.id }, signature, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token, // access token
                    signature: signature // signature
                }
            });
        });
};