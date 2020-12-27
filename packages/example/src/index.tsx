import { h, render } from "preact";
import VimeoPreactPlayer from "preact-vimeo-player";

const Component = () => {
  return (
    <div>
      <VimeoPreactPlayer></VimeoPreactPlayer>
    </div>
  );
};

render(<Component></Component>, document.body);
