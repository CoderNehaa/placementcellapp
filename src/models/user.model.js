import { connectDB } from "../config/db.js";
import bcrypt, { hash } from "bcrypt"

export class UserModel {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static async signin(email, password) {
        try{
            const db = await connectDB();
            const user = await db.collection('users').findOne({ email: email });
            return user;
        } catch (e){
            console.log(e);
        }
    }

    static async doesUserExist(email) {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ email: email });
        return user;
    }

    static async createUser(name, email, password) {
        const db = await connectDB();
        const saltRounds = 10;
        const newUser = { name, email, password };

        await bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if(err){
                    console.log("error while hashing password to store in db ", err);
                }
                if(hash){
                    newUser.password = hash;   
                    const result = await db.collection('users').insertOne(newUser);
                    return result.insertedId;
                }
            });
        });
    }

    static async updateUserPassword(email, hashedPassword) {
        const db = await connectDB();
        await db.collection('users').updateOne({ email: email }, { $set: { password: hashedPassword } });
    }
}
