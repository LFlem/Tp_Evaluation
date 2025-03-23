'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Parse from 'parse';
import Document from '@/models/Document';
import Navbar from '@/components/layout/Navbar';

export default function DocumentUploadPage() {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const cleanFileName = (fileName: string) => {
        return fileName.replace(/[^a-zA-Z0-9.-]/g, '-');
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = Parse.User.current();
            if (!user) throw new Error('Utilisateur non connecté');

            const Project = Parse.Object.extend('Project');
            const project = new Project();
            project.id = id;

            if (!file) throw new Error('Veuillez sélectionner un fichier');
            const cleanedFileNam = cleanFileName(file.name);
            const parseFile = new Parse.File(cleanedFileNam, file);
            const document = await Document.createDocument(title, parseFile, project, user);
            await document.save();

            alert('Document uploadé avec succès !');
            router.push(`/projects/${id}`);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'upload du document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto mt-10 p-6 custom-bg rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">
                    Uploader un document
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 mb-2">
                            Titre du document
                        </label>
                        <input
                            type="text"
                            placeholder="Titre du document"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="file" className="block text-gray-700 mb-2">
                            Fichier
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Upload en cours...' : 'Uploader'}
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
            </div>
        </>
    );
}