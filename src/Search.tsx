import { useRef, useCallback } from "react";
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";
import { useInstantSearch, InstantSearch, SearchBox, Configure, InfiniteHits, } from "react-instantsearch";

import { Hit } from "./Hit";

const appId = (import.meta.env.VITE_ALGOLIA_APP_ID ?? "").trim();
const searchKey = (import.meta.env.VITE_ALGOLIA_SEARCH_KEY ?? "").trim();
const missingEnvVars = [
  !appId ? "VITE_ALGOLIA_APP_ID" : null,
  !searchKey ? "VITE_ALGOLIA_SEARCH_KEY" : null,
].filter((value): value is string => Boolean(value));
const searchClient = missingEnvVars.length === 0 ? algoliasearch(appId, searchKey) : null;

const query = decodeURIComponent(window.location.href).match(/\/salita\/([^#]+)/)?.[1] || '';

export const Search = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queryHook = useCallback((query: string, search: (value: string) => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 300);
  }, []);

  if (!searchClient) {
    return (
      <div>
        <p>Hindi ma-load ang paghahanap dahil kulang ang Algolia configuration.</p>
        <p>
          Required env vars: <code>{missingEnvVars.join(", ")}</code>
        </p>
      </div>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="updf"
      initialUiState={{
        updf: {
          query,
        },
      }}
    >
      <Configure hitsPerPage={20} />
      <div className="ais-InstantSearch">
        <SearchBox placeholder='Hanapin sa Diksiyonaryong Filipino' queryHook={queryHook} />
        <NoResultsBoundary fallback={<NoResults />}>
          <InfiniteHits hitComponent={Hit} showPrevious={false} translations={{ showMoreButtonText: "Higit pa" }} />
        </NoResultsBoundary>
      </div>
    </InstantSearch>
  );
};

type NoResultsBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};


function NoResultsBoundary({ children, fallback }: NoResultsBoundaryProps) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div>
      <p>
        Walang resulta para sa<q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}