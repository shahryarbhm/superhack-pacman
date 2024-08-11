import type { Game } from "@platzh1rsch/pacman-canvas";
import { getGameInstance } from "@platzh1rsch/pacman-canvas";
import { useEffect, useRef, useState } from "react";

interface PacmanCanvasProps {
  updateScore: (score: Number) => {};
  userAddress: any;
}
export default function PacmanCanvas({ updateScore, userAddress }: PacmanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [topUsers, setTopUsers] = useState<{ address: string, score: number, hasActiveGame: boolean }[]>([]);

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
  }, [game.getScore()]);

  useEffect(() => {
    const interval = setInterval(getApi, 3000); // Run getApi every 10 seconds
    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  const endGame = () => {
    updateScore(game.getScore());
    game.endGame();
    game.reset();
  };

  const getApi = async () => {
    let endpoint = "https://arbitrum-sepolia.blockscout.com/api/v2/smart-contracts/0x95fd2C7f1cfD23641116C16f08be621EC3dA1a20/query-read-method"
    let response = await fetch(endpoint,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          args: [
          ],
          method_id: "f39dfb17",
          contract_type: "proxy | regular"
        })
      });

    const json = await response.json();
    const topUsers = json.result.output[0].value.map((item: any) => ({
      address: item[0],
      score: item[1],
      hasActiveGame: item[2]
    }));

    topUsers.sort((a: any, b: any) => b.score - a.score);
    setTopUsers(topUsers)
  };


  return (
    <>
      <div>
        <section>
          {/* Game controls */}
          <button onClick={() => game.pauseResume()}>Pause / Resume</button>
          <button onClick={() => game.newGame()}>Restart Game</button>
          <button onClick={endGame}>End Game</button>
        </section>
        <section>
          <span>Score: {score}</span>
          <br />
          <span>
            Address: {userAddress !== '' ? String(userAddress) : 'No Address'}
          </span>
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

          <div>
            <span>Game Top Scorse</span>
            <ul>
              {topUsers.map((item, index) => ( // Changed from history to topUsers
                <li key={index}>{item.address} : {item.score}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
