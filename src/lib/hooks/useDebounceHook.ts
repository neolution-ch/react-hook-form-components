import { useEffect, useRef, useState } from "react";
import { TypeaheadOption } from "../types/Typeahead";

interface DebounceSearch {
  query: string;
  delay: number;
}

const useDebounceHook = (
  queryFn: (query: string) => Promise<TypeaheadOption[]>,
  setOptions: (results: TypeaheadOption[]) => void,
  onQueryError?: ((error: unknown) => void) | undefined,
) => {
  const queryRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState<DebounceSearch | undefined>(undefined);

  useEffect(() => {
    if (debounceSearch) {
      const { delay: counter, query } = debounceSearch;
      queryRef.current = query;

      const timer =
        counter > 0
          ? setTimeout(
              () =>
                setDebounceSearch((prev) => ({
                  ...(prev as DebounceSearch),
                  delay: (prev as DebounceSearch)?.delay - 100,
                })),
              100,
            )
          : undefined;

      if (counter === 0) {
        void (async () => {
          try {
            const results = await queryFn(query);
            if (queryRef.current === query) {
              setOptions(results);
            }
          } catch (error) {
            onQueryError && onQueryError(error);
          } finally {
            setLoading(false);
          }
        })();

        setDebounceSearch(undefined);
      } else {
        setLoading(true);
      }

      return () => {
        clearTimeout(timer);
      };
    }

    // not all paths returns a value
    return undefined;
  }, [queryFn, setOptions, debounceSearch, onQueryError]);

  return { setDebounceSearch, loading };
};

export { useDebounceHook };
