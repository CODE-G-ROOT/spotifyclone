import { Pasue, Play } from "./Player"

export function CardPlayButton ({id}) {
  return (
    <div className="card-play-button rounded-full bg-green-500 p-4 shadow-black/50 shadow-lg">
      <Play/>
    </div>
  )
}