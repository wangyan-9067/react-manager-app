import React from 'react';
import 'mediaelement/full';



class Video extends React.Component {
    constructor() {
        super();
        this.video = React.createRef();
    }

    componentDidMount() {
        new mejs.MediaElementPlayer(this.video.current, {
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

    render() {
        return (
            <video ref={this.video} width="320" height="240" controls="controls">
                <source src="https://re.008cdn.com/record/mp4:GB022196170OO.flv" />
            </video>
        )
    }
}

export default Video;