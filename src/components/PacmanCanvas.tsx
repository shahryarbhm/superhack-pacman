import type { Game } from "@platzh1rsch/pacman-canvas";
import { getGameInstance } from "@platzh1rsch/pacman-canvas";
import { useEffect, useRef, useState } from "react";

interface PacmanCanvasProps {
  updateScore: (score: Number) => {};
}
export default function PacmanCanvas({ updateScore }: PacmanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const game: Game = getGameInstance();

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasContext(canvasRef.current.getContext("2d"));
    }
  }, []);

  useEffect(() => {
    if (game && canvasContext) {
      game.setCanvasContext2d(canvasContext);
    }
  }, [canvasContext]);
  useEffect(() => {
    setScore(game.getScore());
  }, [])
  const endGame = () => {
    game.endGame()
    updateScore(score)
    game.reset()
  }


  return (
    <>
      <div>
        <section>
          {/* Game controls */}
          <button onClick={() => game.pauseResume()}>Pause / Resume</button>
          <button
            onClick={() => game.newGame()}
          // disabled={!gameStateSnapshotEvent?.payload.started}
          >
            Restart Game
          </button>
          <button onClick={endGame}>End Game</button>
        </section>
        <section>
          <span>Score: {score}</span>
        </section>

        <section>
          <div
            id="canvas-container"
            onClick={() => {
              game.pauseResume();
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ background: "black" }}
              id="myCanvas"
              width="540"
              height="390"
            >
              <p>Canvas not supported</p>
            </canvas>
          </div>
        </section>
      </div>
    </>
  );
}
