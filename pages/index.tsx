import { Title, Text, Anchor } from '@mantine/core';
export default function HomePage() {
  return (
    <>
      <Title>About</Title>
      <Text>
        Thanks for visiting. I share what I'm working on and what interests me
        here.{' '}
      </Text>
      <Text>
        If you're interested in connecting, my email's{' '}
        <Anchor href="mailto:chrischo360@gmail.com">chrischo360@gmail.com</Anchor>
      </Text>
    </>
  );
}
