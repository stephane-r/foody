import * as React from 'react';
import { Button as ButtonApp } from 'react-native-web';

interface Props {
  title: string;
}

export const Button: React.FC<Props> = ({ title }) => (
  <ButtonApp title={title} onPress={() => console.log('test')} />
);
