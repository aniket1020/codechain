import React, { Component } from "react";
import { Button } from 'reactstrap';
import Peer from 'peerjs';
import myPeer from '../lib/peerConnection';
import { withRouter } from "react-router-dom";

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
            alt:1
        };

        this.createLobby=this.createLobby.bind(this);
        this.joinLobby=this.joinLobby.bind(this);
    }

    createLobby(history){
        var peer = initialize();
        var ownid = null;

        peer.on('open', function(id) {
            ownid = id;
            alert("Invite you peers using PeerId = "+id);
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
        if(this.state.alt===0){
            return(<h1>Metamask</h1>)
        }
        return (
            <div className="buttons">
                <Button outline color="primary" onClick={() => this.createLobby(this.props.history)}        > Create Lobby    </Button>
                <Button outline color="success" onClick={() => this.joinLobby(this.props.history)}          > Join            </Button>
            </div>
        );
    }

}

export default withRouter(HomePage);