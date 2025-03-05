import { useEffect, useRef, useState } from "react";
import { TypeaheadOption, TypeaheadOptions } from "../types/Typeahead";

interface DebounceSearch {
  query: string;
  delay: number;
}

const useDebounceHook = (queryFn: (query: string) => Promise<TypeaheadOptions>, setOptions: (results: TypeaheadOption[]) => void) => {
  const queryRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
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
              if (queryRef.current === "") {
                setOptions([]);
              } else {
                setOptions(results);
              }
              setIsLoading(false);
            }
          } catch (error) {
            setIsLoading(false);
          }
        })();

        setDebounceSearch(undefined);
      } else {
        setIsLoading(true);
      }

      return () => {
        clearTimeout(timer);
      };
    }

    // not all paths returns a value
    return undefined;
  }, [queryFn, setOptions, debounceSearch]);

  return { setDebounceSearch, isLoading };
};

export { useDebounceHook };
