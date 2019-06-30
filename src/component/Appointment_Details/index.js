import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import moment  from "moment";

const INITIAL_STATE = {
  vetName: "",
  appointdata: {},
  dataAvailable: false,
  error: ""
};

class AppointmentDetailsBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentWillMount() {
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(this.props.match.params.docid)
      .get()
      .then(doc => {
        const docData = doc.data();
       if (docData === undefined) {
        this.props.history.push('/admin')
       } else {
        this.setState(
          {
            appointdata: docData
          },
          () => {
            this.setState({
              dataAvailable: true
            });
          }
        );
       }
      })
      .catch((rej)=>{
          console.log(rej);
      })
  }


  vetAssignment = (event)=>{
    this.props.firebase.fsdb
    .collection("form-inquiry")
    .doc(this.props.match.params.docid)
    .update({
        "vetDetails.isVetAssigned": true,
        "vetDetails.vetName": this.state.vetName,
      })
    .then( res => {
        this.props.firebase.fsdb
    .collection("form-inquiry")
    .doc(this.props.match.params.docid)
    .onSnapshot(doc => {
        const docData = doc.data();
        this.setState(
          {
            appointdata: docData
          },
          () => {
            this.setState({
              dataAvailable: true
            });
          }
        );
      });
    })
    .catch( rej =>{
        console.log(rej);
    })
  }

  onChange = event =>{
      this.setState({
          [event.target.name]:event.target.value
      })
  }

  render() {
    const { appointdata } = this.state;
    console.log();
    
    if (this.state.dataAvailable){
      return (
        <div
          style={{
            margin: "100px auto 0 auto",
            width: "50%",
            textAlign: "center"
          }}
        >
          <div>
            <h1>Appointment Details</h1>
          </div>
          <div>
            <div>
              <h3>Customer Details</h3>
              <div style={{ textAlign: "left" }}>
                <p>Name: {appointdata.customerDetails.name}</p>
                <p>Email: {appointdata.customerDetails.email}</p>
                <p>Phone: {appointdata.customerDetails.phone}</p>
                <p>Zipcode: {appointdata.customerDetails.zipcode}</p>
              </div>
            </div>
            <div>
              <h3>Session Details</h3>
              <div style={{ textAlign: "left" }}>
                <p>Date: {moment(appointdata.sessionDetails.Date).format('DD/MM/YYYY')}</p>
                <p>Session:{appointdata.sessionDetails.session}</p>
                <p>
                 video Consultation {appointdata.customerDetails.videoconsultation ? "Yes" : ""}
                </p>
              </div>
            </div>
            <div>
              <h3>Pet Details</h3>
              <div style={{ textAlign: "left" }}>
                <p>Name: {appointdata.petDetails.petname}</p>
                <p>DOB: {moment(appointdata.petDetails.petdate).format('DD/MM/YYYY')}</p>
                <p>Gender: {appointdata.petDetails.gender}</p>
                <p>Notes: {appointdata.petDetails.notes}</p>
              </div>
            </div>
            <div>
              <h3>Vet Details</h3>
              <div style={{ textAlign: "left" }}>
                <p>Vet assigned: {appointdata.vetDetails.isVetAssigned? 'Assigned': 'Not Assigned'}</p>
                {appointdata.vetDetails.isVetAssigned? <p>Name: {appointdata.vetDetails.vetName}</p>: <p></p>}
              </div>
            </div>
            <div>
              <h3>Status</h3>
              <div style={{ textAlign: "left" }}>
                <p>Phone Number Status: {appointdata.bookingStatus.phoneVerfication? 'Verified': 'Not Verfied'}</p>
                <p>Status: {appointdata.bookingStatus.status}</p>
              </div>
            </div>
            <div>
              <h3>Assign Vet</h3>
              <div style={{ textAlign: "left" }}>
                <label>
                    <input type="text" name="vetName" value={this.state.vetName} onChange={this.onChange}/>
                    <button onClick={this.vetAssignment}>Assign</button>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
        return null
    }
  }
}

const AppointmentDetails = withRouter(withFirebase(AppointmentDetailsBase));

export default AppointmentDetails;
