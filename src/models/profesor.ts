import { Model, Schema, Document, model } from "mongoose";


//INTERFACE
export interface ITeacher extends Document {
    nombrecompleto:string,
    usuario:string,
    password:string,
    comparePassword:(p: object) => Response
}


const TeacherSchema = new Schema ({
    nombrecompleto:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    usuario:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    }
});


export default model<ITeacher>('profesor', TeacherSchema);