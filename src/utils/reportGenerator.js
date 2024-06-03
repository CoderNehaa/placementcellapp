import { connectDB } from "../config/db.js";
import fs from "fs";

export async function generateCSVReport() {
    try {
        const db = await connectDB();
        const students = await db.collection('students').aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "studentId",
                    as: "studentInterview"
                }
            }
        ]).toArray();

        const csvHeader = "Student ID, Student Name, Student College, Student Status, DSA Final Score, WebD Final Score, React Final Score, Company Name, Interview Date, Result\n";
        
        const csvData = students.map(student => {
            const studentBaseInfo = `${student._id}, ${student.name}, ${student.collegeName}, ${student.status}, ${student.dsaScore}, ${student.webScore}, ${student.reactScore}`;
            console.log(student);
            
            if (student.studentInterview.length > 0) {
                return student.studentInterview.map(interview => {
                    return `${studentBaseInfo}, ${interview.companyName}, ${interview.interviewDate}, ${interview.result}`;
                }).join("\n");
            } else {
                return `${studentBaseInfo}, , , `;
            }
        }).join("\n");
        fs.writeFileSync("report.csv", csvHeader + csvData);

        console.log("CSV report generated successfully.");
    } catch (error) {
        console.error("Error generating CSV report:", error);
    }
}
