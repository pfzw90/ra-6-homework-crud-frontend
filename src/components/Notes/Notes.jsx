import React from "react";
import shortid from "shortid"
import Loading from "./Loading/Loading";
import ReactDOM from "react-dom"
import Note from './Note/Note'
import './Notes.css'

const findAdditionalNotes = (arrayA,arrayB) => {
    const result = [];
    arrayA.forEach((i) => {
        if (!arrayB.map((j)=>j.id).includes(i.id)) result.push(i);
     });
     return result;
}

const DEFAULT_STATE = {
                        isLoading:true, 
                        updated: '-',
                        added: 0,
                        deleted: 0
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
        const result = {};

        fetch(process.env.REACT_APP_NOTES_URL).then(response => {

            response.json().then((res) => {

                if (res.length) result.notesToAdd = findAdditionalNotes(res,this.notes);
                if (this.notes.length) result.notesToRemove = findAdditionalNotes(this.notes,res);
                
                this.setState({
                    isLoading: false,
                    updated: new Date().toLocaleTimeString(),
                    added: result.notesToAdd ? result.notesToAdd.length : 0,
                    deleted: result.notesToRemove ? result.notesToRemove.length : 0 });
                    
                if (result.notesToAdd) {
                    result.notesToAdd.forEach((note) => {
                        this.addNoteNode(note)          
                    })};

                if (result.notesToRemove) {
                    result.notesToRemove.forEach((note) => {
                        this.deleteNoteNode(note.id)          
                    })};
            });        
        });
    }

    addNoteNode(note) {
        this.notes.push(note)
        const container = document.createElement('div');
        document.getElementById("NotesList").appendChild(container)
        container.id = note.id;
        ReactDOM.render(<Note {...note} key={note.id} onDelete={this.deleteNote.bind(this)}/>, container)
    }

    deleteNoteNode(id) {
        console.log(this.notes, id)
        this.notes = this.notes.filter(n => n.id !== id);
        const container = document.getElementById(id)
        ReactDOM.unmountComponentAtNode(container)
        container.remove();
        console.log(this.notes)
    }

    deleteNote(id) {
        fetch(`${process.env.REACT_APP_NOTES_URL}${id}`, {method: 'DELETE'}).then(()=> {
            this.deleteNoteNode(id)
        })
    }

    addNote(note) {
        fetch(
            process.env.REACT_APP_NOTES_URL, 
            {method: 'POST', body: JSON.stringify(note)})
        .then(()=>
            this.addNoteNode(note)
        )
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.addNote({id:shortid.generate(), text: e.target.notetext.value});
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
                <div id="NotesList"></div>
                <form className="NotesForm" onSubmit={this.handleFormSubmit.bind(this)}>
                    <textarea className="NotesForm-text" name="notetext" id="notetext"></textarea>
                    <button className="NotesForm-button" type="submit">+</button>
                </form>
                <Loading {...this.state}/>
            </div>
            )
    }
}