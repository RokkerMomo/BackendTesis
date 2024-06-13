import { Model, Schema, Document, model } from "mongoose";


//INTERFACE
export interface Igrade extends Document {
    grado:string,
    seccion:string,
}

//EL ESQUEMA DE Alumno
const UserSchema = new Schema ({
    grado:{
        type:String,
        require:true
    },
    seccion:{
        type:String,
        require:true
    },
});


export default model<Igrade>('grados', UserSchema);