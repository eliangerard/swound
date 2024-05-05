import { useQuery } from "@tanstack/react-query"
import { SongCard } from "../components/SongCard"
import { Buffer } from 'buffer';
import { useState } from "react";

const { VITE_CLIENT_ID: client_id, VITE_CLIENT_SECRET: client_secret } = import.meta.env;

export const Home = () => {
    const [actualSong, setActualSong] = useState(0);
    console.log(client_id, client_secret);

    const needToken = localStorage.getItem('token') === null;

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
            fetch('https://api.spotify.com/v1/recommendations?limit=10&seed_artists=7Gi6gjaWy3DxyilpF1a8Is', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }).then((res) =>
                res.json(),
            ),
        enabled: !needToken,
    })

    console.log(reccomendationPending, reccomendationError, reccomendationData);

    return (
        <div className='h-[400px] w-[375px]'>
            {
                reccomendationData && reccomendationData.tracks.map((track, index) => (
                    <SongCard key={index} play={(reccomendationData.tracks.length - 1 - index) == actualSong} index={index} setActualSong={setActualSong} {...track} />
                ))
            }
        </div>
    )
}
