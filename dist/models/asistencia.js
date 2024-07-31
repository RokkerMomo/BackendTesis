"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//EL ESQUEMA DE asistencia
const AttendanceSchema = new mongoose_1.Schema({
    id_alumno: {
        type: String,
        required: true,
    },
    id_curso: {
        type: String,
        require: true
    },
    seccion: {
        type: String,
        require: true
    },
    fecha: {
        type: String,
        require: true
    },
    hora: {
        type: String,
        require: true
    }
});
exports.default = (0, mongoose_1.model)('Asistencia', AttendanceSchema);
