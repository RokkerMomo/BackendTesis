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
exports.getallStudent = exports.SearchStudentByGrade = exports.SearchStudent = exports.NewStudent = void 0;
const alumno_1 = __importDefault(require("../models/alumno"));
//FUNCION PARA CREAR TOKEN
//REGISTRO
const NewStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.nombrecompleto || !req.body.cedula || !req.body.grado || !req.body.seccion) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const Student = yield alumno_1.default.findOne({ $or: [
            { nombrecompleto: req.body.nombrecompleto },
            { cedula: req.body.cedula }
        ] });
    if (Student) {
        return res.status(400).json({ msg: 'El alumno ya existe, verificar cedula y nombre completo' });
    }
    //GUARDAR USUARIO
    const newStudent = new alumno_1.default(req.body);
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
//Buscar alumnos por cedula o por nombre
const SearchStudentByGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Students = yield alumno_1.default.find({ $and: [
            { grado: req.body.grado },
            { seccion: req.body.seccion }
        ] });
    if (Students.length === 0) {
        return res.status(400).json({ msg: "no hay alumnos en esa seccion" });
    }
    return res.status(200).json(Students);
});
exports.SearchStudentByGrade = SearchStudentByGrade;
//Get all students
const getallStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield alumno_1.default.find();
    return res.status(200).json(users);
});
exports.getallStudent = getallStudent;
