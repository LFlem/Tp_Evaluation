'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Project from '@/models/Project';
import Parse from 'parse';
import Link from 'next/link';

export default function ProjectMembersPage() {
    const { id } = useParams<{ id: string }>();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAddMember = async () => {
        setLoading(true);
        setError('');

        try {
            const user = await Parse.Cloud.run('findUserByEmail', { email });

            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            await Project.addTeamMember(id, user.id);
            alert('Membre ajouté avec succès !');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'ajout du membre');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <h1 className="text-2xl font-bold mb-6">Ajouter un membre</h1>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            <div className="flex space-x-2">
                <input
                    type="email"
                    placeholder="Email du membre"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                />
                <button
                    onClick={handleAddMember}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Ajout en cours...' : 'Ajouter'}
                </button>
                <Link href={'/projects'} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-center">
                    Annuler
                </Link>
            </div>
        </div>
    );
}