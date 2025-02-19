export enum TechnologyCategory {
  Language = 'language',
  Framework = 'framework',
  Tool = 'tool',
  Database = 'database',
  CloudPlatform = 'cloud_platform',
  Library = 'library',
  TestingTool = 'testing_tool',
  DevelopmentEnvironment = 'development_environment',
  VersionControl = 'version_control',
  BuildTool = 'build_tool',
  APITechnology = 'api_technology',
  Infrastructure = 'infrastructure',
  DesignTool = 'design_tool',
}

export interface Technology {
  name: string;
  category: TechnologyCategory;
  description?: string;
  iconUrl?: string;
}

export interface Project {
  id: string;
  display: boolean;
  title: string;
  description: string;
  technologies: Technology[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  startDate: string;
  endDate?: string;
}
