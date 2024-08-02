import { Request, Response } from "express"
import cursos,{ Igrade } from "../models/curso";
import clases,{ Iclass } from "../models/clase";

export const NewGrade = async (req:Request,res:Response):Promise<Response> => {
    if (
        !req.body.HoraEnd ||
        !req.body.id_profesor || 
        !req.body.nombreCurso|| 
        !req.body.seccion || 
        !req.body.fechaInicio || 
        !req.body.duracionCurso
){
        return res.status(400).json({msg:'Asegurese de que esten todos los datos'})
    }
    const grade = await cursos.findOne({$and: [
        {nombreCurso: req.body.nombreCurso},
        {seccion: req.body.seccion}
    ]});
    if(grade){
        return res.status(400).json({msg:'El Curso que ingreso ya existe'});
    }
    //GUARDAR Curso

    const total = req.body.duracionCurso*req.body.dias.length
    const payloadcurso ={
        id_profesor:req.body.id_profesor,
        nombreCurso:req.body.nombreCurso,
        seccion:req.body.seccion,
        fechaInicio:req.body.fechaInicio,
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
        console.log(payloadClase)
        const newclase = new clases(payloadClase);
        await newclase.save();
    }
    
    return res.status(201).json({newCurso,msg:'Curso registrado correctamente'});

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
        return res.status(400).json({msg:'Asegurese de que esten todos los datos'})
    }
    const grade = await cursos.find({_id:req.params.id});
    return res.status(200).json(grade)
  }

  //Get all sections
export const getsections = async (req : Request, res: Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Ingrese el id del curso'})
    }
    const grades = await cursos.find({nombreCurso:req.params.id});
    return res.status(200).json(grades)
  }


export const getTeacherGrades = async (req:Request,res:Response):Promise<Response>=>{
    if (!req.params.id) {
        return res.status(400).json({msg:"Asegurese de ingresar el id del profesor"})
    }
    const grades = await cursos.find({id_profesor: req.params.id});
    if (grades.length==0) {
        return res.status(400).json({msg:"El profesor no tiene cursos asignados"})
    }
    return res.status(200).json(grades)
}