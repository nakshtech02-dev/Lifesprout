
export const categories = [
  "Wellness",
  "Medical Journal",
  "Medical Tourism",
  "Pharma",
  "Health News",
  "Digital Health",
  "CareTotal",
];

export const initialAdmins = [
  {
    id: 1,
    name: "Lifesprout Care",
    email: "owner@lifesproutcare.com",
    role: "Owner",
    status: "Active",
    categories: ["All Categories"],
    permissions: [
      "Manage Admins",
      "Manage Articles",
      "Manage Payments",
      "Manage Enquiries",
      "Manage Settings",
      "View Analytics",
    ],
    lastLogin: "Today, 10:30 AM",
    isOwner: true,
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "Admin",
    status: "Active",
    categories: ["Wellness", "Health News"],
    permissions: [
      "Manage Articles",
      "Manage Enquiries",
      "View Analytics",
    ],
    lastLogin: "Today, 09:15 AM",
    isOwner: false,
  },
  {
    id: 3,
    name: "Priya Verma",
    email: "priya@example.com",
    role: "Admin",
    status: "Active",
    categories: ["Medical Tourism", "Medical Journal"],
    permissions: [
      "Manage Articles",
      "Manage Enquiries",
    ],
    lastLogin: "Yesterday, 04:20 PM",
    isOwner: false,
  },
  {
    id: 4,
    name: "Amit Patel",
    email: "amit@example.com",
    role: "Editor",
    status: "Active",
    categories: ["Pharma", "Digital Health"],
    permissions: [
      "Manage Articles",
      "View Analytics",
    ],
    lastLogin: "Yesterday, 02:10 PM",
    isOwner: false,
  },
  {
    id: 5,
    name: "Sneha Gupta",
    email: "sneha@example.com",
    role: "Admin",
    status: "Blocked",
    categories: ["CareTotal"],
    permissions: [
      "Manage Articles",
    ],
    lastLogin: "15 Nov 2026",
    isOwner: false,
  },
];

export const availablePermissions = [
  "Manage Admins",
  "Manage Articles",
  "Manage Payments",
  "Manage Enquiries",
  "Manage Settings",
  "View Analytics",
];
