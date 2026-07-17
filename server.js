const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fileURLToPath = require('url');
const {dirname, join} = require('path');
const connectDB = require('./config/db.js');
const initializeDefaultData =  require('./utils/iniitializeData.js');

const authRoutes = require('./routes/authRoutes.js');
const toolsRoutes = require('./routes/toolsRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const chatRoutes =  require('./routes/chatRoutes.js');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

const startServer = async () => {
  await initializeDefaultData();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("Server on fire");
  });
};
startServer();