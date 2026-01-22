export enum ModelMode {
  FAST = 'FAST',
  THINKING = 'THINKING'
}

export interface GeneratedCode {
  html: string;
}

export interface AppState {
  prompt: string;
  isLoading: boolean;
  generatedCode: string | null;
  mode: ModelMode;
  error: string | null;
}
