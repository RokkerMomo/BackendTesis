"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//EL ESQUEMA DE Alumno
const UserSchema = new mongoose_1.Schema({
    grado: {
        type: String,
        require: true
    },
    seccion: {
        type: String,
        require: true
    },
});
exports.default = (0, mongoose_1.model)('grados', UserSchema);