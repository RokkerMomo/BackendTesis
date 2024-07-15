import { Model, Schema, Document, model } from "mongoose";


//INTERFACE
export interface Igrade extends Document {
    id_profesor:string,
    nombreCurso:string,
    seccion:string,
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
});


export default model<Igrade>('cursos', GradeSchema);