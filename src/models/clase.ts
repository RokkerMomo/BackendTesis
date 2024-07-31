import { Model, Schema, Document, model, Date } from "mongoose";


//INTERFACE
export interface Iclass extends Document {
    id_curso:string,
    dia:string,
    horaStart:string,
    TimeFinish:string,
}

const ClassSchema = new Schema ({
    id_curso:{
        type:String,
        unique:false,
        required:true,
        trim:true
    },
    dia:{
        type:String,
        require:true
    },
    horaStart:{
        type:String,
        require:true
    },
    TimeFinish:{
        type:String,
        require:true
    }
});


export default model<Iclass>('clases', ClassSchema);