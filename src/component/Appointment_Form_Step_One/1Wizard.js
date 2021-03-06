import React from "react"
import { Form } from "react-final-form"
import { withRouter } from "react-router-dom";

class WizardBase extends React.Component {
  static Page = ({ children }) => children

  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      values: props.initialValues || {},
      docID: "",
    }
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
           email: doc.data().customerDetails.email, 
           phone: doc.data().customerDetails.phone, 
           name: doc.data().customerDetails.name,
           session: doc.data().sessionDetails.session,
           videoconsultation: doc.data().sessionDetails.videoconsultation,
          }
        }, ()=>{
          if (doc.data().sessionDetails.Date) {
            this.props.setDate(doc.data().sessionDetails.Date)
            this.props.setNum(doc.data().customerDetails.phone)
          }
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    }
  }

  next = values => {
    console.log(values, this.props.number);

    
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
            "countryCode": "+49",
            "phoneNumber": "17658156209"
         })
        })
    
    // let userRef = this.props.firebase.fsdb.collection('users')

    const showAlert = values["email"] === undefined || this.props.number === "" || values["session"] === undefined || values["videoconsultation"] === "" ;
    if (showAlert) {
      alert('Please fill all fields')
    } else {
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID"))
      .update({
        "customerDetails.email": values["email"],
        "customerDetails.name": values["name"],
        "customerDetails.phone":`${this.props.number}` ,
      })
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID"))
      .update({
        "sessionDetails.Date": `${this.props.date}`,
         "sessionDetails.session": `${values["session"]}`,
        "sessionDetails.videoconsultation": `${values["videoconsultation"]}`,
      })
      .then(res => {
        this.props.history.push(`${this.props.match.url}/${values["zipcode"]}`, [{prevData: this.state.values}])
      })
      .catch(rej => {
        console.log(rej)
        alert(rej)
      })
  }
}
  previous = () => this.props.history.goBack();

 
  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  handleSubmit = (e, values) => {
    e.preventDefault()
    this.next(values)
  }

  render() {
    const { children } = this.props
    const { page, values } = this.state
    const activePage = React.Children.toArray(children)[page]
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
                onClick={e => {
                  this.handleSubmit(e, values)
                }}
              >
                Next »
              </button>
            </div>
                  {/* <h4>Form Summary</h4> */}
            {/* <pre>
              <p>Email: {this.state.values.email} </p>
              <p>Session: {this.state.values.session} </p>
              <p>Videoconsultation: {this.state.values.videoconsultation} </p>
              <p>Zipcode: {this.state.values.zipcode} </p>
            </pre> */}
          </form>
        )}
      </Form>
    )
  }
}

const Wizard = withRouter(WizardBase)

export default Wizard
