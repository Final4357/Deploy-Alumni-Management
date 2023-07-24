import User from "../models/User.js"
import mongoose from "mongoose";
import { detailsByIDService } from "../services/detailsById.js"
import { listService } from "../services/listSevice.js"

export const alumniList = async (req, res, next) =>{
    let searchRgx = {'$regex': req.query.searchKey, $options: 'i'}
    let searchArray = [{firstname: searchRgx},{lastname: searchRgx},{dept: searchRgx},{company: searchRgx},{position: searchRgx}]
    let match = {isAlumni: true}
    let project = {password:0,email:0,gender:0,isAlumni:0,isAdmin:0,studentId:0,canView:0,updatedAt:0}
    let sort = {createdAt: -1}
    let result =await listService(req, User, searchArray, match, project, sort)
    if(result) res.status(200).json(result)
}

export const alumniDetailsById = async (req,res,next) =>{
    let match = {
        _id: mongoose.Types.ObjectId(req.params.id),
        isAlumni: true
    }
    let project = {password:0, isAlumni:0,isAdmin:0,createdAt:0,updatedAt:0}
    let result =await detailsByIDService(req, User, match, project)
    if(result) res.status(200).json(result)
}

export const updateAlumni = async (req, res, next) => {
    try {
        const user = await User.findById(
            req.params.id,
        );
        if (!user) return next(createError(404, "User not found."));
        if(req.file){
            await cloudinaryDeleteImg(user.photo.publicId)
            req.body.photo = await productImageUpload(req.file, `Alumni-Management/Users`)
        }
        const updateProfile = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true });
        const { password, createdAt, updatedAt, ...otherDetails } = updateProfile._doc;
        res.status(200).json({ data: {...otherDetails}})
    } catch (err) {
        next(err);
    }
}