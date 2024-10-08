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
exports.EditStudent = exports.DeleteStudent = exports.addFingerPrint = exports.getStudentByID = exports.getallStudents = exports.getStundetsByTeacher = exports.getallStudent = exports.SearchStudentByGrade = exports.SearchStudent = exports.NewStudent = void 0;
const alumno_1 = __importDefault(require("../models/alumno"));
const curso_1 = __importDefault(require("../models/curso"));
const asistencia_1 = __importDefault(require("../models/asistencia"));
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
        return res.status(400).json({ msg: 'The student already exists, verify ID and full name' });
    }
    const payload = {
        nombrecompleto: req.body.nombrecompleto,
        url_foto: req.body.url_foto,
        cedula: req.body.cedula,
        edad: req.body.edad,
        genero: req.body.genero,
        id_curso: req.body.id_curso,
        idHuella: 0
    };
    //GUARDAR Alumno
    const newStudent = new alumno_1.default(payload);
    yield newStudent.save();
    return res.status(201).json({ newStudent, msg: 'Student registered correctly' });
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
        return res.status(400).json({ msg: "No student found" });
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
        return res.status(400).json({ msg: "There are no students in that section" });
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
        return res.status(400).json({ msg: 'Make sure all the data is there' });
    }
    const grades = yield curso_1.default.find({ id_profesor: req.params.id });
    const payload = [];
    for (let index = 0; index < grades.length; index++) {
        const student = yield alumno_1.default.find({ id_curso: grades[index]._id });
        for (let y = 0; y < student.length; y++) {
            if (student) {
                const attendance = yield asistencia_1.default.find({ $and: [
                        { id_alumno: student[y]._id },
                        { id_curso: grades[index]._id }
                    ] });
                const percentage = ((attendance.length * 1) / grades[index].totalClases) * 100;
                const payloadStudent = {
                    _id: student[y]._id,
                    nombrecompleto: student[y].nombrecompleto,
                    url_foto: student[y].url_foto,
                    cedula: student[y].cedula,
                    edad: student[y].edad,
                    genero: student[y].genero,
                    id_curso: student[y].id_curso,
                    idHuella: student[y].idHuella,
                    percentage: percentage
                };
                payload.push(payloadStudent);
            }
        }
    }
    if (payload.length != 0) {
        return res.status(200).json(payload);
    }
    else {
        return res.status(400).json({ msg: "Teacher has no students" });
    }
});
exports.getStundetsByTeacher = getStundetsByTeacher;
//Get all students
const getallStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grades = yield curso_1.default.find();
    const payload = [];
    const studentsNoGrade = yield alumno_1.default.find({ id_curso: "No Grade assigned" });
    console.log(studentsNoGrade);
    for (let index = 0; index < studentsNoGrade.length; index++) {
        console.log(studentsNoGrade[index]);
        const payloadStudent = {
            _id: studentsNoGrade[index]._id,
            nombrecompleto: studentsNoGrade[index].nombrecompleto,
            url_foto: studentsNoGrade[index].url_foto,
            cedula: studentsNoGrade[index].cedula,
            edad: studentsNoGrade[index].edad,
            genero: studentsNoGrade[index].genero,
            id_curso: studentsNoGrade[index].id_curso,
            idHuella: studentsNoGrade[index].idHuella,
            percentage: 0
        };
        payload.push(payloadStudent);
    }
    //payload.push(studentsNoGrade)
    for (let index = 0; index < grades.length; index++) {
        const student = yield alumno_1.default.find({ id_curso: grades[index]._id });
        for (let y = 0; y < student.length; y++) {
            if (student) {
                const attendance = yield asistencia_1.default.find({ $and: [
                        { id_alumno: student[y]._id },
                        { id_curso: grades[index]._id }
                    ] });
                const percentage = ((attendance.length * 1) / grades[index].totalClases) * 100;
                const payloadStudent = {
                    _id: student[y]._id,
                    nombrecompleto: student[y].nombrecompleto,
                    url_foto: student[y].url_foto,
                    cedula: student[y].cedula,
                    edad: student[y].edad,
                    genero: student[y].genero,
                    id_curso: student[y].id_curso,
                    idHuella: student[y].idHuella,
                    percentage: percentage
                };
                payload.push(payloadStudent);
            }
        }
    }
    if (payload.length != 0) {
        return res.status(200).json(payload);
    }
    else {
        return res.status(400).json({ msg: "There are no students" });
    }
});
exports.getallStudents = getallStudents;
const getStudentByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: "Enter the student ID" });
    }
    const student = yield alumno_1.default.findOne({ _id: req.params.id });
    if (!student) {
        return res.status(400).json({ msg: "The entered id does not exist" });
    }
    return res.status(200).json(student);
});
exports.getStudentByID = getStudentByID;
const addFingerPrint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id || !req.body.huella) {
        return res.status(400).json({ msg: "Enter all data" });
    }
    const filter = { _id: req.body.id };
    const update = { idHuella: req.body.huella };
    const student = yield alumno_1.default.findOneAndUpdate(filter, update);
    return res.status(200).json({ student, msg: "Successfully Added Footprint" });
});
exports.addFingerPrint = addFingerPrint;
const DeleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: "Enter the id" });
    }
    console.log(req.params.id);
    const student = yield alumno_1.default.findOne({ _id: req.params.id });
    console.log(student);
    if (!student) {
        return res.status(400).json({ msg: "The student was not found" });
    }
    yield alumno_1.default.deleteOne({ _id: req.params.id });
    return res.status(200).json({ msg: "Eliminated Student" });
});
exports.DeleteStudent = DeleteStudent;
const EditStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.nombrecompleto ||
        !req.body.cedula ||
        !req.body.gender ||
        !req.body.age ||
        !req.body.id_curso) {
        return res.status(400).json({ msg: 'Make sure all the data is there' });
    }
    const student = yield alumno_1.default.findOne({ _id: req.body.id });
    if (!student) {
        return res.status(400).json({ msg: 'No student Found' });
    }
    const filter = { _id: req.body.id };
    const update = {
        nombrecompleto: req.body.nombrecompleto,
        cedula: req.body.cedula,
        genero: req.body.gender,
        edad: req.body.age,
        id_curso: req.body.id_curso,
    };
    const doc = yield alumno_1.default.findOneAndUpdate(filter, update);
    return res.status(200).json({ doc, msg: "Edited Successfully" });
});
exports.EditStudent = EditStudent;
