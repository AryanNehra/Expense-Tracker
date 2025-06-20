const Expense = require('../models/expense')
const { encrypt, decrypt } = require('../utils/encryption');

exports.createExpense = async (req, res, next) => {
    try {
        const { title, category, amount, date } = req.body;

        const encryptedExpense = {
            user: req.userId,
            title: encrypt(title),
            category: encrypt(category),
            amount: encrypt(amount.toString()),
            date,
        };

        const expense = await Expense.create(encryptedExpense);

        res.json({
            _id: expense._id,
            user: expense.user,
            title: title.trim(),
            category: category.trim(),
            amount: parseFloat(amount),
            date: expense.date,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.userId });
        const decryptedExpenses = expenses.map((exp) => ({
            _id: exp._id,
            user: exp.user,
            title: decrypt(exp.title),
            category: decrypt(exp.category),
            amount: parseFloat(decrypt(exp.amount)),
            date: exp.date,
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt,
        }));

        res.json(decryptedExpenses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}

exports.updateExpense = async (req, res, next) => {
    try {
        const { title, category, amount, date } = req.body;

        const encryptedFields = {
            title: encrypt(title),
            category: encrypt(category),
            amount: encrypt(amount.toString()),
            date
        };

        const expense = await Expense.findByIdAndUpdate(req.params.id, encryptedFields, {
            new: true,
            runValidators: true
        });

        res.json({
            _id: expense._id,
            user: expense.user,
            title: title.trim(),
            category: category.trim(),
            amount: parseFloat(amount),
            date: expense.date,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
}