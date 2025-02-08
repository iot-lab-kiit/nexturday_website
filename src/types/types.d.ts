export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface EventDetailType {
  Icon: LucideIcon;
  title: string;
  content: string;
  isLink?: boolean;
  isEmail?: boolean;
}

export interface AuthData {
  token: null | string;
  displayName: null | string;
  email: null | string;
  photoURL: null | string;
}

export interface User {
  accessToken: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Event {
  id: string;
  paid: boolean;
  name: string;
  societyId: string;
  about: string;
  websiteUrl: string;
  joined: boolean;
  emails: string[];
  guidlines: string[];
  details: [
    {
      about: string;
      createdAt: string;
      eventId: string;
      from: string;
      id: string;
      name: string;
      to: string;
      type: string;
      updatedAt: string;
      venue: {
        id: string;
        mapUrl: string;
        name: string;
      };
      venueId: string | null;
    }
  ];
  phoneNumbers: string[];
  registrationUrl: string;
  price: number;
  from: string;
  to: string;
  deadline: string;
  participationCount: number;
  createdAt: string;
  updatedAt: string;
  society: {
    name: string;
  };
  images: {
    key: string;
    url: string;
  }[];
}

export interface TeamMember {
  name: string | "",
  email: string;
  status: "accepted" | "pending" | "leader";
}
export interface Team {
  id: string;
  name: string;
  code: string;
  members: TeamMember[];
  maxMembers: number;
  leader: string;
}
