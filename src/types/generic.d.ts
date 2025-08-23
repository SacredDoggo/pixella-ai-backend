export interface ContextMessages {
    role: "user" | "model";
    parts: Array<{ text: string }>;
}