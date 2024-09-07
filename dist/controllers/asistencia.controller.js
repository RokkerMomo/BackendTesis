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
        return res.status(400).json({ msg: 'Not all the data arrived' });
    }
    const today = new Date();
    const alumno = yield alumno_1.default.findOne({ idHuella: req.body.idHuella });
    if (!alumno) {
        return res.status(400).json({ msg: 'That fingerprint is not assigned to any student.' });
    }
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const Class = yield clase_1.default.find(({ $and: [
            { id_curso: alumno.id_curso },
            { dia: weekday[today.getDay()] }
        ] }));
    if (Class.length == 0) {
        return res.status(400).json({ msg: 'The student does not have class today' });
    }
    if (today.toLocaleTimeString('en-GB') > Class[0].horaStart && today.toLocaleTimeString('en-GB') < Class[0].TimeFinish) {
        const Asistencia = yield asistencia_1.default.findOne({ id_alumno: alumno._id, fecha: today.toLocaleDateString() });
        if (Asistencia) {
            return res.status(400).json({ msg: 'The student already entered today' });
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
        return res.status(200).json({ NewAttendance, msg: 'Successfully registered attendance' });
    }
    else {
        return res.status(400).json({ msg: `It's not class time` });
    }
});
exports.NewAttendance = NewAttendance;
//Get all students
const GetAttendace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.id);
    if (!req.body.id || !req.body.IdCurso) {
        return res.status(400).json({ msg: 'Enter the ID of the student to evaluate' });
    }
    console.log(req.body.IdCurso);
    const attendance = yield asistencia_1.default.find({ id_alumno: req.body.id, id_curso: req.body.IdCurso });
    return res.status(200).json({ msg: `Student attendance with ID : ${req.body.id}`, attendance });
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
        return res.status(400).json({ msg: 'Error not all data arrived' });
    }
    const today = new Date(req.body.fecha);
    const alumno = yield alumno_1.default.findOne({ _id: req.body.id });
    if (!alumno) {
        return res.status(400).json({ msg: 'Student not found' });
    }
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const Class = yield clase_1.default.find(({ $and: [
            { id_curso: alumno.id_curso },
            { dia: weekday[today.getDay()] }
        ] }));
    if (Class.length == 0) {
        return res.status(400).json({ msg: 'The student does not have class that day' });
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
            return res.status(400).json({ msg: 'The student does not have class that day' });
        }
    }
    const Asistencia = yield asistencia_1.default.findOne({ id_alumno: alumno._id, fecha: today.toLocaleDateString() });
    if (Asistencia) {
        return res.status(400).json({ msg: 'The student already entered today' });
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
        return res.status(200).json({ NewAttendance, msg: 'Successfully registered attendance' });
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
    return res.status(200).json({ NewAttendance, msg: 'Successfully registered attendance' });
});
exports.NewAttendanceEdit = NewAttendanceEdit;
const DeleteAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id_alumno || !req.body.fecha || !req.body.id_curso) {
        return res.status(400).json({ msg: "Enter all data" });
    }
    const attendance = yield asistencia_1.default.findOne({
        fecha: req.body.fecha,
        id_alumno: req.body.id_alumno,
        id_curso: req.body.id_curso
    });
    if (!attendance) {
        return res.status(400).json({ msg: "The student did not attend that day" });
    }
    yield asistencia_1.default.deleteOne({
        fecha: req.body.fecha,
        id_alumno: req.body.id_alumno,
        id_curso: req.body.id_curso
    });
    return res.status(200).json({ msg: "Deleted successfully" });
});
exports.DeleteAttendance = DeleteAttendance;
