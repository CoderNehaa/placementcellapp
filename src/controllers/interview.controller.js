import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { InterviewModel } from "../models/interview.model.js";

export class InterviewController {
  constructor() {
    this.getInterviewById = this.getInterviewById.bind(this);
    this.addInterview = this.addInterview.bind(this);
    this.getAddStudentResultPage = this.getAddStudentResultPage.bind(this);
    this.getEditInterviewPage = this.getEditInterviewPage.bind(this);
    this.addStudentResult = this.addStudentResult.bind(this);
    this.deleteInterview = this.deleteInterview.bind(this);
  }

  async addInterview(req, res) {
    const { companyName, interviewDate } = req.body;
    await InterviewModel.addInterview(companyName, interviewDate);
    res.redirect("/dashboard");
  }

  async getEditInterviewPage(req, res) {
    const { id } = req.params;
    const interview = await this.getInterviewById(id);
    console.log(interview);
    if (interview) {
      res.render("editInterview", { interview });
    } else {
      res.redirect("/dashboard");
    }
  }

  async deleteInterview(req, res) {
    const { id } = req.params;
    const db = await connectDB();
    const objectId = new ObjectId(id);
    await db.collection("interviews").deleteOne({ _id: objectId });
    res.redirect("/dashboard");
  }

  async getInterviewById(id) {
    const db = await connectDB();
    const objectId = new ObjectId(id);
    const interview = await db
      .collection("interviews")
      .findOne({ _id: objectId });
    return interview;
  }

  async getAddStudentResultPage(req, res) {
    const { id } = req.params;
    const interview = await this.getInterviewById(id);
    if(interview){
        const db = await connectDB();
        const studentsList = await db.collection('students').find().toArray();    
        res.render("addStudentResult", { interview: interview, errorMsg: null, studentsList });
    }
  }

  async addStudentResult(req, res) {
    const { id, email, result } = req.body;
    const db = await connectDB();
    const objectId = new ObjectId(id);

    try {
      const interview = await this.getInterviewById(id);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }

      const isStudentAssigned = interview.studentsAssigned.some(
        (student) => student.email === email
      );
      if (isStudentAssigned) {
        const studentsList = await db.collection('students').find().toArray();
        return res.render("addStudentResult", {
          interview: interview,
          errorMsg: "This student is already added",
          studentsList
        });
      }

      const obj = { email: email, result: result };
      await db
        .collection("interviews")
        .updateOne({ _id: objectId }, { $push: { studentsAssigned: obj } });

        const studentInterview = {
          companyName:interview.companyName,
          interviewDate:interview.interviewDate,
          result:result
        }
  
        const student = await db.collection('students').findOne({ email: email });
        const studentId = new ObjectId(student._id);
        await db
        .collection("students")
        .updateOne({ _id: studentId }, { $push: { studentInterview: studentInterview } });

      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async editInterview(req, res){
    const {id, companyName, interviewDate} = req.body;
    const db = await connectDB();
    const objectId = new ObjectId(id);
    await db
      .collection("interviews")
      .updateOne({ _id: ObjectId }, { $set: {companyName, interviewDate} });
      res.redirect('/dashboard');
  }

}
