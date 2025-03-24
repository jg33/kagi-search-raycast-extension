import {
  ActionPanel,
  closeMainWindow,
  CopyToClipboardAction,
  getPreferenceValues,
  Icon,
  List,
  showToast,
  ToastStyle,
} from "@raycast/api";
import { getIcon } from "./utils/resultUtils";
import { useSearch } from "./utils/useSearch";
import open from "open";
import { SearchResult } from "./utils/types";

interface ExtensionPreferences {
  token: string;
  apiKey: string;
}

export default function Command() {
  const { token, apiKey }: ExtensionPreferences = getPreferenceValues();
  const {
    isLoading,
    history,
    results,
    searchText,
    search,
    searchWithApi,
    addHistory,
    deleteAllHistory,
    deleteHistoryItem
  } = useSearch(token, apiKey);

  const listItems: SearchResult[] = searchText.length === 0 ? history : results;

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={search}
      searchBarPlaceholder="Search Kagi or type a URL..."
      throttle
    >
      <List.Section title="Results" subtitle={listItems.length + ""}>
        {listItems.map((item) => (
          <List.Item
            key={item.id}
            title={item.query}
            subtitle={item.description}
            icon={getIcon(item)}
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Result">
                  {item.isApiResult ? (
                    // For API results, default action is open in browser
                    <ActionPanel.Item
                      title="Open in Browser"
                      onAction={async () => {
                        await addHistory(item);
                        await open(item.url);
                        await closeMainWindow();
                      }}
                      icon={{ source: Icon.ArrowRight }}
                    />
                  ) : (
                    // For auto-suggest results, default action is search with API
                    <ActionPanel.Item
                      title="Search with Kagi API"
                      onAction={async () => {
                        const apiResults = await searchWithApi(item.query);
                        if (apiResults.length > 0) {
                          await addHistory(item);
                        }
                      }}
                      icon={{ source: Icon.MagnifyingGlass }}
                    />
                  )}

                  {/* Show the alternative action based on result type */}
                  {item.isApiResult ? (
                    <ActionPanel.Item
                      title="Search Again"
                      onAction={async () => {
                        await searchWithApi(item.query);
                      }}
                      icon={{ source: Icon.MagnifyingGlass }}
                    />
                  ) : (
                    <ActionPanel.Item
                      title="Open in Browser"
                      onAction={async () => {
                        await addHistory(item);
                        await open(item.url);
                        await closeMainWindow();
                      }}
                      icon={{ source: Icon.ArrowRight }}
                    />
                  )}

                  <CopyToClipboardAction title="Copy URL to Clipboard" content={item.url} />
                </ActionPanel.Section>

                <ActionPanel.Section title="History">
                  {item.isHistory && (
                    <ActionPanel.Item
                      title="Remove From History"
                      onAction={async () => {
                        await deleteHistoryItem(item);
                      }}
                      icon={{ source: Icon.Trash }}
                      shortcut={{ modifiers: ["cmd"], key: "d" }}
                    />
                  )}

                  <ActionPanel.Item
                    title="Clear All History"
                    onAction={async () => {
                      await deleteAllHistory();
                    }}
                    icon={{ source: Icon.ExclamationMark }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}