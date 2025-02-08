import { GetStaticProps } from 'next';
import { Stack, Title, Card, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { getAllWriting } from '../../utils/markdown';
import { Writing } from '../../types/writing';

interface WritingPageProps {
  writings: Writing[];
}

export default function WritingPage({ writings }: WritingPageProps) {
  console.log(writings);
  return (
    <Stack>
      <Title order={1}>Writing</Title>
      {writings.map(post => (
        <Card key={post.id} shadow="sm" padding="lg">
          <Link href={`/writing/${post.slug}`} passHref legacyBehavior>
            <Anchor>
              <Title order={2}>{post.title}</Title>
            </Anchor>
          </Link>
          <Text size="sm" c="dimmed">
            {new Date(post.publishedDate).toLocaleDateString()}
          </Text>
          <Text>{post.excerpt}</Text>
          {post.tags && (
            <Text size="sm" mt="sm">
              Tags: {post.tags.join(', ')}
            </Text>
          )}
        </Card>
      ))}
    </Stack>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const writings = await getAllWriting();
  return {
    props: {
      writings,
    },
  };
};
