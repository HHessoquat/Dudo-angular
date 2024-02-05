import { PlayerPosition } from './position-types.type';

export const getPosition = (nbPlayer: number): Array<PlayerPosition> => {
  return nbPlayer === 2
    ? ['topWide', 'bottomWide']
    : nbPlayer === 3
    ? ['topLeft', 'topRight', 'bottomWide']
    : nbPlayer === 4
    ? ['topWide', 'right', 'bottomWide', 'left']
    : ['topLeft', 'topRight', 'right', 'bottomRight', 'bottomLeft', 'left'];
};
