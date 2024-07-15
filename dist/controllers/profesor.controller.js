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
exports.getallTeachers = exports.newTeacher = void 0;
const profesor_1 = __importDefault(require("../models/profesor"));
const newTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.nombrecompleto || !req.body.usuario || !req.body.password) {
        return res.status(400).json({ msg: 'Asegurese de que esten todos los datos' });
    }
    const newTeacher = new profesor_1.default(req.body);
    yield newTeacher.save();
    return res.status(200).json({ msg: "profesor creado" });
});
exports.newTeacher = newTeacher;
//Get all users para probar con el esp32
const getallTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teachers = yield profesor_1.default.find();
    return res.status(200).json(teachers);
});
exports.getallTeachers = getallTeachers;
