import React from 'react';
import PropTypes from 'prop-types';
import 'mediaelement';
import 'mediaelement/build/mediaelementplayer.min.css';


class MediaElement extends React.Component {
    constructor() {
        super();
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        const { MediaElementPlayer } = global;

        this.player = new MediaElementPlayer(this.videoRef.current, {
            renderers: ["native_flv", "html5"],
            clickToPlayPause: false,
            pauseOtherPlayers: false,
            success: (mediaElement, originalNode, instance) => {
                this.mediaElement = mediaElement;

                mediaElement.addEventListener('play', this.onPlay);
                mediaElement.addEventListener('error', this.onError);
                mediaElement.addEventListener('ended', this.onEnded);
                mediaElement.addEventListener('signal', this.onSignal);
            }
        });
    }

    componentWillUnmount() {
        this.mediaElement.removeEventListener('play', this.onPlay);
        this.mediaElement.removeEventListener('error', this.onError);
        this.mediaElement.removeEventListener('ended', this.onEnded);
        this.mediaElement.removeEventListener('signal', this.onSignal);
        this.player.remove();
    }

    onPlay = () => {
        console.log('media element on play');
    }

    onError = () => {
        console.log('media element on error');
    }

    onEnded = () => {
        console.log('media element on ended');
    }

    onSignal = () => {
        console.log('media element on signal');
    }

    render() {
        const { isAudio, sources, width, height, muted } = this.props;
        const ComponentName = isAudio ? 'audio' : 'video';

        return (
            <ComponentName ref={this.videoRef} width={width} height={height} controls crossOrigin="anonymous" muted={muted} autoPlay playsInline="" webkit-playsinline="">
                {sources.map((source, index) => (
                    <source key={index} src={source.src} type={source.type} />
                ))}
            </ComponentName>
        )
    }
}

MediaElement.defaultProps = {
    isAudio: false,
    muted: 'muted'
};

MediaElement.propTypes = {
    isAudio: PropTypes.bool,
    muted: PropTypes.string,
    sources: PropTypes.array.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired
}

export default MediaElement;