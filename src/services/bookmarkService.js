import { bookmark_api } from "./api"

export async function bookmark_upload(video_id, time_start, time_end, img){
    let bookmark = {
        video_id : parseInt(video_id),
        time_start : time_start,
        time_end : time_end,
        img : img,

    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmark)
    };
    const response = await fetch(`${bookmark_api}/upload`, requestOptions);
    const data = await response.json();
    return data
}