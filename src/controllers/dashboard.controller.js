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

    async generateCSV() {
        const db = await connectDB();
        const students = await db.collection('students').find().toArray();
        const interviews = await db.collection('interviews').find().toArray();
        const data = [];
    
        students.forEach(student => {
            student.studentInterview.forEach(interview => {
                const interviewData = interviews.find(
                    i => i.companyName === interview.companyName && 
                    i.interviewDate === interview.interviewDate);
                data.push({
                    studentId: student._id,
                    studentName: student.name,
                    studentCollege: student.collegeName,
                    studentStatus: student.status,
                    dsaFinalScore: student.dsaScore,
                    webDFinalScore: student.webScore,
                    reactFinalScore: student.reactScore,
                    interviewDate: interview.interviewDate,
                    interviewCompany: interview.companyName,
                    // interviewStudentResult: interview.studentsAsigned
                });
            });
        });
    
        // Create CSV writer
        const csvWriter = createCsvWriter.createObjectCsvWriter({
            path: 'student_interview_data.csv',
            header: [
                {id: 'studentId', title: 'Student ID'},
                {id: 'studentName', title: 'Student Name'},
                {id: 'studentCollege', title: 'Student College'},
                {id: 'studentStatus', title: 'Student Status'},
                {id: 'dsaFinalScore', title: 'DSA Final Score'},
                {id: 'webDFinalScore', title: 'WebD Final Score'},
                {id: 'reactFinalScore', title: 'React Final Score'},
                {id: 'interviewDate', title: 'Interview Date'},
                {id: 'interviewCompany', title: 'Interview Company'},
                {id: 'interviewStudentResult', title: 'Interview Student Result'}
            ]
        });
    
    }
}

