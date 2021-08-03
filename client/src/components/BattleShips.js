import { Button } from 'reactstrap';
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import myPeer from '../lib/peerConnection';

class BattleGrid extends Component {
    constructor(props) {
        super(props)
        
        this.handleDefenceGrid=this.handleDefenceGrid.bind(this);
        this.handleOffenceGrid=this.handleOffenceGrid.bind(this);
        this.handleAddBattleShip=this.handleAddBattleShip.bind(this);
        this.handleReadyEvent=this.handleReadyEvent.bind(this);
        this.clearBattleShip=this.clearBattleShip.bind(this);

        this.userReady = false;
        this.opponentReady = false;
        this.turn = false;

        this.state={
            userScore:0,
            opponentScore:0
        }

        this.battleShips = new Map();
        this.bShip = [];
    }

    componentDidMount(){
        try {
            myPeer.peerConn.on('data',(data) => {
                console.log(data);
                // Game Logic

                let e = null;

                switch(data.type){
                    case "READY":

                        this.opponentReady = true;
                        break;
                    case "ATTACK":

                        e = document.getElementById(`${data.x}-${data.y} def`);
                        let flag = false;

                        for(let key=1;key<=5;++key){
                            if(this.battleShips.get(key).length === 0) continue;
                            for(let i=0;i<this.battleShips.get(key).length;++i){
                                if(this.battleShips.get(key)[i].x === data.x && this.battleShips.get(key)[i].y === data.y){
                                    e.style.backgroundColor="red";
                                    this.battleShips.get(key).splice(i,1);
                                    if(this.battleShips.get(key).length === 0){
                                        this.setState({opponentScore:this.state.opponentScore+1});
                                        myPeer.peerConn.send({
                                            type:"SCORE"
                                        });
                                    }
                                    flag = true;
                                    break;
                                }
                            }
                            if(flag) break;
                        }

                        if(flag){
                            myPeer.peerConn.send({
                                type:"RESPONSE",
                                status:"HIT",
                                x:data.x,
                                y:data.y
                            });
                        }
                        else {
                            myPeer.peerConn.send({
                                type:"RESPONSE",
                                status:"MISS",
                                x:data.x,
                                y:data.y
                            });
                        }

                        this.turn = true;
                        break;

                    case "RESPONSE":
                        try{
                            e = document.getElementById(`${data.x}-${data.y}`);
                            e.style.backgroundColor = data.status === "HIT" ? "red" : "white";
                        }
                        catch {
                            this.props.history.push("/");
                        }
                        break;
                    case "SCORE":
                        this.setState({userScore:this.state.userScore+1});
                        if(this.state.userScore === 5) {
                            myPeer.peerConn.send({
                                type:"WIN"
                            });
                            alert("You Win");
                            this.props.contract.methods.faucet(
                                100
                            ).send({ from:this.props.accounts[0] });
                            this.props.history.push("/");
                        }
                        break;
                    case "WIN":
                        alert("Opponent won");
                        this.props.history.push("/");
                        break;
                    default:
                }
            }
            );
        }
        catch {
            this.props.history.push('/');
        }
    }

    handleOffenceGrid(e){
        
        if(this.userReady === false || this.opponentReady === false) {
            if(this.userReady === false) alert("Please click Ready to start the game");
            else if(this.opponentReady === false) alert("Please wait for opponent to get ready");
            return;
        }

        if(this.turn === false) {
            alert("Waiting for opponent's turn");
            return;
        }

        this.turn = false;
        myPeer.peerConn.send({
            type:"ATTACK",
            x:e.target.parentNode.rowIndex,
            y:e.target.cellIndex
        });

    }

    handleDefenceGrid(e) {
        // alert("row " + e.target.parentNode.rowIndex + " - column " + e.target.cellIndex);

        if(this.battleShips.size === 5) return;

        if(e.target.style.backgroundColor === "cyan" ){
            let index = -1;
            this.bShip.forEach((cell) => {
                if(cell.x === e.target.parentNode.rowIndex && cell.y === e.target.cellIndex){
                    index = this.bShip.indexOf(cell);
                }
            });
            if(index === -1) return;
            else this.bShip.splice(index,1);
            e.target.style.backgroundColor = "transparent";
        }
        else {
            this.bShip.push({
                e:e,
                x:e.target.parentNode.rowIndex,
                y:e.target.cellIndex
            });
            e.target.style.backgroundColor = "cyan";
        }
    }

    clearBattleShip() {
        alert("Invalid BattleShip");
        this.bShip.forEach((cell) => {
            cell.e.target.style.backgroundColor = "transparent";
        });
        this.bShip = [];
    }

    handleAddBattleShip(){
        // Check all possible scenarios for battleship to be valid

        let len = this.bShip.length;

        let validFlag = true;

        if(len < 1) return;

        if(len > 5 || this.battleShips.has(len)) {
            this.clearBattleShip();
            validFlag = false;
            return;
        }

        if(len > 1) {

            let min = 10;

            if(this.bShip[0].x === this.bShip[1].x) {

                this.bShip.forEach((cell) => {
                    if(cell.y < min) min = cell.y;
                });
                this.bShip.forEach((cell) => {
                    if(cell.y - min >= len || cell.x !== this.bShip[0].x){
                        this.clearBattleShip();
                        validFlag = false;
                        return;
                    }
                });

            }
            else if(this.bShip[0].y === this.bShip[1].y) {

                this.bShip.forEach((cell) => {
                    if(cell.x < min) min = cell.x;
                });

                this.bShip.forEach((cell) => {
                    if(cell.x - min >= len || cell.y !== this.bShip[0].y){
                        this.clearBattleShip();
                        validFlag = false;
                        return;
                    }
                });

            }
            else {
                this.clearBattleShip();
                validFlag = false;
                return;
            }
        }

        if(validFlag === true){
            this.battleShips.set(len, this.bShip);
            this.bShip = [];
        }
    }

    handleReadyEvent(){
        if(this.battleShips.size !== 5) return;
        // Ready Event

        this.userReady = true;
        
        if(this.opponentReady === false) this.turn = true;
        
        myPeer.peerConn.send({
            type:"READY"
        });
    }

    render() {
        const defenceGrid=[],offenceGrid=[];
        const variable=["A","B","C","D","E","F","G","H","I","J"];

        for( let i=0;i<10;++i ) {
            defenceGrid.push(
                    <tr>
                        <th>{variable[i]}</th>
                        <td id={(i+1)+"-1 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-2 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-3 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-4 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-5 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-6 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-7 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-8 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-9 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                        <td id={(i+1)+"-10 def"} onClick={e=>this.handleDefenceGrid(e)}></td>
                    </tr>);
        }

        for( let i=0;i<10;++i ) {
            offenceGrid.push(
                    <tr>
                        <th>{variable[i]}</th>
                        <td id={(i+1)+"-1"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-2"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-3"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-4"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-5"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-6"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-7"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-8"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-9"} onClick={e=>this.handleOffenceGrid(e)}></td>
                        <td id={(i+1)+"-10"} onClick={e=>this.handleOffenceGrid(e)}></td>
                    </tr>);
        }

        return (
            <div className="Container">
                <div className="row">
                    <div className="panel">
                        <div className="names">
                            <div className="scoreButton">
                                <h2>{`Your Score - ${this.state.userScore}`}</h2>
                                <button className="homeButton add" onClick={this.handleAddBattleShip}>Add Battleship</button>
                            </div>
                            <div className="scoreButton">
                                <h2>{`Opponent Score - ${this.state.opponentScore}`}</h2>
                                <button className="homeButton ready" onClick={this.handleReadyEvent}>Ready</button>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="row">
                <div className="gameContainer">
                    <div className="grid">
                        <table>
                            <tr>
                                <th></th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                                <th>8</th>
                                <th>9</th>
                                <th>10</th>
                            </tr>
                            {defenceGrid}
                        </table>
                    </div>
                    <div className="grid">
                        <table>
                            <tr>
                                <th></th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                                <th>8</th>
                                <th>9</th>
                                <th>10</th>
                            </tr>
                            {offenceGrid}
                        </table>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default withRouter(BattleGrid);