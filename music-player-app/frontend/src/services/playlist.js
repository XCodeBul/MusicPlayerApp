import {supabase} from "../supabaseClient.js";

export const getUserPlaylist = async (userId) => {
    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
    if (error) console.error("Playlist fetch error:", error)

    return data
}

export const storeUserPlaylist = async (userId, name) => {
    const { data, error } = await supabase
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

export const deleteUserPlaylist = async (playlistId) => {
    const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)

    if (error) console.error("Playlist fetch error:", error)
}

export const updateSongList = async (playlistId, songs) => {
    const { data, error } = await supabase
        .from("playlists")
        .update({ songs: songs })
        .eq("id", playlistId)

    if (error) console.error("Playlist fetch error:", error)
}


