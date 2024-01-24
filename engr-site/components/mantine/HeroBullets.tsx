'use client';
import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import image from './image.svg';
import classes from './HeroBullets.module.css';

export function HeroBullets() {
  return (
    <Container size='md'>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Find learning resources{' '}
            <span className={classes.highlight}>fast</span>
          </Title>
          <Text c='dimmed' mt='md'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>

          <List
            mt={30}
            spacing='sm'
            size='sm'
            icon={
              <ThemeIcon size={20} radius='xl'>
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Pro 1</b> – Sed ut perspiciatis unde omnis iste natus error sit
              voluptatem accusantium
            </List.Item>
            <List.Item>
              <b>Pro 2</b> – quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt
            </List.Item>
            <List.Item>
              <b>Pro 3</b> – nostrum exercitationem ullam corporis suscipit
              laboriosam
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius='xl' size='md' className={classes.control}>
              Get started
            </Button>
            <Button
              variant='default'
              radius='xl'
              size='md'
              className={classes.control}
            >
              Source code
            </Button>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}
