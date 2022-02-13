export const rankColor = {
    SS: chroma.rgb(255, 223, 33),
    S: chroma.rgb(255, 166, 3),
    A: chroma.rgb(5, 176, 228),
    B: chroma.rgb(30, 160, 13),
};

export const uiColor = {
    // tailwindcss lime-500
    success: chroma.hex("#84CC16"),
    // tailwindcss red-500
    error: chroma.hex("#EF4444"),
    // tailwindcss yellow-300
    warninig: chroma.hex("#FDE047"),
    // tailwindcss sky-400
    info: chroma.hex("#38BDF8"),
};

type DisassemblingRanks = {
    B: DisassemblingItems;
    A: DisassemblingItems;
    S: DisassemblingItems;
    SS: DisassemblingItems;
};
type DisassemblingItems = {
    parts: number;
    nutrients: number;
    power: number;
    basic_module: number;
    advanced_module: number;
    special_module: number;
};
export const disassemblingTable: {
    units: DisassemblingRanks;
    equipments: DisassemblingRanks;
} = {
    units: {
        B: {
            parts: 5,
            nutrients: 5,
            power: 5,
            basic_module: 5,
            advanced_module: 0,
            special_module: 0,
        },
        A: {
            parts: 25,
            nutrients: 25,
            power: 25,
            basic_module: 25,
            advanced_module: 3,
            special_module: 0,
        },
        S: {
            parts: 50,
            nutrients: 50,
            power: 50,
            basic_module: 50,
            advanced_module: 10,
            special_module: 1,
        },
        SS: {
            parts: 100,
            nutrients: 100,
            power: 100,
            basic_module: 100,
            advanced_module: 20,
            special_module: 5,
        },
    },
    equipments: {
        B: {
            parts: 3,
            nutrients: 0,
            power: 3,
            basic_module: 1,
            advanced_module: 0,
            special_module: 0,
        },
        A: {
            parts: 5,
            nutrients: 0,
            power: 5,
            basic_module: 3,
            advanced_module: 1,
            special_module: 0,
        },
        S: {
            parts: 10,
            nutrients: 0,
            power: 10,
            basic_module: 5,
            advanced_module: 2,
            special_module: 0,
        },
        SS: {
            parts: 20,
            nutrients: 0,
            power: 20,
            basic_module: 10,
            advanced_module: 3,
            special_module: 1,
        },
    },
};
