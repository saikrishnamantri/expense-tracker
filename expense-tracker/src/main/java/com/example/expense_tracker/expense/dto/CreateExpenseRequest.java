package com.example.expense_tracker.expense.dto;

import com.example.expense_tracker.expense.Category;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateExpenseRequest(

        @NotBlank(message = "Description is required")
        @Size(max = 120, message = "Description must be 120 characters or fewer")
        String description,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        @Digits(integer = 10, fraction = 2, message = "Amount can have at most 2 decimal places")
        BigDecimal amount,

        @NotNull(message = "Category is required")
        Category category,

        @PastOrPresent(message = "Date cannot be in the future")
        LocalDate spentOn   // optional; we default it to today
) {
}