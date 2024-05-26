import express from "express";
let app = express();
import path from 'path';
import cors from 'cors';
import StudentRoutes from './routers/student.route.js';
import AttendanceRoutes from './routers/attendance.route.js';
import ReportRoutes from './routers/report.route.js';
import cookieParser from "cookie-parser";


app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use('/public', express.static(path.join(path.resolve(), 'public')));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'dist')));
// routes
app.use('/api/v1/student', StudentRoutes);
app.use('/api/v1/attendance', AttendanceRoutes);
app.use('/api/v1/report', ReportRoutes);

app.get('*', (req,res) =>{
    res.sendFile(path.join(path.resolve(), "dist", "index.html"));
})

export { app };
