import React, { useState, Fragment } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/dist/style.css";
import { withFirebase } from "../Firebase";
import Modal from "react-awesome-modal";
import * as ROUTES from "../../constants/routes";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";

import "./styles.css";
import { VetBlock } from "../Vet_Block";

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
    age: "0 to 1.5"
  },
  {
    age: "1.5 to 6"
  },
  {
    age: "older than 6"
  }
];

const WizardFormBase = props => {
  const [emailError, setEmailError] = useState("");
  const [docID, setdocID] = useState("");
  const [date, setDate] = useState(new Date());
  const [petage, setPetAge] = useState("");
  const [styleID, setStyleID] = useState("");
  const [selectedPet, setPet] = useState("");
  const [selectedPetID, setSelectedPetID] = useState("");
  const [addNewPetEvent, triggerAddNewPetEvent] = useState("");
  const [clientName, setClientName] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [visible, setVisibilty] = useState("");
  const [number, setNumber] = useState("");
  const [validNum, setvalidNum] = useState(false);
  

  function openModal() {
    setVisibilty(true);
  }

  function submitNumber() {
    setvalidNum(true)
    setVisibilty(false);
  }

  
  function closeModal() {
    setVisibilty(false);
  }

  function updateNumber(e) {
    setNumber(e);
  }

  function dateUpdate(event) {
    setDate(event);
  }

  function petAgeUpdate(event, id) {
    setPetAge(event);
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
    <div id="wizard-step-two">
      <Styles>
        <div>
          <h1>We are pleased to meet you {clientName}</h1>
        </div>
        <h2>Step 3 of 4</h2>
        <Modal
          visible={visible}
          width="400"
          height="300"
          effect="fadeInUp"
          onClickAway={() => closeModal()}
        >
          <h4>The Number that you entered is invalid</h4>
          <label>Please enter valid number to proceed</label>
          <div style={{ margin: "25px 10px" }}>
            <ReactPhoneInput
              defaultCountry="de"
              value={number}
              inputExtraProps={{
                name: "phone",
                required: true,
                autoFocus: true
              }}
              onChange={updateNumber}
            />
          </div>
          <a onClick={() => submitNumber()}>Update</a>
        </Modal>
        <Wizard
          // initialValues={{ employed: true, stooge: "larry", date: new Date() }}
          firebase={props.firebase}
          date={date}
          petage={petage}
          selectedPet={selectedPet}
          setPet={setPet}
          addNewPetEvent={addNewPetEvent}
          setPetAge={setPetAge}
          validNum={validNum}
          closeModal={closeModal}
          openModal={openModal}
          setStyleID={setStyleID}
          setClientName={setClientName}
          triggerAddNewPetEvent={triggerAddNewPetEvent}
          setSelectedPetID={setSelectedPetID}
          selectedPetID={selectedPetID}
          validNum={validNum}
          setvalidNum={setvalidNum}
          isLoading={isLoading}
          setisLoading={setisLoading}
          number={number}
          emailPrompt={errorHandler}
          setdocID={setdocID}
          setNum={setNumber}
          setDate={setDate}
          // onSubmit={onSubmit}
        >
          <Wizard.Page>
            <h1 style={{ color: "white" }}>Select from old Pets</h1>
            {selectedPet ? (
              <div>
                <ul>
                  {selectedPet &&
                    selectedPet.map(doc => {
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
            {isLoading ? (
              <div style={{ height: "200px" }}>
                <div style={{ display: "inline-block", margin: "auto" }}>
                  <div className="loader" />
                  <div>
                    <p>Almost Done</p>
                  </div>
                </div>
              </div>
            ) : (
              <Fragment>
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
                  <div className="options-container">
                    <ul className="options-list">
                      {petAge &&
                        petAge.map((item, id) => {
                          return (
                            <li
                              id={id}
                              style={petage === item.age ? onSelectStyle : null}
                              onClick={() => petAgeUpdate(item.age, id)}
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
                  </div>
                  <Error name="email" />
                </div>
                <div>
                  <label>Type</label>
                  <Field name="type" component="select">
                    <option>Choose Animal</option>
                    <option value="dog">Dog</option>
                    <option value="cat">🍄 Cat</option>
                    <option value="rabbit">🧀 Rabbit</option>
                    <option value="bird">🐓 Bird</option>
                    <option value="other">🍍 Other</option>
                  </Field>
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
              </Fragment>
            )}
          </Wizard.Page>
        </Wizard>
        <VetBlock />
      </Styles>
    </div>
  );
};
const WizardForm2 = withFirebase(WizardFormBase);

export default WizardForm2;
