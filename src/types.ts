/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface ToolInputSchema {
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'textarea';
  label: string;
  placeholder?: string;
  options?: string[];
  defaultValue?: any;
}

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  longDescription?: string;
  keywords: string[];
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  isInteractive?: boolean; // True if it is one of the 16 full-featured tools
  // Interactive inputs if dynamically rendered
  inputs?: ToolInputSchema[];
  run?: (inputs: Record<string, any>) => string | Record<string, any>;
  howToUse?: string[];
  faq?: { question: string; answer: string }[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  schemaJson: string;
}
