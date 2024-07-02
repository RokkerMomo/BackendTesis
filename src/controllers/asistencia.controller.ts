import { Request, Response } from "express"
import asistencia,{ IAttendance } from "../models/asistencia";
import jwt from 'jsonwebtoken'
import config from "../config/config";
//FUNCION PARA CREAR TOKEN

//Registrar asistencia
export const NewAttendance = async (req: Request,res: Response): Promise<Response> =>{
    if (!req.body.id_alumno || !req.body.fecha || !req.body.grado|| !req.body.seccion){
        return res.status(400).json({msg:'Error no llegaron todos los datos'})
    }
    const Asistencia = await asistencia.findOne({id_alumno: req.body.id_alumno, fecha: req.body.fecha}) 
    if(Asistencia){
        return res.status(400).json({msg:'El alumno ya ingreso el dia de hoy'});
    }
    //GUARDAR asistencia
    const NewAttendance = new asistencia(req.body);
    await NewAttendance.save();
    return res.status(201).json({NewAttendance,msg:'Asistencia registrada exitosamente'});
}

//Get all students
export const GetAttendace = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Ingrese el id del alumno a evaluar'})
    }
    const attendance = await asistencia.find({id_alumno:req.params.id});
    return res.status(200).json({msg:`Asistencias del alumno con id : ${req.params.id}`, attendance})
  }