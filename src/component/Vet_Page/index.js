import React, { Component } from "react";
import VetsSection from "../../common/src/containers/Hosting/Domain";
import PricingSection from "../../common/src/containers/Hosting/Pricing";
import { withContentFul } from "../ContentFul";

let VetsSectionData;

class VetPageBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isDataAvaliable: false
        };
      }
    
  componentWillMount() {
    this.props.contentful
      .getSingleEnty("5fH7UWzNqoAsmYWjv0IkYy")
      .then(response => {
        VetsSectionData = response;
      })
      .then(() => {
        this.setState({
          isDataAvaliable: true
        });
      })
      .catch(rej => {
        console.log(rej);
      });
  }

  render() {
      if (this.state.isDataAvaliable) {
        return (
            <div>
            <VetsSection data={VetsSectionData} />
            <PricingSection />
          </div>
        );
      } else {
        return null;
      }
  }
}

const VetPage = withContentFul(VetPageBase);

export default VetPage;
