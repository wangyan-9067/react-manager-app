import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MediaElement from './MediaElement';

class VideoDialog extends React.Component {
    render() {
        const { onClose, open } = this.props;

        return (
            <Dialog onClose={onClose} open={open}>
                <DialogContent>
                    <MediaElement
                        id="video1"
                        width="320"
                        height="320"
                        sources={[
                            {
                                src: 'https://re.010cdn.com/record/mp4:GC0161961807Y.flv',
                                type: 'video/flv'
                            }
                        ]}
                    />
                </DialogContent>
            </Dialog>
        )
    }
}

export default VideoDialog;