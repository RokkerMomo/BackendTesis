"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const alumno_controller_1 = require("../controllers/alumno.controller");
const asistencia_controller_1 = require("../controllers/asistencia.controller");
const curso_controller_1 = require("../controllers/curso.controller");
const profesor_controller_1 = require("../controllers/profesor.controller");
const ESP32_controller_1 = require("../controllers/ESP32.controller");
const router = (0, express_1.Router)();
//endpoints para users
router.post('/signup', user_controller_1.signUp);
router.post('/signin', user_controller_1.signIn);
//endpoints para alumnos
router.post('/newstudent', alumno_controller_1.NewStudent);
router.get('/getStudentByID/:id', alumno_controller_1.getStudentByID);
router.get('/getallstudent', alumno_controller_1.getallStudent);
router.get('/getallstudents', alumno_controller_1.getallStudents);
router.get('/searchstudent/:search', alumno_controller_1.SearchStudent);
router.get('/searchstudentbygrade/:grade/:section', alumno_controller_1.SearchStudentByGrade);
router.get('/getStundetsByTeacher/:id', alumno_controller_1.getStundetsByTeacher);
router.put('/addFingerPrint', alumno_controller_1.addFingerPrint);
router.delete('/DeleteStudent/:id', alumno_controller_1.DeleteStudent);
router.get('/GetGrade/:id', curso_controller_1.GetGrade);
//endpoints para las asistencias
router.post('/NewAttendance', asistencia_controller_1.NewAttendance);
router.post('/NewAttendanceEdit', asistencia_controller_1.NewAttendanceEdit);
router.get('/GetAttendace/:id', asistencia_controller_1.GetAttendace);
router.delete('/DeleteAttendance', asistencia_controller_1.DeleteAttendance);
//endpoints para los cursos
router.post('/NewGrade', curso_controller_1.NewGrade);
router.get('/getGrades', curso_controller_1.getGrades);
router.get('/getsections/:id', curso_controller_1.getsections);
router.get('/getstudentgrade/:id', curso_controller_1.getstudentgrade);
router.get('/getgradebystudentID/:id', curso_controller_1.getgradebystudentID);
router.get('/getGradesFullData', curso_controller_1.getGradesFullData);
router.put('/EditGrade', curso_controller_1.EditGrade);
//endpoints para los profesores
router.get('/getTeacherGrades/:id', curso_controller_1.getTeacherGrades);
router.post('/NewTeacher', profesor_controller_1.newTeacher);
router.get('/allTeachers', profesor_controller_1.getallTeachers);
//endpooints que se comunican con el ESP32
router.get('/AddFingerPrintESP32/:id', ESP32_controller_1.AddFingerPrintESP32);
router.get('/FindESP32', ESP32_controller_1.FindESP32);
exports.default = router;
