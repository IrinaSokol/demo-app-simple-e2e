import { HttpClient } from './httpClient';

export type ProjectDto = {
  id: string;
  name: string;
  owner: string;
  status: string;
  updatedAt: string;
};

export class ProjectsClient {
  constructor(private readonly http: HttpClient) {}

  async getProjects(token: string): Promise<ProjectDto[]> {
    return this.http.getJson<ProjectDto[]>('/api/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
