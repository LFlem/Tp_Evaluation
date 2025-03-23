import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main className="max-w-4xl mx-auto mt-16 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Bienvenue sur ProjectManager</h1>
        <p className="text-xl text-gray-600 mb-8">
          Gérez vos projets, organisez vos tâches et collaborez efficacement avec votre équipe.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Commencer
          </Link>
          <Link
            href="/register"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
