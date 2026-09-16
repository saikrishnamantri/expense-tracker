package com.example.expense_tracker.common;

import com.example.expense_tracker.expense.dto.ExpenseSummary;

public class ExpenseNotFoundException extends RuntimeException {
    public ExpenseNotFoundException(Long id) {
        super("Expense not found with id: " + id);
    }
}
