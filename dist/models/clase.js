"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ClassSchema = new mongoose_1.Schema({
    id_curso: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    dia: {
        type: String,
        require: true
    },
    horaStart: {
        type: String,
        require: true
    },
    TimeFinish: {
        type: String,
        require: true
    }
});
exports.default = (0, mongoose_1.model)('clases', ClassSchema);
