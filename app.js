const mongoose = require('mongoose')
const express = require('express')
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const Teacher = mongoose.model('Teacher',{name:String,email:String})
const Student = mongoose.model('Student',{name:String,email:String})

let courseSchema = new mongoose.Schema({
    title:String,
    classes:[String],
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Teacher',
        required:true
    },
    Students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:false
    }],
    created_at:{type:Date,default:Date.now}
})

const Course = mongoose.model('Course',courseSchema)

app.get('/',(req,res)=>res.send('School admin'))

app.get('/teachers',async (req,res)=>{
    const teachers = await Teacher.find({}).limit(10)
    res.send(teachers) 
})

app.post('/teachers', async (req,res)=>{
    const teacher = await new Teacher(req.body.teacher).save()
    res.send(teacher)
})

app.get('/students', async (req,res)=>{
    const student = await new Student(req.body.student).save()
    res.send(student)
})

app.post('students',async (req,res)=>{
    const student = await new Student(req.body.student).save()
    res.send(student)
})

app.get('/courses', async (req,res)=>{
    const courses = await Course.find({}).limit(10)
    res.send(course)
})

app.post('/courses',async (req,res)=>{
    const course = await Course(req.body.course).save()
    res.send(course)
})

const adminBro = new AdminBro({
    resources:[Teacher,Course,Student],
    rootPath:'/admin',
    branding:{
        companyName:'School admin'
    }
})

const router = AdminBroExpress.buildRouter(adminBro)
app.use(adminBro.options.rootPath,router)

const run = async ()=>{
    await mongoose.connect('mongodb://localhost/school_admin',{useNewUrlParser:true})
    await app.listen(8080,()=> console.log('App listening on port 8080'))
}

run()





