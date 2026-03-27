const Event = require("../models/event");

async function seedEvents() {
  const events = [
    // ── Past events (2023–2025) ──────────────────────────────────────────────
    {
      name: "Annual Charity Gala 2023",
      description:
        "Our flagship fundraising gala featuring live performances, a silent auction, and a three-course dinner. All proceeds support local shelter programs.",
      time: "2023-11-18T18:00",
      place: "Grand Ballroom, Marriott Downtown",
      pricePublic: "75",
      priceMember: "50",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event1.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Winter Food Drive 2023",
      description:
        "Help us collect non-perishable food items for families in need this holiday season. Volunteers will sort and pack donations at our distribution centre.",
      time: "2023-12-09T09:00",
      place: "Community Distribution Centre, Warehouse A",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event2.png",
      purchaseURL: "",
    },
    {
      name: "Volunteer Appreciation Night 2024",
      description:
        "An evening dedicated to honouring our incredible volunteers across all roles — Tea Area, Reception Table, Door Greeter, Back Stage, Comms, and Dinner teams. Dinner and awards included.",
      time: "2024-02-17T18:30",
      place: "The Loft Event Space",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event3.png",
      purchaseURL: "",
    },
    {
      name: "Spring Fundraiser Concert 2024",
      description:
        "An evening of live music performed by our talented Performer members. All ticket proceeds fund youth arts programs across the region.",
      time: "2024-04-13T19:30",
      place: "Heritage Auditorium, Main Stage",
      pricePublic: "30",
      priceMember: "20",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event4.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Members-Only AGM 2024",
      description:
        "Annual General Meeting for registered members. Review the 2023 financial report, elect new board members, and vote on key policy updates.",
      time: "2024-05-25T10:00",
      place: "Boardroom Suite, City Library",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: true,
      imageUrl: "/image/EventImage/event5.png",
      purchaseURL: "",
    },
    {
      name: "Community Health Fair 2024",
      description:
        "Free health screenings, wellness workshops, and resource booths for the community. Our volunteers staff each station to guide visitors throughout the day.",
      time: "2024-06-08T10:00",
      place: "Riverside Park Pavilion",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event6.png",
      purchaseURL: "",
    },
    {
      name: "Volunteer Orientation Workshop — Summer 2024",
      description:
        "Mandatory onboarding session for all new volunteers. Covers safety guidelines, volunteer role assignments, and event-day protocols for all positions.",
      time: "2024-07-20T10:00",
      place: "Community Centre, Room 4B",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event7.png",
      purchaseURL: "",
    },
    {
      name: "Back-to-School Supply Drive",
      description:
        "Donate and sort school supplies for underprivileged children returning to class. Volunteers needed for collection, sorting, and delivery to partner schools.",
      time: "2024-08-31T09:00",
      place: "Multiple Locations — City-Wide",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event8.png",
      purchaseURL: "",
    },
    {
      name: "Annual Charity Gala 2024",
      description:
        "Join us for our biggest fundraising night of the year. Featuring a live band, silent auction, gourmet dinner, and a special performance by our Performer members.",
      time: "2024-11-15T18:00",
      place: "Grand Ballroom, Marriott Downtown",
      pricePublic: "80",
      priceMember: "55",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event9.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Holiday Toy Drive 2024",
      description:
        "Bring a new, unwrapped toy to donate to children in hospital and shelter programs. Volunteer teams will wrap, sort, and deliver gifts before the holidays.",
      time: "2024-12-07T10:00",
      place: "Shopping Mall Atrium, Centre Court",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event10.png",
      purchaseURL: "",
    },
    {
      name: "Organizer Planning Retreat — Winter 2025",
      description:
        "Two-day retreat for Organizer members to map out the 2025 event calendar, assign committee leads, and align on communication strategies.",
      time: "2025-01-25T09:00",
      place: "Lakeview Retreat Centre, Muskoka",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: true,
      imageUrl: "/image/EventImage/event11.png",
      purchaseURL: "",
    },
    {
      name: "Volunteer Orientation Workshop — Spring 2025",
      description:
        "Onboarding session for volunteers joining the spring season. Role-specific breakout groups for Tea Area, Reception Table, Door Greeter, Back Stage, Comms, and Dinner teams.",
      time: "2025-02-08T10:00",
      place: "Community Centre, Room 4B",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event12.png",
      purchaseURL: "",
    },
    {
      name: "Members-Only Strategy Breakfast",
      description:
        "Exclusive morning session for registered members to review the 2025–2026 strategic plan, vote on new initiatives, and network with the executive committee.",
      time: "2025-06-14T08:30",
      place: "Boardroom Suite, City Library",
      pricePublic: "0",
      priceMember: "15",
      isMemberOnly: true,
      imageUrl: "/image/EventImage/event13.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Community Food Drive 2025",
      description:
        "Volunteers collect and sort non-perishable food donations at partner grocery stores across the city. No ticket required — show up at your assigned location.",
      time: "2025-09-27T09:00",
      place: "Multiple Locations — City-Wide",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event14.png",
      purchaseURL: "",
    },
    {
      name: "Performers Showcase Night 2025",
      description:
        "A celebration of artistic talent from our Performer members. Featuring dance, music, and spoken word acts. A portion of ticket sales goes to the artist development fund.",
      time: "2025-10-11T19:00",
      place: "Heritage Auditorium, Main Stage",
      pricePublic: "25",
      priceMember: "15",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event15.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },

    // ── Future events (2026–2027) ────────────────────────────────────────────
    {
      name: "New Year Charity Kickoff 2026",
      description:
        "Start the new year with purpose. An evening mixer for members, volunteers, and supporters to kick off 2026 fundraising goals with live entertainment and networking.",
      time: "2026-01-10T18:00",
      place: "The Atrium, Convention Centre",
      pricePublic: "20",
      priceMember: "10",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event16.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Volunteer Training Day — Spring 2026",
      description:
        "Full-day skills training for returning and new volunteers. Workshops on first aid, crowd management, accessibility support, and effective communication.",
      time: "2026-03-14T09:00",
      place: "Community Centre, Conference Hall",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event17.png",
      purchaseURL: "",
    },
    {
      name: "Spring Gala & Auction 2026",
      description:
        "An elegant spring evening featuring a live charity auction, cocktail reception, and performances by our Performer members. Proceeds fund our community outreach programs.",
      time: "2026-04-25T18:30",
      place: "Rooftop Garden, Sovereign Hotel",
      pricePublic: "65",
      priceMember: "45",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event18.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Members-Only Financial Review 2026",
      description:
        "Closed-door session for members to review mid-year financials, assess grant applications received, and vote on budget reallocations for Q3–Q4.",
      time: "2026-05-16T09:00",
      place: "Boardroom Suite, City Library",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: true,
      imageUrl: "/image/EventImage/event19.png",
      purchaseURL: "",
    },
    {
      name: "Community Clean-Up Day",
      description:
        "Join our volunteers for a city-wide clean-up in partnership with the municipality. Gloves, bags, and refreshments provided. Family-friendly event open to all.",
      time: "2026-06-06T08:00",
      place: "Multiple Parks — City-Wide",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event20.png",
      purchaseURL: "",
    },
    {
      name: "Organizer Leadership Retreat 2026",
      description:
        "Two-day retreat exclusively for Organizer members to plan the upcoming fall campaign season, review impact metrics, and build cross-team coordination skills.",
      time: "2026-07-18T09:00",
      place: "Lakeview Retreat Centre, Muskoka",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: true,
      imageUrl: "/image/EventImage/event21.png",
      purchaseURL: "",
    },
    {
      name: "Back-to-School Fundraiser 2026",
      description:
        "Dinner and raffle evening raising funds to provide school supplies and uniforms for low-income families. Local businesses donate raffle prizes.",
      time: "2026-08-22T10:00",
      place: "Community Hall, St. Andrew's Church",
      pricePublic: "35",
      priceMember: "20",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event22.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Performers Showcase Night 2026",
      description:
        "Our annual celebration of talent from across the Performer community. Diverse performances spanning classical music, contemporary dance, and theatre.",
      time: "2026-10-03T19:00",
      place: "Heritage Auditorium, Main Stage",
      pricePublic: "30",
      priceMember: "20",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event23.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Winter Charity Auction 2026",
      description:
        "Bid on donated artwork, travel packages, and exclusive experiences from local businesses. Both live and silent auction lots available. Cocktail reception included with entry.",
      time: "2026-12-05T17:00",
      place: "The Atrium, Convention Centre",
      pricePublic: "25",
      priceMember: "15",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event24.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Charity Fun Run 2027",
      description:
        "A 5 km community run/walk raising funds for mental health programs. All fitness levels welcome. Medals, refreshments, and live entertainment at the finish line.",
      time: "2027-02-13T08:00",
      place: "Riverside Park — Starting Line",
      pricePublic: "15",
      priceMember: "10",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event25.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Charity Gala 2027 — Preview Night",
      description:
        "Early-access preview for supporters and sponsors ahead of the main gala. Includes a sneak peek at the performer line-up, reception drinks, and sponsor recognition ceremony.",
      time: "2027-03-12T18:30",
      place: "Grand Ballroom, Marriott Downtown",
      pricePublic: "40",
      priceMember: "25",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event26.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Members-Only AGM 2027",
      description:
        "Annual General Meeting for registered members. Review the 2026 impact report, elect new board members, and vote on strategic priorities for 2027–2028.",
      time: "2027-04-17T10:00",
      place: "Boardroom Suite, City Library",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: true,
      imageUrl: "/image/EventImage/event27.png",
      purchaseURL: "",
    },
    {
      name: "Spring Concert & Fundraiser 2027",
      description:
        "A vibrant evening of musical performances and storytelling by our Performer members. Proceeds support the expansion of our youth mentorship program.",
      time: "2027-05-08T19:30",
      place: "Heritage Auditorium, Main Stage",
      pricePublic: "35",
      priceMember: "22",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event28.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
    {
      name: "Community Literacy Fair 2027",
      description:
        "A free public event promoting literacy with book donations, reading activities for children, and workshops for adult learners. Volunteers staff activity stations throughout the day.",
      time: "2027-09-20T10:00",
      place: "Public Library — Main Branch",
      pricePublic: "0",
      priceMember: "0",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event29.png",
      purchaseURL: "",
    },
    {
      name: "Holiday Gala 2027",
      description:
        "Close out the year with our grandest celebration yet. Live performances, a gourmet dinner, charity raffle, and a keynote from our outgoing board chair. Black tie optional.",
      time: "2027-12-11T18:00",
      place: "Grand Ballroom, Marriott Downtown",
      pricePublic: "90",
      priceMember: "60",
      isMemberOnly: false,
      imageUrl: "/image/EventImage/event30.png",
      purchaseURL: "https://www.eventbrite.ca/",
    },
  ];

  await Event.insertMany(events);
  console.log("Dummy events created successfully!");
}

module.exports = { seedEvents };
