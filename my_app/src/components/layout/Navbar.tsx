"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Parse from "../../lib/parse";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = Parse.User.current();
            if (currentUser) {
                setUser(currentUser);
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await Parse.User.logOut();
            alert("Déconnexion réussie");
            router.push("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold">
                            ProjectManager
                        </Link>

                        {!loading && user && (
                            <div className="ml-10 flex items-center space-x-4">
                                <Link
                                    href="/projects"
                                    className="hover:bg-gray-700 px-3 py-2 rounded"
                                >
                                    Projets
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {!loading && (
                            <>
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-300">
                                            {user.username}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="hover:bg-gray-700 px-3 py-2 rounded"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-x-2">
                                        <Link
                                            href="/login"
                                            className="hover:bg-gray-700 px-3 py-2 rounded"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="hover:bg-gray-700 px-3 py-2 rounded"
                                        >
                                            Inscription
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}