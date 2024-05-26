import { Router } from "express";
import { createReport, getReport, checkName, getByName, downloadPdf, requestToLeave, aproveRequest, myRequest, allRequest, getApplication, getAllReports, deleteReport } from "../controllers/report.controller.js";
import { auth, authorizeRole } from "../middlewares/auth.middleware.js";
let router = Router();

router.route('/create/:id').post(auth, authorizeRole('admin'), createReport);
router.route('/get/:id').post(auth, authorizeRole('admin'), getReport);
router.route('/get/all').get(auth, authorizeRole('admin'), getAllReports);
router.route('/getByName').post(auth, authorizeRole('admin'), getByName);
router.route('/checkName').post(auth, authorizeRole('admin'), checkName);
router.route('/download').post(auth, authorizeRole('admin'), downloadPdf);
router.route('/leave-request').post(auth, requestToLeave);
router.route('/get-my-request').get(auth, myRequest);
router.route('/get-all-request').get(auth, authorizeRole('admin'), allRequest);
router.route('/aproveRequest/:id').post(auth, authorizeRole('admin'), aproveRequest);
router.route('/getApplication/:id').get(auth, authorizeRole('admin'), getApplication);
router.route('/delete-report/:id').delete(auth, authorizeRole('admin'), deleteReport);


export default router;