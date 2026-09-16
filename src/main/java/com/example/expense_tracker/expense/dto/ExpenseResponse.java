package com.example.expense_tracker.expense.dto;

import com.example.expense_tracker.expense.Category;
import com.example.expense_tracker.expense.Expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        String description,
        BigDecimal amount,
        Category category,
        LocalDate spentOn
) {
    public static ExpenseResponse from(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getSpentOn()
        );
    }
}