export default {
    jwtSecret:process.env.JWT_SECRET || 'somesecret',
    DB:{
        URI: process.env.MONGODB_URI || 'mongodb://localhost/Tesis',
        USER: process.env.MONGODB_USER || '',
        PASSWORD: process.env.MONGODB_PASSWORD || ''
    }
}