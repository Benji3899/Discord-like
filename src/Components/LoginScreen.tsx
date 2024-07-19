import React, { useState, useEffect } from "react";

interface LoginScreenProps {
    onLogin: (prenom: string) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
    const [prenoms, setPrenoms] = useState<string[]>([]);
    const [selectedPrenom, setSelectedPrenom] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:3000/prenoms")
            .then((response) => response.json())
            .then((data) => setPrenoms(data))
            .catch((error) => console.error("Error fetching prenoms:", error));
    }, []);

    const handleLogin = () => {
        if (selectedPrenom) {
            onLogin(selectedPrenom);
        }
    };

    return (
        <div className="login-screen">
            <h2>Choisissez un prénom</h2>
            <select value={selectedPrenom} onChange={(e) => setSelectedPrenom(e.target.value)}>
                <option value="" disabled>Sélectionnez un prénom</option>
                {prenoms.map((prenom) => (
                    <option key={prenom} value={prenom}>
                        {prenom}
                    </option>
                ))}
            </select>
            <button onClick={handleLogin} disabled={!selectedPrenom}>
                Connexion
            </button>
        </div>
    );
};
