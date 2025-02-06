import classes from './Navbar.module.css';
import { Group, Button } from '@mantine/core';
import Link from 'next/link';

export function Navbar() {
  return (
    <Group position="apart" px="lg" py="md">
      <Link href="/" passHref>
        <Button variant="subtle">Home</Button>
      </Link>
      <Link href="/writing" passHref>
        <Button variant="subtle">Writing</Button>
      </Link>
      <Link href="/work" passHref>
        <Button variant="subtle">Work</Button>
      </Link>
    </Group>
  );
}
