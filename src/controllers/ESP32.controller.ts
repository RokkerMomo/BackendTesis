import { Request, Response } from "express"
import usuarios, {IUser} from "../models/user"
import profesor,{ ITeacher } from "../models/profesor";
import jwt from 'jsonwebtoken'
import config from "../config/config";
import fetch from "node-fetch";


export const FindESP32 = async (req : Request, res: Response):Promise<Response> => {
    
    const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }}
      const url = `http://192.168.1.102/findSensor`;

      try {
        const response = await fetch(url,requestOptions);
        if (!response.ok) {
          console.log("no se encontro el lector equisded")
          return res.status(400).json({msg:"error con el fetch idk"})
          
        }else{
          const json = await response.json();
          return res.status(200).json({json})
        } 
      } catch (error) {
        return res.status(400).json({msg:"error con el fetch idk"})
      }


}

//Get all users para probar con el esp32
  export const AddFingerPrintESP32 = async (req : Request, res: Response):Promise<Response>=>{
 
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }}
      const url = `http://192.168.1.102/?param1=${req.params.id}`;

      try {
        const response = await fetch(url,requestOptions);
        if (!response.ok) {
          console.log("no se encontro el lector equisded")
          return res.status(400).json({msg:"error con el fetch idk"})
          
        }else{
          const json = await response.json();
          return res.status(200).json({json})
        } 
      } catch (error) {
        return res.status(400).json({msg:"error con el fetch idk"})
      }
    
  };