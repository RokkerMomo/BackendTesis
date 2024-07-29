import { Request, Response } from "express"
import cursos,{ Igrade } from "../models/curso";

export const NewGrade = async (req:Request,res:Response):Promise<Response> => {
    if (!req.body.id_profesor || !req.body.nombreCurso|| !req.body.cantidad){
        return res.status(400).json({msg:'Asegurese de que esten todos los datos'})
    }
    const grade = await cursos.findOne({nombreCurso:req.body.nombreCurso});
    if(grade){
        return res.status(400).json({msg:'El Curso que ingreso ya existe'});
    }
    if (req.body.cantidad > 3) {
        return res.status(400).json({msg:'Maximo de secciones 3'});
    }
    for (let index = 1; index <= req.body.cantidad; index++) {
        if (index == 1) {
            const payload = {
                id_profesor:req.body.id_profesor,
                nombreCurso:req.body.nombreCurso,
                seccion:"A",
                }
            const newGrade = new cursos(payload);
            await newGrade.save();
        }else{
            if (index == 2) {
                const payload = {
                    id_profesor:req.body.id_profesor,
                    nombreCurso:req.body.nombreCurso,
                    seccion:"B",
                    }
             
                const newGrade = new cursos(payload);
                await newGrade.save();
            } else {
                const payload = {
                    id_profesor:req.body.id_profesor,
                    nombreCurso:req.body.nombreCurso,
                    seccion:"C",
                    }
             
                const newGrade = new cursos(payload);
                await newGrade.save();
            }
        }
        
    }

    return res.status(200).json({msg:"curso creado con exito"})
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