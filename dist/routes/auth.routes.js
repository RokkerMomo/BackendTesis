"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const alumno_controller_1 = require("../controllers/alumno.controller");
const router = (0, express_1.Router)();
//endpoints para users
router.post('/signup', user_controller_1.signUp);
router.post('/signin', user_controller_1.signIn);
router.get('/getallusers', user_controller_1.getallusers);
//endpoints para alumnos
router.post('/newstudent', alumno_controller_1.NewStudent);
router.get('/getallstudents', alumno_controller_1.getallStudent);
router.get('/searchstudent/:search', alumno_controller_1.SearchStudent);
exports.default = router;
