import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { dataValidation } from "../middlewares/validation.middleware.js";
import { generateCSVReport} from "../utils/reportGenerator.js"; 

import { UserController } from "../controllers/user.controller.js";
import { StudentController } from "../controllers/student.controller.js";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { InterviewController } from "../controllers/interview.controller.js";

const router = express.Router();
const userController = new UserController();
const interviewController = new InterviewController();
const studentController = new StudentController();
const dashboardController = new DashboardController();

router.get('/signup', (req, res) => res.render("signup", {errorMsg:""}));
router.get('/signin', (req, res) => res.render("signin", {errorMsg:null}));

router.get(
    '/dashboard', 
    ensureAuthenticated, 
    dashboardController.getDashboardPage
);

router.get('/signout', userController.signout);
router.post('/signup', dataValidation('signup'), userController.signup);
router.post('/signin', userController.signin);

router.get('/add-student', ensureAuthenticated, (req, res) => res.render("addStudent"));
router.get('/add-interview', ensureAuthenticated, (req, res) => res.render("addInterview"));

router.post('/add-interview', interviewController.addInterview);
router.post('/add-student', studentController.addStudent);

router.get('/edit-student/:id', ensureAuthenticated, studentController.getEditStudentPage);
router.get('/edit-interview/:id', ensureAuthenticated, interviewController.getEditInterviewPage);
router.post('/edit-student', studentController.updateStudent);
router.post('/edit-interview', interviewController.editInterview);

router.get('/delete-interview/:id', ensureAuthenticated, interviewController.deleteInterview);
router.get('/delete-student/:id', ensureAuthenticated, studentController.deleteStudent);

router.get('/add-student-result/:id', interviewController.getAddStudentResultPage);
router.post('/add-student-result', interviewController.addStudentResult);

router.get(
    '/profile', 
    ensureAuthenticated, 
    (req, res) => res.render("profile", {user:req.session.user, errorMsg:null})
);

router.post('/profile', userController.updateProfile);

router.get("/generate-report", async (req, res) => {
    await generateCSVReport();
    res.download("report.csv", "report.csv");
});

export default router

