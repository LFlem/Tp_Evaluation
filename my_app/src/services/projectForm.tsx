'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectService, ProjectData } from '@/services/projectService';

interface ProjectFormProps {
  projectId?: string;
  isEdit?: boolean;
}

export default function ProjectForm({ projectId, isEdit = false }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    dueDate: new Date(),
    status: 'À faire',
  });

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      if (isEdit && projectId) {
        try {
          const project = await projectService.getProjectById(projectId);
          setFormData({
            name: project.name,
            description: project.description,
            dueDate: project.dueDate ? new Date(project.dueDate) : new Date(),
            status: project.status,
          });
        } catch (err: any) {
          setError(err.message || 'Erreur lors du chargement du projet');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [isEdit, projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dueDate: new Date(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEdit && projectId) {
        await projectService.updateProject(projectId, formData);
      } else {
        await projectService.createProject(formData);
      }
      router.push('/projects');
    } catch (err: any) {
      setError(err.message || 'Une erreur s\'est produite');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Modifier le projet' : 'Créer un nouveau projet'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-white mb-2">
            Nom du projet *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-white mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-white mb-2">
            Date d'échéance
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-white mb-2">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>

        <div className="flex items-center pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 mr-2"
          >
            {submitting
              ? 'Enregistrement...'
              : isEdit
                ? 'Mettre à jour'
                : 'Créer'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}