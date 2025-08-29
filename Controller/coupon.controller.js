const CouponModel = require("../Model/Coupon.model");

const createCoupon = async(req,res)=>{
    try {
        const {code,type,details,active,startDate,endDate} = req.body;
        if(!code || !type || !details){
            return res.status(400).json({message:"Invalid Input"});
        }

        const coupon = await CouponModel.create({code,type,details,active,startDate,endDate});
        
        return res.status(201).json({message:"Coupon created successfully",coupon});
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    }
}
const getCoupons = async(req,res)=>{
    try {
        const coupons = await CouponModel.find();
        if(!coupons){
            return res.status(404).json({message:"No coupons found"});
        }
        return res.status(200).json({message:"Coupons fetched successfully",coupons});
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    }
}
const getCouponById = async(req,res)=>{
    try {
        const coupon_code = req.params.id;
        if(!coupon_code){
            return res.status(400).json({message:"Invalid Input"});
        }
        const coupon = await CouponModel.findOne({code:coupon_code});
        if(!coupon){
            return res.status(404).json({message:"No coupon found"});
        }
        return res.status(200).json({message:"Coupon fetched successfully",coupon});
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    }
}
const updateCoupon = async(req,res)=>{
    try {
        const coupon_code = req.params.id;
        if(!coupon_code){
            return res.status(400).json({message:"Invalid Input"});
        }
        const coupon = await CouponModel.findOneAndUpdate({code:coupon_code},req.body,{new:true});
        if(!coupon){
            return res.status(404).json({message:"No coupon found"});
        }
        return res.status(200).json({message:"Coupon updated successfully",coupon});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error",error});
    }
}
const deleteCoupon = async(req,res)=>{
    try {
        const coupon_code = req.params.id;
        if(!coupon_code){
            return res.status(400).json({message:"Invalid Input"});
        }
        const coupon = await CouponModel.findOneAndDelete({code:coupon_code});
        if(!coupon){
            return res.status(404).json({message:"No coupon found"});
        }
        return res.status(200).json({message:"Coupon deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error",error});
    }
}

module.exports = {
    getCoupons,
    createCoupon,
    getCouponById,
    updateCoupon,
    deleteCoupon
}