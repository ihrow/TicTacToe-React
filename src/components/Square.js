
function Square(props) {

    return (
        <div 
            className={`board-square square-${props.squareN}`} 
            onClick={props.onClick}
        >
            <span>
                {props.value}
            </span>
        </div>
    )
}

export default Square