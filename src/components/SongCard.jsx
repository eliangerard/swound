/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import TinderCard from 'react-tinder-card'

export const SongCard = ({ id, setLikedSongs, className, volume, setVolume, play, setActualSong, artists, album, name, preview_url: preview, }) => {

    const audoPlayer = useRef(null);

    useEffect(() => {
        if (play) {
            audoPlayer.current.play();
        } else {
            audoPlayer.current.pause();
        }
    }, [play]);

    useEffect(() => {
        audoPlayer.current.volume = volume / 100;
    }, [volume]);

    const onSwipe = (direction) => {
        console.log('You swiped: ' + direction)
        setActualSong((prev) => prev + 1);
        if(direction === 'right') {
            setLikedSongs((prev) => [...prev, id]);
        }
    }

    const onCardLeftScreen = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
    }

    return (
        <TinderCard className={`w-fit absolute ${className}`}
            onSwipe={onSwipe}
            onCardLeftScreen={() => onCardLeftScreen('fooBar')}
            preventSwipe={['up', 'down']}        
        >
            {/* <img className='select-none pointer-events-none	h-[400px] w-[375px]' src="/mock.png" alt="" /> */}
            <div className='relative h-[400px] w-[375px] flex bg-white rounded-lg shadow-lg text-white select-none overflow-hidden'>
                <img className='h-full w-full object-cover rounded-lg pointer-events-none select-none' src={album.images[0].url} alt="" />
                <div className='absolute bottom-0 p-4 h-fit w-full bg-black/50'>
                    <h1 className='font-bold text-lg'>{name}</h1>
                    <p className='text-sm'>{artists.map(artist => artist.name).join(', ')}</p>
                    <audio loop ref={audoPlayer} className='w-full mt-4' src={preview}
                        onVolumeChange={(e) => setVolume(e.target.volume * 100)}
                    ></audio>
                </div>
            </div>
        </TinderCard>
    )
}