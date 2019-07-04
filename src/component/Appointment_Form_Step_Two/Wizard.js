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
      docID: "",
      prevData: '',
    };
  }

  componentDidMount(){
    if (window.localStorage.getItem("dbDocID") === null ) {
      this.props.history.push('/', {
        message : "Register for a vet a visit from here."
      })
    }else{
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID")).get()
      .then((doc)=>{
        this.setState({
          values: {
            petname: doc.data().petDetails.petname, 
            type: doc.data().petDetails.type,
            gender: doc.data().petDetails.gender,
            notes: doc.data().petDetails.notes,
          }
        }, ()=>{
          if (doc.data().petDetails.Date) {
            this.props.setDate(doc.data().petDetails.petdate)
          }
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    }
  }

  next = values => {
    const showAlert = values["petname"] === undefined || values["type"] === undefined || values["gender"] === undefined || values["notes"] === "" ;    
    if (showAlert) {
      alert("Please fill all the fields")
    } else{
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID"))
      .update({
        "petDetails.petdate":  `${this.props.date}`,
        "petDetails.petname": `${values["petname"]}`,
        "petDetails.type": `${values["type"]}`,
        "petDetails.gender": `${values["gender"]}`,
        "petDetails.notes": `${values["notes"]}`,
        })
      .then(res => {
        // window.localStorage.removeItem("dbDocID");
        this.props.history.push(ROUTES.BOOKING_VERIFICATION);
      })
      .catch(rej => {
        console.log(rej);
        alert(rej);
      });
  }
}

  previous = (event,values) => {
    event.preventDefault();
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID"))
      .update({
        "petDetails.petdate":  `${this.props.date}`,
        "petDetails.petname": `${values["petname"]}`,
        "petDetails.type": `${values["type"]}`,
        "petDetails.gender": `${values["gender"]}`,
        "petDetails.notes": `${values["notes"]}`,
        })
      .then(res => {
        console.log(res);
      })
      .catch(rej => {
        console.log(rej);
        alert(rej);
      });
    this.props.history.goBack();
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
              <button type="button" onClick={e => this.previous(e,values)}>
                « Previous
              </button>
              <button
                type="submit"
                onClick={e => this.handleSubmit(e, values)}
                disabled={submitting}
              >
                Submit
              </button>
            </div>

            <pre>
              <p>Gender: {this.state.values.gender} </p>
              <p>Notes: {this.state.values.notes} </p>
              <p>Petname: {this.state.values.petname} </p>
              <p>Type: {this.state.values.type} </p>
            </pre>
          </form>
        )}
      </Form>
    );
  }
}

const Wizard = withRouter(WizardBase);

export default Wizard;
