"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//EL ESQUEMA DE asistencia
const UserSchema = new mongoose_1.Schema({
    id_alumno: {
        type: String,
        required: true,
    },
    grado: {
        type: String,
        require: true
    },
    seccion: {
        type: String,
        require: true
    },
    fecha: Date
});
exports.default = (0, mongoose_1.model)('Asistencia', UserSchema);
