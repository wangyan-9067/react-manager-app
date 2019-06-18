import React from 'react';
import 'mediaelement';
import 'mediaelement/build/mediaelementplayer.min.css';


class MediaElement extends React.Component {
    constructor() {
        super();
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        const { MediaElementPlayer } = global;

        this.mediaElement = new MediaElementPlayer(this.videoRef.current, {
            renderers: ["native_flv"],
            clickToPlayPause: false,
            pauseOtherPlayers: false,
            success: (mediaElement, originalNode, instance) => {
                this.player = instance;
                mediaElement.addEventListener('play', () => {
                    console.log('media element on play');
                });

                mediaElement.addEventListener('error', () => {
                    // TODO: error handling
                    console.log('media element on error');
                });

                mediaElement.addEventListener('ended', () => {
                    console.log('media element on ended');
                });

                mediaElement.addEventListener('signal', () => {
                    console.log('media element on signal');
                });
            }
        });
    }

    componentWillUnmount() {
        this.mediaElement.remove();
    }

    render() {
        const { sources, width, height } = this.props;

        return (
            <video ref={this.videoRef} width={width} height={height} controls crossOrigin="anonymous" muted playsInline="" webkit-playsinline="">
                {sources.map((source, index) => (
                    <source key={index} src={source.src} type={source.type} />
                ))}
            </video>
        )
    }
}

export default MediaElement;