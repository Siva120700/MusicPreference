import AppBar from "../app/components/Appbar";
import NowPlaying from "../app/components/nowplaying";
import Queue from "../app/components/queue";
import AddSong from "../app/components/addsong";

const Page = () => {
  return (
    <div>
      <AppBar />
      <NowPlaying />
      <AddSong />
      <Queue />
    </div>
  );
};

export default Page;
