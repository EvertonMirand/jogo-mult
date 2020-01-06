export default function createKeyboardListener(document) {
  const state = {
    observers: [],
    playerId: null,
  };

  function subscribe(obeserveFunction) {
    state.observers.push(obeserveFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  document.addEventListener('keydown', handleKeydown);

  function handleKeydown(event) {
    const keyPressed = event.key;

    const command = {
      playerId: 'player1',
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
  };
}
