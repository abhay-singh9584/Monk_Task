const CouponModel = require("../Model/Coupon.model");
  
const applicableCoupons = async(req,res)=>{
    try {
        const { cart } = req.body;

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty or invalid" });
        }

        const cartTotal = calculateCartTotal(cart);

        const coupons = await CouponModel.find({ active: true });
        if(!coupons){
            return res.status(404).json({ message: "No coupons found" });
        }

        let applicableCoupons = [];
        
        for(let coupon of coupons){
            let discount = 0;

            if(coupon.type === "cart-wise" && cartTotal >= coupon.details.threshold){
                discount = (cartTotal * coupon.details.discount)/100;
            }

            if(coupon.type === "product-wise"){
                const product = cart.items.find((i)=>{
                    return i.product_id == coupon.details.product_id
                })
                if(product){
                    discount = (product.price * coupon.details.discount)/100;
                }
            }

            if(coupon.type === "bxgy"){
                let count = 0;
                coupon.details.buy_products.forEach((product)=>{
                    const item = cart.items.find((i)=>{
                        return i.product_id === product.product_id
                    })
                    if(item){
                        count += Math.floor(item.quantity/product.quantity);
                    }
                })
                const repetition =  coupon.details.repetition_limit &&
                count > coupon.details.repetition_limit
                  ? coupon.details.repetition_limit
                  : count;
                  if (repetition > 0) {
                    // For each repetition, add discount equal to "get" products price
                    coupon.details.get_products.forEach((get) => {
                      const productInCart = cart.items.find((i) => 
                        i.product_id === get.product_id
                      );
                      if (productInCart) {
                        discount += productInCart.price * get.quantity * (repetition-1);
                      }
                    });
                }
                
            }
            if(discount > 0){
                applicableCoupons.push({
                    code:coupon.code,
                    type:coupon.type,
                    discount:discount
                })
            }

        }
        
        return res.status(200).json({message:"Applicable coupons fetched successfully",applicableCoupons});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error",error});
    }
}

const applyCoupon = async(req,res)=>{
    try {
        const { id } = req.params;
        const { cart } = req.body;

        if (!cart || !cart.items || cart.items.length === 0 || !id) {
        return res.status(400).json({ message: "Cart is empty, invalid or coupon code is missing" });
        }

        const coupon = await CouponModel.findOne({code:id});
        if(!coupon){
            return res.status(404).json({ message: "No coupon found" });
        }

        let totalDiscount = 0;
        
        const cartTotal = calculateCartTotal(cart);

        if (coupon.type === "cart-wise") {
            if (cartTotal >= coupon.details.threshold) {
                totalDiscount = (cartTotal * coupon.details.discount) / 100;
            }
        }

        if (coupon.type === "product-wise") {
            updatedItems = updatedItems.map((item) => {
                if (item.product_id == coupon.details.product_id) {
                    const discount =
                    (item.price * item.quantity * coupon.details.discount) / 100;
                    totalDiscount += discount;
                    return { ...item, total_discount: discount };
                }
                return item;
            });
        }

        if (coupon.type === "bxgy") {
            let buyCount = 0;

            cart.items.forEach((item) => {
                const inBuyPool = coupon.details.buy_products.find(
                  (bp) => bp.product_id == item.product_id
                );
                if (inBuyPool) {
                  buyCount += item.quantity;
                }
              });

            const sets = Math.floor(buyCount / coupon.details.buy_quantity);

            const repetition = Math.min(
              sets,
              coupon.details.repetition_limit ?? Infinity
            );

            if (repetition > 0) {
                updatedItems = updatedItems.map((item) => {
                    const gp = coupon.details.get_products.find(
                      (g) => g.product_id == item.product_id
                    );
                    if (gp) {
                        const freeQty = gp.quantity * repetition;
                        const discount = item.price * freeQty;
                        totalDiscount += discount;

                        return {
                            ...item,
                            quantity: item.quantity + freeQty,
                            total_discount: discount
                        };
                    }
                    return item;
                });

                coupon.details.get_products.forEach((gp) => {
                    const exists = updatedItems.find(
                        (i) => i.product_id == gp.product_id
                    );
                    if (!exists) {
                        updatedItems.push({
                            product_id: gp.product_id,
                            quantity: gp.quantity * repetition,
                            price: 0,
                            total_discount: 0
                        });
                    }
                });
            }
        }
        let updatedItems = cart.items.map((item) => ({
          ...item,
          total_discount: 0
        }));


        return res.status(200).json({ updated_cart: {
            items: updatedItems,
            total_price: cartTotal,
            total_discount: totalDiscount,
            final_price: cartTotal - totalDiscount
        } });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error",error});
    }
}

const calculateCartTotal = (cart) => {
    let total = 0;
    for (const item of cart.items) {
        total += item.price * item.quantity;
    }
    return total;
}

module.exports = {
    applicableCoupons,
    applyCoupon
}