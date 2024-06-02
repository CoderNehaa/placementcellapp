import { connectDB } from "../config/db.js";

export class StudentModel{
    constructor(name, email, collegeName, status, batch, dsaScore, webScore, reactScore){
        this.name = name,
        this.email = email,
        this.collegeName = collegeName,
        this.status = status,
        this.batch = batch,
        this.dsaScore = dsaScore,
        this.webScore = webScore,
        this.reactScore = reactScore
    }

    static async addStudent(student){
        const {name, email, collegeName, status, batch, dsaScore, webScore, reactScore} = student;
        const newStudent  = new StudentModel(name, email, collegeName, status, batch, dsaScore, webScore, reactScore);
        console.log(newStudent);
        const db = await connectDB();
        const result = await db.collection('students').insertOne(newStudent);
    }    


}

