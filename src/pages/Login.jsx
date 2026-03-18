import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { authenticateUser, createUser } from "../back-office/api";
import "../styles/Login.css";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        try {
            setIsSubmitting(true);

            if (isRegisterMode) {
                const payload = {
                    name: email.split("@")[0] || "Utilisateur",
                    first_name: "",
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
        setPassword("");
        setConfirmPassword("");
        setFeedback({ type: "", message: "" });
        navigate(nextIsRegisterMode ? "/register" : "/login");
    };

    return (
        <section
            className="profil"
            aria-label={isRegisterMode ? "Inscription a un compte" : "Connexion a votre compte"}
        >
            <Link to="/" className="profil__logoLink" aria-label="Retour a l'accueil">
                <img
                    src="/images/kheti-logo.png"
                    alt="Kheti"
                    className="profil__logo"
                />
            </Link>

            <form className="profil__card" onSubmit={handleSubmit}>
                <h1 className="profil__title">{isRegisterMode ? "Inscription" : "Connexion"}</h1>

                <label className="profil__label" htmlFor="profil-email">
                    E-mail
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

                <label className="profil__label" htmlFor="profil-password">
                    Mot de passe
                </label>
                <input
                    id="profil-password"
                    type="password"
                    className="profil__input"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {isRegisterMode && (
                    <>
                        <label className="profil__label" htmlFor="profil-confirm-password">
                            Confirmer le mot de passe
                        </label>
                        <input
                            id="profil-confirm-password"
                            type="password"
                            className="profil__input"
                            placeholder="Confirmez votre mot de passe"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
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