import Parse from 'parse';

class Document extends Parse.Object {
  constructor() {
    super('Document');
  }

  static async createDocument(
    title: string,
    file: Parse.File,
    project: Parse.Object,
    uploadedBy: Parse.User
  ) {
    const document = new Document();
    document.set('title', title);
    document.set('file', file);
    document.set('project', project);
    document.set('uploadedBy', uploadedBy);
    document.set('uploadDate', new Date());
    return document;
  }

  static async getDocumentsByProject(projectId: string) {
    const query = new Parse.Query('Document');
    query.equalTo('project', { __type: 'Pointer', className: 'Project', objectId: projectId });
    return query.find();
  }

  static async deleteDocument(documentId: string) {
    const query = new Parse.Query('Document');
    const document = await query.get(documentId);
    return document.destroy();
  }
}

Parse.Object.registerSubclass('Document', Document);

export default Document;