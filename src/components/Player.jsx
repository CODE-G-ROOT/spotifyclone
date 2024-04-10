import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../store/playerStore";
import { Slider } from "./Slider";
import {
	FullSound,
	LittleBitSound,
	MiddleSound,
	VolumeSilence,
} from "../icons/Sound";

export const Pause = () => (
	<svg role='img' aria-hidden='true' viewBox='0 0 16 16' width='16' height='16'>
		<path d='M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z'></path>
	</svg>
);

export const Play = () => (
	<svg role='img' aria-hidden='true' viewBox='0 0 16 16' width='16' height='16'>
		<path d='M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z'></path>
	</svg>
);

const VolumeControl = () => {
	const { setVolume, volume } = usePlayerStore((state) => state);
	const previousVolumeRef = useRef(volume);

	const isVolumeSilence = volume < 0.1;

	const handleClickVolume = () => {
		console.log(isVolumeSilence);
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
			<picture className='w-16 h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden'>
				<img src={image} alt={title} />
			</picture>

			<div className='flex flex-col'>
				<h3 className='font-semibold text-sm block'>{title}</h3>
				<span className='text-xs opacity-80'>{artists?.join(", ")}</span>
			</div>
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
		<div className='flex flex-row justify-between w-full px-4 z-50'>
			<div>
				<CurrentSong {...currentMusic.song} />
			</div>

			<div className='grid place-content-center gap-4 flex-1'>
				<div className='flex justify-center'>
					<button
						className='bg-white rounded-full p-2'
						onClick={() => handleClick()}
					>
						{isPlaying ? <Pause /> : <Play />}
					</button>
				</div>
			</div>

			<div className='grid place-content-center'></div>
			<VolumeControl />
			<audio ref={audioRef} />
		</div>
	);
};
