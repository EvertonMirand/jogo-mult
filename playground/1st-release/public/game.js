export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10,
    },
  };

  const observers = [];

  function start() {
    const frequency = 2000;
    setInterval(addFruit, frequency);
  }

  function subscribe(obeserveFunction) {
    observers.push(obeserveFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    let { playerX, playerId, playerY } = command;
    playerX = playerX
      ? playerX
      : Math.floor(Math.random() * state.screen.width);
    playerY = playerY
      ? playerY
      : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
    });
  }

  function removePlayer(command) {
    const { playerId } = command;
    delete state.players[playerId];
    notifyAll({
      type: 'remove-player',
      playerId,
    });
  }

  function addFruit(command = {}) {
    let { fruitX, fruitId, fruitY } = command;
    fruitId = fruitId ? fruitId : Math.floor(Math.random() * 1000000);
    fruitX = fruitX ? fruitX : Math.floor(Math.random() * state.screen.width);
    fruitY = fruitY ? fruitY : Math.floor(Math.random() * state.screen.height);
    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
    notifyAll({
      type: 'add-fruit',
      fruitX,
      fruitId,
      fruitY,
    });
  }

  function removeFruit(command) {
    const { fruitId } = command;
    delete state.fruits[fruitId];
    notifyAll({
      type: 'remove-fruit',
      fruitId,
    });
  }

  function movePlayer(command) {
    notifyAll(command);
    const {
      screen: { height, width },
    } = state;
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < height) {
          player.y = player.y + 1;
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < width) {
          player.x = player.x + 1;
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      },
    };

    const { playerId, keyPressed } = command;

    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];
    player &&
      moveFunction &&
      moveFunction(player) | checkForFruitCollision(playerId);
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId];
    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      if (player.x === fruit.x && player.y === fruit.y) {
        removeFruit({ fruitId });
      }
    }
  }

  return {
    movePlayer,
    state,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    checkForFruitCollision,
    setState,
    subscribe,
    start,
  };
}
