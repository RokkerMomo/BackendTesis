"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const alumno_controller_1 = require("../controllers/alumno.controller");
const asistencia_controller_1 = require("../controllers/asistencia.controller");
const curso_controller_1 = require("../controllers/curso.controller");
const profesor_controller_1 = require("../controllers/profesor.controller");
const router = (0, express_1.Router)();
//endpoints para users
router.post('/signup', user_controller_1.signUp);
router.post('/signin', user_controller_1.signIn);
router.get('/getallusers', user_controller_1.getallusers);
//endpoints para alumnos
router.post('/newstudent', alumno_controller_1.NewStudent);
router.get('/getallstudent', alumno_controller_1.getallStudent);
router.get('/getallstudents', alumno_controller_1.getallStudents);
router.get('/searchstudent/:search', alumno_controller_1.SearchStudent);
router.get('/searchstudentbygrade/:grade/:section', alumno_controller_1.SearchStudentByGrade);
router.get('/getStundetsByTeacher/:id', alumno_controller_1.getStundetsByTeacher);
//endpoints para las asistencias
router.post('/NewAttendance', asistencia_controller_1.NewAttendance);
router.get('/GetAttendace/:id', asistencia_controller_1.GetAttendace);
//endpoints para los cursos
router.post('/NewGrade', curso_controller_1.NewGrade);
router.get('/getGrades', curso_controller_1.getGrades);
router.get('/getsections/:id', curso_controller_1.getsections);
router.get('/getstudentgrade/:id', curso_controller_1.getstudentgrade);
router.get('/getTeacherGrades/:id', curso_controller_1.getTeacherGrades);
//endpoints para los profesores
router.post('/NewTeacher', profesor_controller_1.newTeacher);
router.get('/allTeachers', profesor_controller_1.getallTeachers);
exports.default = router;
