'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Parse from 'parse';
import AddTeamMember from '@/components/AddTeamMember';
import TeamMembersList from '@/components/TeamMembersList';

// Initialiser Parse ici (si ce n'est pas déjà fait ailleurs)
// Ceci devrait être fait une seule fois dans votre application
if (typeof window !== 'undefined') {
  Parse.initialize('VOTRE_APP_ID', 'VOTRE_JS_KEY');
  Parse.serverURL = 'VOTRE_SERVER_URL';
}

export default function ProjectMembersPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Parse.Object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    if (typeof window !== 'undefined') {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    
    const fetchProject = async () => {
      try {
        const Project = Parse.Object.extend('Project');
        const query = new Parse.Query(Project);
        query.include('owner');
        const result = await query.get(id);

        if (!result) {
          throw new Error('Projet non trouvé');
        }

        setProject(result);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du projet');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router, isAuthenticated]);

  const handleMemberAdded = () => {
    router.refresh();
  };

  if (!isAuthenticated) {
    return <div className="container mx-auto p-4">Vérification de l'authentification...</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Erreur: {error}</div>;
  }

  if (!project) {
    return <div className="container mx-auto p-4">Projet non trouvé</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href={`/projects/${id}`} className="text-blue-500 hover:underline">
          &larr; Retour au projet
        </Link>
        <h1 className="text-3xl font-bold mt-2">{project.get('name')} - Gestion des membres</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <AddTeamMember projectId={id} onMemberAdded={handleMemberAdded} />
        </div>
        <div>
          <TeamMembersList projectId={id} />
        </div>
      </div>
    </div>
  );
}