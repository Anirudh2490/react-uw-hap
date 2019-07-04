import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
class WizardBase extends React.Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues || {},
      docID: ""
    };
  }

  componentDidMount(){
    if (window.localStorage.getItem("dbDocID") === null ) {
      this.props.history.push('/', {
        message : "Register for a vet a visit from here."
      })
    }
    // }else{
    // this.props.firebase.fsdb
    //   .collection("form-inquiry")
    //   .doc(window.localStorage.getItem("dbDocID")).get()
    //   .then((doc)=>{
    //     this.setState({
    //       values: {
    //         phone: doc.data().customerDetails.phone, 
    //       }
    //     })
    //   })
    //   .catch((error)=>{
    //     console.log(error);
    //   })
    // }
  }

  next = values => {
    alert('Booking Verfied')
    this.props.firebase.fsdb
    .collection("form-inquiry")
    .doc(window.localStorage.getItem("dbDocID"))
    .update({
      "bookingStatus.phoneVerfication": true,
       "bookingStatus.status": 'Confirmed',
    })
    .then( ()=> {
    this.props.history.push(`${ROUTES.BOOKING_VERIFICATION}/opt-successfully-verified`)
    })
    .catch(rej => {
      console.log(rej)
      alert(rej)
    })
  };

  previous = (event,values) => {
  }
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
    this.next(values);
  };

  render() {
    const { children } = this.props;
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    return (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => (
          <form>
            {activePage}
            <div className="buttons">
              <button
                type="submit"
                onClick={e => this.handleSubmit(e, values)}
                disabled={submitting}
              >
                Verify OTP
              </button>
            </div>

          </form>
        )}
      </Form>
    );
  }
}

const Wizard = withRouter(WizardBase);

export default Wizard;
