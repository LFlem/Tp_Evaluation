import Parse from '../lib/parse';

class Project extends Parse.Object {
  constructor() {
    super('Project');
  }

  // Getters & Setters pour les propriétés standard
  get name() { return this.get('name'); }
  set name(value) { this.set('name', value); }

  get description() { return this.get('description'); }
  set description(value) { this.set('description', value); }

  get dueDate() { return this.get('dueDate'); }
  set dueDate(value) { this.set('dueDate', value); }

  get status() { return this.get('status'); }
  set status(value) { this.set('status', value); }

  get owner() { return this.get('owner'); }
  set owner(value) { this.set('owner', value); }

  // Relation pour les membres d'équipe
  get teamMembers(): Parse.Relation { return this.relation('teamMembers'); }

  // Méthodes statiques pour créer et gérer un projet
  static createProject(name: string, description: string, dueDate: Date, status: string, owner: Parse.User) {
    const project = new Project();
    project.name = name;
    project.description = description;
    project.dueDate = dueDate;
    project.status = status;
    project.owner = owner;
    return project;
  }

  static async addTeamMember(projectId: string, userId: string): Promise<void> {
    const project = new Project();
    project.id = projectId;

    const user = new Parse.User();
    user.id = userId;

    const relation = project.relation<Parse.User>('teamMembers');
    relation.add(user);
    await project.save();
  }

  static async removeTeamMember(projectId: string, userId: string): Promise<void> {
    const project = new Project();
    project.id = projectId;

    const user = new Parse.User();
    user.id = userId;

    const relation = project.relation<Parse.User>('teamMembers');
    relation.remove(user);
    await project.save();
  }

  async getTeamMembers(): Promise<Parse.User[]> {
    const relation = this.relation<Parse.User>('teamMembers');
    return await relation.query().find();
  }

  static async getTeamMembersWithOwner(projectId: string): Promise<Parse.User[]> {
    const query = new Parse.Query<Project>('Project');
    const project = await query.get(projectId);
    const teamMembers = await project.relation<Parse.User>('teamMembers').query().find();
    return [...teamMembers, project.owner];
  }
}

Parse.Object.registerSubclass('Project', Project);

export default Project;
