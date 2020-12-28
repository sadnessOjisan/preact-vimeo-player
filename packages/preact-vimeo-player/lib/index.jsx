import { h, Component } from "preact";
import Player from "@vimeo/player";

const eventNames = {
  play: "onPlay",
  pause: "onPause",
  ended: "onEnd",
  timeupdate: "onTimeUpdate",
  progress: "onProgress",
  error: "onError",
  loaded: "onLoaded",
};

class Vimeo extends Component {
  constructor(props) {
    super(props);

    this.refContainer = this.refContainer.bind(this);
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  /**
   * @private
   */
  getInitialOptions() {
    return {
      id: this.props.video,
      width: this.props.width,
      height: this.props.height,
      autoplay: this.props.autoplay,
      controls: this.props.controls,
      loop: this.props.loop,
      muted: this.props.muted,
      responsive: this.props.responsive,
    };
  }

  /**
   * @private
   */
  createPlayer() {
    const { start } = this.props;

    this.player = new Player(this.container, this.getInitialOptions());

    Object.keys(eventNames).forEach((dmName) => {
      const reactName = eventNames[dmName];
      this.player.on(dmName, (event) => {
        const handler = this.props[reactName];
        if (handler) {
          handler(event);
        }
      });
    });

    const { onError, onReady } = this.props;
    this.player.ready().then(
      () => {
        if (onReady) {
          onReady(this.player);
        }
      },
      (err) => {
        if (onError) {
          onError(err);
        } else {
          throw err;
        }
      }
    );

    if (typeof start === "number") {
      this.player.setCurrentTime(start);
    }
  }

  /**
   * @private
   */
  refContainer(container) {
    this.container = container;
  }

  render() {
    const { id, className, style } = this.props;

    return (
      <div
        id={id}
        className={className}
        style={style}
        ref={this.refContainer}
      />
    );
  }
}

export default Vimeo;
