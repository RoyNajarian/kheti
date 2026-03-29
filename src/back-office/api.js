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
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const res = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: normalizedEmail,
      password: String(password || ""),
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      error: json.error || "Identifiants invalides.",
    };
  }

  const user = json?.data?.user || json?.user || null;
  const token = json?.data?.token || json?.token || null;
  return { success: true, user, token };
}

export async function updateUserPassword({
  email,
  oldPassword,
  newPassword,
  name,
  firstName,
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const currentPassword = String(oldPassword || "");
  const nextPassword = String(newPassword || "");

  try {
    // 1) Vérifier l'ancien mot de passe avec l'endpoint d'auth existant.
    const authRes = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        password: currentPassword,
      }),
    });

    const authJson = await authRes.json().catch(() => ({}));
    if (!authRes.ok) {
      return {
        success: false,
        error:
          String(authJson?.error || "").trim() ||
          "Ancien mot de passe incorrect.",
      };
    }

    // 2) Mettre à jour l'utilisateur via PUT /users/{email}.
    const updateRes = await fetch(`${BASE_URL}/users/${normalizedEmail}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(name || "").trim(),
          first_name: String(firstName || "").trim(),
          email: normalizedEmail,
          password: nextPassword,
        }),
      }
    );

    const updateJson = await updateRes.json().catch(() => ({}));
    if (!updateRes.ok) {
      return {
        success: false,
        error:
          String(updateJson?.error || "").trim() ||
          `Erreur API (${updateRes.status}) lors de la mise à jour du mot de passe.`,
      };
    }

    return {
      success: true,
      data: updateJson?.data || updateJson || null,
    };
  } catch (error) {
    const rawError = String(error?.message || "").trim();
    return {
      success: false,
      error:
        /failed to fetch|networkerror|load failed/i.test(rawError)
          ? "Impossible de joindre l'API. Vérifiez que le back-end est démarré et accessible."
          : rawError || "Erreur réseau pendant la modification du mot de passe.",
    };
  }
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

export async function sendConfirmationEmail(email, reservationId, date, time, price) {
  try {
    const normalizedDate = String(date || "").trim();
    const normalizedTime = String(time || "").trim();

    const res = await fetch(`${BASE_URL}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        type: "reservation_confirmation",
        reservation_id: reservationId,
        date: normalizedDate,
        time: normalizedTime,
        // Compatibilite avec une API qui attend day/hour.
        day: normalizedDate,
        hour: normalizedTime,
        price,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn("Erreur lors de l'envoi du mail:", json.error || res.status);
      return { success: false, error: json.error || "Erreur lors de l'envoi du mail" };
    }

    return { success: true };
  } catch (error) {
    console.warn("Erreur réseau lors de l'envoi du mail:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getAvailableSlots() {
  const res = await fetch(`${BASE_URL}/reservations`);
  if (!res.ok) throw new Error("Erreur lors du chargement des disponibilités");
  const json = await res.json();
  
  // Compter les places par créneau/jour (clé: YYYY-MM-DD_HH:MM)
  const availability = {};
  (json.data || []).forEach((reservation) => {
    const rawDay = String(reservation.day || "").trim();
    const rawHour = String(reservation.hour || "").trim();

    // day peut arriver en "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm:ss..."
    const dateStr = rawDay.includes("T") ? rawDay.split("T")[0] : rawDay;

    // hour peut arriver en "HH", "HH:MM" ou "HH:MM:SS"
    let hourStr = rawHour;
    if (/^\d{1,2}$/.test(hourStr)) {
      hourStr = `${hourStr.padStart(2, "0")}:00`;
    } else if (/^\d{1,2}:\d{2}$/.test(hourStr)) {
      hourStr = hourStr.padStart(5, "0");
    } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(hourStr)) {
      hourStr = hourStr.slice(0, 5).padStart(5, "0");
    }

    if (!dateStr || !hourStr) return;

    const key = `${dateStr}_${hourStr}`;
    const count =
      (reservation.adult_count || 0) +
      (reservation.child_count || 0) +
      (reservation.student_count || 0);

    availability[key] = (availability[key] || 0) + count;
  });
  
  return availability;
}
