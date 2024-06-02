import { connectDB } from "../config/db.js";

export class InterviewModel{
    constructor(companyName, interviewDate){
        this.companyName = companyName,
        this.interviewDate = interviewDate,
        this.studentsAssigned = []
    }

    static async addInterview(companyName, interviewDate){
        const newInterview  = new InterviewModel(companyName, interviewDate);
        const db = await connectDB();
        const result = await db.collection('interviews').insertOne(newInterview);
    }

    static assignInterview(){

    }

    


}

