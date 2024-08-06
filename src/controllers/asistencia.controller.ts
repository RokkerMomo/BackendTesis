import { Request, Response } from "express"
import asistencia,{ IAttendance } from "../models/asistencia";
import alumnos, {IStudent} from "../models/alumno"
import clases,{ Iclass } from "../models/clase";


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

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const Class:any = await clases.find(({$and: [
        {id_curso:alumno.id_curso},
        {dia: weekday[today.getDay()]}
    ]}))
    if (Class.length==0) {
        return res.status(400).json({msg:'El alumno no tiene clase hoy'});
    }
    
    if (today.toLocaleTimeString('en-GB')>Class[0].horaStart && today.toLocaleTimeString('en-GB')<Class[0].TimeFinish) {

        const Asistencia = await asistencia.findOne({id_alumno: alumno._id, fecha: today.toLocaleDateString()})

    if(Asistencia){
        return res.status(400).json({msg:'El alumno ya ingreso el dia de hoy'});
    }
    //GUARDAR asistencia
    const payload = {
    id_alumno:alumno._id,
    id_curso:alumno.id_curso,
    fecha:today.toLocaleDateString(),
    hora:today.toLocaleTimeString('en-GB')
    }
    const NewAttendance = new asistencia(payload);
    await NewAttendance.save();
    return res.status(200).json({NewAttendance,msg:'Asistencia registrada exitosamente'});

    }else{
        return res.status(400).json({msg:'No es Hora de Clase'});
    }
}

//Get all students
export const GetAttendace = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Ingrese el id del alumno a evaluar'})
    }
    const attendance = await asistencia.find({id_alumno:req.params.id});
    return res.status(200).json({msg:`Asistencias del alumno con id : ${req.params.id}`, attendance})
  }




  export const NewAttendanceEdit = async (req:Request,res:Response):Promise<Response> => {
    if (!req.body.id || !req.body.fecha){
        return res.status(400).json({msg:'Error no llegaron todos los datos'})
    }
    const today = new Date(req.body.fecha)
    console.log(today)
    const alumno:any = await alumnos.findOne({_id:req.body.id})
    if (!alumno) {
        return res.status(400).json({msg:'Alumno no encontrado'});
    }

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const Class:any = await clases.find(({$and: [
        {id_curso:alumno.id_curso},
        {dia: weekday[today.getDay()]}
    ]}))
  
    

        const Asistencia = await asistencia.findOne({id_alumno: alumno._id, fecha: today.toLocaleDateString()})

    if(Asistencia){
        return res.status(400).json({msg:'El alumno ya ingreso el dia de hoy'});
    }
    //GUARDAR asistencia
    const payload = {
    id_alumno:alumno._id,
    id_curso:alumno.id_curso,
    fecha:req.body.fecha,
    hora:Class[0].horaStart
    }
    const NewAttendance = new asistencia(payload);
    await NewAttendance.save();
    return res.status(200).json({NewAttendance,msg:'Asistencia registrada exitosamente'});

  }