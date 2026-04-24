import {supabase} from "../supabaseClient.js";
import {API_BASE_URL} from "../config/app.js";

export const getUserPlaylists = async (userId) => {
    const { data: playlists, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId);

    if (!playlists) {
        console.log('No playlists found');
    } else {
        const playlistsWithCount = await Promise.all(
            playlists.map(async (playlist) => {
                const { count } = await supabase
                    .from('playlist_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('playlist_id', playlist.id);
                return {
                    ...playlist,
                    log_count: count || 0
                };
            })
        );
        playlistsWithCount.sort((a, b) => b.log_count - a.log_count);
        return playlistsWithCount
    }

    if (error) console.error("Playlist fetch error:", error)
}

export const storeUserPlaylist = async (userId, name) => {
    const {data, error} = await supabase
        .from('playlists')
        .insert([{
            name: name,
            user_id: userId,
            songs: []
        }])
        .select()

    if (error) console.error("Playlist fetch error:", error)

    return data
}

export const updatePlaylist = async (playlistId, updatedData) => {
    delete updatedData.log_count
    delete updatedData.x
    delete updatedData.y

    const { data, error } = await supabase
        .from("playlists")
        .update(updatedData)
        .eq("id", playlistId)
        .select();

    if (error) {
        console.error("Update playlist error:", error);
        throw error;
    }

    return data;
}

export const updateSongList = async (playlistId, songs) => {
    const {error} = await supabase
        .from("playlists")
        .update({songs: songs})
        .eq("id", playlistId)

    if (error) console.error("Playlist fetch error:", error)
}

export const deleteUserPlaylist = async (playlistId) => {
    const {error} = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)

    if (error) console.error("Playlist fetch error:", error)
}

export const getArtistInfo = async (artistId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/artist/${artistId}`);

        return await response.json()
    } catch (err) {
        console.error(err)
    }
}

export const getTracks = async (signal, searchQuery) => {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`,
            { signal }
        );

        const data = await res.json();
        console.log("Данни от сървъра:", data); 

 
        const rawTracks = data.data || (data.tracks && data.tracks.items) || data || [];


        return rawTracks.filter(track => track.preview_url || track.preview);
        
    } catch (err) {
        if (err.name !== 'AbortError') console.error("Грешка:", err);
        return [];
    }
}

export const getLyrics = async (currentSong) => {
    const response = await fetch(
        `${API_BASE_URL}/api/lyrics?artist=${encodeURIComponent(currentSong.artist)}&title=${encodeURIComponent(currentSong.title)}`
    )
    return await response.json()
}

export const removeSongFromUserPlaylist = async (playlistId, songs) => {
    const { error } = await supabase
        .from("playlists")
        .update({ songs: songs }) 
        .eq("id", playlistId)

    if (error) {
        console.error("DB error:", error)
        throw error
    }
}
