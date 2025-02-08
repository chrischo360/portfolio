import { GetStaticProps, GetStaticPaths } from 'next';
import { Stack, Title, Text } from '@mantine/core';
import { getAllWritingSlugs, getWritingData } from '../../utils/markdown';
import { Writing } from '../../types/writing';

interface WritingPostProps {
  writing: Writing;
}

export default function WritingPost({ writing }: WritingPostProps) {
  return (
    <Stack>
      <Title>{writing.title}</Title>
      <Text size="sm" c="dimmed">
        {new Date(writing.publishedDate).toLocaleDateString()}
      </Text>
      <div dangerouslySetInnerHTML={{ __html: writing.content }} />
    </Stack>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllWritingSlugs().map(slug => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const writing = await getWritingData(params?.slug as string);
  return {
    props: {
      writing,
    },
  };
};
