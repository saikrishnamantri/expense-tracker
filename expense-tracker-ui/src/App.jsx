import { useEffect, useState } from "react";
import { fetchExpenses, fetchSummary } from "./api";

const LOAD_ERROR = "Could not reach the server. Is Spring Boot running on 8080?";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Called on demand (after create or delete). Not inside an effect.
  async function load() {
    try {
      const [list, sum] = await Promise.all([fetchExpenses(), fetchSummary()]);
      setExpenses(list);
      setSummary(sum);
      setLoadError("");
    } catch {
      setLoadError(LOAD_ERROR);
    }
  }

  // Initial load, with cleanup so a late response can't touch a dead component.
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const [list, sum] = await Promise.all([
          fetchExpenses(null, controller.signal),
          fetchSummary(controller.signal),
        ]);
        if (controller.signal.aborted) return;
        setExpenses(list);
        setSummary(sum);
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
          {summary?.expenseCount ?? 0} expense{summary?.expenseCount === 1 ? "" : "s"}
        </div>
      </div>

      <div className="card">
        {expenses.length === 0 ? (
          <div className="empty">No expenses yet.</div>
        ) : (
          expenses.map((e) => (
            <div className="expense-row" key={e.id}>
              <div className="expense-desc">
                <div>{e.description}</div>
                <div className="expense-meta">{e.spentOn}</div>
              </div>
              <span className="badge">{e.category}</span>
              <div className="expense-amount">₹{Number(e.amount).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}