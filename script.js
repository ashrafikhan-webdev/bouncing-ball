(() => {
  const playground = document.getElementById('playground');
  const ball = document.getElementById('ball');

  const state = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 0,
    gravity: 900,
    bounce: 0.8,
    boostSpeed: 700,
    width: 0,
    height: 0,
    previousTime: 0,
    isAnimating: false,
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

  const placeBallAtRest = () => {
    const size = ball.getBoundingClientRect().width;
    state.x = (state.width - size) / 2;
    state.y = state.height - size;
    state.vx = 0;
    state.vy = 0;
  };

  const render = () => {
    ball.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
  };

  const stopAnimation = () => {
    state.isAnimating = false;
    state.previousTime = 0;
    state.vy = 0;
    render();
  };

  const update = (timestamp) => {
    if (!state.isAnimating) {
      return;
    }

    if (!state.previousTime) {
      state.previousTime = timestamp;
    }

    const delta = Math.min((timestamp - state.previousTime) / 1000, 0.05);
    state.previousTime = timestamp;

    state.vy += state.gravity * delta;
    state.y += state.vy * delta;

    const ballSize = state.radius * 2;
    const maxY = state.height - ballSize;

    if (state.y <= 0) {
      state.y = 0;
      state.vy = Math.abs(state.vy);
    } else if (state.y >= maxY) {
      state.y = maxY;
      state.vy = -Math.abs(state.vy) * state.bounce;

      if (Math.abs(state.vy) < 60) {
        stopAnimation();
        return;
      }
    }

    render();
    requestAnimationFrame(update);
  };

  const startBounce = () => {
    state.vy = -Math.max(state.boostSpeed, Math.abs(state.vy) + 200);

    if (!state.isAnimating) {
      state.isAnimating = true;
      state.previousTime = 0;
      requestAnimationFrame(update);
    }
  };

  ball.addEventListener('click', startBounce);

  window.addEventListener('resize', () => {
    setBounds();
    render();
  });

  setBounds();
  placeBallAtRest();
  render();
})();
