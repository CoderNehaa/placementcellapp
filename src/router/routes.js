import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { dataValidation } from "../middlewares/validation.middleware.js";

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

router.get("/reset-password", ensureAuthenticated, (req, res) => res.render("reset", {errorMsg:null}))
router.get("/forgot-password", (req, res) => res.render("forgot", {errorMsg:null, successMsg:null}))

router.get('/signout', userController.signout);
router.post('/signup', dataValidation('signup'), userController.signup);
router.post('/signin', userController.signin);

router.get('/add-student', (req, res) => res.render("addStudent"));
router.get('/add-interview', (req, res) => res.render("addInterview"));

router.post('/add-interview', interviewController.addInterview);
router.post('/add-student', studentController.addStudent);

router.get('/edit-student/:id', studentController.getEditStudentPage);
router.get('/edit-interview/:id', studentController.getEditStudentPage);
router.post('/edit-student', studentController.updateStudent);

export default router

