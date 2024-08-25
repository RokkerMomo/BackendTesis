import { Request, Response } from "express"
import alumnos, {IStudent} from "../models/alumno"
import cursos,{ Igrade } from "../models/curso";
import asistencia,{ IAttendance } from "../models/asistencia";
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
        return res.status(400).json({msg:'The student already exists, verify ID and full name'});
    }
    const payload = {
        nombrecompleto:req.body.nombrecompleto,
        url_foto:req.body.url_foto,
        cedula:req.body.cedula,
        edad:req.body.edad,
        genero:req.body.genero,
        id_curso:req.body.id_curso,
        idHuella:0
        }
    //GUARDAR Alumno
    const newStudent = new alumnos(payload);
    await newStudent.save();
    return res.status(201).json({newStudent,msg:'Student registered correctly'});
}

//Buscar alumno por cedula o por nombre
export const SearchStudent = async (req : Request, res: Response):Promise<Response>=>{
    console.log(req.params.search)
    const Students = await alumnos.find({$or: [
        {nombrecompleto: {$regex : req.params.search}},
        {cedula: req.params.search}
    ]});
    if (Students.length===0) {
        return res.status(400).json({msg:"No student found"})
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
        return res.status(400).json({msg:"There are no students in that section"})
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
        return res.status(400).json({msg:'Make sure all the data is there'})
    }

    const grades:any = await cursos.find({id_profesor:req.params.id})

    
    const payload =[]

    for (let index = 0; index < grades.length; index++) {
        
        const student:any = await alumnos.find({id_curso:grades[index]._id});

        for (let y = 0; y < student.length; y++) {

            if (student) {
                const attendance = await asistencia.find({$and: [
                    {id_alumno: student[y]._id},
                    {id_curso: grades[index]._id}
                ]})
        
                const percentage = ((attendance.length *1)/grades[index].totalClases)*100
                const payloadStudent = {
                    _id:student[y]._id,
                    nombrecompleto:student[y].nombrecompleto,
                    url_foto:student[y].url_foto,
                    cedula:student[y].cedula,
                    edad:student[y].edad,
                    genero:student[y].genero,
                    id_curso:student[y].id_curso,
                    idHuella:student[y].idHuella,
                    percentage:percentage
                }
        
                payload.push(payloadStudent)
            
            
        }
        
            
        }
    }
    if (payload.length!=0) {
        return res.status(200).json(payload)
    }else{
        return res.status(400).json({msg:"Teacher has no students"})
    }
    
  }

    //Get all students
    export const getallStudents = async (req : Request, res: Response):Promise<Response>=>{

    
        const grades:any = await cursos.find()
        const payload =[]
        const studentsNoGrade = await alumnos.find({id_curso:"No Grade assigned"})
        console.log(studentsNoGrade)
        for (let index = 0; index < studentsNoGrade.length; index++) {
            console.log(studentsNoGrade[index])
            const payloadStudent = {
                _id:studentsNoGrade[index]._id,
                nombrecompleto:studentsNoGrade[index].nombrecompleto,
                url_foto:studentsNoGrade[index].url_foto,
                cedula:studentsNoGrade[index].cedula,
                edad:studentsNoGrade[index].edad,
                genero:studentsNoGrade[index].genero,
                id_curso:studentsNoGrade[index].id_curso,
                idHuella:studentsNoGrade[index].idHuella,
                percentage:0
            }
    
            payload.push(payloadStudent)
            
        }
        //payload.push(studentsNoGrade)
        
    
        for (let index = 0; index < grades.length; index++) {
            
            const student:any = await alumnos.find({id_curso:grades[index]._id});
    
            for (let y = 0; y < student.length; y++) {
    
                if (student) {
                    const attendance = await asistencia.find({$and: [
                        {id_alumno: student[y]._id},
                        {id_curso: grades[index]._id}
                    ]})
            
                    const percentage = ((attendance.length *1)/grades[index].totalClases)*100
                    const payloadStudent = {
                        _id:student[y]._id,
                        nombrecompleto:student[y].nombrecompleto,
                        url_foto:student[y].url_foto,
                        cedula:student[y].cedula,
                        edad:student[y].edad,
                        genero:student[y].genero,
                        id_curso:student[y].id_curso,
                        idHuella:student[y].idHuella,
                        percentage:percentage
                    }
            
                    payload.push(payloadStudent)
                
            }
                
            }
        }
        if (payload.length!=0) {
            return res.status(200).json(payload)
        }else{
            return res.status(400).json({msg:"There are no students"})
        }

      }

      export const getStudentByID = async (req:Request,res:Response):Promise<Response> => {

        if (!req.params.id) {
            return res.status(400).json({msg:"Enter the student ID"})
        }
        const student = await alumnos.findOne({_id:req.params.id})

        if (!student) {
            return res.status(400).json({msg:"The entered id does not exist"})
        }
        return res.status(200).json(student)
      }


      export const addFingerPrint = async (req:Request,res:Response):Promise<Response> => {
        if (!req.body.id || !req.body.huella) {
            return res.status(400).json({msg:"Enter all data"})
        }
        const filter = { _id: req.body.id };
        const update = { idHuella: req.body.huella };
        const student = await alumnos.findOneAndUpdate(filter, update);
        return res.status(200).json({student,msg:"Successfully Added Footprint"})
      }


      export const DeleteStudent = async (req:Request,res:Response):Promise<Response> => {
        if (!req.params.id) {
            return res.status(400).json({msg:"Enter the id"})
        }
        console.log(req.params.id)
        const student = await alumnos.findOne({_id:req.params.id})
        console.log(student)
        if (!student) {
            return res.status(400).json({msg:"The student was not found"})
        }
        await alumnos.deleteOne({_id:req.params.id})
        return res.status(200).json({msg:"Eliminated Student"})
      }