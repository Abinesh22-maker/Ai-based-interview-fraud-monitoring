export enum Role {
  CANDIDATE = 'CANDIDATE',
  INTERVIEWER = 'INTERVIEWER'
}

export enum ViolationType {
  TAB_SWITCH = 'TAB_SWITCH',
  WINDOW_BLUR = 'WINDOW_BLUR',
  FACE_NOT_VISIBLE = 'FACE_NOT_VISIBLE',
  GAZE_AVERSION = 'GAZE_AVERSION',
  PHONE_DETECTED = 'PHONE_DETECTED',
  MULTIPLE_VOICES = 'MULTIPLE_VOICES',
  BACKGROUND_NOISE = 'BACKGROUND_NOISE'
}

export interface Violation {
  id: string;
  type: ViolationType;
  timestamp: number;
  message: string;
}

export interface InterviewSession {
  isActive: boolean;
  startTime: number | null;
  endTime: number | null;
  warnings: Violation[];
  maxWarnings: number;
}

export interface GrammarAnalysisResult {
  score: number;
  fluency: number;
  clarity: number;
  grammarIssues: string[];
  feedback: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'system' | 'peer';
  text: string;
  timestamp: number;
}