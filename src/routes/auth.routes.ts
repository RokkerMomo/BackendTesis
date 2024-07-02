import { Router } from "express";
import {signIn,signUp,getallusers } from '../controllers/user.controller';
import { getallStudent, NewStudent,SearchStudent,SearchStudentByGrade } from "../controllers/alumno.controller";
import { GetAttendace, NewAttendance } from "../controllers/asistencia.controller";
const router = Router();

//endpoints para users
router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/getallusers',getallusers)

//endpoints para alumnos
router.post('/newstudent',NewStudent)
router.get('/getallstudents',getallStudent)
router.get('/searchstudent/:search',SearchStudent)
router.get('/searchstudentbygrade/:grade/:section',SearchStudentByGrade)

//endpoints para las asistencias
router.post('/NewAttendance',NewAttendance)
router.get('/GetAttendace/:id',GetAttendace)
export default router