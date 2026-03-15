const BASE_URL = "http://localhost/kheti/back-end/api";

export async function getReservations() {
  const res = await fetch(`${BASE_URL}/reservations`);
  if (!res.ok) throw new Error("Erreur lors du chargement des réservations");
  const json = await res.json();
  return json.data;
}

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  const json = await res.json();
  return json.data;
}

export async function createReservation(data) {
  const res = await fetch(`${BASE_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Erreur lors de la création de la réservation");
  return json;
}
