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
    gainXp: (n: number) => void;
    recordQuiz: (correct: boolean) => void;
    earnStar: () => void;
    completeLevelMode: (i:number, mode:LevelMode) => void;
    isLevelComplete: (i: number) => boolean;
    getLevelProgress: (i: number) => LevelMode[]; 
    setTopic: (t:string, subs: string[])=> void; /**Es para crear un nuevo mundo o cambiar al que esta actualmente */
    switchWorld: (id: string) => void;
    removeWorld: (id: string) => void;
    toogleBreak: () => void;
    setProfile: (p: Profile)=> void;
    resetProfile: () => void;
    addCustomTopic: (t: string) => void;
    removeCustomTopic: (t: string) => void;
    equipAccessory: (id: string | null) => void; /**Compra ropita para el alien pagando con estrellas, Devuelve TRUE si se puedde comprar */
    buyClothing: (id: string, cost: number) => boolean;
    setChatHistory: (m: Array<{id: string; role: "user" | "assistant"; text: string}>)=> void;
    clearChat: () => void;
    markBoardingPassSeen: () => void;
    markWelcomeSeen: () => void;
    usePower: () => boolean;
    canUsePower: () => boolean;
};

const THEMES: WorldTheme[] = ["mint", "pink", "purple", "yellow","blue", "orange"];

const newId = ()=> Math.random().toString(36).slice(2,9);

const initialWorld: World ={
    id: "w_default",
    topic: "Agujeros Negros",
    subtopics: ["Origen", "Singularidad", "Horizonte de Eventos", "Radiación de Hawking", "El vacío"],
    levelProgress:{},
    theme: "purple",
    createdAt: Date.now(),
};

const defaultState: GameState= {
    hearts=5,
    xp: 0,
    streak: 0,
    lastStreakDate: null,
    galaxy: "Galaxy Beta",
    worlds: [initialWorld],
    onBreak: false,
    profile: null,
    customTopics: [],
    equippedAccessory: null,
    starts: 0,
    ownedClothes: [],
    seenWelcome: false,
    chatHistory:[],
    seenBoardingPass: false,
    powerUsedDate: null,
    stats: {lessonsDone:0, quizCorrect:0, quizTotal:0, startsEarned:0, podcastsHeard:0, worldsCreated: 1},
};

const SECONDARY: LevelMode[]=["tv","quiz", "memorize", "recall", "play"];

const todayKey= () => new Date().toISOString().slice(0,10);
const dayDiff = (from: string, to: string)=>
    Math.round((new Date(`${to}T00:00:00`).getTime()-new Date (`${from}T00:00:00`).getTime())/86_400_000);

function applyDailyStreak(s:GameState): GameState {
    const today = todayKey();
    if (s.lastStreakDate === today) return s;
    const diff = s.lastStreakDate ? dayDiff (s.lastStreakDate, today): null;
    return {...s, streak: diff === 1 ? s.streak+1:1, lastStreakDate:today};
}

const Ctx = createContext<GameCtx | null>(null);

export function GameProvider ({children}: {children: ReactNode} ) {
    const [state, setState] = useState<GameState>(defaultState);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("edualiens-state");
            if (raw){
                const loaded = JSON.parse(raw) as Partial<GameState> & {
                    selectedSubtopics?: string[];
                    currentTopic?: string;
                    levelProgress?: Record<number, LevelMode[]>;
                };

                if (!loaded.worlds && loaded.selectedSubtopics) {
                    const w: World={
                        id: "w_legacy",
                        topic: loaded.currentTopic??"Aventura",
                        subtopics: loaded.selectedSubtopics,
                        levelProgress: loaded.levelProgress ??{},
                        theme: "purple",
                        createdAt: Date.now(),
                    };
                    loaded.worlds=[w];
                    loaded.activeWorldId=w.id;
                }

                if (loaded.profile && (!("username" in loaded.profile) || !loaded.profile.username)) {
                    const p = loaded.profile as {name: string; alien: AlienId} & Partial<Profile>;
                    loaded.profile={
                        name: p.name ?? "Astronauta",
                        nickname: p.nickname ?? p.name ?? "cadete",
                        username: p.username ?? (p.name ?? "cadete").toLowerCase().replace(/\s+/g,"_"),
                        occupation:p.occupation??"Cadete Espacial",
                        country:p.country ?? "Tierra",
                        alien:p.alien,
                    };
                }
                if (!loaded.stats){
                    loaded.stats = {...defaultState.stats,worldsCreated:loaded.worlds?.length??1};
                }
                if (typeof loaded.stars !== "number") loaded.stars = loaded.stats?.starsEarned ?? 0;
                if (!Array.isArray(loaded.ownedClothes)) loaded.ownedClothes=[];
                if (typeof loaded.seenWelcome !== "boolean") loaded.seenWelcome= false;
                setState((s) => applyDailyStreak({...s, ...loaded} as GameState));
            } else {
                setState((s)=> applyDailyStreak(s));
            }
        } catch (e) {
            console.warn("hydratation failed", e);
        }
        setHydrated(true);
    }, [])

    useEffect(() => {
        if (!hydrated) return;
        try {localStorage.setItem("edualiens-state",JSON.stringify(state));} catch{}
    }, [state, hydrated]);

    const activeWorld = state.worlds.find((w)=> w.id === state.activeWordldId) ?? state.worlds[0]?? null;
    const currentTopic = activeWorld?.topic ?? "";
    const selectedSubtopics = activeWorld?.subtopics ?? [];
    const levelProgress = activeWorld?.levelProgress ?? {};

    const isLevelComplete = useCallback ((i: number) => {
        const modes = levelProgress [i] ?? [];
        return modes.includes("lesson") && SECONDARY.some((m) =>modes.includes(m));
    }, [levelProgress]);

    const completedLevels = Object.keys(levelProgress)
        .map((k) => Number (k))
        .filter((i) => isLevelComplete(i))
        .sort((a,b) => a - b);

    const updateActiveWorld = (fn: (w: World) => World)=>
        setState((s) => {
            if (!s.activateWorldId) return s;
            return { ...s, worlds: s.worlds.map((w)=> (w.id === s.activeWorld ? fn (w):w))};
        });

    const value: GameCtx = {
        ...state,
        activeWorld,
        currentTopic,
        selectedSubtopics,
        levelProgress,
        completedLevels,
        loseHeart: () => setState((s)=> ({ ...s, hearts: Math.max(0, s.hearts - 1)})),
        gainXp:(n) => setState ((s) => applyDailyStreak({ ...s, xp: s.xp + n})),
        recordQuiz: (correct) =>
            setState((s) => ({
                ...s,
                stats: {
                    ...s.stats,
                    quizTotal: s.stats.quizTotal + 1,
                    quizCorrect: s.stats.quizCorrect + (correct ? 1:0),
                },
            })),
        earnStar: () =>
            setState((s) => ({
                ...s,
                starts: s.stars + 1,
                stats: {...s.stats, starsEarned: s.stats.starsEarned + 1},
            })),
        completeLevelMode: (i, mode) => {
            updateActiveWorld((w) => {
                const prev = w.levelProgress [i] ?? [];
                if (prev.includes(mode)) return w;
                return { ...w, levelProgress: { ...w.levelProgress, [i]: [...prev, mode] }};
            });
            setState((s) => {
                const w = s.worlds.find((x) => x.id === s.activeWorldId);
                if (!w) return s;
                const prev = w.levelProgress[i] ?? [];
                if (prev.includes(mode)) return s;
                const next = [...prev, mode];
                const wasComplete = prev.includes("lesson") && SECONDARY.some((m) => prev.includes(m));
                const isNowComplete = next.includes("lesson") && SECONDARY.some((m) => prev.includes(m));
                const bonusXp = !wasComplete && isNowComplete ? 50:0;
                const lessonsBump = mode === "lesson" ? 1 : 0;
                const podcastBump = mode === "tv" ? 1 : 0;
                const streaked = applyDailyStreak(s);
                return{
                    ...streaked,
                    xp: streaked.xp +bonusXp,
                    starts: streaked.stars + 1,
                    stats: {
                        ...streaked.stats,
                        starsEarned: streaked.stats.startsEarned + 1,
                        lessonsDone: s.stats.lessonsDone + lessonsBump,
                        podcastsHeard: s.stats.podcastsHeard + podcastBump,
                    },
                };

            });
        },
        isLevelComplete,
        getLevelProgress: (i) => levelProgress[i] ?? [],
        setTopic: 


    }



}


