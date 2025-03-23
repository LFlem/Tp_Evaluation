'use client';

import { useState } from 'react';
import Parse from 'parse';

export default function AddTeamMember({ projectId, onMemberAdded }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Appeler la fonction Cloud Code pour rechercher l'utilisateur par email
      const user = await Parse.Cloud.run('findUserByEmail', { email });

      if (!user) {
        throw new Error('Aucun utilisateur trouvé avec cet email');
      }

      // Récupérer le projet
      const Project = Parse.Object.extend('Project');
      const projectQuery = new Parse.Query(Project);
      const project = await projectQuery.get(projectId);

      // Ajouter l'utilisateur à la relation teamMembers
      const relation = project.relation('teamMembers');
      relation.add(user);
      await project.save();

      // Réinitialiser le formulaire et déclencher le callback
      setEmail('');
      if (onMemberAdded) onMemberAdded(user);
    } catch (error) {
      setError(error.message || 'Erreur lors de l\'ajout du membre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-2">Ajouter un membre</h3>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email de l'utilisateur
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}