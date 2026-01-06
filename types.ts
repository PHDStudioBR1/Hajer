
// Import React to resolve React namespace in TypeScript
import React from 'react';

export interface Specialty {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  name: string;
  text: string;
  stars: number;
}

export interface FAQ {
  question: string;
  answer: string;
}
