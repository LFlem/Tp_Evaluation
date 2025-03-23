'use client';

import { useState, useEffect } from 'react';
import Parse from 'parse';

export default function TeamMembersList({ projectId }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const Project = Parse.Object.extend('Project');
        const query = new Parse.Query(Project);
        const project = await query.get(projectId);

        const relation = project.relation('teamMembers');
        const members = await relation.query().find();

        // Assurez-vous que members est un tableau
        if (Array.isArray(members)) {
          setTeamMembers(members);
        } else {
          setTeamMembers([]); // Définir un tableau vide si members n'est pas un tableau
        }
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des membres');
        setTeamMembers([]); // Définir un tableau vide en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [projectId]);

  if (loading) {
    return <div>Chargement des membres...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Membres de l'équipe</h2>
      <ul>
        {teamMembers.map((member) => (
          <li key={member.id} className="flex items-center justify-between py-2 border-b">
            <span>{member.get('username')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}