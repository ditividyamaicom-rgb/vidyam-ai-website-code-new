// AnimatedLogo.js
import React, { useEffect, useState } from 'react';
import styles from './AnimatedLogo.module.css';

const AnimatedLogo = ({
  color,
  showTiles = true,
  enableScrollAnimation = true,
  popOnMount = false,
}) => {
  const [scrollDirection, setScrollDirection] = useState('down');

  // Only attach scroll listener when scroll-based animation is enabled
  useEffect(() => {
    if (!enableScrollAnimation) return;

    let lastScrollPos = window.scrollY;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos > lastScrollPos) {
        setScrollDirection('down');
      } else if (currentScrollPos < lastScrollPos) {
        setScrollDirection('up');
      }

      lastScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enableScrollAnimation]);

  const animate = () => {
    const tiles = document.querySelectorAll(`.${CSS.escape(styles.tile)}`);
    const title = document.querySelector(`.${CSS.escape(styles.title)}`);

    tiles.forEach((t) => t.classList.remove(styles.animate));
    if (title) {
    title.classList.remove(styles.animate);
    }

    setTimeout(() => {
      tiles.forEach((t) => t.classList.add(styles.animate));
      if (title) {
      title.classList.add(styles.animate);
      }
    }, 500);
  };

  // Trigger scroll-based animation only when enabled
  useEffect(() => {
    if (!enableScrollAnimation) return;
    animate();
  }, [scrollDirection, enableScrollAnimation]);

  const titleClasses = [styles.title];

  if (enableScrollAnimation && scrollDirection === 'down') {
    titleClasses.push(styles.animate);
  }

  if (popOnMount) {
    titleClasses.push(styles.logoPop);
  }

  const tileClasses = (base) => {
    const classes = [base];
    if (enableScrollAnimation && scrollDirection === 'down') {
      classes.push(styles.animate);
    }
    return classes.join(' ');
  };

  return (
    <div className={styles.logo}>
      <h1 className={titleClasses.join(' ')} style={{ color }}>
      Vidyam AI
      </h1>
      {showTiles && (
      <ul>
          <li
            className={tileClasses(styles.tile)}
            style={{ backgroundColor: color }}
          ></li>
          <li
            className={tileClasses(styles.tile)}
            style={{ backgroundColor: color }}
          ></li>
          <li
            className={tileClasses(styles.tile)}
            style={{ backgroundColor: color }}
          ></li>
      </ul>
      )}
    </div>
  );
};

export default AnimatedLogo;
