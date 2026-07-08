import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type {AlienId} from "./aliens";

export type LevelMode = "lesson" | "tv" | "quiz" | "memorize" | "recall" | "play";
export type WorldTheme = "mint" |"pink" | "purple" | "blue" | "green" | "orange" | "yellow";

export type World = {
    id: string;
    topic: string;
    subtopics: string[];
    levelProgress: Record<number, LevelMode[]>;
    theme: WorldTheme;
    createdAt: number;    
};

export type Profile = {
    name: string;
    nickname: string;
    username:string;
    occupation: string;
    country: string;
    aliens: AlienId;
};

export type Stats = {
    lessonsDone: number;
    quizCorrect: number;
    quizTotal: number;
    startsEarned:number;
    podcastsHeard: number;
    worldsCreated: number;
};

type GameState = {
    hearts: number;
    xp: number;
    streak: number;
    lastStreakDate: string | null;
    galaxy: string;
    worlds: World[];
    activeWorldId: string | null;
    onBreak: boolean;
    profile: Profile | null;
    stars: number;  /** ⭐ ganadas y aún no gastadas en la tienda. */
    ownedClothes: string[]; /** Ropita comprada en la tienda. */
    seenWelcome: boolean; /** Si el usuario ya vio la pantalla de bienvenida. */
    chatHistory: Array<{id: string; role: "user" | "assistant"; text: string}>;
    seenBoardingPass: boolean;
    powerUsedDate: string | null;
    stats: Stats;
};

type GameCtx = GameState & {
    activeWorld: World | null; /**Es para si hay un mundo activo o si no hay ninguno activado */
    currentTopic: string;
    selectedSubtopics: string[];
    levelProgress: Record<number, LevelMode[]>;
    completedLevels: number[];
    loseHeart:() => void;
    gainXP: (n: number) => void;
    recordQuiz: (correct: boolean) => void;
    earnStar: () => void;
    completeLevelMode: (i:number, mode:LevelMode) => void;


}


