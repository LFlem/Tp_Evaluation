import Parse from '../lib/parse';

export interface ProjectData {
    id?: string;
    name: string;
    description: string;
    dueDate: Date;
    status: string;
    owner?: any;
}

export const projectService = {
    // Récupérer les projets de l'utilisateur connecté
    async getProjects() {
        const query = new Parse.Query('Project');
        query.equalTo('owner', Parse.User.current());
        query.descending('createdAt');

        try {
            const results = await query.find();
            return results.map(project => ({
                id: project.id,
                name: project.get('name'),
                description: project.get('description'),
                dueDate: project.get('dueDate'),
                status: project.get('status')
            }));
        } catch (error) {
            throw error;
        }
    },

    // Récupérer un projet par son ID
    async getProjectById(id: string) {
        const query = new Parse.Query('Project');

        try {
            const project = await query.get(id);
            return {
                id: project.id,
                name: project.get('name'),
                description: project.get('description'),
                dueDate: new Date(project.get('dueDate')),
                status: project.get('status')
            };
        } catch (error) {
            throw error;
        }
    },

    // Créer un nouveau projet
    async createProject(projectData: ProjectData) {
        const Project = Parse.Object.extend('Project');
        const project = new Project();

        project.set('name', projectData.name);
        project.set('description', projectData.description);
        project.set('dueDate', projectData.dueDate.toISOString());
        project.set('status', projectData.status);
        project.set('owner', Parse.User.current());

        try {
            const result = await project.save();
            return {
                id: result.id,
                name: result.get('name'),
                description: result.get('description'),
                dueDate: result.get('dueDate'),
                status: result.get('status')
            };
        } catch (error) {
            throw error;
        }
    },

    // Mettre à jour un projet existant
    async updateProject(id: string, projectData: ProjectData) {
        const query = new Parse.Query('Project');

        try {
            const project = await query.get(id);

            project.set('name', projectData.name);
            project.set('description', projectData.description);
            project.set('dueDate', projectData.dueDate.toISOString());
            project.set('status', projectData.status);

            const result = await project.save();
            return {
                id: result.id,
                name: result.get('name'),
                description: result.get('description'),
                dueDate: result.get('dueDate'),
                status: result.get('status')
            };
        } catch (error) {
            throw error;
        }
    },

    // Supprimer un projet
    async deleteProject(id: string) {
        const query = new Parse.Query('Project');

        try {
            const project = await query.get(id);
            await project.destroy();
            return true;
        } catch (error) {
            throw error;
        }
    }
};