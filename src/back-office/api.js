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

export async function authenticateUser(email, password) {
  const users = await getUsers();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const user = users.find(
    (item) => String(item.email || "").trim().toLowerCase() === normalizedEmail,
  );

  if (!user) {
    return { success: false, error: "Aucun compte trouve pour cet e-mail." };
  }

  // Si le backend expose un mot de passe, on le verifie; sinon on valide via l'e-mail.
  const backendPassword = user.password ?? user.pass ?? null;
  if (backendPassword !== null && String(backendPassword) !== String(password)) {
    return { success: false, error: "Mot de passe incorrect." };
  }

  return { success: true, user };
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || "Erreur lors de la creation du compte");
  }

  return json;
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
