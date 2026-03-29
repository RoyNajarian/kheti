import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { authenticateUser, createUser } from "../back-office/api";
import "../styles/Login.css";

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
            setFeedback({ type: "error", message: "Les mots de passe ne correspondent pas." });
            return;
        }

        if (isRegisterMode && (!lastName.trim() || !firstName.trim())) {
            setFeedback({ type: "error", message: "Veuillez renseigner votre nom et votre prenom." });
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

                setFeedback({ type: "success", message: "Compte cree avec succes. Vous pouvez vous connecter." });
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
            setFeedback({ type: "success", message: "Connexion reussie." });
            navigate("/");
        } catch (error) {
            setFeedback({
                type: "error",
                message: error.message || "Une erreur est survenue, reessayez.",
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
            aria-label={isRegisterMode ? "Inscription a un compte" : "Connexion a votre compte"}
        >

            <form className="profil__card" onSubmit={handleSubmit}>
                <h1 className="profil__title">{isRegisterMode ? "Inscription" : "Connexion"}</h1>

                <label className="profil__label" htmlFor="profil-email">
                    E-mail <span className="profil__required">*</span>
                </label>
                <input
                    id="profil-email"
                    type="email"
                    className="profil__input"
                    placeholder="Entrez votre e-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                {isRegisterMode && (
                    <>
                        <label className="profil__label" htmlFor="profil-last-name">
                            Nom <span className="profil__required">*</span>
                        </label>
                        <input
                            id="profil-last-name"
                            type="text"
                            className="profil__input"
                            placeholder="Entrez votre nom"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                        />

                        <label className="profil__label" htmlFor="profil-first-name">
                            Prenom <span className="profil__required">*</span>
                        </label>
                        <input
                            id="profil-first-name"
                            type="text"
                            className="profil__input"
                            placeholder="Entrez votre prenom"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                        />
                    </>
                )}

                <label className="profil__label" htmlFor="profil-password">
                    Mot de passe <span className="profil__required">*</span>
                </label>
                <div className="profil__passwordField">
                    <input
                        id="profil-password"
                        type={showPassword ? "text" : "password"}
                        className="profil__input profil__input--password"
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={isRegisterMode ? "new-password" : "current-password"}
                        required
                    />
                    <button
                        type="button"
                        className="profil__passwordToggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        aria-pressed={showPassword}
                        disabled={isSubmitting}
                    >
                        <EyeIcon isVisible={showPassword} />
                    </button>
                </div>

                {isRegisterMode && (
                    <>
                        <label className="profil__label" htmlFor="profil-confirm-password">
                            Confirmer le mot de passe <span className="profil__required">*</span>
                        </label>
                        <div className="profil__passwordField">
                            <input
                                id="profil-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="profil__input profil__input--password"
                                placeholder="Confirmez votre mot de passe"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="profil__passwordToggle"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                aria-label={showConfirmPassword ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"}
                                aria-pressed={showConfirmPassword}
                                disabled={isSubmitting}
                            >
                                <EyeIcon isVisible={showConfirmPassword} />
                            </button>
                        </div>
                    </>
                )}

                <button type="submit" className="profil__submit" disabled={isSubmitting}>
                    {isSubmitting ? "Chargement..." : isRegisterMode ? "S'inscrire" : "Connexion"}
                </button>

                {feedback.message && (
                    <p className={`profil__feedback profil__feedback--${feedback.type}`}>
                        {feedback.message}
                    </p>
                )}

                {isRegisterMode ? (
                    <p className="profil__switchText">
                        <span className="profil__question">Vous avez deja un compte ? </span>
                        <button
                            type="button"
                            className="profil__switchAction"
                            onClick={() => switchMode(false)}
                            disabled={isSubmitting}
                        >
                            Connectez-vous
                        </button>
                    </p>
                ) : (
                    <p className="profil__switchText">
                        <span className="profil__question">Pas encore de compte ? </span>
                        <button
                            type="button"
                            className="profil__switchAction"
                            onClick={() => switchMode(true)}
                            disabled={isSubmitting}
                        >
                            Inscrivez-vous
                        </button>
                    </p>
                )}
            </form>
        </section>
    );
};

export default Login;