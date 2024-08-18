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
exports.EditGrade = exports.GetGrade = exports.getGradesFullData = exports.getTeacherGrades = exports.getsections = exports.getgradebystudentID = exports.getstudentgrade = exports.getGrades = exports.NewGrade = void 0;
const curso_1 = __importDefault(require("../models/curso"));
const clase_1 = __importDefault(require("../models/clase"));
const alumno_1 = __importDefault(require("../models/alumno"));
const profesor_1 = __importDefault(require("../models/profesor"));
const NewGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.HoraEnd ||
        !req.body.id_profesor ||
        !req.body.nombreCurso ||
        !req.body.seccion ||
        !req.body.fechaInicio ||
        !req.body.duracionCurso) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const grade = yield curso_1.default.findOne({ $and: [
            { nombreCurso: req.body.nombreCurso },
            { seccion: req.body.seccion }
        ] });
    if (grade) {
        return res.status(400).json({ msg: 'El Curso que ingreso ya existe' });
    }
    //GUARDAR Curso
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const total = req.body.duracionCurso * req.body.dias.length;
    let diasTotales = total - 1;
    let fechaFin = new Date(req.body.fechaInicio);
    while (diasTotales > 0) {
        fechaFin.setDate(fechaFin.getDate() + 1);
        if (req.body.dias.includes(weekday[fechaFin.getDay()])) {
            diasTotales--;
        }
    }
    const FechaFinal = fechaFin.toLocaleDateString();
    const payloadcurso = {
        id_profesor: req.body.id_profesor,
        nombreCurso: req.body.nombreCurso,
        seccion: req.body.seccion,
        fechaInicio: req.body.fechaInicio,
        fechaFin: FechaFinal,
        duracionCurso: req.body.duracionCurso,
        totalClases: total
    };
    const newCurso = new curso_1.default(payloadcurso);
    yield newCurso.save();
    for (let index = 0; index < req.body.dias.length; index++) {
        const payloadClase = {
            id_curso: newCurso._id,
            dia: req.body.dias[index],
            horaStart: req.body.horaStart,
            TimeFinish: req.body.HoraEnd,
        };
        const newclase = new clase_1.default(payloadClase);
        yield newclase.save();
    }
    return res.status(201).json({ newCurso, msg: 'Curso registrado correctamente' });
});
exports.NewGrade = NewGrade;
//Get all grades
const getGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grades = yield curso_1.default.find();
    const uniqueArrayUsingFilter = grades.filter((value, index, self) => {
        return self.findIndex((obj) => obj.nombreCurso === value.nombreCurso) === index;
    });
    return res.status(200).json(uniqueArrayUsingFilter);
});
exports.getGrades = getGrades;
//Get all grades
const getstudentgrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const grade = yield curso_1.default.find({ _id: req.params.id });
    return res.status(200).json(grade);
});
exports.getstudentgrade = getstudentgrade;
const getgradebystudentID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const Students = yield alumno_1.default.findOne({ _id: req.params.id });
    const grade = yield curso_1.default.find({ _id: Students.id_curso });
    const classes = yield clase_1.default.find({ id_curso: Students.id_curso });
    return res.status(200).json({ grade, classes });
});
exports.getgradebystudentID = getgradebystudentID;
//Get all sections
const getsections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Ingrese el id del curso' });
    }
    const grades = yield curso_1.default.find({ nombreCurso: req.params.id });
    return res.status(200).json(grades);
});
exports.getsections = getsections;
const getTeacherGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: "Asegurese de ingresar el id del profesor" });
    }
    const grades = yield curso_1.default.find({ id_profesor: req.params.id });
    if (grades.length == 0) {
        return res.status(400).json({ msg: "El profesor no tiene cursos asignados" });
    }
    return res.status(200).json(grades);
});
exports.getTeacherGrades = getTeacherGrades;
//Get all grades
const getGradesFullData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grades = yield curso_1.default.find();
    const uniqueArrayUsingFilter = grades.filter((value, index, self) => {
        return self.findIndex((obj) => obj.nombreCurso === value.nombreCurso) === index;
    });
    const payload = [];
    for (let index = 0; index < uniqueArrayUsingFilter.length; index++) {
        const students = yield alumno_1.default.find({ id_curso: uniqueArrayUsingFilter[index]._id });
        const classes = yield clase_1.default.find({ id_curso: uniqueArrayUsingFilter[index]._id });
        const teacher = yield profesor_1.default.findOne({ _id: uniqueArrayUsingFilter[index].id_profesor });
        const classespayload = [];
        for (let index = 0; index < classes.length; index++) {
            classespayload.push(classes[index].dia);
        }
        const gradepayload = {
            _id: uniqueArrayUsingFilter[index]._id,
            id_profesor: teacher.nombrecompleto,
            nombreCurso: uniqueArrayUsingFilter[index].nombreCurso,
            seccion: uniqueArrayUsingFilter[index].seccion,
            fechaInicio: uniqueArrayUsingFilter[index].fechaInicio,
            fechaFin: uniqueArrayUsingFilter[index].fechaFin,
            starttime: classes[0].horaStart,
            endtime: classes[0].TimeFinish,
            duracionCurso: uniqueArrayUsingFilter[index].duracionCurso,
            totalClases: uniqueArrayUsingFilter[index].totalClases,
            students: students.length,
            classes: classespayload
        };
        payload.push(gradepayload);
    }
    return res.status(200).json(payload);
});
exports.getGradesFullData = getGradesFullData;
//Get all grades
const GetGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const grade = yield curso_1.default.findOne({ _id: req.params.id });
    const payload = [];
    const classes = yield clase_1.default.find({ id_curso: grade._id });
    const teacher = yield profesor_1.default.findOne({ _id: grade.id_profesor });
    const classespayload = [];
    for (let index = 0; index < classes.length; index++) {
        classespayload.push(classes[index].dia);
    }
    const gradepayload = {
        _id: grade._id,
        id: teacher._id,
        id_profesor: teacher.nombrecompleto,
        nombreCurso: grade.nombreCurso,
        seccion: grade.seccion,
        fechaInicio: grade.fechaInicio,
        fechaFin: grade.fechaFin,
        starttime: classes[0].horaStart,
        endtime: classes[0].TimeFinish,
        duracionCurso: grade.duracionCurso,
        totalClases: grade.totalClases,
        classes: classespayload
    };
    payload.push(gradepayload);
    return res.status(200).json(payload);
});
exports.GetGrade = GetGrade;
const EditGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.HoraEnd ||
        !req.body.id_profesor ||
        !req.body.nombreCurso ||
        !req.body.seccion ||
        !req.body.fechaInicio ||
        !req.body.duracionCurso) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const grade = yield curso_1.default.findOne({ $and: [
            { nombreCurso: req.body.nombreCurso },
            { seccion: req.body.seccion }
        ] });
    if (grade) {
        return res.status(400).json({ msg: 'El Curso que ingreso ya existe' });
    }
    //GUARDAR Curso
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const total = req.body.duracionCurso * req.body.dias.length;
    let diasTotales = total - 1;
    let fechaFin = new Date(req.body.fechaInicio);
    while (diasTotales > 0) {
        fechaFin.setDate(fechaFin.getDate() + 1);
        if (req.body.dias.includes(weekday[fechaFin.getDay()])) {
            diasTotales--;
        }
    }
    const FechaFinal = fechaFin.toLocaleDateString();
    const filter = { _id: req.body.id };
    const update = {
        id_profesor: req.body.id_profesor,
        nombreCurso: req.body.nombreCurso,
        seccion: req.body.seccion,
        fechaInicio: req.body.fechaInicio,
        fechaFin: FechaFinal,
        duracionCurso: req.body.duracionCurso,
        totalClases: total
    };
    const doc = yield curso_1.default.findOneAndUpdate(filter, update);
    yield clase_1.default.deleteMany({ id_curso: req.body.id });
    for (let index = 0; index < req.body.dias.length; index++) {
        const payloadClase = {
            id_curso: doc._id,
            dia: req.body.dias[index],
            horaStart: req.body.horaStart,
            TimeFinish: req.body.HoraEnd,
        };
        const newclase = new clase_1.default(payloadClase);
        yield newclase.save();
    }
    return res.status(200).json({ doc, msg: "Edited Successfully" });
});
exports.EditGrade = EditGrade;
