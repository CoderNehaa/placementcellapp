import { ObjectId } from "mongodb";
import { InterviewModel } from "../models/interview.model.js";

export class InterviewController {
    async addInterview(req, res){
        const {companyName, interviewDate} = req.body;
        await InterviewModel.addInterview(companyName, interviewDate);
        res.redirect('/dashboard');
    }

    async getEditInterviewPage(req, res){
        const { id } = req.params;
        const db = await connectDB();
        const objectId = new ObjectId(id);
        const interview = await db.collection('interviews').findOne({ _id: objectId });
        if(interview){
            res.render("editInterview", { interview });
        } else {
            res.redirect('/dashboard');
        }
    }
    
}


