import { Pause, Play } from "./Player";
import { usePlayerStore } from "../store/platylistStore";

export function CardPlayButton({ id }) {
	const { isPlaying, currentMusic, setIsPlaying, setCurrentMusic } = usePlayerStore(state => state);

	const handdleClick = () => {
		setIsPlaying(!isPlaying)
	};

	return (
		<button 
			onClick={handdleClick}
			className='card-play-button rounded-full bg-green-500 p-4 shadow-black/50 shadow-lg'
		>
			{ isPlaying ? <Pause/> : <Play />}
		</button>
	);
}
