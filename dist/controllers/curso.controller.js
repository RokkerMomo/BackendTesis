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
exports.getsections = exports.getGrades = exports.NewGrade = void 0;
const curso_1 = __importDefault(require("../models/curso"));
const NewGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id_profesor || !req.body.nombreCurso || !req.body.cantidad) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const grade = yield curso_1.default.findOne({ nombreCurso: req.body.nombreCurso });
    if (grade) {
        return res.status(400).json({ msg: 'El Curso que ingreso ya existe' });
    }
    if (req.body.cantidad > 3) {
        return res.status(400).json({ msg: 'Maximo de secciones 3' });
    }
    for (let index = 1; index <= req.body.cantidad; index++) {
        if (index == 1) {
            const payload = {
                id_profesor: req.body.id_profesor,
                nombreCurso: req.body.nombreCurso,
                seccion: "A",
            };
            const newGrade = new curso_1.default(payload);
            yield newGrade.save();
        }
        else {
            if (index == 2) {
                const payload = {
                    id_profesor: req.body.id_profesor,
                    nombreCurso: req.body.nombreCurso,
                    seccion: "B",
                };
                const newGrade = new curso_1.default(payload);
                yield newGrade.save();
            }
            else {
                const payload = {
                    id_profesor: req.body.id_profesor,
                    nombreCurso: req.body.nombreCurso,
                    seccion: "C",
                };
                const newGrade = new curso_1.default(payload);
                yield newGrade.save();
            }
        }
    }
    return res.status(200).json({ msg: "curso creado con exito" });
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
//Get all sections
const getsections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Ingrese el id del curso' });
    }
    const grades = yield curso_1.default.find({ nombreCurso: req.params.id });
    return res.status(200).json(grades);
});
exports.getsections = getsections;
