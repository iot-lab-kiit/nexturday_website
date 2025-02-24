import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
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
  token: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface User {
  accessToken: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Venue {
  id: string;
  mapUrl: string;
  name: string;
}

export interface EventDetail {
  about: string;
  createdAt: string;
  eventId: string;
  from: string;
  id: string;
  name: string;
  to: string;
  type: string;
  updatedAt: string;
  venue: Venue | null;
  venueId: string | null;
}

export interface Society {
  name: string;
}

export interface EventImage {
  key: string;
  url: string;
}

export interface Event {
  id: string;
  paid: boolean;
  name: string;
  societyId: string;
  about: string;
  websiteUrl: string;
  joined: boolean;
  maxTeamSize: number;
  emails: string[];
  guidlines: string[];
  details: EventDetail[];
  phoneNumbers: string[];
  registrationUrl: string;
  price: number;
  from: string;
  to: string;
  deadline: string;
  participationCount: number;
  createdAt: string;
  updatedAt: string;
  society: Society;
  images: EventImage[];
}

export interface TeamMember {
  name: string;
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
  leaderName: string; 
}

// Optional: Export all types as a namespace for easier access
export namespace Types {
  export type Card = CardProps;
  export type EventDetail = EventDetailType;
  export type Auth = AuthData;
  export type User = User;
  export type Venue = Venue;
  export type Society = Society;
  export type EventImage = EventImage;
  export type Event = Event;
  export type TeamMember = TeamMember;
  export type Team = Team;
}