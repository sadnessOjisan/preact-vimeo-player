import { h, render } from "preact";
import VimeoPreactPlayer from "preact-vimeo-player";

const Component = () => {
  return (
    <div>
      <div id="made-in-ny"></div>
      <VimeoPreactPlayer
        video="https://player.vimeo.com/video/115783408"
        onPlay={() => {
          console.log("play");
        }}
        onProgress={() => {
          console.log("progress");
        }}
        onTimeUpdate={() => {
          console.log("pause");
        }}
        controls={true}
      ></VimeoPreactPlayer>
    </div>
  );
};

render(<Component></Component>, document.body);
