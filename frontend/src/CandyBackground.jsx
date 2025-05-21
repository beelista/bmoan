import React, { useEffect, useState } from 'react';

const candyImages = [
  '/cake.png',
  '/candy.png',
  '/cookie.png',
  '/cupcake.png',
  '/donut.png',
];

const isOverlapping = (x1, y1, size1, x2, y2, size2, gap) => {
  return !(
    x1 + size1 + gap < x2 ||
    x1 > x2 + size2 + gap ||
    y1 + size1 + gap < y2 ||
    y1 > y2 + size2 + gap
  );
};

const generateCandies = (count, vw, vh) => {
  const candies = [];
  const maxAttempts = 100;
  const gap = 15;
  const sameIconRadiusPx = 120;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let size = Math.floor(Math.random() * 40) + 40;
    let placed = false;

    while (!placed && attempts < maxAttempts) {
      const leftPercent = Math.random() * (100 - (size / vw) * 100);
      const topPercent = Math.random() * (100 - (size / vh) * 100);
      const rotate = Math.random() * 360;
      const image = candyImages[Math.floor(Math.random() * candyImages.length)];

      const leftPx = (leftPercent / 100) * vw;
      const topPx = (topPercent / 100) * vh;

      let overlap = false;
      for (const c of candies) {
        const cLeftPx = (c.leftPercent / 100) * vw;
        const cTopPx = (c.topPercent / 100) * vh;
        if (isOverlapping(leftPx, topPx, size, cLeftPx, cTopPx, c.size, gap)) {
          overlap = true;
          break;
        }
      }
      if (overlap) {
        attempts++;
        continue;
      }

      let tooClose = false;
      for (const c of candies) {
        if (c.image === image) {
          const cLeftPx = (c.leftPercent / 100) * vw;
          const cTopPx = (c.topPercent / 100) * vh;
          const dx = (leftPx + size / 2) - (cLeftPx + c.size / 2);
          const dy = (topPx + size / 2) - (cTopPx + c.size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < sameIconRadiusPx) {
            tooClose = true;
            break;
          }
        }
      }
      if (tooClose) {
        attempts++;
        continue;
      }

      candies.push({
        topPercent,
        leftPercent,
        size,
        rotate,
        image,
      });
      placed = true;
    }
  }

  return candies;
};

function CandyBackground() {
  const [vw, setVw] = useState(window.innerWidth);
  const [vh, setVh] = useState(window.innerHeight);
  const [candies, setCandies] = useState([]);

  const getCandyCount = () => {
    const area = vw * vh;
    const density = 0.0002; // Slightly reduced
    const base = Math.floor(area * density);
    const cores = navigator.hardwareConcurrency || 4;
    return Math.min(base, cores <= 2 ? 100 : 250);
  };

  // Debounced resize
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setVw(window.innerWidth);
        setVh(window.innerHeight);
      }, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate candies on size change
  useEffect(() => {
    const count = getCandyCount();
    setCandies(generateCandies(count, vw, vh));
  }, [vw, vh]);

  // Preload images
  useEffect(() => {
    candyImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="candy-background">
      {candies.map((candy, index) => {
        const duration = 8000 + Math.random() * 8000;
        const delay = Math.random() * -duration;
        return (
          <img
            key={index}
            src={candy.image}
            alt="candy"
            className="candy"
            style={{
              top: `${candy.topPercent}vh`,
              left: `${candy.leftPercent}vw`,
              width: candy.size,
              '--rotate': `${candy.rotate}deg`,
              animationDuration: `${duration}ms`,
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

export default React.memo(CandyBackground);
