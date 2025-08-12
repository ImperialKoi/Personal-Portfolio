"use client";

import { useState, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface GameState {
  map: string[][];
  playerPos: Position;
  inventory: string[];
  stage: number;
  gameOver: boolean;
  victory: boolean;
  narration: string;
  isProcessing: boolean;
}

const INITIAL_MAPS = [
  // Stage 1: The Basement
  [
    "##########",
    "#..🗝️.....#",
    "#....░...#",
    "#...🧍....#",
    "#....🚪...#",
    "##########",
  ],
  // Stage 2: The Laboratory
  [
    "############",
    "#..........#",
    "#.👹..🗝️..░..#",
    "#..........#",
    "#🧍.........#",
    "#.....🚪....#",
    "############",
  ],
  // Stage 3: The Ritual Chamber
  [
    "##############",
    "#.............#",
    "#.░..👹.....░.#",
    "#.............#",
    "#🧍...🗝️.......#",
    "#.............#",
    "#......🚪.....#",
    "##############",
  ],
];

const STAGE_DESCRIPTIONS = [
  "You wake up in a damp basement. The air reeks of decay and something moves in the shadows...",
  "You've entered what appears to be an abandoned laboratory. Strange equipment hums ominously...",
  "The final chamber pulses with dark energy. Ancient symbols glow on the walls...",
];

export const useHorrorGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialMap = INITIAL_MAPS[0].map((row) => row.split(""));
    const playerPos = findPlayerPosition(initialMap);

    return {
      map: initialMap,
      playerPos,
      inventory: [],
      stage: 1,
      gameOver: false,
      victory: false,
      narration: STAGE_DESCRIPTIONS[0],
      isProcessing: false,
    };
  });

  function findPlayerPosition(map: string[][]): Position {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === "🧍") {
          return { x, y };
        }
      }
    }
    return { x: 1, y: 1 };
  }

  function findItemPosition(map: string[][], item: string): Position | null {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === item) {
          return { x, y };
        }
      }
    }
    return null;
  }

  const processActionWithAI = async (action: string, currentState: GameState) => {
    const prompt = `You are the game master for a horror escape room game. The player is in stage ${currentState.stage}.

Current game state:
- Player position: (${currentState.playerPos.x}, ${currentState.playerPos.y})
- Inventory: [${currentState.inventory.join(", ")}]
- Stage: ${currentState.stage}/3

Map legend:
- 🧍 = Player
- 🗝️ = Key
- 🚪 = Door
- 👹 = Monster/Trap
- ░ = Dark area
- # = Wall
- . = Empty space

Current map:
${currentState.map.map((row) => row.join("")).join("\n")}

Player action: "${action}"

Respond with a JSON object containing:
{
  "narration": "Atmospheric description of what happens (2-3 sentences, horror themed)",
  "newPlayerPos": {"x": number, "y": number} or null if no movement,
  "inventoryChange": "add:item" or "remove:item" or null,
  "gameOver": boolean,
  "victory": boolean,
  "nextStage": boolean
}

Rules:
- Player can only move to adjacent cells (not through walls #)
- Stepping on 👹 causes game over
- Stepping on ░ is allowed but spooky
- Player needs key (🗝️) to open door (🚪)
- Opening final door in stage 3 = victory
- Opening door in stages 1-2 = next stage
- Keep responses atmospheric and horror-themed`;

    try {
      const response = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error("AI API request failed");
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content as string | undefined;

      if (!aiResponse) {
        throw new Error("No response from AI");
      }

      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("AI processing error:", error);
      return {
        narration:
          "The shadows seem to shift around you as you attempt your action. Something feels wrong...",
        newPlayerPos: null,
        inventoryChange: null,
        gameOver: false,
        victory: false,
        nextStage: false,
      };
    }
  };

  const processAction = useCallback(
    async (action: string) => {
      setGameState((prev) => ({ ...prev, isProcessing: true }));

      try {
        const aiResult = await processActionWithAI(action, gameState);

        setGameState((prev) => {
          if (prev.gameOver || prev.victory) return { ...prev, isProcessing: false };

          const newMap = prev.map.map((row) => [...row]);
          let newPlayerPos = prev.playerPos;
          let newInventory = [...prev.inventory];
          let newStage = prev.stage;

          // Clear current player position
          newMap[prev.playerPos.y][prev.playerPos.x] = ".";

          // Apply AI-determined changes
          if (aiResult.newPlayerPos) {
            const targetX = Math.max(0, Math.min(newMap[0].length - 1, aiResult.newPlayerPos.x));
            const targetY = Math.max(0, Math.min(newMap.length - 1, aiResult.newPlayerPos.y));

            // Validate move (can't move through walls)
            if (newMap[targetY][targetX] !== "#") {
              newPlayerPos = { x: targetX, y: targetY };
            }
          }

          // Handle inventory changes
          if (aiResult.inventoryChange) {
            const [invAction, item] = aiResult.inventoryChange.split(":");
            if (invAction === "add" && !newInventory.includes(item)) {
              newInventory.push(item);
              if (item === "Key") {
                const keyPos = findItemPosition(newMap, "🗝️");
                if (keyPos) newMap[keyPos.y][keyPos.x] = ".";
              }
            } else if (invAction === "remove") {
              newInventory = newInventory.filter((i) => i !== item);
            }
          }

          // Handle stage progression
          if (aiResult.nextStage && newStage < INITIAL_MAPS.length) {
            newStage = newStage + 1;
            const nextMap = INITIAL_MAPS[newStage - 1].map((row) => row.split(""));
            const nextPlayerPos = findPlayerPosition(nextMap);

            return {
              map: nextMap,
              playerPos: nextPlayerPos,
              inventory: [],
              stage: newStage,
              gameOver: false,
              victory: false,
              narration: `${aiResult.narration}\n\n${STAGE_DESCRIPTIONS[newStage - 1]}`,
              isProcessing: false,
            };
          }

          // Place player in new position
          newMap[newPlayerPos.y][newPlayerPos.x] = "🧍";

          return {
            map: newMap,
            playerPos: newPlayerPos,
            inventory: newInventory,
            stage: newStage,
            gameOver: aiResult.gameOver,
            victory: aiResult.victory,
            narration: aiResult.narration,
            isProcessing: false,
          };
        });
      } catch (error) {
        console.error("Error processing action:", error);
        setGameState((prev) => ({
          ...prev,
          narration: "Something went wrong in the darkness...",
          isProcessing: false,
        }));
      }
    },
    [gameState]
  );

  const resetGame = useCallback(() => {
    const initialMap = INITIAL_MAPS[0].map((row) => row.split(""));
    const playerPos = findPlayerPosition(initialMap);

    setGameState({
      map: initialMap,
      playerPos,
      inventory: [],
      stage: 1,
      gameOver: false,
      victory: false,
      narration: STAGE_DESCRIPTIONS[0],
      isProcessing: false,
    });
  }, []);

  const renderGame = useCallback(() => {
    const lines = [
      "🏚️ HORROR ESCAPE ROOM",
      `Stage ${gameState.stage}`,
      "━".repeat(20),
      "",
      ...gameState.map.map((row) => row.join("")),
      "",
      `Inventory: [${gameState.inventory.join(", ")}]`,
      "",
      `📖 ${gameState.narration}`,
      "",
    ];

    if (gameState.victory) {
      lines.push("🎉 VICTORY! You have escaped!");
      lines.push('Type "horror" to play again.');
    } else if (gameState.gameOver) {
      lines.push("💀 GAME OVER");
      lines.push('Type "horror" to try again.');
    } else if (gameState.isProcessing) {
      lines.push("🤔 Processing your action...");
    } else {
      lines.push("💬 What do you want to do?");
      lines.push("(Examples: 'pick up key', 'move north', 'open door', 'look around')");
    }

    return lines;
  }, [gameState]);

  return {
    gameState,
    processAction,
    resetGame,
    renderGame,
  };
};
