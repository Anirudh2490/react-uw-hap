import React, { Component } from 'react'
import './style.scss'

// var myLandbot = new LandbotFrameWidget({
//     container: '#myLandbot',
//     index: 'https://landbot.io/u/H-212248-NH98O0N70W6P37X9/index.html',
//   });

export class Chat extends Component {
    render() {
        return (
          <div className="column is-3">
            <div className="section">
              <h4 style={{ color: "white" }}>
                Booking for *Petname* on the 12th of May, 2019
              </h4>
              <div className="chat">
                <iframe
                  className="chat-frame"
                  name="myLandbot"
                  title="myLandbot"
                  src="https://landbot.io/u/H-212248-NH98O0N70W6P37X9/index.html"
                />
              </div>
            </div>
          </div>
        );
    }
}

export default Chat
