'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Parse from 'parse';
import Navbar from '@/components/layout/Navbar';
import AuthGuard from '@/components/auth/AuthGuard';
import Document from '@/models/Document';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Parse.Object | null>(null);
  const [teamMembers, setTeamMembers] = useState<Parse.User[]>([]);
  const [documents, setDocuments] = useState<Parse.Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchProjectAndData = async () => {
      try {
        // Récupérer le projet
        const Project = Parse.Object.extend('Project');
        const query = new Parse.Query(Project);
        query.include('owner');
        const projectData = await query.get(id);
        setProject(projectData);

        // Récupérer les membres de l'équipe
        const relation = projectData.relation('teamMembers');
        const members = await relation.query().find();
        setTeamMembers(members as Parse.User[]); // Caster en Parse.User[]

        // Récupérer les documents du projet
        const documents = await Document.getDocumentsByProject(id);
        setDocuments(documents);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du projet');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndData();
  }, [id]);

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await Document.deleteDocument(documentId);
        setDocuments(documents.filter((doc) => doc.id !== documentId));
        alert('Document supprimé avec succès !');
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression du document');
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
        <AuthGuard>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{project.get('name')}</h1>
              <span className={`px-3 py-1 rounded-full ${getStatusColor(project.get('status'))}`}>
                {project.get('status')}
              </span>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-black">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {project.get('description') || 'Aucune description fournie.'}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-black">Détails</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 font-medium">Date d'échéance</p>
                    <p className="text-gray-800">
                      {project.get('dueDate')
                        ? new Date(project.get('dueDate')).toLocaleDateString()
                        : 'Non définie'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-black">Membres de l'équipe</h2>
                <ul>
                  {teamMembers.map((member) => (
                    <li key={member.id} className="flex items-center space-x-2">
                      <span>{member.get('username')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-black">Documents</h2>
                {documents.length === 0 ? (
                  <p className="text-gray-600">Aucun document trouvé.</p>
                ) : (
                  <ul className="space-y-4">
                    {documents.map((doc) => (
                      <li key={doc.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold">{doc.get('title')}</h3>
                            <p className="text-gray-600">
                              Uploadé par : {doc.get('uploadedBy').get('username')}
                            </p>
                            <p className="text-gray-600">
                              Date d'upload : {new Date(doc.get('uploadDate')).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <a
                              href={doc.get('file').url()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Télécharger
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.id!)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex space-x-3 mt-8">
                <Link
                  href={`/projects/${id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Modifier
                </Link>
                <Link
                  href={`/projects/${id}/members`}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Gérer les membres
                </Link>
                <Link
                  href={`/projects/${id}/upload`}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Uploader un document
                </Link>
                <Link
                  href="/projects"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Retour aux projets
                </Link>
              </div>
            </div>
          </div>
        </AuthGuard>
      </main>
    </>
  );
}

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