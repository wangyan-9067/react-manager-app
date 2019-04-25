import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';

const CustomAvatar = ({ label, imgUrl }) => {
  return (
    <Avatar
      aria-label={label}
      src={imgUrl}
      onError={e => {
        e.target.onerror = null;
        e.target.src="account-circle.svg"
      }}
    />
	);
}

CustomAvatar.prototype = {
  label: PropTypes.string.isRequired,
  imgUrl: PropTypes.string
};

export default CustomAvatar;