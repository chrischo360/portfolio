import { Container, Title, Grid } from '@mantine/core';
import { projects } from '../../data/work';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';

export default function WorkPage() {
  const displayedProjects = projects.filter(project => project.display);

  return (
    <>
      <Title order={1} mb="xl">
        My Work
      </Title>
      <Grid>
        {displayedProjects.map(project => (
          <Grid.Col key={project.id} xs={12} sm={6} lg={4}>
            <ProjectCard project={project}></ProjectCard>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
