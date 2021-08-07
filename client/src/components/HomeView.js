import React, { Component } from "react";
import Peer from 'peerjs';
import myPeer from '../lib/peerConnection';
import { withRouter } from "react-router-dom";
import Popup from 'reactjs-popup';
import Canvas from "./Canvas";
//import 'reactjs-popup/dist/index.css';

function initialize(){
    var peer  = new Peer('', {
        host: '127.0.0.1',
            port: 9000,
            path: '/codechain',
            debug: 3
    });
    
    return peer;
}

class HomePage extends Component{

    constructor(props) {
        super(props);
        this.state={
            pid:null,
            mOpen:false
        };

        this.createLobby=this.createLobby.bind(this);
        this.joinLobby=this.joinLobby.bind(this);
    }

    componentDidMount(){
        const script=document.createElement('script');
        script.async=true;
        script.src='../../../nft-gen/script.js'
        document.body.appendChild(script);
    }

    createLobby(history){
        var peer = initialize();
        var ownid = null;
        peer.on('open', function(id) {
            ownid = id;
            alert('Connect Using PeerID :  ' + id);
        });
        // We might move this to game logic file
        peer.on('connection', function(conn) {
            // Store the Peer connection and ID
            myPeer.peerUser     = peer;
            myPeer.peerUserId   = ownid;
            myPeer.peerConn     = conn;

            // Redirect to Game Page
            history.push('/battleships');
        });
    }

    joinLobby(history){
        var peer = initialize();
        peer.on('open', function(id) {
            var destId = prompt("Destination PeerId");
            var conn   = peer.connect(destId, {
                reliable:true
            });

            // Store the Peer connection and ID
            myPeer.peerUser     = peer;
            myPeer.peerUserId   = id;
            myPeer.peerConn     = conn;

            // Redirect to Game Page
            history.push('/battleships');
        });
    }

    render(){
        return (
            <div className="homeContainer">
                <h1>BATTLESHIPS</h1>
                <div className="buttons">
                    <button className="homeButton" onClick={() => this.createLobby(this.props.history)}>Create Lobby</button>
                    <button className="homeButton" onClick={() => this.joinLobby(this.props.history)}>Join</button>
                    <Popup trigger={<button className="homeButton">Generate NFT</button>} modal>
                        <div className="nft">
                            <Canvas/>
                        </div>
                    </Popup>
                </div>
                <h2>Instructions</h2>
                <ul className="instructions">
                    <li>Start the game by creating a lobby.This will generate a lobby ID, which you have to send to your friend to play. If you want to join your friend's lobby you can use the lobby ID given to you by your friend.</li>
                    <li>Once the game is started, you have to add 5 battleships to your defence grid. The game has 5 unique battleships having sizes vary from 1 to 5, and after adding each battleship you have to click 'Add Battleship' button.</li>
                    <li>After you added battleships both the players need to click 'Ready' button to play.</li>
                    <li>When you both are ready to play then you can attack your opponent's battleship by clicking on the grid. If you guessed it right then the grid will turn 'RED', if not then 'WHITE'.</li>
                    <li>Whoever scores 5 first will win the game and will be rewarded 200 XCH tokens.</li>
                    <li>You can use these XCH tokens to generate NFTs and you can mint these NFTs for 100 XCH tokens.</li>
                </ul>
            </div>
        );
    }

}

export default withRouter(HomePage);