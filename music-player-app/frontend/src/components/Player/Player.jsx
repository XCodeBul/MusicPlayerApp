import PlaylistManager from "./PlaylistManager/PlaylistManager.jsx";
import MusicPlayer from "./MusicPlayer/MusicPlayer.jsx";

const Player = () => {

    return (
        <div className="flex flex-1 overflow-hidden">
            <aside
                className="hidden md:flex w-20 lg:w-24 bg-gray-900/50 rounded-3xl flex-col shadow-xl ml-4 my-4 flex-shrink-0">
                <PlaylistManager/>
            </aside>

            <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
                <div className="flex flex-row items-stretch flex-shrink-0 w-full overflow-hidden">
                    <div className="scale-90 origin-top-left shrink-0">
                        {/*<MusicPlayer*/}
                        {/*    // ref={musicAudioRef}*/}
                        {/*    // currentSong={currentSong}*/}
                        {/*    // isPlaying={isPlaying}*/}
                        {/*    // onPlayPause={handlePlayPause}*/}
                        {/*    // onNext={handleNext}*/}
                        {/*    // onPrev={handlePrev}*/}
                        {/*    // progress={progress}*/}
                        {/*    // onSeek={(newProgress) => setProgress(newProgress)}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Player
