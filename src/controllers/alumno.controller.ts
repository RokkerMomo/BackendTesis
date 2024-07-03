import { Request, Response } from "express"
import alumnos, {IStudent} from "../models/alumno"
import jwt from 'jsonwebtoken'
import config from "../config/config";
//FUNCION PARA CREAR TOKEN

//REGISTRO
export const NewStudent = async (req: Request,res: Response): Promise<Response> =>{
    if (!req.body.nombrecompleto || !req.body.cedula || !req.body.grado|| !req.body.seccion){
        return res.status(400).json({msg:'Asegurese de que esten todos los datos'})
    }
    const Student = await alumnos.findOne({$or: [
        {nombrecompleto: req.body.nombrecompleto},
        {cedula: req.body.cedula}
    ]}) 
    if(Student){
        return res.status(400).json({msg:'El alumno ya existe, verificar cedula y nombre completo'});
    }
    const users = await alumnos.find();
    const payload = {
        nombrecompleto:req.body.nombrecompleto,
        cedula:req.body.cedula,
        grado:req.body.grado,
        seccion:req.body.seccion,
        idHuella:users.length + 1
        }
    //GUARDAR Alumno
    const newStudent = new alumnos(payload);
    await newStudent.save();
    return res.status(201).json({newStudent,msg:'Alumno registrado correctamente'});
}

//Buscar alumno por cedula o por nombre
export const SearchStudent = async (req : Request, res: Response):Promise<Response>=>{
    console.log(req.params.search)
    const Students = await alumnos.find({$or: [
        {nombrecompleto: {$regex : req.params.search}},
        {cedula: req.params.search}
    ]});
    if (Students.length===0) {
        return res.status(400).json({msg:"no se encontro ningun alumno"})
    }
    return res.status(201).json(Students)
  }

  //Buscar alumnos por Grado
export const SearchStudentByGrade = async (req : Request, res: Response):Promise<Response>=>{
    console.log(req.params.grade);
    console.log(req.params.section);
    const Students = await alumnos.find({$and: [
        {grado: req.params.grade},
        {seccion: req.params.section}
    ]});
    if (Students.length===0) {
        return res.status(400).json({msg:"no hay alumnos en esa seccion"})
    }
    return res.status(200).json(Students)
  }


  //Get all students
  export const getallStudent = async (req : Request, res: Response):Promise<Response>=>{
    const users = await alumnos.find();
    return res.status(200).json(users.length)
  }