import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";

class WizardBase extends React.Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues || {}
    };
  }

  componentDidMount() {
    console.log(this.props.firebase.auth.getUid());
    if (window.localStorage.getItem("dbDocID") === null) {
      this.props.history.push("/", {
        message: "Register for a vet a visit from here."
      });
    } else  {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          this.setState(
            {
              values: {
                email: doc.data().customerDetails.email,
                phone: doc.data().customerDetails.phone,
                name: doc.data().customerDetails.name,
                zipcode: doc.data().customerDetails.zipcode,
                session: doc.data().sessionDetails.session,
                uid: doc.data().customerDetails.uid
                // videoconsultation: doc.data().sessionDetails.videoconsultation
              }
            },
            () => {
              
              this.props.setService(doc.data().customerDetails.service);
              if (doc.data().sessionDetails.Date) {
                this.props.setDate(doc.data().sessionDetails.Date);
                this.props.setNum(doc.data().customerDetails.phone);
              }
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentWillReceiveProps(nextProps, previousProps) {
    var userDoc;
    if (this.props.firebase.auth.currentUser !== null) {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .where(
          "customerDetails.uid",
          "==",
          `${this.props.firebase.auth.currentUser.uid}`
        )
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.data().customerDetails.phone !== "") {
              userDoc = doc.data()
            }
           
          });
          this.props.firebase.fsdb
          .collection("form-inquiry")
          .doc(window.localStorage.getItem("dbDocID"))
          .update({
            "bookingStatus.phoneVerfication": true,
            "bookingStatus.status": "Confirmed",
            "customerDetails.uid": this.props.firebase.auth.currentUser.uid
          })
          .then(() => {
            this.setState(
              {
                values: {
                  email: userDoc.customerDetails.email,
                  name: userDoc.customerDetails.name,
                  zipcode: userDoc.customerDetails.zipcode,
                  uid: this.props.firebase.auth.currentUser.uid
                }
              },
              () => {
                console.log(userDoc.customerDetails.phone);
                
                this.props.setNum(userDoc.customerDetails.phone);
                this.props.setisLoading(false);
                this.props.setIsDisabled(true);
              }
            );
          });
        });
    } 
    console.log(nextProps);
    if (nextProps.withOutLogin === true) {
      console.log("without login");

      window.localStorage.setItem("contWithOutLogin", true);
      this.setState(
        {
          values: {}
        },
        () => {
          this.props.setwithOutLogin(false);
          this.setState(state => ({
            page: Math.min(state.page + 1, this.props.children.length - 1)
          }));
        }
      );
    }

    console.log(this.state.page);

    if (nextProps.resendOtp === true) {
      console.log("resend otp");
      const { number, token } = this.props;
      console.log(token, number);
      var twilioVerification = number.split(" ");
      fetch("https://hug-a-pet.herokuapp.com/verification/start/send-otp", {
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
          countryCode: twilioVerification[0],
          phoneNumber: twilioVerification[1] + twilioVerification[2]
        })
      }).then(res => {
          if (res.status === 400) {
          this.props.setresendOtp(false);
            alert("Invalid Number");
          } else {
            res.json().then(res => {
              console.log(res);
              window.localStorage.setItem("newUser", res);
              this.props.setresendOtp(false);
            });
          }
        });
    }
  }

  onSubmit = values => {
    console.log(values);
    const showAlert =
      this.props.dateAvail === false ||
      values["session"] === "" ||
      values === {} ||
      values.name === "" ||
      values.email === "";
    console.log(showAlert);

    if (showAlert) {
      alert("Please fill all fields");
    } else {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .update({
          "customerDetails.email": values["email"],
          "customerDetails.name": values["name"],
          "customerDetails.phone": `${this.props.number}`
        });
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .update({
          "sessionDetails.Date": `${this.props.date}`,
          "sessionDetails.session": `${values["session"]}`,
          "sessionDetails.videoconsultation": `${values["videoconsultation"]}`
        })
        .then(res => {
          console.log(this.state.values);

          this.props.history.push(
            `${this.props.match.url}/${this.state.values.zipcode}`,
            [{ prevData: this.state.values }]
          );
        })
        .catch(rej => {
          this.props.setdateAvail(false)
          console.log(rej);
          alert(rej);
        });
    }
  };

  next = values => {
    var uid;
    var userDoc;
    var docID;
    if (this.state.page === 1) {
      this.props.setCheckOtp(true);

      const { number } = this.props;
      var twilioVerification = number.split(" ");
      console.log(twilioVerification[1] + twilioVerification[2]);
      fetch("https://hug-a-pet.herokuapp.com/verification/start/verify-otp", {
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
          token: values.token,
          phoneNumber: twilioVerification[1] + twilioVerification[2]
        })
      }).then(res => {
        if (res.status === 400) {
          this.props.setCheckOtp(false);
          alert("Invalid Number, please confirm Number");
          this.setState(state => ({
            page: Math.max(state.page - 1, 0)
          }));
        } else {
          this.props.firebase
            .doSignInWithCustomToken(window.localStorage.getItem("newUser"))
            .then(authUser => {
              this.props.setCheckOtp(false);
              uid = authUser.user.uid;
              this.props.firebase.fsdb
                .collection("form-inquiry")
                .doc(window.localStorage.getItem("dbDocID"))
                .update({
                  "bookingStatus.phoneVerfication": true,
                  "bookingStatus.status": "Confirmed",
                  "customerDetails.uid": uid
                });
            })
            .then(() => {
              this.props.firebase.fsdb
                .collection("form-inquiry")
                .doc(window.localStorage.getItem("user"))
                .get()
                .then(doc => {
                  this.setState({
                    values: {
                      email: doc.data().customerDetails.email,
                      name: doc.data().customerDetails.name,
                      zipcode: doc.data().customerDetails.zipcode,
                      uid: uid
                    }
                  });
                });
            })
            .then(() => {
              this.setState(
                state => ({
                  page: Math.min(state.page + 1, this.props.children.length - 1)
                }),
                () => {
                  this.props.setCheckOtp(false);
                  this.props.setVisibilty(false);
                }
              );
            });
        }
      });
    } else {
      this.props.setisLoading(true);
      console.log("check Initiated");
      const { number } = this.props;

      if (!number) {
        this.props.setisLoading(false);
        alert("Please Enter phone number");
      }
      if (this.props.firebase.auth.currentUser !== null) {
        this.props.firebase.fsdb
          .collection("form-inquiry")
          .where("customerDetails.phone", "==", `${number}`)
          .where(
            "customerDetails.uid",
            "==",
            `${this.props.firebase.auth.currentUser.uid}`
          )
          .limit(1)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              this.props.setisLoading(false);
              alert(
                "This number is not associated with the logged in account."
              );
            } else {
              querySnapshot.forEach(doc => {
                userDoc = doc.data();
                this.props.firebase.fsdb
                  .collection("form-inquiry")
                  .doc(window.localStorage.getItem("dbDocID"))
                  .update({
                    "bookingStatus.phoneVerfication": true,
                    "bookingStatus.status": "Confirmed",
                    "customerDetails.uid": this.props.firebase.auth.currentUser
                      .uid
                  })
                  .then(() => {
                    this.setState(
                      {
                        values: {
                          email: userDoc.customerDetails.email,
                          name: userDoc.customerDetails.name,
                          zipcode: userDoc.customerDetails.zipcode,
                          uid: this.props.firebase.auth.currentUser.uid
                        }
                      },
                      () => {
                        this.props.setisLoading(false);
                        this.setState(state => ({
                          page: Math.min(
                            state.page + 2,
                            this.props.children.length - 1
                          )
                        }));
                      }
                    );
                  });
              });
            }
          });
      } else {
        const twilioVerification = number.split(" ");
        this.props.firebase.fsdb
          .collection("form-inquiry")
          .where("customerDetails.phone", "==", `${number}`)
          .limit(1)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              this.props.setisLoading(false);
              this.setState(state => ({
                page: Math.min(state.page + 2, this.props.children.length - 1),
                values
              }));
            } else {
              querySnapshot.forEach(doc => {
                console.log(doc.data());
                userDoc = doc.data();
                docID = doc.id;
                window.localStorage.setItem("user", doc.id);
                console.log(this.props.firebase.auth.currentUser);
              });
              if (this.props.firebase.auth.currentUser === null) {
                fetch(
                  "https://hug-a-pet.herokuapp.com/verification/start/send-otp",
                  {
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
                      countryCode: twilioVerification[0],
                      phoneNumber: twilioVerification[1] + twilioVerification[2]
                    })
                  }
                ).then(res => {
                  if (res.status === 400) {
                    this.props.setresendOtp(false);
                      alert("Invalid Number");
                    } else {
                      res.json().then(res => {
                        console.log(res);
                        window.localStorage.setItem("newUser", res);
                        this.props.setresendOtp(false);
                      })
                      .then(() => {
                        this.props.setisLoading(false);
                        this.props.setTimer(Date.now() + 30000);
                        // this.props.openModal();
                        this.setState(state => ({
                          page: Math.min(
                            state.page + 1,
                            this.props.children.length - 1
                          )
                        }));
                      });
                    }
                })
              }
            }
          });
      }
    }
  };

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 2, 0)
    }));

  /**
   * NOTE: Both validate and handleSubmit switching are implemented
   * here because 🏁 Redux Final Form does not accept changes to those
   * functions once the form has been defined.
   */

  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  handleSubmit = (e, values) => {
    e.preventDefault();
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) {
      return this.onSubmit(values);
    } else {
      this.next(values);
    }
  };

  render() {
    const { children } = this.props;
    console.log(this.props.date);
    
    
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    const isLastPage = page === React.Children.count(children) - 1;
    return (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => (
          <form className="wizard-form">
            {activePage}
            <div className="buttons">
              {page > 0 && (
                <button type="button" onClick={this.previous}>
                  « Previous
                </button>
              )}
              {!isLastPage && (
                <button
                  disabled={this.props.isLoading ? true : false}
                  onClick={e => this.handleSubmit(e, values)}
                  type="submit"
                >
                  Next »
                </button>
              )}
              {isLastPage && (
                <button
                  onClick={e => this.handleSubmit(e, values)}
                  type="submit"
                  disabled={submitting}
                >
                  Next »
                </button>
              )}
            </div>
          </form>
        )}
      </Form>
    );
  }
}

const Wizard = withRouter(WizardBase);

export default Wizard;
