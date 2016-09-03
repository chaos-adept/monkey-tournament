import React from 'react';

export class PlayerIcon extends React.Component {
    render() {
        return <span>
                {this.props.player && this.props.player.photos.map(photo => <img key={photo.value} className="img-circle"
                                                                                 src={photo.value}/>)}</span>;

    }
}