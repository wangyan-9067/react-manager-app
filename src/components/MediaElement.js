import React from 'react';
import 'mediaelement';
import 'mediaelement/build/mediaelementplayer.min.css';
// import 'mediaelement/build/mediaelement-flash-video.swf';


class MediaElement extends React.Component {
    constructor() {
        super();
        this.video = React.createRef();
    }

    componentDidMount() {
        const { MediaElementPlayer } = global;

        this.mediaElement = new MediaElementPlayer(this.video.current, {
            renderers: ["native_flv", "html5", "native_hls", "flash_video"],
            // pluginPath: './static/media/',
            // plugins: ['flash', 'silverlight'],
            clickToPlayPause: false,
            pauseOtherPlayers: false,
            success: (mediaElement, originalNode, instance) => {
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
        return (
            <video ref={this.video} width="320" height="240" controls="controls">
                <source src="https://re.008cdn.com/record/mp4:GB022196170OO.flv" type="video/flv"/>
            </video>
        )
    }
}

export default MediaElement;