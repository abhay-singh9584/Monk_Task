const express = require("express")
const router = express.Router();
const couponController = require("../Controller/coupon.controller")
const applyCouponController = require("../Controller/apply.coupon.controller")

//CRUD Routes
router.post("/coupons", couponController.createCoupon);
router.get("/coupons", couponController.getCoupons);
router.get("/coupons/:id", couponController.getCouponById);
router.put("/coupons/:id", couponController.updateCoupon);
router.delete("/coupons/:id", couponController.deleteCoupon);

//Coupon Application Routes
router.post("/applicable-coupons",applyCouponController.applicableCoupons);
router.post("/apply-coupon/:id",applyCouponController.applyCoupon);

module.exports = router;
