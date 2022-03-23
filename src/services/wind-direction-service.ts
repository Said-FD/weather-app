export const convertWindDirection = (deg: number) => {
  const directions = [
    'N ↑',
    'NE ↗',
    'E →',
    'SE ↘',
    'S ↓',
    'SW ↙',
    'W ←',
    'NW ↖'
  ];

  const directionIndex = Math.round(deg / 45) % 8;

  return directions[directionIndex];
};
