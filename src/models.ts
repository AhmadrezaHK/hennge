export interface Email {
    from: string;
    to: string[];
    subject: string;
    date: string;
    key: string;
    attachment?: string;
}

export enum EmailShowingMode {
    SHOW_ALL,
    SHOW_ONE,
}

export type sortType = "date" | "from";

export type sortOrderType = "up" | "down";