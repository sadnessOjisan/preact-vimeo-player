import { h, Component } from "preact";
import Player from "@vimeo/player";

const eventNames = {
  play: "onPlay",
  pause: "onPause",
  ended: "onEnd",
  timeupdate: "onTimeUpdate",
  progress: "onProgress",
  seeked: "onSeeked",
  texttrackchange: "onTextTrackChange",
  cuechange: "onCueChange",
  cuepoint: "onCuePoint",
  volumechange: "onVolumeChange",
  playbackratechange: "onPlaybackRateChange",
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

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const changes = Object.keys(this.props).filter(
      (name) => this.props[name] !== prevProps[name]
    );

    this.updateProps(changes);
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  /**
   * @private
   */
  getInitialOptions() {
    /* eslint-disable react/destructuring-assignment */
    return {
      id: this.props.video,
      width: this.props.width,
      height: this.props.height,
      autopause: this.props.autopause,
      autoplay: this.props.autoplay,
      byline: this.props.showByline,
      color: this.props.color,
      controls: this.props.controls,
      loop: this.props.loop,
      portrait: this.props.showPortrait,
      title: this.props.showTitle,
      muted: this.props.muted,
      background: this.props.background,
      responsive: this.props.responsive,
    };
    /* eslint-enable react/destructuring-assignment */
  }

  /**
   * @private
   */
  updateProps(propNames) {
    const { player } = this;
    propNames.forEach((name) => {
      // eslint-disable-next-line react/destructuring-assignment
      const value = this.props[name];
      switch (name) {
        case "autopause":
          player.setAutopause(value);
          break;
        case "color":
          player.setColor(value);
          break;
        case "loop":
          player.setLoop(value);
          break;
        case "volume":
          player.setVolume(value);
          break;
        case "paused":
          player.getPaused().then((paused) => {
            if (value && !paused) {
              return player.pause();
            }
            if (!value && paused) {
              return player.play();
            }
            return null;
          });
          break;
        case "width":
        case "height":
          player.element[name] = value;
          break;
        case "video":
          if (value) {
            const { start } = this.props;
            const loaded = player.loadVideo(value);
            // Set the start time only when loading a new video.
            // It seems like this has to be done after the video has loaded, else it just starts at
            // the beginning!
            if (typeof start === "number") {
              loaded.then(() => {
                player.setCurrentTime(start);
              });
            }
          } else {
            player.unload();
          }
          break;
        default:
        // Nothing
      }
    });
  }

  /**
   * @private
   */
  createPlayer() {
    const { start, volume } = this.props;

    this.player = new Player(this.container, this.getInitialOptions());

    Object.keys(eventNames).forEach((dmName) => {
      const reactName = eventNames[dmName];
      this.player.on(dmName, (event) => {
        // eslint-disable-next-line react/destructuring-assignment
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

    if (typeof volume === "number") {
      this.updateProps(["volume"]);
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
