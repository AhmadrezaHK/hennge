export interface Email {
    from: string;
    to: string[];
    subject: string;
    date: string;
    key: string;
}

export enum EmailShowingMode {
    SHOW_ALL,
    SHOW_ONE,
}