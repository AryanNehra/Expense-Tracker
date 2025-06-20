const express=require('express');
const auth=require('../middleware/auth')
const expenseRouter=express.Router();

const expenseController=require('../controllers/expenseController');

expenseRouter.use(auth);

expenseRouter.post('/',expenseController.createExpense);
expenseRouter.get('/',expenseController.getExpenses);
expenseRouter.put('/:id',expenseController.updateExpense);
expenseRouter.delete('/:id',expenseController.deleteExpense);

module.exports = expenseRouter;