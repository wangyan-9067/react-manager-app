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

        this.mediaElement = new MediaElementPlayer(this.videoRef.current, {
            renderers: ["native_flv", "html5"],
            clickToPlayPause: false,
            pauseOtherPlayers: false,
            success: (mediaElement, originalNode, instance) => {
                this.player = instance;
                mediaElement.addEventListener('play', () => {
                    console.log('media element on play');
                });

                mediaElement.addEventListener('error', () => {
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