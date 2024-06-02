import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export class UserController {
    async signup(req, res) {
        const { name, email, password, confirmPassword } = req.body;
        try {
            if(password != confirmPassword){
                return res.render("signup", {errorMsg:"Password does not match with confirm pasword"})
            }
            const userExists = await UserModel.doesUserExist(email);
            if (userExists) {
                res.render("signup", { errorMsg: "Email already exists" });
            } else {
                await UserModel.createUser(name, email, password);
                res.redirect('/signin');
            }
        } catch (error) {
            console.log(error, " signup ");
            res.render("signup", { errorMsg: "Error creating user" });
        }
    }

    async signin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.signin(email, password);
            if (!user) {
                return res.render("signin", { errorMsg: "User does not exist" })
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.render("signin", { errorMsg: "Password incorrect" })
            }
            req.session.user = user;
            res.redirect("/dashboard");
        } catch (e) {
            console.log('error in signin', e);
            res.render("signin", { errorMsg: e });
        }
    }

    signout(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('signin');
            }
        })
    }
}


