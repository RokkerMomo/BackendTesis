import { Model, Schema, Document, model } from "mongoose";


//INTERFACE
export interface IStudent extends Document {
    nombrecompleto:string,
    cedula:string,
    grado:string,
    seccion:string,
    idHuella:Number,
}

//EL ESQUEMA DE Alumno
const UserSchema = new Schema ({
    nombrecompleto:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    cedula:{
        type:String,
        require:true
    },
    grado:{
        type:String,
        require:true
    },
    seccion:{
        type:String,
        require:true
    },
    idHuella:{
        type:Number,
        require:false
    }
});


export default model<IStudent>('alumnos', UserSchema);