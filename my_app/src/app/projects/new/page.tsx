import Navbar from '@/components/layout/Navbar';
import ProjectForm from '@/services/projectForm';

export default function NewProject() {
    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <ProjectForm />
            </main>
        </>
    );
}