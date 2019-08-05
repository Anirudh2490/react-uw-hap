import React from "react";
import { Route } from "react-router-dom";
import * as ROUTE from "../../constants/routes";
import WizardForm from "../Appointment_Form_Step_One/WizardForm";
import WizardForm2 from "../Appointment_Form_Step_Two/WizardForm";
import ScrollToTop from "react-router-scroll-top";

const BookAnAppointment = props => {
  return (
    <div>
      <ScrollToTop>
        <Route
          exact
          path={`${ROUTE.BOOK_AN_APPOINTMENT}/:service`}
          component={WizardForm}
        />
        <Route
          exact
          path={`${ROUTE.BOOK_AN_APPOINTMENT}/:service/:zipcode`}
          component={WizardForm2}
        />
      </ScrollToTop>
    </div>
  );
};

export default BookAnAppointment;
