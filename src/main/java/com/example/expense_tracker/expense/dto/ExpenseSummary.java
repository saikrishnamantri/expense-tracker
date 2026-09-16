package com.example.expense_tracker.expense.dto;

import java.math.BigDecimal;
import java.util.List;

public record ExpenseSummary(
        BigDecimal totalSpent,
        long expenseCount,
        List<CategoryTotal> byCategory) {
}
