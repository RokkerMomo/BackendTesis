import { Request, Response } from "express"
import alumnos, {IStudent} from "../models/alumno"
import cursos,{ Igrade } from "../models/curso";
import jwt from 'jsonwebtoken'
import config from "../config/config";
//FUNCION PARA CREAR TOKEN

//REGISTRO
export const NewStudent = async (req: Request,res: Response): Promise<Response> =>{
    if (!req.body.nombrecompleto || !req.body.url_foto|| !req.body.cedula || !req.body.edad || !req.body.genero || !req.body.id_curso){
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
        url_foto:req.body.url_foto,
        cedula:req.body.cedula,
        edad:req.body.edad,
        genero:req.body.genero,
        id_curso:req.body.id_curso,
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


  //Get all students.lenght
  export const getallStudent = async (req : Request, res: Response):Promise<Response>=>{
    const users = await alumnos.find();
    return res.status(200).json(users.length)
  }


  export const getStundetsByTeacher = async (req: Request, res:Response):Promise<Response>=>{
    if (!req.params.id){
        return res.status(400).json({msg:'Asegurese de que esten todos los datos'})
    }
    const grades = await cursos.find({id_profesor:req.params.id})
    console.log("wtf ?")
    console.log(grades)
    const payload =[]

    for (let index = 0; index < grades.length; index++) {
        const student = await alumnos.findOne({id_curso:grades[index]._id});
        payload.push(student)
    }
    if (payload.length!=0) {
        return res.status(200).json(payload)
    }else{
        return res.status(400).json({msg:"Profesor no tiene alumnos"})
    }
    
  }

    //Get all students
    export const getallStudents = async (req : Request, res: Response):Promise<Response>=>{
        const users = await alumnos.find();
        return res.status(200).json(users)
      }