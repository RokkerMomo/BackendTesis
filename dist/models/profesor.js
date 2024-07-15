"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TeacherSchema = new mongoose_1.Schema({
    nombrecompleto: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    usuario: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    }
});
exports.default = (0, mongoose_1.model)('profesor', TeacherSchema);
