import {supabase} from "../supabaseClient.js";
import {API_BASE_URL} from "../config/app.js";

// Извличане на всички плейлисти на конкретен потребител по ID
export const getUserPlaylists = async (userId) => {
    const {data, error} = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: true})

    if (error) console.error("Playlist fetch error:", error)

    return data
}

// Създаване на нов празен плейлист в базата данни
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

// Обновяване на метаданни на плейлист (име и др.), филтрирайки ненужни координати
export const updatePlaylist = async (playlistId, updatedData) => {
    const { x, y, ...dataToSave } = updatedData;

    const { data, error } = await supabase
        .from("playlists")
        .update(dataToSave)
        .eq("id", playlistId)
        .select();

    if (error) {
        console.error("Update playlist error:", error);
        throw error;
    }

    return data;
};

// Записване на целия масив от песни в даден плейлист
export const updateSongList = async (playlistId, songs) => {
    const {error} = await supabase
        .from("playlists")
        .update({songs: songs})
        .eq("id", playlistId)

    if (error) console.error("Playlist fetch error:", error)
}

// Изтриване на плейлист по неговото ID
export const deleteUserPlaylist = async (playlistId) => {
    const {error} = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)

    if (error) console.error("Playlist fetch error:", error)
}

// Получаване на детайлна информация за артист от външно API
export const getArtistInfo = async (artistId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/artist/${artistId}`);

        return await response.json()
    } catch (err) {
        console.error(err)
    }
}

// Търсене на песни с поддръжка на AbortController сигнал
export const getTracks = async (signal, searchQuery) => {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`,
            { signal }
        );

        const data = await res.json();
        console.log("Данни от сървъра:", data); 

        // Проверка на различните структури на отговора за намиране на масива с песни
        const rawTracks = data.data || (data.tracks && data.tracks.items) || data || [];

        // Филтриране само на песни, които имат наличен превю линк
        return rawTracks.filter(track => track.preview_url || track.preview);
        
    } catch (err) {
        if (err.name !== 'AbortError') console.error("Грешка:", err);
        return [];
    }
}

// Извличане на текст за конкретна песен
export const getLyrics = async (currentSong) => {
    const response = await fetch(
        `${API_BASE_URL}/api/lyrics?artist=${encodeURIComponent(currentSong.artist)}&title=${encodeURIComponent(currentSong.title)}`
    )
    return await response.json()
}

// Премахване на песен чрез обновяване на целия масив в базата
export const removeSongFromUserPlaylist = async (playlistId, songs) => {
    const { error } = await supabase
        .from("playlists")
        .update({ songs: songs }) 
        .eq("id", playlistId)

    if (error) {
        console.error("DB error:", error)
        throw error
    }
};