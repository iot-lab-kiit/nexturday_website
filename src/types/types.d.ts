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
