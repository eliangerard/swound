import { useQuery } from "@tanstack/react-query"
import { SongCard } from "../components/SongCard"
import { Buffer } from 'buffer';
import { useState } from "react";

const { VITE_CLIENT_ID: client_id, VITE_CLIENT_SECRET: client_secret } = import.meta.env;

export const Home = () => {
    const [actualSong, setActualSong] = useState(0);
    const [volume, setVolume] = useState(50);
    const [likedSongs, setLikedSongs] = useState([]);

    const needToken = localStorage.getItem('user_token') === null ? localStorage.getItem('token') === null : false;

    const { isPending: isTokenPending, error: tokenError, data: tokenData } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
                },
                body: new URLSearchParams({
                    'grant_type': 'client_credentials',
                }),
            }).then((res) =>
                res.json(),
            ),
        enabled: needToken,
    })

    if (!isTokenPending && tokenData)
        localStorage.setItem('token', tokenData.access_token);

    const { isPending: reccomendationPending, error: reccomendationError, data: reccomendationData } = useQuery({
        queryKey: ['reccomendationData'],
        queryFn: () =>
            fetch(`https://api.spotify.com/v1/recommendations?limit=10&seed_artists=7Gi6gjaWy3DxyilpF1a8Is${likedSongs.length > 0 ? `seed_tracks=${likedSongs.join(",")}` : ""}`, { headers: { Authorization: 'Bearer ' + (localStorage.getItem('user_token') !== null ? localStorage.getItem('user_token') : localStorage.getItem('token')) } }).then((res) =>
                res.json(),
            ),
        enabled: !needToken,
    })

    if (reccomendationData?.error)
        localStorage.removeItem('token');

    console.log(reccomendationPending, reccomendationError, reccomendationData);

    return (
        <>
            <div className='h-[400px] w-[375px]'>
                {localStorage.getItem('user_token') === null && <div className="bg-green-600 rounded-lg h-12 text-white font-bold mb-4 flex items-center cursor-pointer">
                    <a className="px-4 flex items-center w-full h-full" href="https://accounts.spotify.com/authorize?client_id=08e3156cf19e4c4791974bf3727c7d0d&response_type=token&redirect_uri=https://swound.eliangerard.tech/callback">
                        Iniciar Sesión con Spotify
                    </a>
                </div>}

                <input type="range" min={0} max={100} className="w-full" value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                />

                {
                    reccomendationData && reccomendationData.tracks.map((track, index) => (
                        <SongCard key={index}
                            setLikedSongs={setLikedSongs}
                            volume={volume}
                            setVolume={setVolume}
                            play={(reccomendationData.tracks.length - 1 - index) == actualSong}
                            index={index}
                            setActualSong={setActualSong}
                            {...track}
                        />
                    ))
                }
            </div>
        </>
    )
}
