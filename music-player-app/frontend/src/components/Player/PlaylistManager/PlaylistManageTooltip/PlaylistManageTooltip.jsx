import DeletePlaylist from "../DeletePlaylist/DeletePlaylist.jsx";
import {usePlaylistContext} from "../../../../contexts/PlaylistContext.jsx";

const PlaylistManageTooltip = ({tooltip, setTooltip}) => {
    const {updatePlaylist} = usePlaylistContext()

    const handleOnChangeImageInput = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = async () => {
                const base64Image = reader.result
                try {
                    await updatePlaylist(tooltip.id, {
                        ...tooltip,
                        cover_url: base64Image
                    })
                    setTooltip(null)
                } catch (error) {
                    console.error("Failed to update cover:", error)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    return tooltip && (
        <div
            className="fixed z-[100000]
                bg-white/[0.03] backdrop-blur-2xl
                border border-white/10
                p-4 rounded-[28px]
                shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_20px_rgba(168,85,247,0.1)]
                -translate-y-1/2 flex flex-col gap-3
                animate-in fade-in zoom-in-95 slide-in-from-left-4 duration-300"
            style={{left: tooltip.x, top: tooltip.y}}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className="flex flex-col px-1">
                <span
                    className="text-[8px] text-purple-400 font-black uppercase tracking-[0.4em] mb-1 opacity-70">
                    Playlist
                </span>
                <span className="text-white text-[13px] font-semibold tracking-tight whitespace-nowrap">
                    {tooltip.name}
                </span>
            </div>

            <div className="flex items-center gap-2 mt-1 pt-3 border-t border-white/5">
                <div className="hover:scale-105 transition-transform active:scale-95">
                    <DeletePlaylist playlist={tooltip}/>
                </div>
                <label
                    htmlFor={`edit-cover-${tooltip.id}`}
                    className="flex items-center justify-center w-9 h-9
                        bg-white/5 border border-white/10
                        rounded-xl cursor-pointer transition-all
                        hover:bg-purple-500/20 hover:border-purple-500/40
                        group/edit shadow-lg"
                >
                    <svg
                        className="w-4 h-4 text-white/50 group-hover/edit:text-purple-300 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20
                              14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <input
                        id={`edit-cover-${tooltip.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleOnChangeImageInput}
                    />
                </label>
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/10 blur-[20px] rounded-full -z-10"/>
        </div>
    )
}

export default PlaylistManageTooltip
