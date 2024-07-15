import { Model, Schema, Document, model } from "mongoose";


//INTERFACE
export interface IStudent extends Document {
    nombrecompleto:string,
    url_foto:string,
    cedula:string,
    edad:string,
    genero:string,
    id_curso:string,
    idHuella:Number,
}

//EL ESQUEMA DE Alumno
const StudentSchema = new Schema ({
    nombrecompleto:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    url_foto:{
        type:String,
        unique:true,
        required:false,
        trim:true
    },
    cedula:{
        type:String,
        require:true
    },
    edad:{
        type:String,
        require:true
    },
    genro:{
        type:String,
        require:true
    },
    id_curso:{
        type:String,
        unique:false,
        required:true,
        trim:true
    },
    idHuella:{
        type:Number,
        require:false
    }
});


export default model<IStudent>('alumnos', StudentSchema);