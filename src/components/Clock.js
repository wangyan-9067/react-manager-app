import React from 'react';
import Moment from 'react-moment';

export default class Clock extends React.Component {
    render() {
        return (
            <Moment interval={1000} format="HH:mm:ss" />
        );
    }
}