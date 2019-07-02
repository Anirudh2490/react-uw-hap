import React , { Fragment , Component }from "react";
import FeatureSection from "../../common/src/containers/Hosting/Features";
import InfoSection from "../../common/src/containers/Hosting/Info";
import VetsSection from "../../common/src/containers/Hosting/Domain";
import BlogSection from "../../common/src/containers/Hosting/Payment";
import AboutTeam from "../../common/src/containers/Hosting/Guarantee";
import ServicesSection from "../../common/src/containers/Hosting/Services";
import BannerSection from "../../common/src/containers/Hosting/Banner";
import PricingSection from "../../common/src/containers/Hosting/Pricing";
import TestimonialSection from "../../common/src/containers/Hosting/Testimonials";
import ContactSection from "../../common/src/containers/Hosting/Contact";
import FaqSection from "../../common/src/containers/Hosting/Faq";
import { withContentFul } from "../ContentFul";

let BannerData, ServicesData, FeatureData, AboutTeamData, TestimonialData, FAQData, BlogData, VetsSectionData, ContactData;

class LandingBase extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isDataAvaliable: false
     }
  }

  componentWillMount(){
    this.props.contentful.getPostfromContentful()
    .then((response)=>{
      const posts = [];
      response.items.forEach(element => {
          posts.push(element)
      });
      return posts
    })
    .then((posts)=>{
      this.setState({
        posts
      }, ()=>{
        this.setState({
          isDataAvaliable: true,
        })

    BannerData = this.state.posts[1];

    // ServicesData = this.state.posts[5];

    // FeatureData = this.state.posts[2]; 

    // TestimonialData = this.state.posts[6]; 

    // FAQData = this.state.posts[3];

    BlogData = this.state.posts[0]; 
    
    VetsSectionData = this.state.posts[4];
      })
    })
  }

  render() { 
    console.log(this.state);
    
    if (this.state.isDataAvaliable) {
      return ( 
        <Fragment>
        <BannerSection data={BannerData} />
        <ServicesSection />
        <FeatureSection />
        <AboutTeam />
        <TestimonialSection  />  
        <FaqSection  />
        <BlogSection  data={BlogData}/> 
        <VetsSection data={VetsSectionData} />
        <PricingSection />
        <InfoSection />
        <ContactSection/>
      </Fragment>
       );
    } else {
      return null
    }
    
  }
}
 
const Landing = withContentFul(LandingBase)


export default Landing;
