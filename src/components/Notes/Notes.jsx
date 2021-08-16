import React from "react";
import shortid from "shortid"
import Loading from "./Loading/Loading";
import Note from './Note/Note'
import './Notes.css'

const DEFAULT_STATE = {
                        isLoading: true, 
                        updated: '-',
                        added: 0,
                        deleted: 0,
                        notes: []
                    }


export default class Notes extends React.Component {

    constructor(props) {
        super(props);
        this.notes = [];
    }

    state = DEFAULT_STATE;

    componentDidMount() {
        setTimeout(() => this.updateNotes(), 1000)
    }

    updateNotes() {
        this.setState({isLoading: true})
   
        fetch(process.env.REACT_APP_NOTES_URL).then(response => {

            response.json().then((res) => {

                const diff = res.length - this.state.notes.length;
                const added = (diff > 0) ? diff : 0;
                const deleted = (diff < 0) ? Math.abs(diff) : 0;
                const updated = new Date().toLocaleTimeString();

 
                this.setState({isLoading: false, updated, added, deleted, notes: res})
            });        
        });
    }

        
    deleteNote(id) {
        fetch(`${process.env.REACT_APP_NOTES_URL}/${id}`, {method: 'DELETE'}).then(()=> {
            this.updateNotes()
        })
    }

    addNote(note) {
        fetch(
            process.env.REACT_APP_NOTES_URL, 
            {method: 'POST', body: JSON.stringify(note)})
        .then((response) => {
            this.updateNotes();
        })
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const note = {id:shortid.generate(), text: e.target.notetext.value}
        this.addNote(note);
        e.target.reset();
    }

    render() {
            return (
            <div className="Notes">
                <div className="Update">
                    <span className="LastUpdate">
                        Обновлено: {this.state.updated}  Добавлено: {this.state.added}  Удалено: {this.state.deleted}
                    </span>
                    <span className="UpdateButton" onClick={this.updateNotes.bind(this)}> ↺ </span>
                </div>
                <div id="NotesList">
                    {this.state.notes.map(note=> {
                        return (<Note {...note} key={shortid.generate()} onDelete={this.deleteNote.bind(this)}/>)
                    })}
                </div>
                <form className="NotesForm" onSubmit={this.handleFormSubmit.bind(this)}>
                    <textarea className="NotesForm-text" name="notetext" id="notetext"></textarea>
                    <button className="NotesForm-button" type="submit">+</button>
                </form>
                <Loading loading={this.state.isLoading}/>
            </div>
            )
    }
}