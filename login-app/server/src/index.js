import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express'
import authRoutes from './routes/auth.js';

const app = express();
const port = process.env.PORT || 3000;

(async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`);
    console.log("MongoDB connected successfully. DB Host:", connectionInstance.connection.host, "DB Name:", connectionInstance.connection.name);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
})();

app.get('/', (req, res) => {
    res.send('server home page!');
});

app.use('/api', authRoutes)