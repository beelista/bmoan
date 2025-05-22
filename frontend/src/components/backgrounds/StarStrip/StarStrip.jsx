import React, { useEffect, useState, useRef } from 'react';
import './StarStrip.css';

const TOTAL_STARS = 400; // number of stars to scatter
const ANIMATION_INTERVAL = 15; // ms between each star lighting up
const LIGHT_DURATION = 1000; // ms a star stays filled
const GRID_COLUMNS = 14; // grid columns for spreading stars evenly
const GRID_ROWS = 7; // grid rows for spreading stars evenly

const STAR_IDS = [1, 2, 3];
const SHOOTING_CHANCE = 0.1; // 10% chance per tick to start shooting star
const MIN_DISTANCE = 10; // minimum % distance between shooting stars in both top and left

// Helper: parse "xx%" to number xx
function parsePercent(str) {
  return parseFloat(str.replace('%', ''));
}

// Generate positions based on grid, with some random offset inside each grid cell
function generateGridPositions(total, columns, rows) {
  const positions = [];
  const cellWidth = 100 / columns;
  const cellHeight = 100 / rows;

  for (let i = 0; i < total; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    // Random offset inside grid cell (max ~50% of cell size)
    const offsetX = (Math.random() * 0.5 + 0.25) * cellWidth; // between 25% and 75%
    const offsetY = (Math.random() * 0.5 + 0.25) * cellHeight;

    const left = col * cellWidth + offsetX;
    const top = row * cellHeight + offsetY;

    positions.push({
      top: top + '%',
      left: left + '%',
    });
  }
  return positions;
}

export default function LandingStarsBackground() {
  const [stars, setStars] = useState(() => {
    const positions = generateGridPositions(TOTAL_STARS, GRID_COLUMNS, GRID_ROWS);

    return positions.map((pos, i) => ({
      id: i,
      starType: STAR_IDS[Math.floor(Math.random() * STAR_IDS.length)],
      pos,
      filled: false,
      shooting: false,
    }));
  });

  const animationTimeouts = useRef([]);

  useEffect(() => {
    function isNearShootingStar(candidatePos, stars) {
      const candidateTop = parsePercent(candidatePos.top);
      const candidateLeft = parsePercent(candidatePos.left);

      return stars.some(({ shooting, pos }) => {
        if (!shooting) return false;

        const starTop = parsePercent(pos.top);
        const starLeft = parsePercent(pos.left);

        const verticalDist = Math.abs(candidateTop - starTop);
        const horizontalDist = Math.abs(candidateLeft - starLeft);

        // If too close in either vertical or horizontal direction, consider "near"
        return verticalDist < MIN_DISTANCE && horizontalDist < MIN_DISTANCE;
      });
    }

    function animateStar() {
      setStars((prevStars) => {
        const newStars = [...prevStars];
        const starIndex = Math.floor(Math.random() * TOTAL_STARS);
        const star = newStars[starIndex];

        if (!star.shooting && Math.random() < SHOOTING_CHANCE) {
          // Check if near other shooting stars
          if (!isNearShootingStar(star.pos, newStars)) {
            // Start shooting star animation
            newStars[starIndex] = { ...star, shooting: true, filled: true };
          }
          // else: skip shooting here to avoid clustering
        } else if (!star.shooting) {
          // Normal fill glow if not shooting
          newStars[starIndex] = { ...star, filled: true };
          // Turn off fill after LIGHT_DURATION
          setTimeout(() => {
            setStars((prev) =>
              prev.map((s, i) =>
                i === starIndex ? { ...s, filled: false } : s
              )
            );
          }, LIGHT_DURATION);
        }

        return newStars;
      });
    }

    const intervalId = setInterval(animateStar, ANIMATION_INTERVAL);

    return () => {
      clearInterval(intervalId);
      animationTimeouts.current.forEach(clearTimeout);
      animationTimeouts.current = [];
    };
  }, []);

  function handleShootingAnimationEnd(id) {
    setStars((prevStars) =>
      prevStars.map((star) =>
        star.id === id ? { ...star, shooting: false, filled: false } : star
      )
    );
  }

  return (
    <div className="landing-stars-background">
      {stars.map(({ id, starType, pos, filled, shooting }) => (
        <img
          key={id}
          src={`/${starType}_${filled ? 'filled' : 'blank'}.png`}
          alt="star"
          className={`landing-star ${shooting ? 'shooting-star' : ''}`}
          style={{ top: pos.top, left: pos.left }}
          draggable={false}
          loading="lazy"
          aria-hidden="true"
          onAnimationEnd={shooting ? () => handleShootingAnimationEnd(id) : undefined}
        />
      ))}
    </div>
  );
}
