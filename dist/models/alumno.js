"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//EL ESQUEMA DE Alumno
const StudentSchema = new mongoose_1.Schema({
    nombrecompleto: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    url_foto: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    cedula: {
        type: String,
        unique: true,
        require: true
    },
    edad: {
        type: String,
        require: true
    },
    genero: {
        type: String,
        require: true
    },
    id_curso: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    idHuella: {
        type: Number,
        require: false
    }
});
exports.default = (0, mongoose_1.model)('alumnos', StudentSchema);
