export interface PresentCommitteeMember {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  bio?: string;
}

export interface CommitteeHierarchyGroup {
  categoryName: string;
  members: PresentCommitteeMember[];
}

export const presentCommitteeHierarchy: CommitteeHierarchyGroup[] = [
  {
    categoryName: "Office Bearers",
    members: [
      {
        name: "Badodhe Sreenu",
        role: "Chairman",
        phone: "9848431244",
        email: "chairman@sridurgamatatemple.org",
        bio: "Directing the trust board, fostering spiritual growth, and leading major development programs."
      },
      {
        name: "Goutham Anil Kumar",
        role: "General Secretary",
        phone: "9652079793",
        email: "secretary@sridurgamatatemple.org",
        bio: "Managing overall administration, coordinating programs, and handling correspondence."
      },
      {
        name: "Gudipalli Ganesh",
        role: "Treasurer",
        phone: "9849871099",
        email: "treasurer@sridurgamatatemple.org",
        bio: "Overseeing all temple accounts, verifying donation books, and directing financial planning."
      }
    ]
  },
  {
    categoryName: "Vice Chairmen",
    members: [
      { name: "N. Yadaiah", role: "Vice Chairman" },
      { name: "K. Venkatesh Gupta", role: "Vice Chairman" }
    ]
  },
  {
    categoryName: "Joint Secretaries",
    members: [
      { name: "J. Ramesh", role: "Joint Secretary" },
      { name: "P. Srisailam", role: "Joint Secretary" }
    ]
  },
  {
    categoryName: "Organising Secretaries",
    members: [
      { name: "B. Nagaraj", role: "Organising Secretary" },
      { name: "Rahul Kumar Sharma", role: "Organising Secretary" },
      { name: "G. Madhavi Latha", role: "Organising Secretary" },
      { name: "M. Manjula", role: "Organising Secretary" }
    ]
  },
  {
    categoryName: "Executive Members",
    members: [
      { name: "M. Vignesh Goud", role: "Executive Member" },
      { name: "V. Venkatesh", role: "Executive Member" },
      { name: "B. Deepak Kumar", role: "Executive Member" },
      { name: "K. Chandra Shekhar", role: "Executive Member" },
      { name: "N. Srinath", role: "Executive Member" },
      { name: "C. Mahesh Goud", role: "Executive Member" },
      { name: "M. Bheem Rao", role: "Executive Member" },
      { name: "L. Harishwar Reddy", role: "Executive Member" },
      { name: "N. Srikanth", role: "Executive Member" },
      { name: "P. Teja", role: "Executive Member" },
      { name: "B. Sai Deepak", role: "Executive Member" },
      { name: "M. Vinay Kumar", role: "Executive Member" },
      { name: "K. Raj", role: "Executive Member" },
      { name: "J. Jatin", role: "Executive Member" },
      { name: "Y. Malathi", role: "Executive Member" }
    ]
  },
  {
    categoryName: "Advisors",
    members: [
      { name: "I. Somasundaram", role: "Advisor" },
      { name: "V. Gnaneshwar", role: "Advisor" },
      { name: "G. Laxman Das", role: "Advisor" }
    ]
  }
];
