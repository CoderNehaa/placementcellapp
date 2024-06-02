import { connectDB } from "../config/db.js";
import { StudentModel } from "../models/student.model.js";
import { ObjectId } from "mongodb";

export class StudentController {
  async addStudent(req, res) {
    await StudentModel.addStudent(req.body);
    res.redirect("/dashboard");
  }

  async getEditStudentPage(req, res) {
    const { id } = req.params;
    const db = await connectDB();
    const objectId = new ObjectId(id);
    const student = await db.collection("students").findOne({ _id: objectId });
    if (student) {
      res.render("editStudent", { student });
    } else {
      res.redirect("/dashboard");
    }
  }

  async updateStudent(req, res) {
    const {
      id,
      name,
      email,
      collegeName,
      status,
      batch,
      dsaScore,
      webScore,
      reactScore
    } = req.body;
    const db = await connectDB();
    const objectId = new ObjectId(id);
    const student = {
      name,
      email,
      collegeName,
      status,
      batch,
      dsaScore,
      webScore,
      reactScore,
    };
    await db
      .collection("students")
      .updateOne({ _id: ObjectId }, { $set: student });
      res.redirect('/dashboard');
  }

  async deleteStudent(req, res){
    const {id} = req.params
    const db = await connectDB();
    const objectId = new ObjectId(id);
    const result = await db.collection('students').deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
        console.log(`Successfully deleted student with id ${id}`);
    } else {
        console.log(`Student with id ${id} not found`);
    }
    res.redirect('/dashboard');
  }
    
}

