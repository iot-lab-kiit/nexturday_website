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