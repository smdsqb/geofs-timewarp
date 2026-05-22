// ==UserScript==
// @name         GeoFS Time Warp
// @namespace    https://github.com/smdsqb
// @version      1.0
// @description  Adds a time warp multiplier button to GeoFS — 1x, 2x, 4x, 8x, 10x, 50x, 100x
// @author       smdsqb
// @match        https://www.geo-fs.com/geofs.php*
// @match        https://geo-fs.com/geofs.php*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const SPEEDS = [1, 2, 4, 8, 10, 50, 100];
  let currentIndex = 0;
  let warpInterval = null;
  let lastTime = null;

  // Wait for GeoFS to fully load
  function waitForGeoFS(callback) {
    const check = setInterval(() => {
      if (window.geofs && window.geofs.aircraft && window.geofs.aircraft.instance) {
        clearInterval(check);
        callback();
      }
    }, 500);
  }

  function applyWarp(multiplier) {
    if (warpInterval) {
      clearInterval(warpInterval);
      warpInterval = null;
    }

    if (multiplier <= 1) return; // 1x = normal, nothing to do

    // For multipliers > 1, we tick the simulation faster
    // by repeatedly calling the physics update with scaled delta time
    warpInterval = setInterval(() => {
      try {
        const aircraft = window.geofs.aircraft.instance;
        if (!aircraft) return;

        // Scale the simulation delta
        if (window.geofs.animation && window.geofs.animation.deltaTime !== undefined) {
          window.geofs.animation.deltaTime = (1 / 60) * multiplier;
        }

        // Directly update aircraft position if supported
        if (aircraft.animationValue !== undefined) {
          aircraft.animationValue += (multiplier - 1) * 0.016;
        }

      } catch (e) {
        // silently fail if API changes
      }
    }, 16); // ~60fps tick
  }

  function setSpeed(index) {
    currentIndex = index;
    const speed = SPEEDS[index];
    applyWarp(speed);
    updateButton();

    // Flash confirmation
    btn.style.background = '#ff3b2f';
    setTimeout(() => {
      btn.style.background = speed === 1 ? '#1a1a1a' : '#ff3b2f';
    }, 200);
  }

  function updateButton() {
    const speed = SPEEDS[currentIndex];
    btn.textContent = `⏩ ${speed}x`;
    btn.style.background = speed === 1 ? '#1a1a1a' : '#ff3b2f';
    btn.title = `Time Warp: ${speed}x — click to cycle speeds`;
  }

  // Build the button
  const btn = document.createElement('button');
  btn.textContent = '⏩ 1x';
  btn.title = 'Time Warp — click to cycle speeds';

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '99999',
    background: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'monospace',
    cursor: 'pointer',
    letterSpacing: '1px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    transition: 'background 0.15s ease',
    userSelect: 'none',
  });

  // Click cycles through speeds
  btn.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    setSpeed(nextIndex);
  });

  // Right click resets to 1x
  btn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    setSpeed(0);
  });

  // Keyboard shortcut — T to cycle, Shift+T to reset
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'T' && !e.shiftKey) {
      const nextIndex = (currentIndex + 1) % SPEEDS.length;
      setSpeed(nextIndex);
    }
    if (e.key === 'T' && e.shiftKey) {
      setSpeed(0);
    }
  });

  // Inject button once GeoFS loads
  waitForGeoFS(() => {
    // Try to attach to GeoFS bottom bar first
    const bar = document.querySelector('#geofs-ui-bottom') ||
                 document.querySelector('.geofs-ui-bottom') ||
                 document.querySelector('#ui-bottom') ||
                 document.body;

    if (bar && bar !== document.body) {
      bar.appendChild(btn);
    } else {
      document.body.appendChild(btn);
    }

    console.log('[GeoFS Time Warp] Loaded. Click button or press T to cycle speeds. Shift+T to reset.');
  });

})();
