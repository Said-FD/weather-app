import React from 'react';

import TilePropsModel from '../../types/TilePropsModel';
import styles from './Tile.module.css';

interface TileProps {
  weather: TilePropsModel;
}

const Tile = ({weather}: TileProps) => {
  const {
    title,
    value,
    details
  } = weather;

  return (
    <div className={styles.tile}>
      <div className={styles.tileLeftSideContainer}>
        <h2 className={styles.tileTitle}>
          {title}
        </h2>

        {details && (
          <div className={styles.tileDetails}>
            {details.map(item => <p key={item}>{item}</p>)}
          </div>
        )}
      </div>

      <p className={styles.tileValue}>
        {value}
      </p>
    </div>
  );
};

export default Tile;
