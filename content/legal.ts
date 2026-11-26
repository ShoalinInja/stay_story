// OWNER: A3 shell-navigation. DRAFT legal text for /privacy and /terms.
// Every block is needsReview: true. A lawyer must review and the owner must approve before launch.
// Facts are drawn from BRIEF §6 A7 (how enquiries are handled). No dates or company registration details are invented.

export interface LegalSection { heading: string; body: string[]; needsReview: true }
export interface LegalDoc { title: string; intro: string; sections: LegalSection[] }

const s = (heading: string, ...body: string[]): LegalSection => ({ heading, body, needsReview: true });

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  intro:
    "This policy explains what personal information Stay Story collects when you use this website or send us an enquiry, how we use it, and the choices you have.",
  sections: [
    s(
      "Information we collect",
      "When you send an enquiry or request a callback, we collect the details you enter, such as your name, phone number, email address, message, travel dates, number of guests and budget.",
      "We also record how you reached us, such as the page you enquired from, the referring website and campaign tags in the link (UTM parameters).",
      "To protect the enquiry form from abuse, we briefly process your IP address to limit repeated submissions.",
    ),
    s(
      "How we use it",
      "We use your information to respond to your enquiry, suggest stays and services, arrange what you book with us, and follow up about your request.",
      "We do not sell your personal information.",
    ),
    s(
      "Who we share it with",
      "To fulfil your request, we may share the relevant details with the property owners and service partners involved, for example a villa host, driver, chef or event vendor.",
      "Enquiries are delivered and stored using service providers that act on our behalf, such as email delivery, database hosting and spreadsheet tools. They may only use the data to provide those services to us.",
    ),
    s(
      "Cookies and analytics",
      "If analytics are enabled, we use tools such as Google Tag Manager and Google Analytics to understand how the site is used, including when an enquiry is submitted. These tools may set cookies.",
      "The site may store small preferences in your browser, such as a dismissed announcement.",
    ),
    s(
      "How long we keep it",
      "We keep enquiry details only for as long as needed to handle your request and our follow-up, and as required by law. We then delete or anonymise them.",
    ),
    s(
      "Your choices and rights",
      "You can ask us to access, correct or delete the personal information we hold about you, or to stop contacting you. Contact us using the details on our contact page.",
    ),
    s(
      "Contact",
      "For privacy questions, please reach us through the phone number or email address listed on our contact page.",
    ),
  ],
};

export const terms: LegalDoc = {
  title: "Terms of Use",
  intro:
    "These terms apply to your use of the Stay Story website. By using the site you agree to them.",
  sections: [
    s(
      "Enquiries, not bookings",
      "This website lets you send enquiries and request callbacks. Submitting a form does not create a booking or a contract. A booking is confirmed only when we confirm it to you directly, together with its price and terms.",
      "We do not take payments on this website.",
    ),
    s(
      "Prices and availability",
      "Prices, where shown, are indicative and may exclude taxes and add-ons. Availability and final prices are confirmed at the time of booking.",
    ),
    s(
      "Properties and partner services",
      "Many stays and services are provided by independent owners and partners. Their own terms, house rules and cancellation policies apply, and we will share them with you before you book.",
    ),
    s(
      "Content on this site",
      "We aim to keep descriptions, photos and details accurate, but they are for general information and may change. Photos may be representative.",
      "The text, design and images on this site belong to Stay Story or its licensors and may not be copied without permission.",
    ),
    s(
      "Acceptable use",
      "Please do not misuse the site, submit false or automated enquiries, or try to interfere with its operation.",
    ),
    s(
      "Liability",
      "To the extent permitted by law, Stay Story is not liable for indirect or consequential loss arising from use of this website.",
    ),
    s(
      "Governing law",
      "These terms are governed by the laws of India. Courts in Goa will have jurisdiction over any dispute.",
    ),
    s(
      "Contact",
      "Questions about these terms can be sent through the details on our contact page.",
    ),
  ],
};
