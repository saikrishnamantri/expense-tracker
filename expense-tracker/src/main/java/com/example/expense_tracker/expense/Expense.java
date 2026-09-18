package com.example.expense_tracker.expense;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 120)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Category category;

    @Column(name = "spent_on", nullable = false)
    private LocalDate spentOn;

    protected Expense() {
    }

    public Expense(String description, BigDecimal amount, Category category, LocalDate spentOn) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.spentOn = spentOn;
    }

    public long getId() { return id; }
    public String getDescription() { return description; }
    public BigDecimal getAmount() { return amount; }
    public Category getCategory() { return category; }
    public LocalDate getSpentOn() { return spentOn; }

}
