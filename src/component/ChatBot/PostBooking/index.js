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
              <div className="content">
                <h4>Booking for *Petname* on the 12th of May, 2019</h4>
                <hr />
                <div style={{width: '100%', height: '400px', position: 'relative', overflow: 'hidden'}}>
                  <iframe name="myLandbot" width="50%" height="100%" frameBorder={2} src="https://landbot.io/u/H-212248-NH98O0N70W6P37X9/index.html" style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, border: 0}}>
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default Chat
