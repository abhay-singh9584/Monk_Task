const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const routes = require('./Routes/routes');
const cors = require('cors');


const app = express();

const port = config.PORT;
const mongoURI = config.MONGODB_URI;

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`📢 ${req.method} request received at ${req.url}`);
  next();
});

app.get('/', (req, res) => {
    sendResponse(res,200,"SUCCESS","🚀 Server is running successfully!")
  });

app.use("/",routes)

const connectDB = async () => {
    try {
      console.info("🔄 Connecting to MongoDB...")
      await mongoose.connect(mongoURI);
      console.info("✅ MongoDB Connected Successfully")
      return true;
    } catch (error) {
      console.error('❌ MongoDB Connection Failed:', error.message)
      return false;
    }
  };

const startServer = async () => {
    const isConnected = await connectDB(); // Ensure DB is connected before starting the server

    if (isConnected) {
        app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    } else {
        console.error('❌ Server startup aborted due to DB connection failure.');
        process.exit(1);
    }
};
startServer().catch(error => {
    console.error('❌ Fatal error during server startup:', error);
    process.exit(1);
});