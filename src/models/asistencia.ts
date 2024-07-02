import { Model, Schema, Document, model } from "mongoose";


//INTERFACE
export interface IAttendance extends Document {
    id_alumno:string,
    grado:string,
    seccion:string,
    fecha:Date
}

//EL ESQUEMA DE asistencia
const UserSchema = new Schema ({
    id_alumno:{
        type:String,
        required:true,
    },
    grado:{
        type:String,
        require:true
    },
    seccion:{
        type:String,
        require:true
    },
    fecha:Date
});


export default model<IAttendance>('Asistencia', UserSchema);