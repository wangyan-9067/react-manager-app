import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import Video from './Video';

class VideoDialog extends React.Component {
    render() {
        const { onClose, open } = this.props;

        return (
            <Dialog onClose={onClose} open={open}>
                <DialogContent>
                    <Video />
                </DialogContent>
            </Dialog>
        )
    }
}

export default VideoDialog;