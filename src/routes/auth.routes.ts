import { Router } from "express";
import {signIn,signUp,getallusers } from '../controllers/user.controller';
import { getallStudent, getallStudents, getStudentByID, getStundetsByTeacher, NewStudent,SearchStudent, SearchStudentByGrade} from "../controllers/alumno.controller";
import { GetAttendace, NewAttendance, NewAttendanceEdit } from "../controllers/asistencia.controller";
import { getGrades, getsections, getstudentgrade, getTeacherGrades, NewGrade } from "../controllers/curso.controller";
import { getallTeachers, newTeacher } from "../controllers/profesor.controller";

const router = Router();

//endpoints para users
router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/getallusers',getallusers)

//endpoints para alumnos
router.post('/newstudent',NewStudent)
router.get('/getStudentByID/:id',getStudentByID)
router.get('/getallstudent',getallStudent)
router.get('/getallstudents',getallStudents)
router.get('/searchstudent/:search',SearchStudent)
router.get('/searchstudentbygrade/:grade/:section',SearchStudentByGrade)
router.get('/getStundetsByTeacher/:id',getStundetsByTeacher)

//endpoints para las asistencias
router.post('/NewAttendance',NewAttendance)
router.post('/NewAttendanceEdit',NewAttendanceEdit)
router.get('/GetAttendace/:id',GetAttendace)

//endpoints para los cursos
router.post('/NewGrade',NewGrade)
router.get('/getGrades',getGrades)
router.get('/getsections/:id',getsections)
router.get('/getstudentgrade/:id',getstudentgrade)

router.get('/getTeacherGrades/:id',getTeacherGrades)
//endpoints para los profesores
router.post('/NewTeacher', newTeacher)
router.get('/allTeachers', getallTeachers)

export default router