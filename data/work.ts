import { Project } from '../types/work';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Personal Website',
    description:
      'A personal website to showcase some of my writing and work. Built with Next.js and Mantine UI',
    technologies: ['React', 'TypeScript', 'Next.js', 'Mantine'],
    githubUrl: 'https://github.com/yourusername/personal-website',
    liveUrl: 'https://yourwebsite.com',
    startDate: '2023-01',
    endDate: '2023-present',
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description:
      'Full-stack e-commerce application with user authentication and payment processing',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    startDate: '2022-09',
    endDate: '2022-12',
  },
];
