package com.example.expense_tracker.expense.dto;

import com.example.expense_tracker.expense.Category;
import java.math.BigDecimal;

public record CategoryTotal(Category category, BigDecimal total) {
}
