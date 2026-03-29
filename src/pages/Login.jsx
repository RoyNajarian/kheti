import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { authenticateUser, createUser } from "../back-office/api";
import "../styles/Login.css";
import { useTranslation } from "react-i18next";

const EyeIcon = ({ isVisible }) => (
    <svg
        viewBox="0 0 24 24"
        className="profil__passwordIcon"
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="M1.5 12s3.8-7 10.5-7 10.5 7 10.5 7-3.8 7-10.5 7S1.5 12 1.5 12Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
        {!isVisible && (
            <path
                d="M4 4l16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
            />
        )}
    </svg>
);

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    useEffect(() => {
        setIsRegisterMode(location.pathname === "/register");
    }, [location.pathname]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback({ type: "", message: "" });

        if (isRegisterMode && password !== confirmPassword) {
            setFeedback({ type: "error", message: t('login.errors.passwords_mismatch') });
            return;
        }

        if (isRegisterMode && (!lastName.trim() || !firstName.trim())) {
            setFeedback({ type: "error", message: t('login.errors.name_required') });
            return;
        }

        try {
            setIsSubmitting(true);

            if (isRegisterMode) {
                const payload = {
                    name: lastName.trim(),
                    first_name: firstName.trim(),
                    email: email.trim(),
                    password,
                    admin_state: 0,
                };
                await createUser(payload);

                setFeedback({ type: "success", message: t('login.success.account_created') });
                switchMode(false);
                setEmail(email.trim());
                return;
            }

            const result = await authenticateUser(email, password);
            if (!result.success) {
                setFeedback({ type: "error", message: result.error });
                return;
            }

            localStorage.setItem("khetiUser", JSON.stringify(result.user));
            if (result.token) {
                localStorage.setItem("khetiToken", result.token);
            } else {
                localStorage.removeItem("khetiToken");
            }
            setFeedback({ type: "success", message: t('login.success.logged_in') });
            navigate("/");
        } catch (error) {
            setFeedback({
                type: "error",
                message: error.message || t('login.errors.generic'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const switchMode = (nextIsRegisterMode) => {
        setIsRegisterMode(nextIsRegisterMode);
        setLastName("");
        setFirstName("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setFeedback({ type: "", message: "" });
        navigate(nextIsRegisterMode ? "/register" : "/login");
    };

    return (
        <section
            className="profil"
            aria-label={isRegisterMode ? t('login.aria.register_page') : t('login.aria.login_page')}
        >
            <form className="profil__card" onSubmit={handleSubmit}>
                <h1 className="profil__title">
                    {isRegisterMode ? t('login.title_register') : t('login.title_login')}
                </h1>

                <label className="profil__label" htmlFor="profil-email">
                    {t('login.email_label')} <span className="profil__required">{t('login.required')}</span>
                </label>
                <input
                    id="profil-email"
                    type="email"
                    className="profil__input"
                    placeholder={t('login.email_placeholder')}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                {isRegisterMode && (
                    <>
                        <label className="profil__label" htmlFor="profil-last-name">
                            {t('login.last_name_label')} <span className="profil__required">{t('login.required')}</span>
                        </label>
                        <input
                            id="profil-last-name"
                            type="text"
                            className="profil__input"
                            placeholder={t('login.last_name_placeholder')}
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                        />

                        <label className="profil__label" htmlFor="profil-first-name">
                            {t('login.first_name_label')} <span className="profil__required">{t('login.required')}</span>
                        </label>
                        <input
                            id="profil-first-name"
                            type="text"
                            className="profil__input"
                            placeholder={t('login.first_name_placeholder')}
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                        />
                    </>
                )}

                <label className="profil__label" htmlFor="profil-password">
                    {t('login.password_label')} <span className="profil__required">{t('login.required')}</span>
                </label>
                <div className="profil__passwordField">
                    <input
                        id="profil-password"
                        type={showPassword ? "text" : "password"}
                        className="profil__input profil__input--password"
                        placeholder={t('login.password_placeholder')}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={isRegisterMode ? "new-password" : "current-password"}
                        required
                    />
                    <button
                        type="button"
                        className="profil__passwordToggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? t('login.aria.hide_password') : t('login.aria.show_password')}
                        aria-pressed={showPassword}
                        disabled={isSubmitting}
                    >
                        <EyeIcon isVisible={showPassword} />
                    </button>
                </div>

                {isRegisterMode && (
                    <>
                        <label className="profil__label" htmlFor="profil-confirm-password">
                            {t('login.confirm_password_label')} <span className="profil__required">{t('login.required')}</span>
                        </label>
                        <div className="profil__passwordField">
                            <input
                                id="profil-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="profil__input profil__input--password"
                                placeholder={t('login.confirm_password_placeholder')}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="profil__passwordToggle"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                aria-label={showConfirmPassword ? t('login.aria.hide_confirm_password') : t('login.aria.show_confirm_password')}
                                aria-pressed={showConfirmPassword}
                                disabled={isSubmitting}
                            >
                                <EyeIcon isVisible={showConfirmPassword} />
                            </button>
                        </div>
                    </>
                )}

                <button type="submit" className="profil__submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? t('login.submit_loading')
                        : isRegisterMode
                            ? t('login.submit_register')
                            : t('login.submit_login')}
                </button>

                {feedback.message && (
                    <p className={`profil__feedback profil__feedback--${feedback.type}`}>
                        {feedback.message}
                    </p>
                )}

                {isRegisterMode ? (
                    <p className="profil__switchText">
                        <span className="profil__question">{t('login.switch_to_login.question')} </span>
                        <button
                            type="button"
                            className="profil__switchAction"
                            onClick={() => switchMode(false)}
                            disabled={isSubmitting}
                        >
                            {t('login.switch_to_login.action')}
                        </button>
                    </p>
                ) : (
                    <p className="profil__switchText">
                        <span className="profil__question">{t('login.switch_to_register.question')} </span>
                        <button
                            type="button"
                            className="profil__switchAction"
                            onClick={() => switchMode(true)}
                            disabled={isSubmitting}
                        >
                            {t('login.switch_to_register.action')}
                        </button>
                    </p>
                )}
            </form>
        </section>
    );
};

export default Login;