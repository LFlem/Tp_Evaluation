'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { projectService, ProjectData } from '@/services/projectService';
import Navbar from '@/components/layout/Navbar';
import  Parse  from 'parse';

export default function ProjectList() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<Parse.User | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
        const user = Parse.User.current();
        if (user) {
          // Si besoin, vous pouvez récupérer des données supplémentaires de l'utilisateur
          const query = new Parse.Query(Parse.User);
          const fullUser = await query.get(user.id!);
          setCurrentUser(fullUser);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des projets');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter((project) => project.id !== id));
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression du projet');
      }
    }
  };

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

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8"></main>
      <div className="max-w-4xl mx-auto mt-6">
        {/* <Navbar /> */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes Projets</h1>

          <div className="flex items-center space-x-4">
            {currentUser && currentUser.get('avatar') && (
              <div className="flex items-center space-x-2">
                <img
                  src={currentUser.get('avatar').url()}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600">
                  {currentUser.get('username')}
                </span>
              </div>
            )}
            </div>

          <Link
            href="/projects/new"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Nouveau Projet
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded">
            <p className="text-gray-500">Aucun projet trouvé. Créez votre premier projet !</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Échéance: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Non définie'}
                  </p>
                  <div className="flex justify-between mt-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Voir détails
                    </Link>
                    <div className="space-x-2">
                      {/* <Link
                        href={`/projects/${project.id}/members`}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Equipe
                      </Link> */}
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </>
  );
}