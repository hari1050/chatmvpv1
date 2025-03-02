declare module 'rtf-parser' {
    export function string(
      rtfText: string, 
      callback: (err: Error | null, doc: any) => void
    ): void;
  }