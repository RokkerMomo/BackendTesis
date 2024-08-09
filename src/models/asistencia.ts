import { Model, Schema, Document, model } from "mongoose";


//INTERFACE
export interface IAttendance extends Document {
    id_alumno:string,
    id_curso:string,
    fecha:String,
    hora:String,
    nota:String
}

//EL ESQUEMA DE asistencia
const AttendanceSchema = new Schema ({
    id_alumno:{
        type:String,
        required:true,
    },
    id_curso:{
        type:String,
        require:true
    },
    seccion:{
        type:String,
        require:true
    },
    fecha:{
        type:String,
        require:true
    },
    hora:{
        type:String,
        require:true
    },
    nota:{
        type:String,
        require:false
    }
});


export default model<IAttendance>('Asistencia', AttendanceSchema);