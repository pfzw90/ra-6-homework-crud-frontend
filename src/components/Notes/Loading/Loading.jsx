import './Loading.css'

export default function Loading(props) {
    if (props.loading) {
        return (
        
        <div className="Loading">
            <link href="/node_modules/three-dots/dist/three-dots.css" rel="stylesheet"></link>
            <div className="dot-elastic"></div>
        </div>
    )} else return null
}