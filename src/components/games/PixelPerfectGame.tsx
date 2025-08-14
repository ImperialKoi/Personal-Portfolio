import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface GameProps {
  challenge: any
  onComplete: (success: boolean) => void
}

export function PixelPerfectGame({ challenge, onComplete }: GameProps) {
  const [differentSquare, setDifferentSquare] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameEnded) {
      setGameEnded(true)
      onComplete(false)
    }
  }, [timeLeft, gameStarted, gameEnded, onComplete])

  const startGame = () => {
    setGameStarted(true)
    setGameEnded(false)
    // Randomly select which square (0-15) will be different
    setDifferentSquare(Math.floor(Math.random() * 16))
  }

  const handleSquareClick = (squareIndex: number) => {
    if (gameEnded) return

    setGameEnded(true)
    const success = squareIndex === differentSquare
    onComplete(success)
  }

  if (!gameStarted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">{challenge.hint}</p>
        <Button onClick={startGame}>Start Pixel Perfect</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Time: {timeLeft}s</Badge>
        <Badge>Find the different square</Badge>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4 bg-muted rounded-lg max-w-sm mx-auto">
        {Array.from({ length: 16 }, (_, index) => {
          const isDifferent = index === differentSquare
          return (
            <div
              key={index}
              className={`aspect-square rounded cursor-pointer transition-transform hover:scale-105 ${
                isDifferent ? "bg-[#2b72ff]" : "bg-blue-500"
              }`}
              onClick={() => handleSquareClick(index)}
            />
          )
        })}
      </div>

      <p className="text-xs text-center text-muted-foreground">Look carefully - one square has a different color</p>
    </div>
  )
}