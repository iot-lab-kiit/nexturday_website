interface EventData {
  title: string;
  date: string;
  time: string;
  venue: string;
  about: string;
  language: string[];
  duration: string;
  organizer: string;
  website: string;
  email: string;
  address: string;
  guidelines: string[];
  registrationFee: string;
}

export const eventData: EventData = {
  title: "Innovance 3.0",
  date: "Sun, 15 Dec, 2024",
  time: "10 AM onwards",
  venue: "Campus 6 Auditorium",
  about:
    "After two game-changing events, Innovance is back—bigger, bolder, and more groundbreaking! Our previous Innovance events set the bar high, with none other than Striver (Raj Vikramaditya) headlining Innovance 2.0. Innovance 3.0 is here to raise it even higher, bringing top-notch insights, hands-on projects, and career-shaping strategies—courtesy of IoT Lab, KIIT. Network with like-minded peers, learn from industry experts, gain hands-on experience, and boost your career prospects!",
  language: ["Hindi", "English"],
  duration: "6 hours",
  organizer: "IoT Lab",
  website: "innovance.iotkit.in",
  email: "iot.lab@kiit.ac.in",
  address:
    "Campus 6 Auditorium, Campus 15 Rd, Chandaka Industrial Estate, KIIT University, Patia, Bhubaneswar, Odisha, 751024",
  guidelines: [
    "Carry your college ID card for verification.",
    "Entry is restricted to registered participants and authorized personnel.",
    "Respect the event timings; late entries may not be entertained.",
    "Pre-registration is mandatory; on-spot registration depends on availability.",
    "Provide accurate details during registration.",
    "Registration fees (if applicable) are non-refundable.",
    "Maintain decorum and discipline throughout the event.",
    "Avoid any disruptive behavior or misconduct.",
    "Follow instructions from event coordinators and volunteers.",
    "Adhere to the schedule provided by the organizers.",
  ],
  registrationFee: "₹200",
};

export const branches = [
  { value: "CSE", label: "CSE" },
  { value: "IT", label: "IT" },
  { value: "CSSE", label: "CSSE" },
  { value: "CSCE", label: "CSCE" },
  { value: "ECE", label: "ECE" },
  { value: "ECS", label: "ECS" },
  { value: "EEE", label: "EEE" },
  { value: "ME", label: "ME" },
  { value: "CIVIL", label: "Civil" },
];

export const years = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];
