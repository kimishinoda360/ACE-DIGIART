
export type AppSection = 'imaginable' | 'editable' | 'promptable' | 'collectable';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface AspectRatio {
  name: string;
  value: string;
}

// @google/genai guidelines: gemini-2.5-flash-image supports '1:1', '3:4', '4:3', '9:16', and '16:9'
export const ASPECT_RATIOS: AspectRatio[] = [
  { name: 'Square (1:1)', value: '1:1' },
  { name: 'Landscape (16:9)', value: '16:9' },
  { name: 'Portrait (9:16)', value: '9:16' },
  { name: 'Standard (4:3)', value: '4:3' },
  { name: 'Standard Portrait (3:4)', value: '3:4' },
];

export const IMAGE_COUNTS = [1, 2, 3, 4];
