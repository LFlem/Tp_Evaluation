import Parse from '../lib/parse';

class Project extends Parse.Object {
  constructor() {
    super('Project');
  }

  static createProject(name: string, description: string, dueDate: Date, status: string, owner: Parse.User) {
    const project = new Project();
    project.set('name', name);
    project.set('description', description);
    project.set('dueDate', dueDate);
    project.set('status', status);
    project.set('owner', owner);
    return project;
  }
  static async addTeamMember(projectId: string, userId: string) {
    const project = new Project();
    project.id = projectId;

    const user = new Parse.User();
    user.id = userId;

    const relation = project.relation('teamMembers');
    relation.add(user);
    await project.save();
  }

  static async removeTeamMember(projectId: string, userId: string) {
    const project = new Project();
    project.id = projectId;

    const user = new Parse.User();
    user.id = userId;

    const relation = project.relation('teamMembers');
    relation.remove(user);
    await project.save();
  }

  static async getTeamMembers(projectId: string): Promise<Parse.User[]> {
    const query = new Parse.Query('Project');
    const project = await query.get(projectId);
    const teamMembersRelation = project.relation('teamMembers');
    const teamMembers = await teamMembersRelation.query().find();

    const owner = project.get('owner');

    return [...teamMembers, owner];
  }
}

Parse.Object.registerSubclass('Project', Project);

export default Project;