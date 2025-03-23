'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Parse from 'parse';
import Link from 'next/link';

export default function DocumentListPage() {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<Parse.Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const query = new Parse.Query('Document');
        query.equalTo('project', { __type: 'Pointer', className: 'Project', objectId: id });
        const results = await query.find();
        setDocuments(results);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 custom-bg rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Documents du projet
      </h2>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">{doc.get('title')}</h3>
            <p className="text-gray-600">
              Uploadé par : {doc.get('uploadedBy').get('username')}
            </p>
            <p className="text-gray-600">
              Date d'upload : {new Date(doc.get('uploadDate')).toLocaleDateString()}
            </p>
            <a
              href={doc.get('file').url()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Télécharger
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href={`/projects/${id}/documents/upload`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Uploader un nouveau document
        </Link>
      </div>
    </div>
  );
}