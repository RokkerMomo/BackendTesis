import { Model, Schema, Document, model, Date } from "mongoose";


//INTERFACE
export interface Igrade extends Document {
    id_profesor:string,
    nombreCurso:string,
    seccion:string,
    fechaInicio:string,
    fechaFin:string,
    duracionCurso:number,
    totalClases:number
}

const GradeSchema = new Schema ({
    id_profesor:{
        type:String,
        unique:false,
        required:true,
        trim:true
    },
    nombreCurso:{
        type:String,
        require:true
    },
    seccion:{
        type:String,
        require:true
    },
    fechaInicio:{
        type:String,
        require:true
    },
    fechaFin:{
        type:String,
        require:true
    },
    duracionCurso:{
        type:Number,
        require:true
    },
    totalClases:{
        type:Number,
        require:true
    },
});


export default model<Igrade>('cursos', GradeSchema);