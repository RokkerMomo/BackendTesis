import { Router } from "express";
import {signIn,signUp,getallusers } from '../controllers/user.controller';
import { getallStudent, getallStudents, NewStudent,SearchStudent,
//SearchStudentByGrade
 } from "../controllers/alumno.controller";
import { GetAttendace, NewAttendance } from "../controllers/asistencia.controller";
import { getGrades, getsections, NewGrade } from "../controllers/curso.controller";
const router = Router();

//endpoints para users
router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/getallusers',getallusers)

//endpoints para alumnos
router.post('/newstudent',NewStudent)
router.get('/getallstudent',getallStudent)
router.get('/getallstudents',getallStudents)
router.get('/searchstudent/:search',SearchStudent)
//router.get('/searchstudentbygrade/:grade/:section',SearchStudentByGrade)

//endpoints para las asistencias
router.post('/NewAttendance',NewAttendance)
router.get('/GetAttendace/:id',GetAttendace)


//endpoints para los grados
router.post('/NewGrade',NewGrade)
router.get('/getGrades',getGrades)
router.get('/getsections/:id',getsections)
export default router