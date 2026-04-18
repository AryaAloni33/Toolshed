import { useState, useCallback, useEffect } from "react";
import { FileText, Copy, RefreshCw } from "lucide-react";
import {
  ToolPanel,
  PrimaryButton,
  GhostButton,
  FieldLabel,
  CopyButton,
} from "./shared";

const words = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "ut",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "ut",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "dolor",
  "in",
  "reprehenderit",
  "in",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "dolore",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "in",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

export function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentencesPerPara, setSentencesPerPara] = useState(5);
  const [result, setResult] = useState("");

  const generate = useCallback(() => {
    let output = [];
    for (let p = 0; p < paragraphs; p++) {
      let sentences = [];
      for (let s = 0; s < sentencesPerPara; s++) {
        let sentenceWords = [];
        const wordCount = Math.floor(Math.random() * 8) + 8;
        for (let w = 0; w < wordCount; w++) {
          sentenceWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        let sentence = sentenceWords.join(" ");
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
        sentences.push(sentence);
      }
      output.push(sentences.join(" "));
    }
    setResult(output.join("\n\n"));
  }, [paragraphs, sentencesPerPara]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <FieldLabel>Paragraphs: {paragraphs}</FieldLabel>
              <input
                type="range"
                min="1"
                max="10"
                value={paragraphs}
                onChange={(e) => setParagraphs(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>
            <div>
              <FieldLabel>
                Sentences per Paragraph: {sentencesPerPara}
              </FieldLabel>
              <input
                type="range"
                min="1"
                max="15"
                value={sentencesPerPara}
                onChange={(e) => setSentencesPerPara(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <PrimaryButton onClick={generate} className="flex-1">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </PrimaryButton>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                Generated Text
              </span>
              <CopyButton value={result} />
            </div>
            <div className="h-48 w-full overflow-y-auto rounded-md border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              {result.split("\n\n").map((para, i) => (
                <p key={i} className={i > 0 ? "mt-4" : ""}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
