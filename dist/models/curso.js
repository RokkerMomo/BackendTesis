"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GradeSchema = new mongoose_1.Schema({
    id_profesor: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    nombreCurso: {
        type: String,
        require: true
    },
    seccion: {
        type: String,
        require: true
    },
    fechaInicio: {
        type: Date,
        require: true
    },
    duracionCurso: {
        type: Number,
        require: true
    },
    totalClases: {
        type: Number,
        require: true
    },
});
exports.default = (0, mongoose_1.model)('cursos', GradeSchema);
