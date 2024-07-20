import { Request, Response } from "express"
import usuarios, {IUser} from "../models/user"
import profesor,{ ITeacher } from "../models/profesor";
import jwt from 'jsonwebtoken'
import config from "../config/config";


//FUNCION PARA CREAR TOKEN
function createToken(user: IUser){
return jwt.sign({id:user.id, usuario:user.usuario},config.jwtSecret,{
    expiresIn:86400
});
}

 

//REGISTRO
export const signUp = async (req: Request,res: Response): Promise<Response> =>{
    if (!req.body.usuario || !req.body.password){
        return res.status(400).json({msg:'Asegurese de ingresar el usuario y la contraseña'})
    }
    const user = await usuarios.findOne({usuario:req.body.usuario});
    if(user){
        return res.status(400).json({msg:'El Usuario que ingreso ya existe'});
    }
    //GUARDAR USUARIO
    const newUser = new usuarios(req.body);
    await newUser.save();
    return res.status(201).json({newUser,msg:'Usuario Registrado Correctamente'});
}

//LOGIN
export const signIn = async (req: Request,res: Response): Promise<Response> => {
    if (!req.body.usuario || !req.body.password) {
      return res.status(400).json({ msg: "Asegurese de ingresar el usuario y la contraseña" });
    }
    const user = await usuarios.findOne({usuario:req.body.usuario});
    const teacher = await profesor.findOne({usuario:req.body.usuario});


    if (user) {
      const isMatch = await user.comparePassword(req.body.password);

      if (!isMatch) {
       //DEVOLVER RESPUETA
        return res.status(400).json({msg: "El Usuario o la contraseña son incorrectos"});
      }
  
       //DEVOLVER TOKEN
      return res.status(201).json({ user,token: createToken(user),msg:"ingreso como usuario" });
     
    }else{
      if (teacher) {
        const isMatch = await teacher.comparePassword(req.body.password);

      if (!isMatch) {
       //DEVOLVER RESPUETA
        return res.status(400).json({msg: "El Usuario o la contraseña son incorrectos"});
      }
  
       //DEVOLVER TOKEN
      return res.status(201).json({ teacher,token: createToken(teacher),msg:"ingreso como teacher" });
      } else {
        return res.status(400).json({ msg: "El usuario no existe" });
      }
    }
   
  }; 


  //Get all users para probar con el esp32
  export const getallusers = async (req : Request, res: Response):Promise<Response>=>{
    const users = await usuarios.find();
    return res.status(201).json(users)
  }