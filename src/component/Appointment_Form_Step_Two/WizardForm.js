// import React, { useState, Fragment } from "react";
// import Styles from "./Styles";
// import { Field } from "react-final-form-html5-validation";
// import Wizard from "./Wizard";
// import ReactPhoneInput from "react-phone-input-2";
// import "react-phone-input-2/dist/style.css";
// import { withFirebase } from "../Firebase";
// import Modal from "react-awesome-modal";
// import * as ROUTES from "../../constants/routes";

// import "./styles.css";
// import { VetBlock } from "../Vet_Block";

// const onSelectStyle = {
//   backgroundColor: "#ff6767"
// };

// const petAge = [
//   {
//     age: "0 to 1.5"
//   },
//   {
//     age: "1.5 to 6"
//   },
//   {
//     age: "older than 6"
//   }
// ];

// const WizardFormBase = props => {
//   const [emailError, setEmailError] = useState("");
//   const [docID, setdocID] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [petage, setPetAge] = useState("");
//   const [styleID, setStyleID] = useState("");
//   const [selectedPet, setPet] = useState("");
//   const [selectedPetID, setSelectedPetID] = useState("");
//   const [addNewPetEvent, triggerAddNewPetEvent] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [isLoading, setisLoading] = useState(false);
//   const [visible, setVisibilty] = useState("");
//   const [number, setNumber] = useState("");
//   const [validNum, setvalidNum] = useState(false);

//   function openModal() {
//     setVisibilty(true);
//   }

//   function submitNumber() {
//     setvalidNum(true);
//     setVisibilty(false);
//   }

//   function closeModal() {
//     setVisibilty(false);
//   }

//   function updateNumber(e) {
//     setNumber(e);
//   }

//   function dateUpdate(event) {
//     setDate(event);
//   }

//   function petAgeUpdate(event, id) {
//     setPetAge(event);
//     setStyleID(id);
//   }

//   function addNewPet(event) {
//     triggerAddNewPetEvent(event);
//   }

//   // function petAgeUpdate(event) {
//   //   console.log(event);
//   //   // setPet(event.target.value)
//   // }

//   function petSelectionChanged(event) {
//     console.log(event);

//     setSelectedPetID(event);
//   }

//   function errorHandler() {
//     setEmailError(
//       <p>
//         Email already exists please <a href={ROUTES.SIGNIN}>signin</a>
//       </p>
//     );
//   }
//   return (
//     <div id="wizard-step-two">
//       <Styles>
//         <div>
//           <h1>We are pleased to meet you {clientName}</h1>
//         </div>
//         <h2>Step 3 of 4</h2>
//         <Modal
//           visible={visible}
//           width="400"
//           height="300"
//           effect="fadeInUp"
//           onClickAway={() => closeModal()}
//         >
//           <h4>The Number that you entered is invalid</h4>
//           <label>Please enter valid number to proceed</label>
//           <div style={{ margin: "25px 10px" }}>
//             <ReactPhoneInput
//               defaultCountry="de"
//               value={number}
//               inputExtraProps={{
//                 name: "phone",
//                 required: true,
//                 autoFocus: true
//               }}
//               onChange={updateNumber}
//             />
//           </div>
//           <a onClick={() => submitNumber()}>Update</a>
//         </Modal>
//         <Wizard
//           // initialValues={{ employed: true, stooge: "larry", date: new Date() }}
//           firebase={props.firebase}
//           date={date}
//           petage={petage}
//           selectedPet={selectedPet}
//           setPet={setPet}
//           addNewPetEvent={addNewPetEvent}
//           setPetAge={setPetAge}
//           validNum={validNum}
//           closeModal={closeModal}
//           openModal={openModal}
//           setStyleID={setStyleID}
//           setClientName={setClientName}
//           triggerAddNewPetEvent={triggerAddNewPetEvent}
//           setSelectedPetID={setSelectedPetID}
//           selectedPetID={selectedPetID}
//           validNum={validNum}
//           setvalidNum={setvalidNum}
//           isLoading={isLoading}
//           setisLoading={setisLoading}
//           number={number}
//           emailPrompt={errorHandler}
//           setdocID={setdocID}
//           setNum={setNumber}
//           setDate={setDate}
//           // onSubmit={onSubmit}
//         >
//           <Wizard.Page>
//             <h1 style={{ color: "white" }}>Select from old Pets</h1>
//             {selectedPet ? (
//               <div>
//                 <ul>
//                   {selectedPet &&
//                     selectedPet.map(doc => {
//                       if (doc.petDoc.petname !== "") {
//                         return (
//                           <li
//                             id={doc.petId}
//                             style={
//                               selectedPetID === doc.petId ? onSelectStyle : null
//                             }
//                             onClick={() => {
//                               petSelectionChanged(doc.petId);
//                             }}
//                             className="options-list-item"
//                           >
//                             <label>
//                               <div className="item-container">
//                                 <p>{doc.petDoc.petname}</p>
//                               </div>
//                             </label>
//                           </li>
//                         );
//                       }
//                     })}
//                   <li
//                     className="options-list-item"
//                     onClick={() => addNewPet(true)}
//                   >
//                     <label>
//                       <div className="item-container">
//                         <p>Add a new Pet</p>
//                       </div>
//                     </label>
//                   </li>
//                 </ul>
//               </div>
//             ) : null}
//           </Wizard.Page>
//           <Wizard.Page>
//             {isLoading ? (
//               <div style={{ height: "200px" }}>
//                 <div style={{ display: "inline-block", margin: "auto" }}>
//                   <div className="loader" />
//                   <div>
//                     <p>Almost Done</p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <Fragment>
//                 <div>
//                   <label>Name of Pet</label>
//                   <Field
//                     name="petname"
//                     component="input"
//                     type="text"
//                     placeholder="Tom"
//                     // validate={required}
//                   />
//                 </div>
//                 <div>
//                   <label>How old is your pet?</label>
//                   <div className="options-container">
//                     <ul className="options-list">
//                       {petAge &&
//                         petAge.map((item, id) => {
//                           return (
//                             <li
//                               id={id}
//                               style={petage === item.age ? onSelectStyle : null}
//                               onClick={() => petAgeUpdate(item.age, id)}
//                               className="options-list-item"
//                             >
//                               <label>
//                                 <div className="item-container">
//                                   <p>{item.age}</p>
//                                 </div>
//                               </label>
//                             </li>
//                           );
//                         })}
//                     </ul>
//                   </div>
//                 </div>
//                 <div>
//                   <label>Type</label>
//                   <Field name="type" component="select">
//                     <option>Choose Animal</option>
//                     <option value="dog">Dog</option>
//                     <option value="cat">🍄 Cat</option>
//                     <option value="rabbit">🧀 Rabbit</option>
//                     <option value="bird">🐓 Bird</option>
//                     <option value="other">🍍 Other</option>
//                   </Field>
//                 </div>
//                 <div>
//                   <label>Gender</label>
//                   <Field name="gender" component="select">
//                     <option>Choose time</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </Field>
//                 </div>
//                 <div>
//                   <label>
//                     Tell us more about your pet. Her breed, health issues etc.
//                   </label>
//                   <Field
//                     name="notes"
//                     type="text"
//                     placeholder="My dog is a Golden retriever..."
//                     component="input"
//                   />
//                 </div>
//               </Fragment>
//             )}
//           </Wizard.Page>
//         </Wizard>
//         <VetBlock />
//       </Styles>
//     </div>
//   );
// };
// const WizardForm2 = withFirebase(WizardFormBase);

// export default WizardForm2;

import React, { useState, Fragment } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form-html5-validation";
import Wizard from "./Wizard";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/dist/style.css";
import { withFirebase } from "../Firebase";
import Modal from "react-awesome-modal";
import * as ROUTES from "../../constants/routes";

import "./styles.css";
import { VetBlock } from "../Vet_Block";

const onSelectStyle = {
  backgroundColor: "#ff6767"
};

const petage = [
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

const INITIAL_STATE = {
  docID: "",
  date: "",
  styleID: "",
  selectedPet: "",
  selectedPetID: "",
  addNewPetEvent: "",
  clientName: "",
  isLoading: "",
  petNameError: "",
  petAgeError: "",
  typeError: "",
  genderError: "",
  notesError: "",
  visible: "",
  number: "",
  validNum: ""
};

class WizardFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  setPet = e => {
    this.setState({
      selectedPet: e
    });
  };

  setPetNameError = e => {
    this.setState({
      petNameError: e
    });
  };

  setPetAgeError = e => {
    console.log("uPDATE age");

    this.setState({
      petAgeError: e
    });
  };

  setTypeError = e => {
    this.setState({
      typeError: e
    });
  };

  setGenderError = e => {
    this.setState({
      genderError: e
    });
  };

  setNotesError = e => {
    this.setState({
      notesError: e
    });
  };

  setClientName = e => {
    this.setState({
      clientName: e
    });
  };

  setVisibilty = e => {
    this.setState({
      visible: e
    });
  };

  openModal = e => {
    this.setVisibilty(e);
  };

  setvalidNum = e => {
    this.setState({
      validNum: e
    });
  };

  submitNumber = () => {
    this.setvalidNum(true);
    this.setVisibilty(false);
  };

  closeModal = e => {
    this.setVisibilty(e);
  };

  setNumber = e => {
    this.setState({
      number: e
    });
  };

  updateNumber = e => {
    this.setNumber(e);
  };

  setDate = e => {
    this.setState({
      date: e
    });
  };

  dateUpdate = event => {
    this.setDate(event);
  };

  petAgeUpdate = (event, id) => {
    this.setPetAge(event);
    this.setStyleID(id);
  };

  setStyleID = e => {
    this.setState({
      styleID: e
    });
  };

  setPetAge = e => {
    this.setState({
      petage: e
    });
  };

  setisLoading = e => {
    this.setState({
      isLoading: e
    });
  };

  triggerAddNewPetEvent = e => {
    this.setState({
      addNewPetEvent: e
    });
  };

  addNewPet = event => {
    this.triggerAddNewPetEvent(event);
  };

  setSelectedPetID = e => {
    this.setState({
      selectedPetID: e
    });
  };

  petSelectionChanged = event => {
    this.setSelectedPetID(event);
  };

  render() {
    console.log(this.state);

    return (
      <div id="wizard-step-two">
        <Styles>
          <div>
            <h1>We are pleased to meet you {this.state.clientName}</h1>
          </div>
          <h2>Step 3 of 4</h2>
          <Modal
            visible={this.state.visible}
            width="400"
            height="300"
            effect="fadeInUp"
            onClickAway={e => this.closeModal(e)}
          >
            <h4>The Number that you entered is invalid</h4>
            <label>Please enter valid number to proceed</label>
            <div style={{ margin: "25px 10px" }}>
              <ReactPhoneInput
                defaultCountry="de"
                value={this.state.number}
                inputExtraProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true
                }}
                onChange={this.updateNumber}
              />
            </div>
            <a onClick={() => this.submitNumber()}>Update</a>
          </Modal>
          <Wizard
            // initialValues={{ employed: true, stooge: "larry", date: new Date() }}
            firebase={this.props.firebase}
            date={this.state.date}
            petage={this.state.petage}
            selectedPet={this.state.selectedPet}
            setPet={this.setPet}
            addNewPetEvent={this.state.addNewPetEvent}
            setPetAge={this.setPetAge}
            validNum={this.state.validNum}
            closeModal={this.closeModal}
            setPetAgeError={this.setPetAgeError}
            setPetNameError={this.setPetNameError}
            setTypeError={this.setTypeError}
            openModal={this.openModal}
            setStyleID={this.setStyleID}
            setGenderError={this.setGenderError}
            setClientName={this.setClientName}
            triggerAddNewPetEvent={this.triggerAddNewPetEvent}
            setSelectedPetID={this.setSelectedPetID}
            selectedPetID={this.state.selectedPetID}
            validNum={this.state.validNum}
            setvalidNum={this.setvalidNum}
            isLoading={this.state.isLoading}
            setNotesError={this.setNotesError}
            setisLoading={this.setisLoading}
            number={this.state.number}
            setdocID={this.setdocID}
            setNum={this.setNumber}
            setDate={this.setDate}
            // onSubmit={onSubmit}
          >
            <Wizard.Page>
              <h1 style={{ color: "white" }}>Select from old Pets</h1>
              {this.state.selectedPet ? (
                <div>
                  <ul>
                    {this.state.selectedPet &&
                      this.state.selectedPet.map(doc => {
                        if (doc.petDoc.petname !== "") {
                          return (
                            <li
                              id={doc.petId}
                              style={
                                this.state.selectedPetID === doc.petId
                                  ? onSelectStyle
                                  : null
                              }
                              onClick={() => {
                                this.petSelectionChanged(doc.petId);
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
                      onClick={() => this.addNewPet(true)}
                    >
                      <label>
                        <div className="item-container">
                          <p>Add a new Pet</p>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              ) : null}
            </Wizard.Page>
            <Wizard.Page>
              {this.state.isLoading ? (
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
                      onFocus={() => this.setPetNameError(false)}
                      placeholder="Tom"
                      // validate={required}
                    />
                    {this.state.petNameError ? <p>Required</p> : null}
                  </div>
                  <div>
                    <label>How old is your pet?</label>
                    <div className="options-container">
                      <ul
                        className="options-list"
                      >
                        {petage.map((item, id) => {
                          return (
                            <li
                              id={id}
                              style={
                                this.state.petage === item.age
                                  ? onSelectStyle
                                  : null
                              }
                              onClick={() => {
                                this.petAgeUpdate(item.age, id)
                                this.setPetAgeError(false)
                              }}
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
                    {this.state.petAgeError ? <p>Required</p> : null}
                  </div>
                  <div>
                    <label>Type</label>
                    <Field
                      name="type"
                      onFocus={() => this.setTypeError(false)}
                      component="select"
                    >
                      <option value="">Choose Animal</option>
                      <option value="dog">Dog</option>
                      <option value="cat">🍄 Cat</option>
                      <option value="rabbit">🧀 Rabbit</option>
                      <option value="bird">🐓 Bird</option>
                      <option value="other">🍍 Other</option>
                    </Field>
                    {this.state.typeError ? <p>Required</p> : null}
                  </div>
                  <div>
                    <label>Gender</label>
                    <Field
                      name="gender"
                      onFocus={() => this.setGenderError(false)}
                      component="select"
                    >
                      <option value="">Choose time</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Field>
                    {this.state.genderError ? <p>Required</p> : null}
                  </div>
                  <div>
                    <label>
                      Tell us more about your pet. Her breed, health issues etc.
                    </label>
                    <Field
                      name="notes"
                      type="text"
                      onFocus={() => this.setNotesError(false)}
                      placeholder="My dog is a Golden retriever..."
                      component="input"
                    />
                    {this.state.notesError ? <p>Required</p> : null}
                  </div>
                </Fragment>
              )}
            </Wizard.Page>
          </Wizard>
          <VetBlock />
        </Styles>
      </div>
    );
  }
}
const WizardForm2 = withFirebase(WizardFormBase);

export default WizardForm2;
