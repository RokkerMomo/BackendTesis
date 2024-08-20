import { Request, Response } from "express"
import profesor,{ ITeacher } from "../models/profesor";

export const newTeacher = async (req:Request,res:Response):Promise<Response> => {
    if (!req.body.nombrecompleto || !req.body.usuario|| !req.body.password){
        return res.status(400).json({msg:'Make sure all the data is there'})
    }

    const Student = await profesor.findOne({$or: [
        {nombrecompleto: req.body.nombrecompleto},
        {usuario: req.body.usuario}
    ]}) 
    if(Student){
        return res.status(400).json({msg:'Teacher already exist (Check full name and username)'});
    }


    const newTeacher = new profesor(req.body);
    await newTeacher.save();
    return res.status(200).json({msg:"New teacher created successfully"})
    
}

 //Get all users para probar con el esp32
 export const getallTeachers = async (req : Request, res: Response):Promise<Response>=>{
    const teachers = await profesor.find();
    return res.status(200).json(teachers)
  }