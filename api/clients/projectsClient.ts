import { HttpClient } from './httpClient';

export type ProjectDto = {
  id: string;
  name: string;
  owner: string;
  status: string;
  updatedAt: string;
};

export type NewProjectDto = {
  name: string;
  owner: string;
  status: string;
};

export class ProjectsClient {
  constructor(private readonly http: HttpClient) {}

  async getProjects(token: string): Promise<ProjectDto[]> {
    return this.http.getJson<ProjectDto[]>('/api/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getProject(token: string, id: string): Promise<ProjectDto> {
    return this.http.getJson<ProjectDto>(`/api/projects/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /** `POST /api/projects` → `201` + created project. */
  async createProject(token: string, input: NewProjectDto): Promise<ProjectDto> {
    return this.http.postJson<ProjectDto>('/api/projects', {
      data: input,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
