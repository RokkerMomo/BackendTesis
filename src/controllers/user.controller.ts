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
        return res.status(400).json({msg:'Make sure you enter the username and password'})
    }
    const user = await usuarios.findOne({usuario:req.body.usuario});
    if(user){
        return res.status(400).json({msg:'The User you entered already exists'});
    }
    //GUARDAR USUARIO
    const newUser = new usuarios(req.body);
    await newUser.save();
    return res.status(201).json({newUser,msg:'Correctly Registered User'});
}

//LOGIN
export const signIn = async (req: Request,res: Response): Promise<Response> => {
    if (!req.body.usuario || !req.body.password) {
      return res.status(400).json({ msg: "Make sure you enter the username and password" });
    }
    const user = await usuarios.findOne({usuario:req.body.usuario});
    const teacher = await profesor.findOne({usuario:req.body.usuario});


    if (user) {
      const isMatch = await user.comparePassword(req.body.password);

      if (!isMatch) {
       //DEVOLVER RESPUETA
        return res.status(400).json({msg: "The username or password is incorrect"});
      }
  
       //DEVOLVER TOKEN
      return res.status(201).json({ user,token: createToken(user),rol:0 });
     
    }else{
      if (teacher) {
        const isMatch = await teacher.comparePassword(req.body.password);

      if (!isMatch) {
       //DEVOLVER RESPUETA
        return res.status(400).json({msg: "The username or password is incorrect"});
      }
  
       //DEVOLVER TOKEN
      return res.status(201).json({ teacher,token: createToken(teacher),rol:1 });
      } else {
        return res.status(400).json({ msg: "The user does not exist" });
      }
    }
   
  }; 


  //Get all users para probar con el esp32
  export const getallusers = async (req : Request, res: Response):Promise<Response>=>{
    const fechaInicio = new Date('8/12/2024'); // Cambia esta fecha según sea necesario

// Días de la semana en los que se imparte el curso (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
const diasDeClase = [1,2,3,4,5]; // Lunes, Miércoles, Viernes

// Número total de semanas del curso
const semanasTotales = 4;

// Función para calcular la fecha de fin

    let diasTotales = (semanasTotales * diasDeClase.length)-1;
    const dias = (semanasTotales * diasDeClase.length)
    const length = diasDeClase.length
    let fechaFin = new Date(fechaInicio);

    while (diasTotales >0) {
        fechaFin.setDate(fechaFin.getDate() + 1);
        if (diasDeClase.includes(fechaFin.getDay())) {
            diasTotales--;
            console.log(fechaFin.toLocaleDateString())
        }
        
    }

    console.log(`La fecha de fin del curso es: ${fechaFin.toDateString()}`);
    const resultado = fechaFin.toLocaleDateString()
    return res.status(200).json({fechaInicio,resultado,semanasTotales,length,dias})
  }