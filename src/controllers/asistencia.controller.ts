import { Request, Response } from "express"
import asistencia,{ IAttendance } from "../models/asistencia";
import alumnos, {IStudent} from "../models/alumno"
import jwt from 'jsonwebtoken'
import config from "../config/config";
//FUNCION PARA CREAR TOKEN

//Registrar asistencia
export const NewAttendance = async (req: Request,res: Response): Promise<Response> =>{
    if (!req.body.idHuella){
        return res.status(400).json({msg:'Error no llegaron todos los datos'})
    }
    const today = new Date()
    const alumno:any = await alumnos.findOne({idHuella:req.body.idHuella})
    if (!alumno) {
        return res.status(400).json({msg:'Esa huella no esta asignada a ningun alumno'});
    }
    const Asistencia = await asistencia.findOne({id_alumno: alumno._id, fecha: today}) 
    if(Asistencia){
        return res.status(400).json({msg:'El alumno ya ingreso el dia de hoy'});
    }
    //GUARDAR asistencia
    const payload = {
    id_alumno:alumno._id,
    grado:alumno.grado,
    seccion:alumno.seccion,
    fecha:today
    }
    const NewAttendance = new asistencia(payload);
    await NewAttendance.save();
    return res.status(200).json({NewAttendance,msg:'Asistencia registrada exitosamente'});
}

//Get all students
export const GetAttendace = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Ingrese el id del alumno a evaluar'})
    }
    const attendance = await asistencia.find({id_alumno:req.params.id});
    return res.status(200).json({msg:`Asistencias del alumno con id : ${req.params.id}`, attendance})
  }