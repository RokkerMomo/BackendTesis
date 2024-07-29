"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallStudents = exports.getStundetsByTeacher = exports.getallStudent = exports.SearchStudentByGrade = exports.SearchStudent = exports.NewStudent = void 0;
const alumno_1 = __importDefault(require("../models/alumno"));
const curso_1 = __importDefault(require("../models/curso"));
//FUNCION PARA CREAR TOKEN
//REGISTRO
const NewStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.nombrecompleto || !req.body.url_foto || !req.body.cedula || !req.body.edad || !req.body.genero || !req.body.id_curso) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const Student = yield alumno_1.default.findOne({ $or: [
            { nombrecompleto: req.body.nombrecompleto },
            { cedula: req.body.cedula }
        ] });
    if (Student) {
        return res.status(400).json({ msg: 'El alumno ya existe, verificar cedula y nombre completo' });
    }
    const users = yield alumno_1.default.find();
    const payload = {
        nombrecompleto: req.body.nombrecompleto,
        url_foto: req.body.url_foto,
        cedula: req.body.cedula,
        edad: req.body.edad,
        genero: req.body.genero,
        id_curso: req.body.id_curso,
        idHuella: users.length + 1
    };
    //GUARDAR Alumno
    const newStudent = new alumno_1.default(payload);
    yield newStudent.save();
    return res.status(201).json({ newStudent, msg: 'Alumno registrado correctamente' });
});
exports.NewStudent = NewStudent;
//Buscar alumno por cedula o por nombre
const SearchStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.search);
    const Students = yield alumno_1.default.find({ $or: [
            { nombrecompleto: { $regex: req.params.search } },
            { cedula: req.params.search }
        ] });
    if (Students.length === 0) {
        return res.status(400).json({ msg: "no se encontro ningun alumno" });
    }
    return res.status(201).json(Students);
});
exports.SearchStudent = SearchStudent;
//Buscar alumnos por Grado
const SearchStudentByGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.grade);
    console.log(req.params.section);
    const Students = yield alumno_1.default.find({ $and: [
            { grado: req.params.grade },
            { seccion: req.params.section }
        ] });
    if (Students.length === 0) {
        return res.status(400).json({ msg: "no hay alumnos en esa seccion" });
    }
    return res.status(200).json(Students);
});
exports.SearchStudentByGrade = SearchStudentByGrade;
//Get all students.lenght
const getallStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield alumno_1.default.find();
    return res.status(200).json(users.length);
});
exports.getallStudent = getallStudent;
const getStundetsByTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const grades = yield curso_1.default.find({ id_profesor: req.params.id });
    console.log("wtf ?");
    console.log(grades);
    const payload = [];
    for (let index = 0; index < grades.length; index++) {
        const student = yield alumno_1.default.findOne({ id_curso: grades[index]._id });
        payload.push(student);
    }
    if (payload.length != 0) {
        return res.status(200).json(payload);
    }
    else {
        return res.status(400).json({ msg: "Profesor no tiene alumnos" });
    }
});
exports.getStundetsByTeacher = getStundetsByTeacher;
//Get all students
const getallStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield alumno_1.default.find();
    return res.status(200).json(users);
});
exports.getallStudents = getallStudents;
