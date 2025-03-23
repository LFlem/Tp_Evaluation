'use client';

import Navbar from '@/components/layout/Navbar';
import ProjectForm from '@/services/projectForm';

export default function EditProjectPage({ params }: { params: { id: string } }) {
    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <ProjectForm projectId={params.id} isEdit={true} />
            </main>
        </>
    );
}