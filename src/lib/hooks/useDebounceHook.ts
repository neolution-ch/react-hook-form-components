﻿import { useEffect, useRef, useState } from "react";
import { TypeaheadOption, TypeaheadOptions } from "../types/Typeahead";
import { getUniqueOptions } from "../helpers/typeahead";

interface DebounceSearch {
  query: string;
  delay: number;
  value: TypeaheadOption[];
}

const useDebounceHook = (queryFn: (query: string) => Promise<TypeaheadOptions>, setOptions: (results: TypeaheadOption[]) => void) => {
  const queryRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState<DebounceSearch | undefined>(undefined);

  useEffect(() => {
    if (debounceSearch) {
      const { delay: counter, query, value } = debounceSearch;
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
              setOptions(getUniqueOptions(results, value));
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
