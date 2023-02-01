require('dotenv').config();
require('express-async-errors');
// express
const express = require('express');
const app = express();
//
const connectDB = require('./db/connect');
//
const cookieParser = require('cookie-parser');
const cors = require('cors');
//
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const wellRouter = require('./routes/wellRoutes');
//
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
//
const path = require('path');

// middleware
app.use(express.static(path.resolve(__dirname, './client/build')));
app.set('trust proxy', 1);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/well', wellRouter);

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// notFound and errorHandler middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log('connected to DB');
    app.listen(port, () =>
      console.log(`Server is listening in port ${port} ...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
