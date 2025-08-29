const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["cart-wise", "product-wise", "bxgy"], required: true },
  details: { type: mongoose.Schema.Types.Mixed, required: true },
  active: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });


module.exports = mongoose.model("Coupon", couponSchema);