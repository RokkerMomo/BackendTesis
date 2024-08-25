import { Request, Response } from "express"
import cursos,{ Igrade } from "../models/curso";
import clases,{ Iclass } from "../models/clase";
import alumnos, {IStudent} from "../models/alumno"
import profesor from "../models/profesor";

export const NewGrade = async (req:Request,res:Response):Promise<Response> => {
    if (
        !req.body.HoraEnd ||
        !req.body.id_profesor || 
        !req.body.nombreCurso|| 
        !req.body.seccion || 
        !req.body.fechaInicio || 
        !req.body.duracionCurso
){
        return res.status(400).json({msg:'Make sure all the data is there'})
    }
    const grade = await cursos.findOne({$and: [
        {nombreCurso: req.body.nombreCurso},
        {seccion: req.body.seccion}
    ]});
    if(grade){
        return res.status(400).json({msg:'The Grade entered already exists'});
    }
    //GUARDAR Curso
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const total = req.body.duracionCurso*req.body.dias.length
    let diasTotales = total - 1
    let fechaFin = new Date(req.body.fechaInicio);
    while (diasTotales >0) {
        fechaFin.setDate(fechaFin.getDate() + 1);
        if (req.body.dias.includes(weekday[fechaFin.getDay()])) {
            diasTotales--;
        }
    }

    const FechaFinal = fechaFin.toLocaleDateString()

    
    const payloadcurso ={
        id_profesor:req.body.id_profesor,
        nombreCurso:req.body.nombreCurso,
        seccion:req.body.seccion,
        fechaInicio:req.body.fechaInicio,
        fechaFin:FechaFinal,
        duracionCurso:req.body.duracionCurso,
        totalClases:total
    }

    const newCurso = new cursos(payloadcurso);
    await newCurso.save();

    for (let index = 0; index < req.body.dias.length; index++) {




        const payloadClase ={

            id_curso:newCurso._id,
            dia:req.body.dias[index],
            horaStart:req.body.horaStart,
            TimeFinish:req.body.HoraEnd,
            
        }
        const newclase = new clases(payloadClase);
        await newclase.save();
    }
    
    return res.status(201).json({newCurso,msg:'Successfully registered grade'});

}


//Get all grades
export const getGrades = async (req : Request, res: Response):Promise<Response>=>{
    const grades:any = await cursos.find();
    const uniqueArrayUsingFilter = grades.filter((value: { nombreCurso: any; }, index: any, self: any[]) => {
        return self.findIndex((obj: { nombreCurso: any; }) => obj.nombreCurso === value.nombreCurso) === index;
      });
    
    return res.status(200).json(uniqueArrayUsingFilter)
  }

  //Get all grades
export const getstudentgrade = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Make sure all the data is there'})
    }
    if (req.params.id=="No Grade assigned") {
        return res.status(200).json([{nombreCurso:"No Grade assigned",seccion:"None"}])
    }
    const grade = await cursos.find({_id:req.params.id});
    return res.status(200).json(grade)
  }

  export const getgradebystudentID = async (req : Request, res: Response):Promise<Response> => {
    if (!req.params.id){
        return res.status(400).json({msg:'Make sure all the data is there'})
    }
    const Students:any = await alumnos.findOne({_id:req.params.id});
    if (Students.id_curso=="No Grade assigned") {
        return res.status(400).json({msg:"No Grade assigned"})
    } 
    const grade:any = await cursos.find({_id:Students.id_curso});
    const classes = await clases.find({id_curso:Students.id_curso});
    return res.status(200).json({grade,classes})
  }

  //Get all sections
export const getsections = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Enter the grade id'})
    }
    const grades = await cursos.find({nombreCurso:req.params.id});
    return res.status(200).json(grades)
  }


export const getTeacherGrades = async (req:Request,res:Response):Promise<Response>=>{
    if (!req.params.id) {
        return res.status(400).json({msg:"Make sure you enter the teacher's ID"})
    }
    const grades = await cursos.find({id_profesor: req.params.id});
    if (grades.length==0) {
        return res.status(400).json({msg:"The teacher has no assigned grades"})
    }
    return res.status(200).json(grades)
}


//Get all grades
export const getGradesFullData = async (req : Request, res: Response):Promise<Response>=>{
    const grades:any = await cursos.find();
    const uniqueArrayUsingFilter = grades.filter((value: { nombreCurso: any; }, index: any, self: any[]) => {
        return self.findIndex((obj: { nombreCurso: any; }) => obj.nombreCurso === value.nombreCurso) === index;
      });


      const payload = []

      for (let index = 0; index < uniqueArrayUsingFilter.length; index++) {
        const students = await alumnos.find({id_curso:uniqueArrayUsingFilter[index]._id})
        const classes:any = await clases.find({id_curso:uniqueArrayUsingFilter[index]._id})
        const teacher:any = await profesor.findOne({_id:uniqueArrayUsingFilter[index].id_profesor})
        const classespayload:any = []

        for (let index = 0; index < classes.length; index++) {
            classespayload.push(classes[index].dia)
            
        }

        if (teacher== null) {

            const gradepayload = {
                _id: uniqueArrayUsingFilter[index]._id,
                id_profesor: "No teacher assigned",
                nombreCurso: uniqueArrayUsingFilter[index].nombreCurso,
                seccion: uniqueArrayUsingFilter[index].seccion,
                fechaInicio: uniqueArrayUsingFilter[index].fechaInicio,
                fechaFin: uniqueArrayUsingFilter[index].fechaFin,
                starttime:classes[0].horaStart,
                endtime:classes[0].TimeFinish,
                duracionCurso: uniqueArrayUsingFilter[index].duracionCurso,
                totalClases: uniqueArrayUsingFilter[index].totalClases,
                students:students.length,
                classes:classespayload
            }
    
            payload.push(gradepayload)
            
        }else{
            const gradepayload = {
                _id: uniqueArrayUsingFilter[index]._id,
                id_profesor: teacher.nombrecompleto,
                nombreCurso: uniqueArrayUsingFilter[index].nombreCurso,
                seccion: uniqueArrayUsingFilter[index].seccion,
                fechaInicio: uniqueArrayUsingFilter[index].fechaInicio,
                fechaFin: uniqueArrayUsingFilter[index].fechaFin,
                starttime:classes[0].horaStart,
                endtime:classes[0].TimeFinish,
                duracionCurso: uniqueArrayUsingFilter[index].duracionCurso,
                totalClases: uniqueArrayUsingFilter[index].totalClases,
                students:students.length,
                classes:classespayload
            }
    
            payload.push(gradepayload)
        }

        
        
      }
    
    return res.status(200).json(payload)
  }


  //Get all grades
export const GetGrade = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id) {
        return res.status(400).json({msg:'Make sure all the data is there'})
    }
    const grade:any = await cursos.findOne({_id:req.params.id});
      const payload = []

        const classes:any = await clases.find({id_curso:grade._id})
        const teacher:any = await profesor.findOne({_id:grade.id_profesor})
        const classespayload:any = []

        for (let index = 0; index < classes.length; index++) {
            classespayload.push(classes[index].dia)
            
        }


        if (teacher== null) {

            const gradepayload = {
                _id: grade._id,
                id:"No teacher assigned",
                id_profesor: "No teacher assigned",
                nombreCurso: grade.nombreCurso,
                seccion: grade.seccion,
                fechaInicio: grade.fechaInicio,
                fechaFin: grade.fechaFin,
                starttime:classes[0].horaStart,
                endtime:classes[0].TimeFinish,
                duracionCurso: grade.duracionCurso,
                totalClases: grade.totalClases,
                classes:classespayload
            }
    
            payload.push(gradepayload)
            
        }else{
            const gradepayload = {
                _id: grade._id,
                id:teacher._id,
                id_profesor: teacher.nombrecompleto,
                nombreCurso: grade.nombreCurso,
                seccion: grade.seccion,
                fechaInicio: grade.fechaInicio,
                fechaFin: grade.fechaFin,
                starttime:classes[0].horaStart,
                endtime:classes[0].TimeFinish,
                duracionCurso: grade.duracionCurso,
                totalClases: grade.totalClases,
                classes:classespayload
            }
    
            payload.push(gradepayload)
        }

        
        
      
    
    return res.status(200).json(payload)
  }


  export const EditGrade = async (req : Request, res: Response):Promise<Response>=> {
    if (
        !req.body.HoraEnd ||
        !req.body.id_profesor || 
        !req.body.nombreCurso|| 
        !req.body.seccion || 
        !req.body.fechaInicio || 
        !req.body.duracionCurso
){
        return res.status(400).json({msg:'Make sure all the data is there'})
    }
    
    const grade = await cursos.findOne({$and: [
        {nombreCurso: req.body.nombreCurso},
        {seccion: req.body.seccion}
    ]});
    // if(grade){
    //     return res.status(400).json({msg:'The Grade entered already exists'});
    // }
    //GUARDAR Curso
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const total = req.body.duracionCurso*req.body.dias.length
    let diasTotales = total - 1
    let fechaFin = new Date(req.body.fechaInicio);
    while (diasTotales >0) {
        fechaFin.setDate(fechaFin.getDate() + 1);
        if (req.body.dias.includes(weekday[fechaFin.getDay()])) {
            diasTotales--;
        }
    }

    const FechaFinal = fechaFin.toLocaleDateString()

    const filter = { _id: req.body.id };

    const update ={
        id_profesor:req.body.id_profesor,
        nombreCurso:req.body.nombreCurso,
        seccion:req.body.seccion,
        fechaInicio:req.body.fechaInicio,
        fechaFin:FechaFinal,
        duracionCurso:req.body.duracionCurso,
        totalClases:total
    }

    const doc:any = await cursos.findOneAndUpdate(filter, update);

    await clases.deleteMany({ id_curso: req.body.id });

    for (let index = 0; index < req.body.dias.length; index++) {




        const payloadClase ={

            id_curso:doc._id,
            dia:req.body.dias[index],
            horaStart:req.body.horaStart,
            TimeFinish:req.body.HoraEnd,
            
        }
        const newclase = new clases(payloadClase);
        await newclase.save();
    }
    
    return res.status(200).json({doc,msg:"Edited Successfully"})

    
  }



  export const DeleteGrade = async (req : Request, res: Response):Promise<Response>=> {
    if (
        !req.params.id
){
        return res.status(400).json({msg:'Make sure all the data is there'})
    }
    
    const filter = { _id: req.params.id };
    const filter2 = { id_curso: req.params.id };

    const update ={id_curso: "No Grade assigned"}


    const doc:any = await cursos.findOneAndDelete(filter);

    await clases.deleteMany({ id_curso: req.params.id });
    await alumnos.updateMany(filter2,update)
    
    return res.status(200).json({doc,msg:"Deleted Successfully"})

    
  }