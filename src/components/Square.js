
function Square(props) {

    return (
        <div 
            className={`board-square square-${props.squareN} ${props.isVisible ? 'animated-appear' : ''}`} 
            onClick={props.onClick}
        >
            <span>
                {props.value}
            </span>
        </div>
    )
}

export default Square