import React, { Component } from "react";
import Peer from 'peerjs';
import myPeer from '../lib/peerConnection';
import { withRouter } from "react-router-dom";
//import Popup from 'reactjs-popup';
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

        var destId = prompt("Destination PeerId");

        if(destId === null) return;

        var peer = initialize();
        peer.on('open', function(id) {

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
                    {/* <button className="homeButton" onClick={() => this.props.history.push("/nftgen")}>Generate NFT</button> */}
                </div>
            </div>
        );
    }

}

export default withRouter(HomePage);