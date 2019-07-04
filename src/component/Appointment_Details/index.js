import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import moment from "moment";
import ReactPhoneInput from "react-phone-input-2";

const INITIAL_STATE = {
  vetName: "",
  vetEmail: "",
  vetPhone: "",
  appointdata: {},
  dataAvailable: false,
  error: ""
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
          this.props.history.push("/admin");
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
      .catch(rej => {
        console.log(rej);
      });
  }

  vetAssignment = (e, event) => {
    var videoCode = makeid(5);
    e.preventDefault();
    console.log(event);
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(this.props.match.params.docid)
      .update({
        "vetDetails.isVetAssigned": true,
        "vetDetails.vetName": this.state.vetName
      })
      .then(res => {
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
      .then(() => {
        //APPI CALL FOR TWILIO MSG
        fetch("https://hug-a-pet.herokuapp.com/admin/messages", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          redirect: "follow",
          referrer: "no-referrer",
          body: JSON.stringify({
            to: event.phone,
            body:
              "Hi " +
              event.name +
              "! We have assigned " +
              event.vetName +
              "to your case, you can join a video session on " +
              event.date +
              " " +
              event.session +
              "on https://hugapet-de.firebaseapp.com/video-session using this code:" +
              videoCode
          })
        })
          .then(response => {
            console.log(response.json());
            //APPI CALL FOR TWILIO Email
            fetch("https://hug-a-pet.herokuapp.com/admin/mail", {
              method: "POST",
              mode: "cors",
              cache: "no-cache",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json"
              },
              redirect: "follow",
              referrer: "no-referrer",
              body: JSON.stringify({
                emailReceiver: event.email,
                emailSubject:
                  "Hi " + event.name + " We have assigned you a Vet!",
                emailContent:
                  "Hi " +
                  event.name +
                  "! We have assigned " +
                  event.vetName +
                  " to your case, you can join a video session on " +
                  event.date +
                  " " +
                  event.session +
                  " on https://hugapet-de.firebaseapp.com/video-session using this code:" +
                  videoCode
              })
            })
              .then(response => {
                fetch("https://hug-a-pet.herokuapp.com/vet/messages", {
                  method: "POST",
                  mode: "cors",
                  cache: "no-cache",
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  redirect: "follow",
                  referrer: "no-referrer",
                  body: JSON.stringify({
                    to: event.vetPhone,
                    body:
                      "Hi " +
                      event.vetName +
                      "! We have assigned " +
                      event.name +
                      "to your case, you can join a video session on " +
                      event.date +
                      " " +
                      event.session +
                      "on https://hugapet-de.firebaseapp.com/video-session using this code:" +
                      videoCode
                  })
                })
                  .then(res => {
                    fetch("https://hug-a-pet.herokuapp.com/vet/mail", {
                      method: "POST",
                      mode: "cors",
                      cache: "no-cache",
                      credentials: "same-origin",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      redirect: "follow",
                      referrer: "no-referrer",
                      body: JSON.stringify({
                        emailReceiver: event.vetEmail,
                        emailSubject:
                          "Hi " +
                          event.vetName +
                          " We have assigned you a case!",
                        emailContent:
                          "Hi " +
                          event.vetName +
                          "! We have assigned " +
                          event.name +
                          " to your case, you can join a video session on " +
                          event.date +
                          " " +
                          event.session +
                          " on https://hugapet-de.firebaseapp.com/video-session using this code:" +
                          videoCode
                      })
                    })
                      .then(res => {
                        console.log(res.json());
                      })
                      .catch(rej => {
                        console.log(rej);
                      });
                  })
                  .catch(rej => {
                    console.log(rej);
                  });
              })
              .catch(rej => {
                alert(rej.message);
              });
          })
          .catch(rej => {
            alert(rej.message);
          });
      })
      .catch(rej => {
        console.log(rej);
      });
  };

  onChangePhone = event => {
    this.setState({
      vetPhone: event
    });
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { appointdata } = this.state;
    if (this.state.dataAvailable) {
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
                <p>
                  Date:{" "}
                  {moment(appointdata.sessionDetails.Date).format("DD/MM/YYYY")}
                </p>
                <p>Session:{appointdata.sessionDetails.session}</p>
                <p>
                  video Consultation{" "}
                  {appointdata.customerDetails.videoconsultation ? "Yes" : ""}
                </p>
              </div>
            </div>
            <div>
              <h3>Pet Details</h3>
              <div style={{ textAlign: "left" }}>
                <p>Name: {appointdata.petDetails.petname}</p>
                <p>
                  DOB:{" "}
                  {moment(appointdata.petDetails.petdate).format("DD/MM/YYYY")}
                </p>
                <p>Gender: {appointdata.petDetails.gender}</p>
                <p>Notes: {appointdata.petDetails.notes}</p>
              </div>
            </div>
            <div>
              <h3>Vet Details</h3>
              <div style={{ textAlign: "left" }}>
                <p>
                  Vet assigned:{" "}
                  {appointdata.vetDetails.isVetAssigned
                    ? "Assigned"
                    : "Not Assigned"}
                </p>
                {appointdata.vetDetails.isVetAssigned ? (
                  <p>Name: {appointdata.vetDetails.vetName}</p>
                ) : (
                  <p />
                )}
              </div>
            </div>
            <div>
              <h3>Status</h3>
              <div style={{ textAlign: "left" }}>
                <p>
                  Phone Number Status:{" "}
                  {appointdata.bookingStatus.phoneVerfication
                    ? "Verified"
                    : "Not Verfied"}
                </p>
                <p>Status: {appointdata.bookingStatus.status}</p>
              </div>
            </div>
            <div>
              <h3>Assign Vet</h3>
              <div style={{ textAlign: "left" }}>
                <form
                  onSubmit={e =>
                    this.vetAssignment(e, {
                      vetPhone: this.state.vetPhone,
                      vetEmail: this.state.vetEmail,
                      name: appointdata.customerDetails.name,
                      vetName: this.state.vetName,
                      date: moment(appointdata.sessionDetails.Date).format(
                        "DD/MM/YYYY"
                      ),
                      session: appointdata.sessionDetails.session,
                      phone: appointdata.customerDetails.phone,
                      email: appointdata.customerDetails.email
                    })
                  }
                >
                  <div>
                    <label>
                      <p>Full Name</p>
                      <input
                        type="text"
                        name="vetName"
                        required
                        value={this.state.vetName}
                        onChange={this.onChange}
                      />
                    </label>
                  </div>
                  <br />
                  <div>
                    <label>
                      <p>Email</p>
                      <input
                        type="email"
                        name="vetEmail"
                        required
                        value={this.state.vetEmail}
                        onChange={this.onChange}
                      />
                    </label>
                  </div>
                  <br />
                  <div>
                    <label>
                      <p>Phone</p>
                      <ReactPhoneInput
                        defaultCountry="de"
                        required
                        value={this.state.vetPhone}
                        onChange={this.onChangePhone}
                      />
                    </label>
                  </div>
                  <br />
                  <div>
                    <button>Assign</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const AppointmentDetails = withRouter(withFirebase(AppointmentDetailsBase));

export default AppointmentDetails;
