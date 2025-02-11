// import classes from './Header.module.css';
import { Group, Button } from '@mantine/core';
import Link from 'next/link';

export function Header() {
  return (
    <Group justify="center" w="100%" px="lg" py="md">
      <Link href="/" passHref>
        <Button variant="transparent">About</Button>
      </Link>
      <Link href="/work" passHref>
        <Button variant="transparent">Work</Button>
      </Link>
      <Link href="/writing" passHref>
        <Button variant="transparent">Writing</Button>
      </Link>
    </Group>
  );
}
