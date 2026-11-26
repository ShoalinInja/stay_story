// OWNER: A1 content-migrator. Source: /travel-services-goa.php, /airport-transfers-goa.php, /chauffeur-services-goa.php,
// /self-drive-cars-goa.php, /bike-rentals-goa.php. No vehicle models, airports or prices are named on the legacy site.
import type { ServiceCategory } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const travel: ServiceCategory = {
  key: "travel",
  slug: "travel",
  title: "Travel",
  tagline: "Transfers, chauffeurs, self-drive cars and bikes",
  cover: media("travel-services-cover"),
  intro:
    "Land, drive or ride. Stay Story arranges airport transfers, chauffeur-driven cars, self-drive rentals and bike hire across Goa, with well-maintained vehicles, professional drivers and clear pricing.",
  whyUs: [
    { title: "Well-maintained vehicles", body: "Every car and bike is regularly serviced and checked for safety and cleanliness." },
    { title: "Professional drivers", body: "Experienced, punctual drivers who know Goa's routes and traffic." },
    { title: "Transparent pricing", body: "Clear rates shared upfront, with no hidden charges." },
  ],
  faqs: [
    draft("What travel services do you offer in Goa?", "Airport transfers, chauffeur-driven cars, self-drive car rentals and scooter or motorbike hire."),
    draft("Are there hidden charges?", "No. Pricing is transparent and shared when you book."),
    draft("Can I rent a vehicle for a week or longer?", "Yes. Self-drive cars and bikes are available on daily, weekly and extended plans."),
    draft("How are the vehicles maintained?", "Vehicles are regularly serviced and inspected for safety, performance and cleanliness."),
    draft("Can I book a chauffeur for a full day?", "Yes. Chauffeur services can be booked for a few hours, a full day or several days."),
  ],
  seo: {
    title: "Travel in Goa: Airport Transfers, Chauffeurs, Car & Bike Rentals | Stay Story",
    description: "Airport transfers, chauffeur-driven cars, self-drive car rentals and bike hire across Goa, with maintained vehicles and transparent pricing.",
    keywords: ["travel services Goa", "car rental Goa", "airport transfer Goa", "bike rental Goa"],
  },
  items: [
    {
      slug: "airport-transfers",
      category: "travel",
      title: "Airport Transfers",
      legacyPath: "/airport-transfers-goa.php",
      hero: media("airport-transfers-cover"),
      summary:
        "Pre-booked pickups and drops between the airport and your villa, hotel or apartment, timed to your flight, with trained local drivers and clear pricing.",
      sections: [
        { heading: "Timed to your flight", icon: "plane-landing", body: "Drivers track your flight schedule, so pickups stay on time even when you land early or late." },
        { heading: "Vehicles for every group", icon: "car", body: "Clean, well-maintained vehicles suited to solo travellers, families and groups." },
        { heading: "Drivers who know Goa", icon: "map", body: "Trained, courteous drivers familiar with local routes and traffic, happy to share directions and travel tips." },
        { heading: "No haggling", icon: "badge-check", body: "Pre-booked transfers mean no hunting for taxis or negotiating fares, whether you are here on holiday or for work." },
        { heading: "Clear pricing, real support", icon: "receipt", body: "Transparent rates with no hidden charges, and a support team for bookings and special requests." },
      ],
      idealFor: ["Tourists", "Business travellers", "Families", "Groups", "Solo travellers"],
      faqs: [
        draft("What if my flight is delayed?", "Drivers track your flight schedule, so pickups adjust to delays or early arrivals."),
        draft("Do you offer drops to the airport too?", "Yes. Both pickups and drops are available."),
      ],
      related: ["chauffeur", "self-drive-cars", "bike-rentals"],
      seo: {
        title: "Airport Transfers in Goa | Pickup & Drop | Stay Story",
        description: "Pre-booked airport pickups and drops in Goa with flight tracking, trained drivers and transparent pricing. Book with Stay Story.",
        keywords: ["airport transfer Goa", "airport pickup Goa", "Goa airport taxi"],
      },
    },
    {
      slug: "chauffeur",
      category: "travel",
      title: "Chauffeur Services",
      legacyPath: "/chauffeur-services-goa.php",
      hero: media("chauffeur-services-cover"),
      summary:
        "Chauffeur-driven cars across Goa for sightseeing, meetings and occasions, booked for a few hours, a full day or several days, with professional drivers and premium vehicles.",
      sections: [
        { heading: "Professional chauffeurs", icon: "user-check", body: "Trained, punctual and courteous drivers who know Goa's roads, help with luggage and keep every journey comfortable." },
        { heading: "Premium vehicle options", icon: "car-front", body: "Well-maintained luxury and premium cars, from a sedan for business to a spacious vehicle for group outings." },
        { heading: "Business, leisure, events", icon: "briefcase", body: "Reliable for meetings and airport runs, relaxed for sightseeing, polished for weddings, parties and private events." },
        { heading: "Your schedule, your plan", icon: "clock", body: "Book for a few hours, a full day or several days; we manage the itinerary around you." },
        { heading: "Safety first", icon: "shield-check", body: "Regularly maintained vehicles, drivers who follow strict safety protocols, and transparent pricing." },
      ],
      idealFor: ["Business travellers", "Sightseeing", "Wedding guests", "Event transport"],
      faqs: [
        draft("How long can I book a chauffeur for?", "From a few hours to a full day or several days, with a custom travel plan."),
        draft("Can a chauffeur handle airport runs?", "Yes. Chauffeur services cover airport transfers as well as meetings and sightseeing."),
      ],
      related: ["airport-transfers", "self-drive-cars", "bike-rentals"],
      seo: {
        title: "Chauffeur Services in Goa | Car with Driver | Stay Story",
        description: "Hire a chauffeur-driven luxury or premium car in Goa for business, sightseeing or events, by the hour, day or several days.",
        keywords: ["chauffeur Goa", "car with driver Goa", "luxury car hire Goa"],
      },
    },
    {
      slug: "self-drive-cars",
      category: "travel",
      title: "Self-Drive Cars",
      legacyPath: "/self-drive-cars-goa.php",
      hero: media("self-drive-cars-cover"),
      summary:
        "Self-drive car rentals for exploring Goa on your own schedule: hatchbacks to SUVs, daily to extended plans, quick handover and minimal paperwork.",
      sections: [
        { heading: "Cars for every trip", icon: "car", body: "From compact hatchbacks for solo travellers and couples to spacious SUVs for families and groups, all regularly serviced." },
        { heading: "Go where you like", icon: "compass", body: "No fixed schedules or routes: beach-hop, take a countryside drive or head out for the night." },
        { heading: "Flexible plans", icon: "calendar-range", body: "Daily, weekly and extended rentals at competitive, transparent prices with no hidden costs." },
        { heading: "Quick, simple handover", icon: "key-round", body: "Minimal documentation, easy booking and fast vehicle handover, with support throughout your rental." },
        { heading: "Safe and reliable", icon: "shield-check", body: "Regular maintenance checks, essential safety features and a clean car every time." },
      ],
      idealFor: ["Couples", "Families", "Groups", "Independent explorers", "Extended stays"],
      faqs: [
        draft("What rental durations are available?", "Daily, weekly and extended rentals."),
        draft("How much paperwork is involved?", "Documentation is minimal; we confirm what is needed when you book."),
      ],
      related: ["bike-rentals", "chauffeur", "airport-transfers"],
      seo: {
        title: "Self-Drive Car Rental in Goa | Hatchbacks to SUVs | Stay Story",
        description: "Rent a self-drive car in Goa on daily, weekly or extended plans. Well-maintained hatchbacks and SUVs, minimal paperwork, no hidden costs.",
        keywords: ["self drive car Goa", "car rental Goa", "rent a car Goa"],
      },
    },
    {
      slug: "bike-rentals",
      category: "travel",
      title: "Bike Rentals",
      legacyPath: "/bike-rentals-goa.php",
      hero: media("bike-rentals-cover"),
      summary:
        "Scooters and motorbikes for getting around Goa like a local: budget-friendly daily to extended plans, quick pickup or delivery, and regularly serviced bikes.",
      sections: [
        { heading: "Scooters and motorbikes", icon: "bike", body: "Lightweight scooters for short hops and more powerful motorbikes for longer rides, all regularly serviced." },
        { heading: "Made for Goa's lanes", icon: "route", body: "Ideal for beaches, cafés and markets, and for narrow roads where parking is tight." },
        { heading: "Budget-friendly plans", icon: "wallet", body: "Daily, weekly and extended plans with transparent pricing and no hidden charges." },
        { heading: "Pickup or delivery", icon: "truck", body: "Simple booking, minimal paperwork and a smooth handover. Collect your bike or request delivery, subject to availability." },
        { heading: "Ride with confidence", icon: "shield-check", body: "Bikes are regularly inspected, and we share basic guidance for safe riding." },
      ],
      idealFor: ["Solo travellers", "Couples", "Daily errands", "Budget trips"],
      faqs: [
        draft("Can the bike be delivered to me?", "Delivery to your location can be requested, depending on availability."),
        draft("What rental plans are available?", "Daily, weekly and extended rental plans."),
      ],
      related: ["self-drive-cars", "airport-transfers", "chauffeur"],
      seo: {
        title: "Bike Rentals in Goa | Scooter & Motorbike Hire | Stay Story",
        description: "Affordable scooter and motorbike hire in Goa on daily, weekly or extended plans, with pickup or delivery and regularly serviced bikes.",
        keywords: ["bike rental Goa", "scooter rental Goa", "motorbike hire Goa"],
      },
    },
  ],
};
