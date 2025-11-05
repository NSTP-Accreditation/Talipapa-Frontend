export interface Step {
  _id?: string;
  stepNumber: number;
  title: string;
  description: string;
  requiredDocuments?: string[];
  estimatedTime?: string;
  tips?: string[];
}

export interface Guideline {
  _id?: string;
  title: string;
  description: string;
  category: string;
  steps: Step[];
  totalEstimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}
