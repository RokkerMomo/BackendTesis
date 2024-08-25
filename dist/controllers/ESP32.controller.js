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
exports.AddFingerPrintESP32 = exports.FindESP32 = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const FindESP32 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    };
    const url = `http://192.168.1.102/findSensor`;
    try {
        const response = yield (0, node_fetch_1.default)(url, requestOptions);
        if (!response.ok) {
            console.log("no se encontro el lector equisded");
            return res.status(400).json({ msg: "error con el fetch idk" });
        }
        else {
            const json = yield response.json();
            return res.status(200).json({ json });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "error con el fetch idk" });
    }
});
exports.FindESP32 = FindESP32;
//Get all users para probar con el esp32
const AddFingerPrintESP32 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    };
    const url = `http://192.168.1.102/?param1=${req.params.id}`;
    try {
        const response = yield (0, node_fetch_1.default)(url, requestOptions);
        if (!response.ok) {
            console.log("no se encontro el lector equisded");
            return res.status(400).json({ msg: "error con el fetch idk" });
        }
        else {
            const json = yield response.json();
            return res.status(200).json({ json });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "error con el fetch idk" });
    }
});
exports.AddFingerPrintESP32 = AddFingerPrintESP32;
