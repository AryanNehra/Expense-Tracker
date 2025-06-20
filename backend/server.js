const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();

const authRouter=require('./router/authRouter')
const expenseRouter=require('./router/expenseRouter')
const profileRouter=require('./router/profileRouter')

const app=express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api', authRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/profile',profileRouter);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('DB connection failed:', err));