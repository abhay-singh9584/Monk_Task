# Monk_Task

This project implements a **RESTful API** for managing and applying discount coupons (cart-wise, product-wise, and BxGy) for an e-commerce platform.  
Built with **Node.js, Express, MongoDB, and Mongoose**.

# Installation & Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/abhay-singh9584/Monk_Task.git
   cd Monk_Task
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup `config.js`:
   ```js
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/Monk
   ```
4. Start server:
   ```bash
   npm run dev

# API Endpoints

1. Coupon Management (CRUD)
   - POST /coupons → Create coupon  
   - GET /coupons → Get all coupons  
   - GET /coupons/:id → Get coupon by ID  
   - PUT /coupons/:id → Update coupon  
   - DELETE /coupons/:id → Delete coupon  

2. Coupon Application
   - POST /applicable-coupons → Fetch all applicable coupons for a given cart and their discounts  
   - POST /apply-coupon/:id → Apply a specific coupon to cart and return updated cart  


# Implemented Cases

   1. Cart-Wise Coupon
   2. Product-Wise Coupon
   3. BxGy Coupon

# Unimplemented Cases

   1. A seprate error handler, I don't implement it because its not making sense in this case.
   2. I have implemented the Service layer as it can be done in Controller layer.

# Assumptions

   1. In applicabe coupon api, in your response product-wise coupon was not applied so i added it.
   2. Also in your's api there were some wrong calculations so i fixed it.

# Author
Backend API by **Abhay Singh**