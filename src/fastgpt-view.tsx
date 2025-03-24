// src/fastgpt-view.tsx
import { ActionPanel, Detail, List, Icon, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { searchWithFastGPT } from "./utils/kagiApi";
import open from "open";

interface FastGPTViewProps {
  query: string;
}

interface ExtensionPreferences {
  token: string;
  apiKey: string;
}

export default function FastGPTView(props: FastGPTViewProps) {
  const { token, apiKey }: ExtensionPreferences = getPreferenceValues();
  const [isLoading, setIsLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState<{title: string, snippet: string, url: string}[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFastGPTAnswer() {
      try {
        setIsLoading(true);
        const controller = new AbortController();
        const result = await searchWithFastGPT(props.query, apiKey, controller.signal);

        if (result.length > 0) {
          const mainResult = result[0];
          setAnswer(mainResult.content || "");

          // Extract references
          const refs = result.slice(1).map(item => ({
            title: item.query,
            snippet: item.description || "",
            url: item.url
          }));
          setReferences(refs);
        }
      } catch (err) {
        console.error("Error fetching FastGPT answer:", err);
        setError(`Failed to get answer: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFastGPTAnswer();
  }, [props.query, apiKey]);

  const markdown = `
# ${props.query}

${answer}

${references.length > 0 ? "## References\n" : ""}
${references.map((ref, index) => `${index + 1}. [${ref.title}](${ref.url})\n   ${ref.snippet}`).join("\n\n")}
  `;

  return (
    <Detail
      isLoading={isLoading}
      markdown={error ? `# Error\n\n${error}` : markdown}
      metadata={
        <Detail.Metadata>
          {references.map((ref, index) => (
            <Detail.Metadata.Link
              key={index}
              title={`Reference ${index + 1}`}
              text={ref.title}
              target={ref.url}
            />
          ))}
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <ActionPanel.OpenInBrowser
            title="Search on Kagi"
            url={`https://kagi.com/search?token=${token}&q=${encodeURIComponent(props.query)}`}
          />
          {references.map((ref, index) => (
            <ActionPanel.OpenInBrowser
              key={index}
              title={`Open Reference ${index + 1}`}
              url={ref.url}
            />
          ))}
        </ActionPanel>
      }
    />
  );
}