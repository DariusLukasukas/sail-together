import type { Job } from "@/types/job";

export const JOBS: Job[] = [
  {
    id: "1",
    isFavorite: false,
    title: "Engineer",
    type: "Permanent",
    date: "1st Dec 2025",
    vessel: "38m Motor Yacht",
    location: {
      name: "Caribbean",
      address: "Port of Saint Martin",
      coordinates: { longitude: -63.0822, latitude: 18.0708 },
    },
    meta: {
      description:
        "We are looking for an engineer to join a 38m M/Y. Vessel will be crossing from Caribbean to Mediterranean for season early December. Joining a team of 2 rotational chief engineers and a permanent 2nd engineer. The role will require work on deck during guest trips and mooring operation. This works out to be approx. 80/20 Engine Room/Deck. Responsible for maintaining and repairing the yacht's mechanical and electrical systems.",
      requirements: [
        "Proven experience as a marine engineer.",
        "Knowledge of mechanical and electrical systems.",
        "Ability to troubleshoot and repair equipment.",
      ],
      experience: ["Minimum 3 years of experience as a marine engineer."],
      qualifications: [
        "STCW 95 (STCW 2010)",
        "ENG1 (Medical Certificate)",
        "MCA Approved Engine Course (AEC 1 & 2) Certificate",
        "GMDSS Certification",
        "Relevant maritime visas.",
      ],
    },
  },
  {
    id: "2",
    isFavorite: false,
    title: "Chief Steward(ess)",
    type: "Permanent",
    date: "15th Nov 2025",
    vessel: "52m Motor Yacht",
    location: {
      name: "U.S. Virgin Islands",
      address: "Charlotte Amalie Harbor, St. Thomas",
      coordinates: { longitude: -64.9312, latitude: 18.3381 },
    },
    meta: {
      description:
        "Great opportunity for a chief stewardess on a newbuild 52m private motor yacht. Candidate must be professional, well organised and demonstrate good leadership skills. The candidate will be expected to manage all areas of the interior department and liaise with the owners private chef when required. During the 3 month trial period candidate will work 2-4 weeks at owners winter villa to join his permanent team to get to know the owner and his family and vice versa.",
      requirements: [
        "Responsible for providing excellent service to guests and maintaining the interior of the yacht.",
        "Previous experience in a similar role.",
        "Excellent communication and interpersonal skills.",
        "Ability to multitask and work under pressure.",
      ],
      experience: ["Minimum 2 years in a similar role."],
      qualifications: [
        "STCW 95 (STCW 2010)",
        "ENG1 (Medical Certificate)",
        "Food and Hygiene Level 2",
      ],
    },
  },
  {
    id: "3",
    isFavorite: false,
    title: "Captain",
    type: "Permanent",
    date: "1st Dec 2025",
    vessel: "60m Motor Yacht",
    location: {
      name: "Bahamas",
      address: "Nassau Marina",
      coordinates: { longitude: -77.3554, latitude: 25.0582 },
    },
    meta: {
      description:
        "We are seeking an experienced Captain to oversee the operation and navigation of a 60-meter motor yacht. The ideal candidate will have a strong background in maritime operations, excellent leadership skills, and a commitment to safety and customer service.",
      requirements: [
        "Valid captain's license and certifications.",
        "Extensive experience in yacht navigation and operations.",
        "Strong leadership and team management skills.",
        "Excellent communication and interpersonal skills.",
      ],
      experience: ["Minimum 5 years of experience as a yacht captain."],
      qualifications: [
        "STCW 95 (STCW 2010)",
        "ENG1 (Medical Certificate)",
        "MCA CoC Master <500gt / Class 5",
        "GMDSS Certification",
        "Valid captain's license",
        "Relevant maritime visas.",
      ],
    },
  },
  {
    id: "4",
    isFavorite: false,
    title: "Chef",
    type: "Permanent",
    date: "15th Nov 2025",
    vessel: "45m Motor Yacht",
    location: {
      name: "Caribbean",
      address: "Antigua Marina",
      coordinates: { longitude: -61.8456, latitude: 17.1274 },
    },
    meta: {
      description:
        "We are looking for a talented and experienced chef to join a 45m motor yacht. The ideal candidate will have a passion for culinary arts, experience in high-end dining, and the ability to cater to diverse dietary needs while at sea. The owners are health-conscious and follow specific dietary routines. Excellent knowledge of gluten-free options, balanced menus, and seasonal cuisine is essential.",
      requirements: [
        "Proven experience as a yacht chef or in a similar role.",
        "Ability to create diverse and high-quality menus.",
        "Knowledge of food safety and hygiene standards.",
        "Excellent organizational and time-management skills.",
      ],
      experience: ["Minimum 3 years of experience as a yacht chef."],
      qualifications: [
        "STCW 95 (STCW 2010)",
        "ENG1 (Medical Certificate)",
        "Food and Hygiene Level 2",
        "Must hold B1/B2 and Schengen visas",
      ],
    },
  },
  {
    id: "5",
    isFavorite: false,
    title: "Deckhand",
    type: "Permanent",
    date: "20th Nov 2025",
    vessel: "30m Motor Yacht",
    location: {
      name: "Mediterranean",
      address: "Port of Barcelona",
      coordinates: { longitude: 2.1734, latitude: 41.3851 },
    },
    meta: {
      description:
        "We seek an experienced Deck-engineer to work on a 30-meter yacht. Responsible for maintaining the exterior of the yacht and assisting with docking and undocking procedures.",
      requirements: [
        "Previous experience as a deckhand.",
        "Knowledge of boat maintenance and cleaning.",
        "Ability to work in a team and follow instructions.",
      ],
      experience: ["Minimum 1-2 years of experience as a deckhand."],
      qualifications: [
        "STCW 95 (STCW 2010)",
        "ENG1 (Medical Certificate)",
        "MCA Approved Engine Course (AEC 1 & 2) Certificate",
        "RYA Powerboat Level 2",
        "RYA Tender Operator Course",
        "BWSF Ski Boat Driver Award Certificate",
      ],
    },
  },
];
