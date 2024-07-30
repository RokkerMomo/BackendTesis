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
exports.getsections = exports.getstudentgrade = exports.getGrades = exports.NewGrade = void 0;
const curso_1 = __importDefault(require("../models/curso"));
const clase_1 = __importDefault(require("../models/clase"));
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
    const total = req.body.duracionCurso * req.body.dias.length;
    const payloadcurso = {
        id_profesor: req.body.id_profesor,
        nombreCurso: req.body.nombreCurso,
        seccion: req.body.seccion,
        fechaInicio: req.body.fechaInicio,
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
        console.log(payloadClase);
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
//Get all sections
const getsections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Ingrese el id del curso' });
    }
    const grades = yield curso_1.default.find({ nombreCurso: req.params.id });
    return res.status(200).json(grades);
});
exports.getsections = getsections;
