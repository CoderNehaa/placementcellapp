import { connectDB } from "../config/db.js";

export class DashboardController {
    constructor(){
        this.getDashboardPage = this.getDashboardPage.bind(this);
        this.getInterviewsList = this.getInterviewsList.bind(this);
        this.getStudentsList = this.getStudentsList.bind(this);   
    }

    async getDashboardPage(req, res) {
        try {
            const studentsList = await this.getStudentsList();
            const interviewsList = await this.getInterviewsList();
            res.render("dashboard", { user: req.session.user, studentsList, interviewsList });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async getStudentsList() {
        try {
            const db = await connectDB();
            const studentsList = await db.collection('students').find().toArray();
            return studentsList;
        } catch (error) {
            console.error("Error fetching students list:", error);
            throw error;
        }
    }

    async getInterviewsList() {
        try {
            const db = await connectDB();
            const interviewsList = await db.collection('interviews').find().toArray();
            return interviewsList;
        } catch (error) {
            console.error("Error fetching interviews list:", error);
            throw error;
        }
    }
}
