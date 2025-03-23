'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { projectService, ProjectData } from '@/services/projectService';
import Link from 'next/link';
import Project from '@/models/Project';
import { useParams } from 'next/navigation';
import Parse from 'parse';

export default function ProjectDetailPage() {
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [teamMembers, setTeamMembers] = useState<Parse.User[]>([]);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les détails du projet
                const projectData = await projectService.getProjectById(id);
                setProject(projectData);

                // Charger tous les membres (y compris le propriétaire)
                const members = await Project.getTeamMembers(id);
                setTeamMembers(members);
            } catch (err: any) {
                setError(err.message || 'Erreur lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'À faire':
                return 'bg-gray-100 text-gray-800';
            case 'En cours':
                return 'bg-blue-100 text-blue-800';
            case 'Terminé':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            try {
                await Project.removeTeamMember(id, userId);
                setTeamMembers(teamMembers.filter((member) => member.id !== userId));
                alert('Membre supprimé avec succès !');
            } catch (err: any) {
                setError(err.message || 'Erreur lors de la suppression du membre');
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">Chargement...</div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
                </main>
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
                        Projet non trouvé
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className="text-gray-700 whitespace-pre-line">
                                {project.description || 'Aucune description fournie.'}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Détails</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600 font-medium">Date d'échéance</p>
                                    <p>
                                        {project.dueDate
                                            ? new Date(project.dueDate).toLocaleDateString()
                                            : 'Non définie'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-8">
                            <Link
                                href={`/projects/${id}/edit`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Modifier
                            </Link>
                            <Link
                                href="/projects"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Retour aux projets
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto mt-6">
                        <h2 className="text-xl font-semibold mb-2">Membres de l'équipe</h2>
                        <ul>
                            {teamMembers.map((member) => {
                                const memberId = member.id;
                                if (!memberId) return null;

                                return (
                                    <li key={memberId} className="flex items-center space-x-2 mb-2">
                                        <span>{member.get('username')}</span>
                                        {/* Afficher un badge pour le propriétaire */}
                                        {memberId === project.owner?.id && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                                Propriétaire
                                            </span>
                                        )}
                                        {/* Bouton de suppression (masqué pour le propriétaire) */}
                                        {memberId !== project.owner?.id && (
                                            <button
                                                onClick={() => handleRemoveMember(memberId)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
}