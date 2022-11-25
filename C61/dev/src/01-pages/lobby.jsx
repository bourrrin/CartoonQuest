import { Link } from "react-router-dom"
import { useEffect } from "react";
import { IS_GAME_RUNNING } from "../App";

function Lobby() {
	useEffect(() => {
		IS_GAME_RUNNING.val = false;
	  },[])

	return (
        <div className="lobby__container">
			<div className="lobby__menu">
				<div className="lobby__button">
					<Link to={{pathname: "/game"}} state="newGame" className="text__highlignted--title">New Game</Link>
				</div>
				{/* <div  className="lobby__button" hidden={!hasAnActiveGame}>
					<Link to={{pathname: "/game"}} state="continueGame" className="text__highlignted--title">Continue game</Link>
				</div> */}
				<div className="lobby__button">
					<Link to="/item" className="text__highlignted--title">Items</Link>
				</div>
				<div className="lobby__button">
					<Link to="/" className="text__highlignted--title">Quit</Link>
				</div>
			</div>
		</div>
    );
}

export default Lobby;
	
