package com.example.expense_tracker.expense;

import com.example.expense_tracker.expense.dto.CategoryTotal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Derived query: Spring reads the METHOD NAME and writes the SQL for you.
    List<Expense> findByCategoryOrderBySpentOnDescIdDesc(Category category);

    List<Expense> findAllByOrderBySpentOnDescIdDesc();

    // Custom query in JPQL (like SQL, but over Java classes instead of tables).
    // coalesce(..., 0) means "if there are no rows, give me 0, not null".
    @Query("select coalesce(sum(e.amount), 0) from Expense e")
    BigDecimal totalSpent();

    @Query("""
           select new com.example.expense_tracker.expense.dto.CategoryTotal(e.category, sum(e.amount))
           from Expense e
           group by e.category
           order by sum(e.amount) desc
           """)
    List<CategoryTotal> totalsByCategory();
}