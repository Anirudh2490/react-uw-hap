import {
  IconOne,
  IconTwo,
  IconThree,
  IconFour,
  IconFive,
  IconSix,
  AuthorOne,
  AuthorTwo,
  AuthorThree
} from "./images";

import Contentful from "../../../../component/ContentFul";

let FEATURES_DATA,
  TESTIMONIALS,
  SERVICES_DATA,
  FAQ_DATA;

const contentful = new Contentful();

const posts = [];

contentful
  .getPostfromContentful()
  .then(response => {
    response.items.map((element, index) => {
      posts.push(element);
    });
  })
  .then(() => {

    let ServicesData = posts[5];
    
    let FeatureData = posts[2];

    let TestimonialData = posts[6];

    let FAQData = posts[3];

    // Why Us Section Content
    FEATURES_DATA = [
      {
        title: FeatureData.fields.title1,
        description: FeatureData.fields.summary1,
        icon: "flaticon-trophy violate",
        animation: true
      },
      {
        title: FeatureData.fields.title2,
        description: FeatureData.fields.summary2,
        icon: "flaticon-startup yellow",
        animation: true
      },
      {
        title: FeatureData.fields.title3,
        description: FeatureData.fields.summary3,
        icon: "flaticon-creative green",
        animation: true
      }
    ];

    // FAQ Section Content
    FAQ_DATA = [
      {
        expend: true,
        title: FAQData.fields.q1,
        description: FAQData.fields.a1
      },
      {
        title: FAQData.fields.q2,
        description: FAQData.fields.a2
      },
      {
        title: FAQData.fields.q3,
        description: FAQData.fields.a3
      },
      {
        title: FAQData.fields.q4,
        description: FAQData.fields.a4
      }
    ];

    // Service Section Content
    SERVICES_DATA = [
      {
        title: `${ServicesData.fields.h1text1}`,
        description: `${ServicesData.fields.paratext1}`,
        icon: `${ServicesData.fields.logo1.fields.file.url}`
      },
      {
        title: `${ServicesData.fields.h1text2}`,
        description: `${ServicesData.fields.paratext2}`,
        icon: `${ServicesData.fields.logo2.fields.file.url}`
      },
      {
        title: `${ServicesData.fields.h1text3}`,
        description: `${ServicesData.fields.paratext3}`,
        icon: `${ServicesData.fields.logo3.fields.file.url}`
      },
      {
        title: `${ServicesData.fields.h1text4}`,
        description: `${ServicesData.fields.paratext4}`,
        icon: `${ServicesData.fields.logo4.fields.file.url}`
      },
      {
        title: `${ServicesData.fields.h1text5}`,
        description: `${ServicesData.fields.paratext5}`,
        icon: `${ServicesData.fields.logo5.fields.file.url}`
      },
      {
        title: `${ServicesData.fields.h1text6}`,
        description: `${ServicesData.fields.paratext6}`,
        icon: `${ServicesData.fields.logo6.fields.file.url}`
      }
    ];

   

    TESTIMONIALS = [
      {
        review: TestimonialData.fields.guestName,
        name: TestimonialData.fields.guestReview,
        designation: TestimonialData.fields.socialMediaLogo.fields.title,
        avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
      },
      {
        review: TestimonialData.fields.guestName,
        name: TestimonialData.fields.guestReview,
        designation: TestimonialData.fields.socialMediaLogo.fields.title,
        avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
      },
      {
        review: TestimonialData.fields.guestName,
        name: TestimonialData.fields.guestReview,
        designation: TestimonialData.fields.socialMediaLogo.fields.title,
        avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
      }
    ];
  })
  .catch(rej => {
    console.log(rej);
  });

 const MONTHLY_PRICING_TABLE = [
    {
      freePlan: true,
      name: "Clinics Starter Pack",
      description:
        "Digital customer support and reservation management assistance for clinics",
      price: "€59",
      priceLabel: "Per Month",
      buttonLabel: "SIGN UP",
      url: "#",
      listItems: [
        {
          content: "Online Bookings"
        },
        {
          content: "Calendar Management"
        },
        {
          content: "Appointment optimization"
        },
        {
          content: "Customer Data Management"
        },
        {
          content: "GDPR Compliant"
        }
      ]
    },
    {
      name: "Freelance Vets",
      description:
        "Work exclusively with Hug A Pet, and earn as per your schedule!",
      price: "€399",
      priceLabel: "Per Month, €2000 guaranteed income p.m.",
      buttonLabel: "SIGN UP",
      url: "#",
      listItems: [
        {
          content: "Guaranteed Income of €2000 per month"
        },
        {
          content: "Schedule based on your availability"
        },
        {
          content: "App-based Business"
        },
        {
          content: "Consult customers from home over video"
        },
        {
          content: "Access to invoicing and payment tools"
        }
      ]
    },
    {
      name: "Premium Partner Pack",
      description:
        "For larger clinics or group of clinics that handle both mobile vet bookings and normal bookings",
      price: "On Enquiry",
      priceLabel: "Per month & subscription yearly",
      buttonLabel: "SIGN UP",
      url: "#",
      listItems: [
        {
          content: "Drag & Drop Builder"
        },
        {
          content: "1,000s of Templates Ready"
        },
        {
          content: "Blog Tools"
        },
        {
          content: "eCommerce Store "
        },
        {
          content: "30+ Webmaster Tools"
        }
      ]
    }
  ];

 const YEARLY_PRICING_TABLE = [
    {
      freePlan: true,
      name: "Clinics starter pack",
      description:
        "Digital customer support and reservation management assistance for clinics",
      price: "$49",
      priceLabel: "Yearly",
      buttonLabel: "SIGN UP",
      url: "#",
      listItems: [
        {
          content: "Online Bookings"
        },
        {
          content: "Calendar Management"
        },
        {
          content: "Appointment optimization"
        },
        {
          content: "Customer Data Management"
        },
        {
          content: "GDPR Compliant"
        }
      ]
    },
    {
      name: "Freelance Vet",
      description:
        "Work exclusively with Hug A Pet, and earn as per your schedule!",
      price: "€399.00",
      priceLabel: "Per month / subscription yearly €36000 minimum revenue",
      buttonLabel: "SIGN UP",
      url: "#",
      listItems: [
        {
          content: "Guaranteed Income of €3000 per month"
        },
        {
          content: "Schedule based on your availability"
        },
        {
          content: "App-based Business"
        },
        {
          content: "Consult customers from home over video"
        },
        {
          content: "Access to invoicing and payment tools"
        }
      ]
    },
    {
      name: "Premium Partner Pack",
      description:
        "For clinics looking for digital customer support and reservation management assistance",
      price: "INQUIRE NOW",
      priceLabel: "Per month & subscription yearly",
      buttonLabel: "START FREE TRIAL",
      url: "#",
      listItems: [
        {
          content: "Drag & Drop Builder"
        },
        {
          content: "3,000s of Templates Ready"
        },
        {
          content: "Advanced branding"
        },
        {
          content: "Knowledge base support"
        },
        {
          content: "80+ Webmaster Tools"
        }
      ]
    }
  ];

const DOMAIN_NAMES = [
    {
      label: "General Checkup",
      value: "general-Checkup"
    },
    {
      label: "Castration",
      value: "castration"
    },
    {
      label: "Vaccination",
      value: "vaccination"
    },
    {
      label: "Euthenesia",
      value: "euthenesia"
    },
    {
      label: "General Information",
      value: "general-information"
    },
    {
      label: "Other",
      value: "other"
    }
  ];



const MENU_ITEMS = [
  {
    label: "Book an Appointment",
    path: "#banner_section",
    offset: "40"
  },
  {
    label: "Why Us",
    path: "#feature_section",
    offset: "40"
  },
  {
    label: "Our Services",
    path: "#service_section",
    offset: "40"
  },
  {
    label: "Testimonial",
    path: "#testimonial_section",
    offset: "70"
  },
  {
    label: "FAQ",
    path: "#faq_section",
    offset: "70"
  },
  {
    label: "For Vets",
    path: "#",
    offset: "70"
  },
  {
    label: "Contact",
    path: "#contact_section",
    offset: "70"
  }
];

const DOMAIN_PRICE = [
  {
    content: "12 vets in Kreutzberg"
  },
  {
    content: "15 vets in Mitte"
  },
  {
    content: "9 vets in Charlottenburg"
  },
  {
    content: "11 vets in Freidrichshain"
  },
  {
    content: "& much more",
    url: "#"
  }
];

const FOOTER_WIDGET = [
  {
    title: "About Us",
    menuItems: [
      {
        url: "#",
        text: "Customer Support"
      },
      {
        url: "#",
        text: "About Us"
      },
      {
        url: "#",
        text: "Copyright"
      }
    ]
  },
  {
    title: "Our Information",
    menuItems: [
      {
        url: "#",
        text: "Privacy Policy"
      },
      {
        url: "#",
        text: "Terms & Conditions"
      },
      {
        url: "#",
        text: "Site Map"
      },
      {
        url: "#",
        text: "Operational Hours"
      }
    ]
  },
  {
    title: "My Account",
    menuItems: [
      {
        url: "#",
        text: "Press inquiries"
      },
      {
        url: "#",
        text: "Social media directories"
      },
      {
        url: "#",
        text: "Images & B-roll"
      }
    ]
  },
  {
    title: "Policy",
    menuItems: [
      {
        url: "#",
        text: "Application security"
      },
      {
        url: "#",
        text: "Software principles"
      },
      {
        url: "#",
        text: "Unwanted software policy"
      },
      {
        url: "#",
        text: "Responsible supply chain"
      }
    ]
  }
];

export {
  FEATURES_DATA,
  DOMAIN_NAMES,
  DOMAIN_PRICE,
  TESTIMONIALS,
  YEARLY_PRICING_TABLE,
  MONTHLY_PRICING_TABLE,
  FOOTER_WIDGET,
  MENU_ITEMS,
  SERVICES_DATA,
  FAQ_DATA
};
