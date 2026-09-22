import { useEffect, useState } from "react";
import { createExpense, fetchCategories } from "./api";

const EMPTY = { description: "", amount: "", category: "FOOD", spentOn: "" };

export default function ExpenseForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState(["FOOD", "OTHER"]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then((list) => {
        if (!controller.signal.aborted) setCategories(list);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // ONE handler for every field. The input's name tells it which key to update.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await createExpense({
        description: form.description.trim(),
        amount: form.amount === "" ? null : Number(form.amount),
        category: form.category,
        spentOn: form.spentOn || null,
      });
      setForm(EMPTY);
      onCreated();
    } catch (err) {
      const fieldErrors = err.fieldErrors ?? {};
      setErrors(
        Object.keys(fieldErrors).length ? fieldErrors : { _general: err.message }
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      {errors._general && <div className="banner">{errors._general}</div>}

      <div className="form-row">
        <div className="field" style={{ flex: 2 }}>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? "invalid" : ""}
            placeholder="Groceries"
          />
          <span className="error-text">{errors.description}</span>
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            className={errors.amount ? "invalid" : ""}
            placeholder="0.00"
          />
          <span className="error-text">{errors.amount}</span>
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="error-text">{errors.category}</span>
        </div>

        <div className="field">
          <label htmlFor="spentOn">Date</label>
          <input
            id="spentOn"
            name="spentOn"
            type="date"
            value={form.spentOn}
            onChange={handleChange}
            className={errors.spentOn ? "invalid" : ""}
          />
          <span className="error-text">{errors.spentOn}</span>
        </div>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Add expense"}
      </button>
    </form>
  );
}