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
exports.DeleteAttendance = exports.NewAttendanceEdit = exports.GetAttendace = exports.NewAttendance = void 0;
const asistencia_1 = __importDefault(require("../models/asistencia"));
const alumno_1 = __importDefault(require("../models/alumno"));
const clase_1 = __importDefault(require("../models/clase"));
const curso_1 = __importDefault(require("../models/curso"));
//Registrar asistencia
const NewAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.idHuella) {
        return res.status(400).json({ msg: 'Error no llegaron todos los datos' });
    }
    const today = new Date();
    const alumno = yield alumno_1.default.findOne({ idHuella: req.body.idHuella });
    if (!alumno) {
        return res.status(400).json({ msg: 'Esa huella no esta asignada a ningun alumno' });
    }
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const Class = yield clase_1.default.find(({ $and: [
            { id_curso: alumno.id_curso },
            { dia: weekday[today.getDay()] }
        ] }));
    if (Class.length == 0) {
        return res.status(400).json({ msg: 'El alumno no tiene clase hoy' });
    }
    if (today.toLocaleTimeString('en-GB') > Class[0].horaStart && today.toLocaleTimeString('en-GB') < Class[0].TimeFinish) {
        const Asistencia = yield asistencia_1.default.findOne({ id_alumno: alumno._id, fecha: today.toLocaleDateString() });
        if (Asistencia) {
            return res.status(400).json({ msg: 'El alumno ya ingreso el dia de hoy' });
        }
        //GUARDAR asistencia
        const payload = {
            id_alumno: alumno._id,
            id_curso: alumno.id_curso,
            fecha: today.toLocaleDateString(),
            hora: today.toLocaleTimeString('en-GB')
        };
        const NewAttendance = new asistencia_1.default(payload);
        yield NewAttendance.save();
        return res.status(200).json({ NewAttendance, msg: 'Asistencia registrada exitosamente' });
    }
    else {
        return res.status(400).json({ msg: 'No es Hora de Clase' });
    }
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
function addMinutes(time, minsToAdd) {
    function D(J) { return (J < 10 ? '0' : '') + J; }
    ;
    var piece = time.split(':');
    var mins = piece[0] * 60 + +piece[1] + +minsToAdd;
    return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60) + ":00";
}
const NewAttendanceEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id || !req.body.fecha || !req.body.time) {
        return res.status(400).json({ msg: 'Error no llegaron todos los datos' });
    }
    const today = new Date(req.body.fecha);
    const alumno = yield alumno_1.default.findOne({ _id: req.body.id });
    if (!alumno) {
        return res.status(400).json({ msg: 'Alumno no encontrado' });
    }
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const Class = yield clase_1.default.find(({ $and: [
            { id_curso: alumno.id_curso },
            { dia: weekday[today.getDay()] }
        ] }));
    if (Class.length == 0) {
        return res.status(400).json({ msg: 'El alumno no tiene clase ese dia' });
    }
    const grade = yield curso_1.default.find({ _id: alumno.id_curso });
    const StartDate = new Date(grade[0].fechaInicio);
    const FinalDate = new Date(grade[0].fechaFin);
    for (let index = 0; index < Class.length; index++) {
        if (today >= StartDate &&
            today <= FinalDate &&
            Class[index].dia == weekday[today.getDay()]) {
        }
        else {
            return res.status(400).json({ msg: 'El alumno no tiene clase ese dia' });
        }
    }
    const Asistencia = yield asistencia_1.default.findOne({ id_alumno: alumno._id, fecha: today.toLocaleDateString() });
    if (Asistencia) {
        return res.status(400).json({ msg: 'El alumno ya ingreso el dia de hoy' });
    }
    //GUARDAR asistencia
    if (req.body.time == "on time") {
        const payload = {
            id_alumno: alumno._id,
            id_curso: alumno.id_curso,
            fecha: req.body.fecha,
            hora: Class[0].horaStart,
            nota: req.body.note
        };
        const NewAttendance = new asistencia_1.default(payload);
        yield NewAttendance.save();
        return res.status(200).json({ NewAttendance, msg: 'Asistencia registrada exitosamente' });
    }
    const payload = {
        id_alumno: alumno._id,
        id_curso: alumno.id_curso,
        fecha: req.body.fecha,
        hora: addMinutes(Class[0].horaStart, '30'),
        nota: req.body.note
    };
    const NewAttendance = new asistencia_1.default(payload);
    yield NewAttendance.save();
    return res.status(200).json({ NewAttendance, msg: 'Asistencia registrada exitosamente' });
});
exports.NewAttendanceEdit = NewAttendanceEdit;
const DeleteAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id_alumno || !req.body.fecha || !req.body.id_curso) {
        return res.status(400).json({ msg: "ingrese todos los datos" });
    }
    const attendance = yield asistencia_1.default.findOne({
        fecha: req.body.fecha,
        id_alumno: req.body.id_alumno,
        id_curso: req.body.id_curso
    });
    if (!attendance) {
        return res.status(400).json({ msg: "El alumno no asistio ese dia" });
    }
    yield asistencia_1.default.deleteOne({
        fecha: req.body.fecha,
        id_alumno: req.body.id_alumno,
        id_curso: req.body.id_curso
    });
    return res.status(200).json({ msg: "Borrado con exito" });
});
exports.DeleteAttendance = DeleteAttendance;
