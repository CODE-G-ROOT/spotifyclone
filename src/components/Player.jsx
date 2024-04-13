import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../store/playerStore";
import { Slider } from "./Slider";
import {
	FullSound,
	LittleBitSound,
	MiddleSound,
	VolumeSilence,
} from "../icons/Sound";

export const Pause = ({className}) => (
	<svg 
		role='img' 
		aria-hidden='true' 
		viewBox='0 0 16 16' 
		width='16' 
		height='16'
		className={className}
	>
		<path d='M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z'></path>
	</svg>
);

export const Play = ({className}) => (
	<svg 
		role='img' 
		aria-hidden='true' 
		viewBox='0 0 16 16' 
		width='16' 
		height='16'
		className={className}
	>
		<path d='M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z'></path>
	</svg>
);

const VolumeControl = () => {
	const { setVolume, volume } = usePlayerStore((state) => state);
	const previousVolumeRef = useRef(volume);

	const isVolumeSilence = volume < 0.1;

	const handleClickVolume = () => {
		if (isVolumeSilence) {
			setVolume(previousVolumeRef.current);
		} else {
			previousVolumeRef.current = volume;
			setVolume(0);
		}
	};

	return (
		<div className='flex justify-center align-middle gap-x-2'>
			<button
				className='w-4 h-auto items-center opacity-70 hover:opacity-100 transition'
				onClick={handleClickVolume}
			>
				{volume === 0.0 ? (
					<VolumeSilence />
				) : volume > 0 && volume <= 0.4 ? (
					<LittleBitSound />
				) : volume > 0.4 && volume < 0.8 ? (
					<MiddleSound />
				) : (
					<FullSound />
				)}
			</button>
			<Slider
				defaultValue={[100]}
				max={100}
				min={0}
				value={[volume * 100]}
				className='w-[100px]'
				// value={currentValue}
				onValueChange={(value) => {
					const [newVolume] = value;
					const volumeValue = newVolume / 100;
					setVolume(volumeValue);
				}}
			/>
		</div>
	);
};

const CurrentSong = ({ image, title, artists }) => {
	return (
		<div
			className={`flex items-center gap-5 relative
			overflow-hidden`}
		>
			<picture className='w-14 h-14 bg-zinc-800 rounded-md shadow-lg overflow-hidden'>
				<img src={image} alt={title} />
			</picture>

			<div className='flex flex-col'>
				<h3 className='font-semibold text-sm block'>{title}</h3>
				<span className='text-xs opacity-80'>{artists?.join(", ")}</span>
			</div>
		</div>
	);
};

const SongControl = ({ audio }) => {
	const [currentTime, setCurrentTime] = useState(0);

	useEffect(() => {
		audio.current.addEventListener("timeupdate", hadleTimeUpdate);
		return () => {
			audio.current.removeEventListener("timeupdate", hadleTimeUpdate);
		};
	});

	const hadleTimeUpdate = () => {
		setCurrentTime(audio.current.currentTime);
	};

	const formatTime = (time) => {
		if (time == 0) return "0:00";

		const seconds = Math.floor(time % 60);
		const minutes = Math.floor(time / 60);

		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const duration = audio?.current?.duration ?? 0;

	return (
		<div className='flex gap-x-2 text-xs pt-2'>
			<span className='opacity-60 w-12 text-right'>
				{[formatTime(currentTime)]}
			</span>
			<Slider
				min={0}
				max={audio?.current?.duration ?? 0}
				value={[currentTime]}
				className='w-[520px]'
				// value={currentValue}
				onValueChange={(value) => {
					audio.current.currentTime = value;
				}}
			/>
			<span className='opacity-60 w-12 text-left'>
				{ duration 
					? formatTime(duration)
				  : '0:00'
				}
			</span>
		</div>
	);
};

export const Player = () => {
	const { currentMusic, isPlaying, setIsPlaying, volume } = usePlayerStore(
		(state) => state
	);

	const audioRef = useRef();

	useEffect(() => {
		isPlaying ? audioRef.current.play() : audioRef.current.pause();
	}, [isPlaying]);

	useEffect(() => {
		audioRef.current.volume = volume;
	}, [volume]);

	useEffect(() => {
		const { song, playlist, songs } = currentMusic;
		if (song) {
			const src = `/music/${playlist?.id}/0${song.id}.mp3`;
			audioRef.current.src = src;
			audioRef.current.volume = volume;
			audioRef.current.play();
		}
	}, [currentMusic]);

	const handleClick = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		<div className='flex flex-row justify-between w-full py-2 z-50'>
			<div className="w-[171.4px] pl-2">
				<CurrentSong {...currentMusic.song} />
			</div>

			<div className='grid place-content-center gap-4 flex-1'>
				<div className='flex justify-center items-center flex-col'>
					<button
						className='bg-white w-min rounded-full p-2'
						onClick={handleClick}
					>
						{isPlaying ? <Pause /> : <Play />}
					</button>
					<SongControl audio={audioRef} />
				</div>
			</div>

			<div className='grid place-content-center w-[171.4px]'>
				<VolumeControl />
			</div>
			<audio ref={audioRef} />
		</div>
	);
};
