package com.example.expense_tracker.expense;


import com.example.expense_tracker.expense.dto.CreateExpenseRequest;
import com.example.expense_tracker.expense.dto.ExpenseResponse;
import com.example.expense_tracker.expense.dto.ExpenseSummary;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    //GET/api/expenses                  -> Everything
    //GET/api/expenses?category=FOOD    -> filtered
    @GetMapping
    public List<ExpenseResponse> list(@RequestParam(required = false) Category category) {
        return service.findAll(category);
    }

    @GetMapping("/summary")
    public ExpenseSummary summary() {
        return service.summary();
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@Valid @RequestBody CreateExpenseRequest request) {
        ExpenseResponse created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public Category[] categories() {
        return Category.values();
    }

}
