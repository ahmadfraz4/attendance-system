import express, { Router } from 'express';
import { addUser, deleteUser, getCurrentUser, getSingleUser, getUsers, loginUser, logout, registerUser, updateUser } from '../controllers/student.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { auth, authorizeRole } from '../middlewares/auth.middleware.js';

let router = Router()

router.route('/register').post(upload.single('profilePic'),registerUser)
router.route('/add').post(auth, authorizeRole('admin'), upload.single('profilePic'),addUser)
router.route('/login').post(upload.none(),loginUser)
router.route('/update/:id').put(auth, upload.single('profilePic'),updateUser)
router.route('/delete/:id').delete(auth,deleteUser)
router.route('/logout').post(auth,logout)
router.route('/get').get(auth, authorizeRole('admin') , getUsers)
router.route('/get/current').get(auth,  getCurrentUser)
router.route('/get/single/:id').get(auth,authorizeRole('admin'), getSingleUser)


export default router

