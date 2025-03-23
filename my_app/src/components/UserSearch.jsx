import { useState } from 'react';
import Parse from 'parse';

const UserSearch = ({ onUserSelect, excludeUsers = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchUsers = async (term) => {
        if (!term || term.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const query = new Parse.Query(Parse.User);
            // Recherche par nom d'utilisateur ou email
            const usernameQuery = new Parse.Query(Parse.User);
            usernameQuery.matches('username', new RegExp(term, 'i'));

            const emailQuery = new Parse.Query(Parse.User);
            emailQuery.matches('email', new RegExp(term, 'i'));

            query._orQuery([usernameQuery, emailQuery]);
            const users = await query.find();

            // Filtrer les utilisateurs déjà ajoutés
            const excludeIds = excludeUsers.map(user => user.id);
            setResults(users.filter(user => !excludeIds.includes(user.id)));
        } catch (error) {
            console.error('Erreur lors de la recherche d\'utilisateurs:', error);
            setError('Impossible de rechercher des utilisateurs. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Rechercher par email ou nom d'utilisateur"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        searchUsers(e.target.value);
                    }}
                />
            </div>

            {loading && <p className="text-gray-500">Recherche en cours...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {results.length > 0 && (
                <ul className="mt-2 border rounded divide-y">
                    {results.map(user => (
                        <li
                            key={user.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                            onClick={() => {
                                onUserSelect(user);
                                setSearchTerm('');
                                setResults([]);
                            }}
                        >
                            <div>
                                <p className="font-medium">{user.get('username')}</p>
                                <p className="text-sm text-gray-600">{user.get('email')}</p>
                            </div>
                            <button className="text-blue-500 hover:underline">Ajouter</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSearch;