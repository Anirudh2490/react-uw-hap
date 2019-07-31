import React, { useState } from "react";
import Stepper from "react-stepper-horizontal";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
// import Slider from "rc-slider";
// // import Tooltip from "rc-tooltip";
// import "rc-slider/assets/index.css";
// import "rc-tooltip/assets/bootstrap.css";
import { Slider } from '../../elements/Slider';
import * as ROUTES from "../../constants/routes";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";

import "./styles.css";
import { VetBlock } from "../Vet_Block";

// const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider);

const Error = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
);

const required = value => (value ? undefined : "Required");

const onSelectStyle = {
  backgroundColor: "#ff6767"
};

const petAge = [
  {
    age: "DOG"
  },
  {
    age: "CAT"
  },
  {
    age: "RABBIT"
  },
  {
    age: "BIRD"
  },
  {
    age: "OTHER"
  }
];

const WizardFormBase = props => {
  const [emailError, setEmailError] = useState("");
  const [docID, setdocID] = useState("");
  const [date, setDate] = useState(new Date());
  const [petage, setPetAge] = useState("");
  const [petType, setPetType] = useState("");
  const [styleID, setStyleID] = useState("");
  const [selectedPet, setPet] = useState("");
  const [selectedPetID, setSelectedPetID] = useState("");
  const [addNewPetEvent, triggerAddNewPetEvent] = useState("");
  const [clientName, setClientName] = useState("");

  function dateUpdate(event) {
    setDate(event);
  }

  function petAgeUpdate(event, id) {
    setPetAge(event);
    setStyleID(id);
  }
  
  function petTypeUpdate(event, id) {
    console.log(selectedPet);
    setPetType(event);
    setStyleID(id);
  }

  function addNewPet(event) {
    triggerAddNewPetEvent(event);
  }

  // function petAgeUpdate(event) {
  //   console.log(event);
  //   // setPet(event.target.value)
  // }

  function petSelectionChanged(event) {
    console.log(event);

    setSelectedPetID(event);
  }

  function errorHandler() {
    setEmailError(
      <p>
        Email already exists please <a href={ROUTES.SIGNIN}>signin</a>
      </p>
    );
  }
  return (
    <Styles>
      <div className="stepper">
        <Stepper
          steps={[
            { title: "CUSTOMER DETAILS" },
            { title: "PET INFO" },
            { title: "CONFIRM BOOKING" }
          ]}
          activeStep={1}
        />
      </div>
      <div>
        <h1>We are pleased to meet you {clientName}</h1>
      </div>
      <Wizard
        // initialValues={{ employed: true, stooge: "larry", date: new Date() }}
        firebase={props.firebase}
        date={date}
        petage={petage}
        selectedPet={selectedPet}
        setPet={setPet}
        addNewPetEvent={addNewPetEvent}
        setPetAge={setPetAge}
        setStyleID={setStyleID}
        setClientName={setClientName}
        triggerAddNewPetEvent={triggerAddNewPetEvent}
        setSelectedPetID={setSelectedPetID}
        selectedPetID={selectedPetID}
        emailPrompt={errorHandler}
        setdocID={setdocID}
        setDate={setDate}
        // onSubmit={onSubmit}
      >
        <Wizard.Page>
          <h2 style={{ color: "white" }}>Select from old Pets</h2>
          {selectedPet ? (
            <div>
              <ul>
                {selectedPet &&
                  selectedPet.map(doc => {
                    console.log(doc);

                    if (doc.petDoc.petname !== "") {
                      return (
                        <li
                          id={doc.petId}
                          style={
                            selectedPetID === doc.petId ? onSelectStyle : null
                          }
                          onClick={() => {
                            petSelectionChanged(doc.petId);
                          }}
                          className="options-list-item"
                        >
                          <label>
                            <div className="item-container">
                              <p>{doc.petDoc.petname}</p>
                            </div>
                          </label>
                        </li>
                      );
                    }
                  })}
                <li
                  className="options-list-item"
                  onClick={() => addNewPet(true)}
                >
                  <label>
                    <div className="item-container">
                      <p>Add a new Pet</p>
                    </div>
                  </label>
                </li>
              </ul>
              <Error name="session" />
            </div>
          ) : null}
        </Wizard.Page>
        <Wizard.Page
          validate={values => {
            const errors = {};
            if (!values.type) {
              errors.type = "Required";
            }
            if (!values.gender) {
              errors.gender = "Required";
            }
            if (!values.petdate) {
              errors.age = "Required";
            }
            return errors;
          }}
        >
          <div>
            <label>Name of Pet</label>
            <Field
              name="petname"
              component="input"
              type="text"
              placeholder="Tom"
              validate={required}
            />
          </div>
          <div>
            <label>How old is your pet?</label>
            <Slider
              min={0}
              max={20}
              defaultValue={3}
              marks={{ 0: 0, 5: 5, 10: 10, 15: 15, 20: "20+" }}
            />
            <Error name="email" />
          </div>
          <div>
            <label>Type</label>
            <ul className="options-list">
              {petAge &&
                petAge.map((item, id) => {
                  return (
                    <li
                      id={id}
                      style={petType === item.age ? onSelectStyle : null}
                      onClick={() => petTypeUpdate(item.age, id)}
                      className="options-list-item"
                    >
                      <label>
                        <div className="item-container">
                          <p>{item.age}</p>
                        </div>
                      </label>
                    </li>
                  );
                })}
            </ul>
            <Error name="type" />
          </div>
          <div>
            <label>Gender</label>
            <Field name="gender" component="select">
              <option>Choose time</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Field>
            <Error name="gender" />
          </div>
          <label>
            Tell us more about your pet. Her breed, health issues etc.
          </label>
          <div>
            <Field
              name="notes"
              type="text"
              placeholder="My dog is a Golden retriever..."
              component="input"
            />
          </div>
        </Wizard.Page>
      </Wizard>
      <VetBlock />
    </Styles>
  );
};
const WizardForm2 = withFirebase(WizardFormBase);

export default WizardForm2;
