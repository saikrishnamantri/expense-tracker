const BASE_URL = "http://localhost:8080/api/expenses";

async function handle(response) {
  if (response.status === 204) return null;

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(body?.message ?? "Request failed");
    error.fieldErrors = body?.errors ?? {};
    error.status = response.status;
    throw error;
  }
  return body;
}

export async function fetchExpenses(category, signal) {
  const url = category ? `${BASE_URL}?category=${category}` : BASE_URL;
  return handle(await fetch(url, { signal }));
}

export async function fetchSummary(signal) {
  return handle(await fetch(`${BASE_URL}/summary`, { signal }));
}

export async function fetchCategories(signal) {
  return handle(await fetch(`${BASE_URL}/categories`, { signal }));
}

export async function createExpense(payload) {
  return handle(await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
}

export async function deleteExpense(id) {
  return handle(await fetch(`${BASE_URL}/${id}`, { method: "DELETE" }));
}