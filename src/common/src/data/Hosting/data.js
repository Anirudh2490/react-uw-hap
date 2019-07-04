// import {
//   IconOne,
//   IconTwo,
//   IconThree,
//   IconFour,
//   IconFive,
//   IconSix,
//   AuthorOne,
//   AuthorTwo,
//   AuthorThree
// } from "./images";

import Contentful from "../../../../component/ContentFul";

let FEATURES_DATA, SERVICES_DATA, FAQ_DATA;

let TESTIMONIALS = []

const contentful = new Contentful();

// const posts = [];

// contentful
//   .getPostfromContentful()
//   .then(response => {
//     response.items.map((element, index) => {
//       posts.push(element);
//     });
//   })
//   .then(() => {

// let ServicesData = posts[5];

// let FeatureData = posts[2];

// let TestimonialData = posts[6];

// let FAQData = posts[3];
// AboutUs - cw0D1SIOyaVxIcR1xXYPM //
// FAQ - 77src8z8GCAdsL48VsqBEl //
// Banner - 3VHcsy4GV7wpS3FFsHcVum
// Mission - 5yzRgQj6JNmTvbQHbTEhek
// Services - 5AvHwtNclSNaBXcyEonUqH
// For Vets - 5fH7UWzNqoAsmYWjv0IkYy
// Blog - 4z7oGGjQJRoLBuuOO4EI8v

// Testimonial
// 1. 1moz7Lh5pi8Hz2AH0tpv18
// 2. HueRzeMvF0MhmCOmMF4mg
// 3. 3V7MlNUOcgoPXjbBpFCELI
// 4. 4qYmaxLjU8EAagYdrhWey4

let ServicesData, FeatureData, TestimonialData, FAQData;

contentful
  .getSingleEnty("5yzRgQj6JNmTvbQHbTEhek")
  .then(response => {
    console.log(response);

    FeatureData = response;

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
  })
  .catch(rej => {
    console.log(rej);
  });

contentful
  .getSingleEnty("77src8z8GCAdsL48VsqBEl")
  .then(response => {
    FAQData = response;
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
  })
  .catch(rej => {
    console.log(rej);
  });

contentful
  .getSingleEnty("5AvHwtNclSNaBXcyEonUqH")
  .then(response => {
    ServicesData = response;
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
  })
  .catch(rej => {
    console.log(rej);
  });

// / Testimonial
// 1. 1moz7Lh5pi8Hz2AH0tpv18
// 2. HueRzeMvF0MhmCOmMF4mg
// 3. 3V7MlNUOcgoPXjbBpFCELI
// 4. 4qYmaxLjU8EAagYdrhWey4

contentful
  .getSingleEnty("1moz7Lh5pi8Hz2AH0tpv18")
  .then(response => {
    TestimonialData = response;
    TESTIMONIALS.push({
      review: TestimonialData.fields.guestName,
      name: TestimonialData.fields.guestReview,
      designation: TestimonialData.fields.typeOfPetOwner,
      avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
    });
    contentful
      .getSingleEnty("HueRzeMvF0MhmCOmMF4mg")
      .then(response => {
        TestimonialData = response;
        TESTIMONIALS.push({
          review: TestimonialData.fields.guestName,
          name: TestimonialData.fields.guestReview,
          designation: TestimonialData.fields.typeOfPetOwner,
          avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
        });
        contentful
          .getSingleEnty("3V7MlNUOcgoPXjbBpFCELI")
          .then(response => {
            TestimonialData = response;
            TESTIMONIALS.push({
              review: TestimonialData.fields.guestName,
              name: TestimonialData.fields.guestReview,
              designation: TestimonialData.fields.typeOfPetOwner,
              avatar: `${
                TestimonialData.fields.socialMediaLogo.fields.file.url
              }`
            });
            contentful
              .getSingleEnty("4qYmaxLjU8EAagYdrhWey4")
              .then(response => {
                TestimonialData = response;
                TESTIMONIALS.push({
                  review: TestimonialData.fields.guestName,
                  name: TestimonialData.fields.guestReview,
                  designation:TestimonialData.fields.typeOfPetOwner,
                  avatar: `${
                    TestimonialData.fields.socialMediaLogo.fields.file.url
                  }`
                });
              })
              .catch(rej => {
                console.log(rej);
              });
          })
          .catch(rej => {
            console.log(rej);
          });
      })
      .catch(rej => {
        console.log(rej);
      });
  })
  .catch(rej => {
    console.log(rej);
  });

// TestimonialData =
// TESTIMONIALS = [
//   {
//     review: TestimonialData.fields.guestName,
//     name: TestimonialData.fields.guestReview,
//     designation: TestimonialData.fields.socialMediaLogo.fields.title,
//     avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
//   },
//   {
//     review: TestimonialData.fields.guestName,
//     name: TestimonialData.fields.guestReview,
//     designation: TestimonialData.fields.socialMediaLogo.fields.title,
//     avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
//   },
//   {
//     review: TestimonialData.fields.guestName,
//     name: TestimonialData.fields.guestReview,
//     designation: TestimonialData.fields.socialMediaLogo.fields.title,
//     avatar: `${TestimonialData.fields.socialMediaLogo.fields.file.url}`
//   }
// ];

const MONTHLY_PRICING_TABLE = [
  {
    freePlan: true,
    name: "HUG A PET - Vet Connect",
    description:
      "Verbinden Sie Ihre Praxis mit uns und genießen Sie die Vorteile unseres Services",
    price: "",
    priceLabel: "TBA",
    buttonLabel: "Jetzt verbinden",
    url: "/sign-up",
    listItems: [
      {
        content: "Hausbesuche in Ihrer Umgebung"
      },
      {
        content: "Volle Organisation und Service"
      },
      {
        content: "Persönlicher Ansprechpartner"
      },
      {
        content: "Digitaler Assistent"
      },
      {
        content: "Freie Zeiteinteilung und volle Kontrolle"
      }
    ]
  },
  {
    name: "HUG A PET - Vet Flexi",
    description:
      "Werden Sie Tierarzt bei uns und entscheiden Sie wann und wieviel Sie arbeiten",
    price: "",
    priceLabel: "TBA",
    buttonLabel: "Anmelden",
    url: "/sign-in",
    listItems: [
      {
        content: "Freie Zeiteinteilung"
      },
      {
        content: "Überdurchschnittlicher Verdienst"
      },
      {
        content: "Digitaler Assistent inklusive"
      },
      {
        content: "Eigene app-basierte Praxis"
      },
      {
        content: "Community: Austausch- und Weiterbildungsmöglichkeiten"
      },
      {
        content: "Optional: Bequeme Patienten-Beratung von Zuhause per Video-Chat"
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
    label: "Hausbesuch anfordern",
    path: "#banner_section",
    offset: "40"
  },
  {
    label: "Services",
    path: "#service_section",
    offset: "40"
  },
  {
    label: "Vorteile",
    path: "#feature_section",
    offset: "40"
  },
  {
    label: "Kundenstimmen ",
    path: "#testimonial_section",
    offset: "70"
  },
  {
    label: "Häufig gestellte Fragen",
    path: "#faq_section",
    offset: "70"
  },
  {
    label: " Für Tierärzte ",
    path: "#",
    offset: "70"
  },
  {
    label: "Our Blog",
    path: "#blog_section",
    offset: "70"
  },
  {
    label: "Kontakt",
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
