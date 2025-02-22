declare module 'mammoth' {
  interface ExtractResult {
    value: string;
    messages: any[];
  }

  interface ExtractOptions {
    arrayBuffer: ArrayBuffer;
  }

  export function extractRawText(options: ExtractOptions): Promise<ExtractResult>;
}

declare module 'pdf-parse' {
  interface PDFResult {
    text: string;
    numpages: number;
    info: any;
  }

  function PDFParse(dataBuffer: ArrayBuffer): Promise<PDFResult>;
  export default PDFParse;
} 