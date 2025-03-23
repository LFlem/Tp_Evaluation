'use client'; // Indique que ce composant est côté client

import { useState, FormEvent } from 'react';
import Parse from '../../lib/parse';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await Parse.User.logIn(username, password);
            alert('Connexion réussie !');
            router.push('/projects'); // Redirige vers la liste des projets
        } catch (error) {
            if (error instanceof Error) { // Vérifiez si 'error' est une instance de 'Error'
                alert(`Erreur lors de la connexion: ${error.message}`);
            } else {
                alert('Une erreur inconnue est survenue.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 custom-bg rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
                Se connecter
            </h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 mb-2">
                        Nom d'utilisateur
                    </label>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 mb-2">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    Se connecter
                </button>
                <div className="mt-4 text-center">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        S'inscrire
                    </Link>
                </div>
            </form>
        </div>
    );
}