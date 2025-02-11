import {
  Container,
  Title,
  Grid,
  Card,
  Group,
  Badge,
  Text,
  Button,
  Stack,
} from '@mantine/core';
import { projects } from '../../data/work';

export default function WorkPage() {
  return (
    <>
      <Title order={1} mb="xl">
        My Work
      </Title>
      <Grid>
        {projects.map(project => (
          <Grid.Col key={project.id} xs={12} sm={6} lg={4}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Stack spacing="md">
                <Title order={3}>{project.title}</Title>

                <Text size="sm" color="dimmed">
                  {project.description}
                </Text>

                <Group spacing={5}>
                  {project.technologies.map(tech => (
                    <Badge key={tech} size="sm">
                      {tech}
                    </Badge>
                  ))}
                </Group>

                <Text size="sm" color="dimmed">
                  {project.startDate} - {project.endDate || 'Present'}
                </Text>

                <Group spacing="sm">
                  {project.githubUrl && (
                    <Button
                      component="a"
                      href={project.githubUrl}
                      target="_blank"
                      variant="light"
                      size="sm"
                    >
                      GitHub
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button
                      component="a"
                      href={project.liveUrl}
                      target="_blank"
                      variant="light"
                      size="sm"
                    >
                      Live Demo
                    </Button>
                  )}
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
