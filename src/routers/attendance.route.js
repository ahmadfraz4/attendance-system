import express, {Router} from 'express'
import { auth, authorizeRole } from '../middlewares/auth.middleware.js';
import { fromDaytoDay, getAttendance, getAttendanceOfOneUser, getUserAllAttendances, MarkAttendance, ReportUserAttendance } from '../controllers/attendance.controller.js';
let router = Router();

router.route('/mark/:id').put(auth, MarkAttendance); // specific user and admin
router.route('/all').get(auth,authorizeRole('admin'),getAttendance); // only admin
router.route('/fromToDay').post(auth,authorizeRole('admin'),fromDaytoDay); // only admin
router.route('/get-user-attendance/:id').post(auth, getAttendanceOfOneUser); // admin and specific user can access
router.route('/get-one-user-attendance/:id').post(auth, getUserAllAttendances); // admin and specific user can access
router.route('/get-user-attendance-report/:id').get(auth, ReportUserAttendance); // admin and specific user can access

export default router