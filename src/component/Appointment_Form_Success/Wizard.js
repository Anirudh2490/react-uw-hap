import React from "react"
import { Form } from "react-final-form"
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'

class WizardBase extends React.Component {
  static Page = ({ children }) => children

  componentDidMount(){
    setTimeout(()=>{
      this.props.history.push(ROUTES.BOOKING_VERIFICATION)
    },4000)
  }
  render() {
    return (
      <Form
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => (
          <form>
            {/* <div className="buttons"> */}
                {/* <button type="button" onClick={this.previous}> */}
                  {/* « Previous */}
                {/* </button> */}
                <button type="submit" disabled={submitting}>
                  Submit
                </button>
            {/* </div>  */}

            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
          </form>
        )}
      </Form>
    )
  }
}


const Wizard = withRouter(WizardBase);

export default Wizard;