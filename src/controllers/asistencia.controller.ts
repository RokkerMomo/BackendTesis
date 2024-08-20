import { Request, Response } from "express"
import asistencia,{ IAttendance } from "../models/asistencia";
import alumnos, {IStudent} from "../models/alumno"
import clases,{ Iclass } from "../models/clase";
import cursos,{ Igrade } from "../models/curso";

//Registrar asistencia
export const NewAttendance = async (req: Request,res: Response): Promise<Response> =>{
    if (!req.body.idHuella){
        return res.status(400).json({msg:'Not all the data arrived'})
    }
    const today = new Date()
    const alumno:any = await alumnos.findOne({idHuella:req.body.idHuella})
    if (!alumno) {
        return res.status(400).json({msg:'That fingerprint is not assigned to any student.'});
    }

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const Class:any = await clases.find(({$and: [
        {id_curso:alumno.id_curso},
        {dia: weekday[today.getDay()]}
    ]}))
    if (Class.length==0) {
        return res.status(400).json({msg:'The student does not have class today'});
    }
    
    if (today.toLocaleTimeString('en-GB')>Class[0].horaStart && today.toLocaleTimeString('en-GB')<Class[0].TimeFinish) {

        const Asistencia = await asistencia.findOne({id_alumno: alumno._id, fecha: today.toLocaleDateString()})

    if(Asistencia){
        return res.status(400).json({msg:'The student already entered today'});
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
    return res.status(200).json({NewAttendance,msg:'Successfully registered attendance'});

    }else{
        return res.status(400).json({msg:`It's not class time`});
    }
}

//Get all students
export const GetAttendace = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Enter the ID of the student to evaluate'})
    }
    const attendance = await asistencia.find({id_alumno:req.params.id});
    return res.status(200).json({msg:`Student attendance with ID : ${req.params.id}`, attendance})
  }


  function addMinutes(time:any, minsToAdd:any) {
    function D(J:any){ return (J<10? '0':'') + J;};
    var piece = time.split(':');
    var mins = piece[0]*60 + +piece[1] + +minsToAdd;
  
    return D(mins%(24*60)/60 | 0) + ':' + D(mins%60) + ":00";  
  }



  export const NewAttendanceEdit = async (req:Request,res:Response):Promise<Response> => {
    if (!req.body.id || !req.body.fecha || !req.body.time){
        return res.status(400).json({msg:'Error not all data arrived'})
    }
    const today = new Date(req.body.fecha)
    const alumno:any = await alumnos.findOne({_id:req.body.id})
    if (!alumno) {
        return res.status(400).json({msg:'Student not found'});
    }

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const Class:any = await clases.find(({$and: [
        {id_curso:alumno.id_curso},
        {dia: weekday[today.getDay()]}
    ]}))
    if (Class.length==0) {
        return res.status(400).json({msg:'The student does not have class that day'});
    }

    const grade:any = await cursos.find({_id:alumno.id_curso});
    const StartDate = new Date(grade[0].fechaInicio)
    const FinalDate = new Date(grade[0].fechaFin)

    for (let index = 0; index < Class.length; index++) {
        if (
            today >= StartDate && 
            today <=FinalDate && 
            Class[index].dia==weekday[today.getDay()] 
          ) {
    
        }else{
        
            return res.status(400).json({msg:'The student does not have class that day'});
        }
        
      }

    

        const Asistencia = await asistencia.findOne({id_alumno: alumno._id, fecha: today.toLocaleDateString()})

    if(Asistencia){
        return res.status(400).json({msg:'The student already entered today'});
    }
    //GUARDAR asistencia
    if (req.body.time == "on time") {
        const payload = {
            id_alumno:alumno._id,
            id_curso:alumno.id_curso,
            fecha:req.body.fecha,
            hora:Class[0].horaStart,
            nota:req.body.note
            }
            const NewAttendance = new asistencia(payload);
            await NewAttendance.save();
            return res.status(200).json({NewAttendance,msg:'Successfully registered attendance'});
    }
    const payload = {
        id_alumno:alumno._id,
        id_curso:alumno.id_curso,
        fecha:req.body.fecha,
        hora:addMinutes(Class[0].horaStart,'30'),
        nota:req.body.note
        }
        const NewAttendance = new asistencia(payload);
        await NewAttendance.save();
        return res.status(200).json({NewAttendance,msg:'Successfully registered attendance'});
   
    

  }


  export const DeleteAttendance = async (req:Request, res:Response):Promise<Response> => {

    if (!req.body.id_alumno || !req.body.fecha || !req.body.id_curso) {

        return res.status(400).json({msg:"Enter all data"})
    }

    const attendance = await asistencia.findOne({
        fecha:req.body.fecha,
        id_alumno:req.body.id_alumno,
        id_curso:req.body.id_curso})

    if (!attendance) {
        return res.status(400).json({msg:"The student did not attend that day"})
    }

    await asistencia.deleteOne({
        fecha:req.body.fecha,
        id_alumno:req.body.id_alumno,
        id_curso:req.body.id_curso
    })

    return res.status(200).json({msg:"Deleted successfully"})
  }