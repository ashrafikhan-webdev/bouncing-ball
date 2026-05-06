(() => {
  const playground = document.getElementById('playground');
  const ball = document.getElementById('ball');

  const state = {
    x: 0,
    y: 0,
    vx: 260,
    vy: 220,
    radius: 0,
    gravity: 900,
    bounce: 0.9,
    boostSpeed: 420,
    maxBoost: 900,
    width: 0,
    height: 0,
    previousTime: 0,
  };

  const setBounds = () => {
    const rect = playground.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;

    const ballRect = ball.getBoundingClientRect();
    state.radius = ballRect.width / 2;

    const maxX = Math.max(0, state.width - ballRect.width);
    const maxY = Math.max(0, state.height - ballRect.height);

    state.x = Math.min(Math.max(state.x, 0), maxX);
    state.y = Math.min(Math.max(state.y, 0), maxY);
  };

  const resetPosition = () => {
    const size = ball.getBoundingClientRect().width;
    state.x = (state.width - size) / 2;
    state.y = (state.height - size) / 3;
  };

  const render = () => {
    ball.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
  };

  const update = (timestamp) => {
    if (!state.previousTime) {
      state.previousTime = timestamp;
    }

    const delta = Math.min((timestamp - state.previousTime) / 1000, 0.05);
    state.previousTime = timestamp;

    state.vy += state.gravity * delta;
    state.x += state.vx * delta;
    state.y += state.vy * delta;

    const ballSize = state.radius * 2;
    const maxX = state.width - ballSize;
    const maxY = state.height - ballSize;

    if (state.x <= 0) {
      state.x = 0;
      state.vx = Math.abs(state.vx);
    } else if (state.x >= maxX) {
      state.x = maxX;
      state.vx = -Math.abs(state.vx);
    }

    if (state.y <= 0) {
      state.y = 0;
      state.vy = Math.abs(state.vy);
    } else if (state.y >= maxY) {
      state.y = maxY;
      state.vy = -Math.abs(state.vy) * state.bounce;

      if (Math.abs(state.vy) < 120) {
        state.vy = -220;
      }
    }

    render();
    requestAnimationFrame(update);
  };

  const boostBounce = () => {
    state.vy = -Math.min(Math.abs(state.vy) + state.boostSpeed, state.maxBoost);
  };

  ball.addEventListener('click', boostBounce);

  window.addEventListener('resize', () => {
    setBounds();
    render();
  });

  setBounds();
  resetPosition();
  render();
  requestAnimationFrame(update);
})();
