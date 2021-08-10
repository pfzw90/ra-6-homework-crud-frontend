import React from 'react'
import './Note.css'


export default class Note extends React.Component {
    constructor(props) {
        super(props);
        this.text = props.text
        this.id = props.id
    }

    handleDelete = () => {
        this.props.onDelete(this.id)
     
    }

    render() {
        return(
        <div className="Note">
            <span className="Note-delete" onClick={this.handleDelete}>X</span>
            <div className="Note-text">{this.text}</div>
        </div>    
        )
    }
}