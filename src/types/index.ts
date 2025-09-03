export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  date: string;
  category: 'news' | 'event' | 'world';
  author?: string;
  featured?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'tournament' | 'training' | 'workshop' | 'match';
  image?: string;
}

export interface Coach {
  id: string;
  name: string;
  title: string;
  experience: string;
  image: string;
  specialization: string[];
}
