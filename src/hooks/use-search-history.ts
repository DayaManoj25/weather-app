/*It is a custom React hook that:
Manages search history (for city search, weather search, etc.).
Stores history persistently in localStorage.
Uses React Query (@tanstack/react-query) for state management, caching, and reactivity.
*/


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "./use-local-storage";

//defines shape of the history item
interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function useSearchHistory() {

  // Loads search history from localStorage or uses [] if none.
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
    "search-history",
    []
  );

  //Used to manually update React Query’s cache.
  const queryClient = useQueryClient();

  //Creates a React Query state - Components consuming historyQuery.data re-render reactively when history changes.
  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: () => history,
    initialData: history,
  });

  /*useMutation is a React Query hook used when you want to change data, like:
  Adding to a list.
  Deleting something.
  Sending a form.
  --->It adds a new item to your search history safely and updates your UI immediately.*/
  const addToHistory = useMutation({
    mutationFn: async (
      search: Omit<SearchHistoryItem, "id" | "searchedAt"> //data to add
    ) => { /*It creates a new history item.
            Removes duplicates if needed.
            Adds it to the history.
            Updates localStorage.*/
      const newSearch: SearchHistoryItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };

      // Remove duplicates and keep only last 10 searches
      const filteredHistory = history.filter(
        (item) => !(item.lat === search.lat && item.lon === search.lon)
      );
      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);

      setHistory(newHistory);
      return newHistory;
    },
    //The updated list of history items after adding the new one.
    onSuccess: (newHistory) => {
      queryClient.setQueryData(["search-history"], newHistory);
    },
  });

  /*Clears the search history by:
  Setting it to [] in localStorage.
  Updating React Query’s cache so the UI updates immediately.*/
  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []);
    },
  });

  return {
    history: historyQuery.data ?? [], //current search history
    addToHistory, //Mutation to add a new search item.
    clearHistory, //Mutation to clear all history.
  };
}