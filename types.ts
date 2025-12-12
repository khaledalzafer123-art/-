export interface LetterData {
  id: string;
  char: string;
  name: string;
  forms: {
    isolated: string;
    start: string;
    middle: string;
    end: string;
  };
  sounds: {
    fatha: string;
    kasra: string;
    damma: string;
  };
  madood: {
    alif: string;
    waw: string;
    yaa: string;
  };
  exampleWord: string;
  emoji: string;
  // New fields for Sun/Moon lesson
  sunOrMoon: 'sun' | 'moon';
  wordWithAl: string;
}

export enum AppMode {
  MENU = 'MENU',
  LEARN = 'LEARN',
  WRITE = 'WRITE',
  QUIZ = 'QUIZ'
}

export interface QuizQuestion {
  type: 'sound_to_letter' | 'form_identification';
  questionAudio?: string; // If audio based
  questionText?: string; // If text based
  correctAnswer: string;
  options: string[];
}