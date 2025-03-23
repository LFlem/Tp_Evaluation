'use client'; // Indique que ce composant est côté client

import { useState, FormEvent } from 'react';
import Parse from '../../lib/parse';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const router = useRouter();

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = new Parse.User();
        user.set('username', username);
        user.set('email', email);
        user.set('password', password);

        try {
            if (avatar) {
                const parseFile = new Parse.File(avatar.name, avatar);
                user.set('avatar', parseFile);
            }

            await user.signUp();
            alert('Utilisateur inscrit avec succès !');
            router.push('/projects'); // Redirige vers la liste des projets
        } catch (error) {
            if (error instanceof Error) { // Vérifiez si 'error' est une instance de 'Error'
                alert(`Erreur lors de l'inscription: ${error.message}`);
            } else {
                alert('Une erreur inconnue est survenue.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 custom-bg  rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
                S'inscrire
            </h2>
            <form onSubmit={handleRegister}>
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
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div className="mb-6">
                    <label htmlFor="avatar" className="block text-gray-700 mb-2">
                        Avatar (optionnel)
                    </label>
                    <input
                        type="file"
                        id="avatar"
                        accept="image/*" // Accepter uniquement les fichiers image
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)} // Stocker le fichier sélectionné
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    S'inscrire
                </button>

                <div className="mt-4 text-center">
                    Déjà un compte ? {' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Se connecter
                    </Link>
                </div>
            </form>
        </div>
    );
}