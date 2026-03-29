const DEFAULT_BASE_URL = "https://kheti.leolesimple.fr/api/index.php";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

function buildApiUrl(resource, id) {
  const url = new URL(BASE_URL);
  url.searchParams.set("resource", resource);
  if (id !== undefined && id !== null && String(id).trim() !== "") {
    url.searchParams.set("id", String(id));
  }
  return url.toString();
}

export async function getReservations() {
  const reservationsUrl = new URL(buildApiUrl("reservations"));
  reservationsUrl.searchParams.set("_ts", String(Date.now()));

  const res = await fetch(reservationsUrl.toString(), {
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Erreur lors du chargement des réservations");
  }

  const reservations = Array.isArray(json?.data) ? json.data : [];
  return reservations;
}

export async function getUsers() {
  const res = await fetch(buildApiUrl("users"));
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  const json = await res.json();
  return json.data;
}

export async function authenticateUser(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const res = await fetch(buildApiUrl("auth"), {
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
    const authRes = await fetch(buildApiUrl("auth"), {
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

    const updateRes = await fetch(buildApiUrl("users", normalizedEmail), {
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
  const res = await fetch(buildApiUrl("users"), {
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
  const reservationUrl = buildApiUrl("reservations");

  const res = await fetch(reservationUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = json.error || json.message || `Erreur HTTP ${res.status}`;
    throw new Error(errorMsg);
  }

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
        day: normalizedDate,
        hour: normalizedTime,
        price,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: json.error || "Erreur lors de l'envoi du mail" };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAvailableSlots() {
  try {
    const reservations = await getReservations();

    const availability = {};
    (reservations || []).forEach((reservation) => {
      const rawDay = String(reservation.day || "").trim();
      const rawHour = String(reservation.hour || "").trim();

      const dateStr = rawDay.includes("T") ? rawDay.split("T")[0] : rawDay;

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
  } catch {
    return {};
  }
}
