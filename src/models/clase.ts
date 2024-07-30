import { Model, Schema, Document, model, Date } from "mongoose";


//INTERFACE
export interface Iclass extends Document {
    id_curso:string,
    dia:string,
    horaStart:Date,
    TimeFinish:Date,
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
        type:Date,
        require:true
    },
    TimeFinish:{
        type:Date,
        require:true
    }
});


export default model<Iclass>('clases', ClassSchema);