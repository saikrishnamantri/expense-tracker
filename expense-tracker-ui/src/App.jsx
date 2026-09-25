import { useEffect, useState } from "react";
import { fetchExpenses, fetchSummary, fetchCategories, deleteExpense } from "./api";
import ExpenseForm from "./ExpenseForm";

const LOAD_ERROR = "Could not reach the server. Is Spring Boot running on 8080?";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  // Called on demand (after create or delete). Not inside an effect.
  async function load(category = activeCategory) {
    try {
      const [list, sum] = await Promise.all([
        fetchExpenses(category),
        fetchSummary(),
      ]);
      setExpenses(list);
      setSummary(sum);
      setLoadError("");
    } catch {
      setLoadError(LOAD_ERROR);
    }
  }

  function selectCategory(category) {
    setActiveCategory(category);
    load(category);
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id);
      load();
    } catch {
      setLoadError("Could not delete that expense.");
    }
  }

  // Initial load, with cleanup so a late response can't touch a dead component.
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const [list, sum, cats] = await Promise.all([
          fetchExpenses(null, controller.signal),
          fetchSummary(controller.signal),
          fetchCategories(controller.signal),
        ]);
        if (controller.signal.aborted) return;
        setExpenses(list);
        setSummary(sum);
        setCategories(cats);
        setLoadError("");
      } catch (err) {
        if (err.name !== "AbortError") setLoadError(LOAD_ERROR);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  if (loading) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <p className="subtitle">Track what you spend, see where it goes</p>

      {loadError && <div className="banner">{loadError}</div>}

      <div className="card">
        <div className="total-label">Total spent</div>
        <div className="total-value">
          ₹{Number(summary?.totalSpent ?? 0).toFixed(2)}
        </div>
        <div className="expense-meta">
          {summary?.expenseCount ?? 0} expense
          {summary?.expenseCount === 1 ? "" : "s"}
        </div>

        {summary?.byCategory?.length > 0 && (
          <div style={{ marginTop: 20 }}>
            {summary.byCategory.map((row) => {
              const pct =
                (Number(row.total) / Number(summary.totalSpent)) * 100;
              return (
                <div key={row.category} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    <span className="expense-meta">{row.category}</span>
                    <span className="expense-amount">
                      ₹{Number(row.total).toFixed(2)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "var(--surface-2)",
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: "var(--accent)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ExpenseForm onCreated={load} />

      <div className="filter-bar">
        <button
          className={`ghost ${activeCategory === null ? "active" : ""}`}
          onClick={() => selectCategory(null)}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`ghost ${activeCategory === c ? "active" : ""}`}
            onClick={() => selectCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card">
        {expenses.length === 0 ? (
          <div className="empty">
            {activeCategory
              ? `No expenses in ${activeCategory}.`
              : "No expenses yet."}
          </div>
        ) : (
          expenses.map((e) => (
            <div className="expense-row" key={e.id}>
              <div className="expense-desc">
                <div>{e.description}</div>
                <div className="expense-meta">{e.spentOn}</div>
              </div>
              <span className="badge">{e.category}</span>
              <div className="expense-amount">
                ₹{Number(e.amount).toFixed(2)}
              </div>
              <button
                className="icon"
                onClick={() => handleDelete(e.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}