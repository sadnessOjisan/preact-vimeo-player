import { h, Component } from "preact";
import Player, { Options } from "@vimeo/player";

const eventNames = {
  play: "onPlay",
  pause: "onPause",
  ended: "onEnd",
  timeupdate: "onTimeUpdate",
  progress: "onProgress",
  error: "onError",
  loaded: "onLoaded",
} as const;

type EventKey = keyof typeof eventNames;

type Props = {
  video: string;
  width: number;
  height: number;
  start: number;
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  muted: boolean;
  responsive: boolean;
  onPlay: () => void;
  onPause: () => void;
  onError: () => void;
  onReady: () => void;
  onEnd: () => void;
  onTimeUpdate: () => void;
  onProgress: () => void;
  onLoaded: () => void;
  id: string;
  className?: string;
  style?: string | h.JSX.CSSProperties;
};

class Vimeo extends Component<Props> {
  // @ts-ignore
  player: Player;
  constructor(props: Props) {
    super(props);

    this.refContainer = this.refContainer.bind(this);
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  getInitialOptions(): Options {
    return {
      // @ts-ignore
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

    // @ts-ignore
    this.player = new Player(this.container, this.getInitialOptions());

    (Object.keys(eventNames) as EventKey[]).forEach((dmName) => {
      const reactName = eventNames[dmName];
      this.player.on(dmName, (event) => {
        const handler = this.props[reactName];
        if (handler) {
          // @ts-ignore
          handler(event);
        }
      });
    });

    const { onError, onReady } = this.props;
    this.player.ready().then(
      () => {
        if (onReady) {
          // @ts-ignore
          onReady(this.player);
        }
      },
      (err) => {
        if (onError) {
          // @ts-ignore
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

  // @ts-ignore
  refContainer(container) {
    // @ts-ignore
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
