package com.example.expense_tracker.expense;

import com.example.expense_tracker.common.ExpenseNotFoundException;
import com.example.expense_tracker.expense.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    // Constructor injection. Spring passes the repository in automatically.
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ExpenseResponse create(CreateExpenseRequest request) {
        LocalDate date = (request.spentOn() != null) ? request.spentOn() : LocalDate.now();

        // Belt and braces: annotations guard the edge, the service guards the core.
        if (request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        Expense expense = new Expense(
                request.description().trim(),
                request.amount().setScale(2, java.math.RoundingMode.HALF_UP),
                request.category(),
                date
        );

        return ExpenseResponse.from(repository.save(expense));
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> findAll(Category category) {
        List<Expense> expenses = (category == null)
                ? repository.findAllByOrderBySpentOnDescIdDesc()
                : repository.findByCategoryOrderBySpentOnDescIdDesc(category);

        return expenses.stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExpenseSummary summary() {
        return new ExpenseSummary(
                repository.totalSpent(),
                repository.count(),
                repository.totalsByCategory()
        );
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }
        repository.deleteById(id);
    }
}