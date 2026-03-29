import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getReservations, updateUserPassword } from "../back-office/api";
import "../styles/Profil.css";
import { useTranslation } from "react-i18next";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("khetiUser");
    if (!rawUser) return null;
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("khetiUser");
    return null;
  }
};

const parseReservationDateTime = (reservation) => {
  const day = String(reservation?.day || "").trim();
  const hour = String(reservation?.hour || "00:00").trim();
  if (!day) return null;

  const normalizedHour = /^\d{2}:\d{2}$/.test(hour) ? `${hour}:00` : "00:00:00";
  const parsed = new Date(`${day}T${normalizedHour}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const Profil = () => {
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState(null);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [reservationError, setReservationError] = useState("");
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [resetFeedback, setResetFeedback] = useState({ type: "", message: "" });
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Moved inside component so it has access to t()
  const formatDateLabel = (reservation) => {
    const dateTime = parseReservationDateTime(reservation);
    if (!dateTime) return reservation?.day || t('profil.reservations.date_undefined');

    const locale = i18n.language?.startsWith("fr") ? "fr-FR" : "en-GB";
    const dateLabel = dateTime.toLocaleDateString(locale, {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const hourLabel = String(reservation?.hour || "").trim();
    return hourLabel ? `${dateLabel} à ${hourLabel}` : dateLabel;
  };

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    if (!isPasswordFormOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPasswordFormOpen(false);
        setOldPassword("");
        setNewPassword("");
        setShowOldPassword(false);
        setShowNewPassword(false);
        setResetFeedback({ type: "", message: "" });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPasswordFormOpen]);

  useEffect(() => {
    if (!isPasswordFormOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPasswordFormOpen]);

  useEffect(() => {
    if (!user?.email) {
      setUpcomingReservations([]);
      setPastReservations([]);
      setReservationError("");
      return;
    }

    let isMounted = true;

    const loadReservations = async () => {
      try {
        setIsLoadingReservations(true);
        setReservationError("");

        const allReservations = await getReservations();
        if (!isMounted) return;

        const userEmail = String(user.email).trim().toLowerCase();
        const userReservations = allReservations.filter((reservation) => {
          const reservationEmail = String(
            reservation?.email || reservation?.user?.email || "",
          )
            .trim()
            .toLowerCase();
          return reservationEmail && reservationEmail === userEmail;
        });

        const now = new Date();
        const upcoming = [];
        const past = [];

        userReservations.forEach((reservation) => {
          const reservationDateTime = parseReservationDateTime(reservation);
          if (!reservationDateTime || reservationDateTime >= now) {
            upcoming.push(reservation);
            return;
          }
          past.push(reservation);
        });

        upcoming.sort((a, b) => {
          const dateA =
            parseReservationDateTime(a)?.getTime() || Number.MAX_SAFE_INTEGER;
          const dateB =
            parseReservationDateTime(b)?.getTime() || Number.MAX_SAFE_INTEGER;
          return dateA - dateB;
        });

        past.sort((a, b) => {
          const dateA = parseReservationDateTime(a)?.getTime() || 0;
          const dateB = parseReservationDateTime(b)?.getTime() || 0;
          return dateB - dateA;
        });

        setUpcomingReservations(upcoming);
        setPastReservations(past);
      } catch (error) {
        if (!isMounted) return;
        setReservationError(error.message || t('profil.errors.load_reservations'));
      } finally {
        if (isMounted) {
          setIsLoadingReservations(false);
        }
      }
    };

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setResetFeedback({ type: "error", message: t('profil.errors.no_email') });
      return;
    }

    if (!oldPassword || !newPassword) {
      setResetFeedback({ type: "error", message: t('profil.errors.fields_required') });
      return;
    }

    if (oldPassword === newPassword) {
      setResetFeedback({ type: "error", message: t('profil.errors.same_password') });
      return;
    }

    const result = await updateUserPassword({
      email: user.email,
      oldPassword,
      newPassword,
      name: user?.name || "",
      firstName: user?.first_name || "",
    });

    if (!result.success) {
      setResetFeedback({
        type: "error",
        message: String(result.error || "").trim() || t('profil.errors.update_failed'),
      });
      return;
    }

    setResetFeedback({ type: "success", message: t('profil.success.password_updated') });
    setOldPassword("");
    setNewPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setIsPasswordFormOpen(false);
  };

  const closePasswordModal = () => {
    setIsPasswordFormOpen(false);
    setOldPassword("");
    setNewPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setResetFeedback({ type: "", message: "" });
  };

  return (
    <section className="profilePage" aria-label={t('profil.aria.page')}>
      <div className="profileBackdrop" aria-hidden="true" />
      <div className="profileContent">
        <header className="profileHeader">
          <div className="profileTitleRow">
            <h1 className="profileTitle">{t('profil.title')}</h1>
          </div>
        </header>

        {user ? (
          <>
            <section className="profileSection" aria-labelledby="profile-infos-title">
              <h2 id="profile-infos-title" className="profileSectionTitle">
                {t('profil.account.section_title')}
              </h2>
              <dl className="profileInfoList">
                <div className="profileInfoRow">
                  <dt>{t('profil.account.last_name')}</dt>
                  <dd>{user.name || "-"}</dd>
                </div>
                <div className="profileInfoRow">
                  <dt>{t('profil.account.first_name')}</dt>
                  <dd>{user.first_name || "-"}</dd>
                </div>
                <div className="profileInfoRow">
                  <dt>{t('profil.account.email')}</dt>
                  <dd>{user.email || "-"}</dd>
                </div>
                <div className="profileInfoRow profileInfoRow--password">
                  <dt>{t('profil.account.password')}</dt>
                  <dd className="profilePasswordCell">
                    <span className="profilePasswordMask">••••••••</span>
                    <button
                      type="button"
                      className="profileIconBtn"
                      onClick={() => {
                        setIsPasswordFormOpen((prev) => !prev);
                        setShowOldPassword(false);
                        setShowNewPassword(false);
                        setResetFeedback({ type: "", message: "" });
                      }}
                      aria-expanded={isPasswordFormOpen}
                      aria-label={t('profil.aria.edit_password')}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M3 17.25V21h3.75l11-11-3.75-3.75-11 11zm14.71-9.04c.39-.39.39-1.02 0-1.41l-2.5-2.5a.996.996 0 10-1.41 1.41l2.5 2.5c.39.39 1.02.39 1.41 0z" />
                      </svg>
                    </button>
                  </dd>
                </div>
              </dl>
            </section>

            <section className="profileSection" aria-labelledby="profile-reservations-title">
              <h2 id="profile-reservations-title" className="profileSectionTitle">
                {t('profil.reservations.section_title')}
              </h2>

              {isLoadingReservations ? (
                <p className="profileHint">{t('profil.reservations.loading')}</p>
              ) : reservationError ? (
                <p className="profileInlineFeedback profileInlineFeedback--error">
                  {reservationError}
                </p>
              ) : (
                <div className="profileReservationsGrid">
                  <div className="profileReservationsColumn">
                    <h3 className="profileColumnTitle">{t('profil.reservations.upcoming_title')}</h3>
                    {upcomingReservations.length === 0 ? (
                      <p className="profileHint">{t('profil.reservations.upcoming_empty')}</p>
                    ) : (
                      <ul className="profileReservationList">
                        {upcomingReservations.map((reservation) => {
                          const count = reservation.number_of_people ??
                            ((reservation.adult_count || 0) + (reservation.child_count || 0) + (reservation.student_count || 0));
                          return (
                            <li key={reservation.id} className="profileReservationItem">
                              <p className="profileReservationDate">{formatDateLabel(reservation)}</p>
                              <p className="profileReservationMeta">
                                {t('profil.reservations.people_count', { count })} • {reservation.price} €
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="profileReservationsColumn">
                    <h3 className="profileColumnTitle">{t('profil.reservations.past_title')}</h3>
                    {pastReservations.length === 0 ? (
                      <p className="profileHint">{t('profil.reservations.past_empty')}</p>
                    ) : (
                      <ul className="profileReservationList">
                        {pastReservations.map((reservation) => {
                          const count = reservation.number_of_people ??
                            ((reservation.adult_count || 0) + (reservation.child_count || 0) + (reservation.student_count || 0));
                          return (
                            <li key={reservation.id} className="profileReservationItem profileReservationItem--past">
                              <p className="profileReservationDate">{formatDateLabel(reservation)}</p>
                              <p className="profileReservationMeta">
                                {t('profil.reservations.people_count', { count })} • {reservation.price} €
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <p className="profileStatus profileStatus--disconnected">{t('profil.guest.not_connected')}</p>
            <p className="profileHint">{t('profil.guest.hint')}</p>
            <div className="profileActions">
              <Link to="/login" className="profileBtn">
                {t('profil.guest.login_btn')}
              </Link>
              <Link to="/register" className="profileBtn profileBtn--ghost">
                {t('profil.guest.register_btn')}
              </Link>
            </div>
          </>
        )}

        {isPasswordFormOpen && (
          <div
            className="profilePasswordModalBackdrop"
            onClick={(event) => {
              if (event.target !== event.currentTarget) return;
              closePasswordModal();
            }}
          >
            <div className="profilePasswordModal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
              <h2 id="password-modal-title" className="profileSectionTitle">
                {t('profil.password_modal.title')}
              </h2>

              <form
                className="profilePasswordForm"
                onSubmit={(event) => {
                  event.preventDefault();
                  handlePasswordReset();
                }}
              >
                <div className="profilePasswordField">
                  <label htmlFor="old-password">{t('profil.password_modal.old_label')}</label>
                  <div className="profilePasswordInputWrap">
                    <input
                      id="old-password"
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(event) => setOldPassword(event.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="profilePasswordToggle"
                      onClick={() => setShowOldPassword((prev) => !prev)}
                      aria-label={showOldPassword
                        ? t('profil.aria.hide_old_password')
                        : t('profil.aria.show_old_password')}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        {showOldPassword ? (
                          <path d="M2.1 3.51L1 4.62l4.03 4.03C3.77 9.67 2.8 10.99 2 12c1.73 2.39 4.56 5 10 5 2.02 0 3.74-.36 5.2-.96l3.18 3.18 1.11-1.11L2.1 3.51zM12 7c3.72 0 6.22 1.85 7.99 4.06-.57.72-1.23 1.43-2.04 2.07l-1.46-1.46c.32-.53.51-1.15.51-1.82a3.5 3.5 0 0 0-3.5-3.5c-.67 0-1.29.19-1.82.51l-1.44-1.44c.56-.23 1.16-.42 1.76-.42zM8.27 11.89l3.84 3.84A3.5 3.5 0 0 1 8.27 11.9z" />
                        ) : (
                          <path d="M12 5c-5.44 0-8.27 2.61-10 5 1.73 2.39 4.56 5 10 5s8.27-2.61 10-5c-1.73-2.39-4.56-5-10-5zm0 8.5A3.5 3.5 0 1 1 12 6a3.5 3.5 0 0 1 0 7.5zm0-1.5A2 2 0 1 0 12 8a2 2 0 0 0 0 4z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="profilePasswordField">
                  <label htmlFor="new-password">{t('profil.password_modal.new_label')}</label>
                  <div className="profilePasswordInputWrap">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="profilePasswordToggle"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword
                        ? t('profil.aria.hide_new_password')
                        : t('profil.aria.show_new_password')}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        {showNewPassword ? (
                          <path d="M2.1 3.51L1 4.62l4.03 4.03C3.77 9.67 2.8 10.99 2 12c1.73 2.39 4.56 5 10 5 2.02 0 3.74-.36 5.2-.96l3.18 3.18 1.11-1.11L2.1 3.51zM12 7c3.72 0 6.22 1.85 7.99 4.06-.57.72-1.23 1.43-2.04 2.07l-1.46-1.46c.32-.53.51-1.15.51-1.82a3.5 3.5 0 0 0-3.5-3.5c-.67 0-1.29.19-1.82.51l-1.44-1.44c.56-.23 1.16-.42 1.76-.42zM8.27 11.89l3.84 3.84A3.5 3.5 0 0 1 8.27 11.9z" />
                        ) : (
                          <path d="M12 5c-5.44 0-8.27 2.61-10 5 1.73 2.39 4.56 5 10 5s8.27-2.61 10-5c-1.73-2.39-4.56-5-10-5zm0 8.5A3.5 3.5 0 1 1 12 6a3.5 3.5 0 0 1 0 7.5zm0-1.5A2 2 0 1 0 12 8a2 2 0 0 0 0 4z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="profilePasswordActions">
                  <button type="submit" className="profileBtn">{t('profil.password_modal.save_btn')}</button>
                  <button
                    type="button"
                    className="profileBtn profileBtn--ghost"
                    onClick={closePasswordModal}
                  >
                    {t('profil.password_modal.cancel_btn')}
                  </button>
                </div>
              </form>

              {resetFeedback.message && (
                <p
                  className={`profileInlineFeedback profileInlineFeedback--${resetFeedback.type}`}
                >
                  {resetFeedback.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profil;