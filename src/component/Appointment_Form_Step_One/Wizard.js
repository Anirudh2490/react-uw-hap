import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
import { sendOtp, verifyOtp } from "../../services/otp";

class WizardBase extends React.Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues || {},
      setNumber: true,
    };
  }

  componentWillMount() {
    if (window.localStorage.getItem("dbDocID") === null) {
      this.props.history.push("/");
    } else {
      if (this.props.location.state !== undefined) {
        this.setState({
          page: this.props.location.state[0].pageNumber || 0
        });
      }
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
                address: doc.data().customerDetails.address,
                session: doc.data().sessionDetails.session,
                uid: doc.data().customerDetails.uid
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
    if (this.state.setNumber) {
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
              userDoc = doc.data();
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
                 setNumber: false,
                },
                () => {
              this.props.setNum(userDoc.customerDetails.phone);
              this.props.setisLoading(false);
              this.props.setIsDisabled(true);
                })
            });
        });
    }

    }

    if (nextProps.withOutLogin === true) {
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

    if (nextProps.resendOtp === true) {
      this.props.setresendOtp(false);
      const { number } = this.props;
      sendOtp(number)
      .then(res => {
          window.localStorage.setItem("newUser", res.data);
      })
      .catch((rej)=>{
        console.log(rej);
      })
    }
  }

  onSubmit = values => {
    if (values.email === undefined || values.email === "") {
      this.props.setEmailError({
        emailError: true
      });
    } else if (values.name === undefined || values.name === "") {
      this.props.setNameError({
        nameError: true
      });
    } else if (values.session === undefined || values.session === "") {
      this.props.setSessionError({
        sessionError: true
      });
    } else {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .update({
          "customerDetails.email": values["email"],
          "customerDetails.name": values["name"],
          "customerDetails.phone": `${this.props.number}`,
          "sessionDetails.Date": `${this.props.date}`,
          "sessionDetails.session": `${values["session"]}`,
        })
        .then(res => {
          this.props.history.push(
            `${this.props.match.url}/berlin`
          );
        })
        .catch(rej => {
          this.props.setdateAvail(false);
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
      verifyOtp(number, values.token)
      .then(res => {
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
                }
              );
            });
      })
      .catch(()=>{
          this.props.setCheckOtp(false);
          alert("Invalid Code");
      })
    } else {
      this.props.setisLoading(true);
      const { number } = this.props;
      if (!number) {
        this.props.setisLoading(false);
        alert("Please Enter phone number");
      }else if (this.props.firebase.auth.currentUser !== null) {
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
                        this.setState(state => ({
                          page: Math.min(
                            state.page + 2,
                            this.props.children.length - 1
                          )
                        }));
                        this.props.setisLoading(false);
                      }
                    );
                  });
              });
            }
          });
      } else {
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
                userDoc = doc.data();
                docID = doc.id;
                window.localStorage.setItem("user", doc.id);
              });
              if (this.props.firebase.auth.currentUser === null) {
                sendOtp(number)
                  .then(res => {
                      window.localStorage.setItem("newUser", res.data);
                    })
                  .then(() => {
                    this.props.setTimer(Date.now() + 30000);
                    this.props.setisLoading(false);
                    this.setState(state => ({
                      page: Math.min(
                        state.page + 1,
                        this.props.children.length - 1
                      )
                    }));
                  })
                  .catch((rej)=>{
                      alert("Invalid Number");
                      this.props.setNum("");
                      this.props.setisLoading(false);
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

  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  handleSubmit = (e, values) => {
    e.preventDefault();
    const { children } = this.props;
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
          <form
            onSubmit={e => this.handleSubmit(e, values)}
            className="wizard-form"
          >
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
                  type="submit"
                >
                  Next »
                </button>
              )}
              {isLastPage && (
                <button type="submit" disabled={submitting}>
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
