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
exports.GetAttendace = exports.NewAttendance = void 0;
const asistencia_1 = __importDefault(require("../models/asistencia"));
//FUNCION PARA CREAR TOKEN
//Registrar asistencia
const NewAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id_alumno || !req.body.fecha || !req.body.grado || !req.body.seccion) {
        return res.status(400).json({ msg: 'Error no llegaron todos los datos' });
    }
    const Asistencia = yield asistencia_1.default.findOne({ id_alumno: req.body.id_alumno, fecha: req.body.fecha });
    if (Asistencia) {
        return res.status(400).json({ msg: 'El alumno ya ingreso el dia de hoy' });
    }
    //GUARDAR asistencia
    const NewAttendance = new asistencia_1.default(req.body);
    yield NewAttendance.save();
    return res.status(201).json({ NewAttendance, msg: 'Asistencia registrada exitosamente' });
});
exports.NewAttendance = NewAttendance;
//Get all students
const GetAttendace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ msg: 'Ingrese el id del alumno a evaluar' });
    }
    const attendance = yield asistencia_1.default.find({ id_alumno: req.params.id });
    return res.status(200).json({ msg: `Asistencias del alumno con id : ${req.params.id}`, attendance });
});
exports.GetAttendace = GetAttendace;
