import { useRef, useCallback } from "react";
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";
import { useInstantSearch, InstantSearch, SearchBox, Configure, InfiniteHits, } from "react-instantsearch";

import { Hit } from "./Hit";

const appId = "D3FGLXXB5K";
const searchKey = "5c53005d8242ec8d86e078f98ad6f8e0";
const baseSearchClient = algoliasearch(appId, searchKey);
const MIN_QUERY_LENGTH = 2;
const HITS_PER_PAGE = 20;
const DEBOUNCE_MS = 450;
type SearchRequests = Parameters<typeof baseSearchClient.search>[0];
type SearchRequest = SearchRequests[number];
type SearchRequestOptions = Parameters<typeof baseSearchClient.search>[1];

const searchClient = {
  ...baseSearchClient,
  search<TObject>(
    requests: SearchRequests,
    requestOptions?: SearchRequestOptions,
  ): ReturnType<typeof baseSearchClient.search<TObject>> {
    const hasSearchableQuery = requests.some((request) => {
      const queryValue = request.params?.query?.trim() ?? "";
      return queryValue.length >= MIN_QUERY_LENGTH;
    });

    if (!hasSearchableQuery) {
      const emptyResponse = {
        results: requests.map((request) => ({
          hits: [],
          nbHits: 0,
          page: 0,
          nbPages: 0,
          hitsPerPage: HITS_PER_PAGE,
          exhaustiveNbHits: false,
          processingTimeMS: 0,
          query: (request as SearchRequest).params?.query ?? "",
          params: "",
        })),
      } as Awaited<ReturnType<typeof baseSearchClient.search<TObject>>>;
      return Promise.resolve(emptyResponse);
    }

    return baseSearchClient.search(requests, requestOptions);
  },
};

const query = decodeURIComponent(window.location.href).match(/\/salita\/([^#]+)/)?.[1] || '';

export const Search = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queryHook = useCallback((query: string, search: (value: string) => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const normalizedQuery = query.trim();
    timerRef.current = setTimeout(() => search(normalizedQuery), DEBOUNCE_MS);
  }, []);

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
      <Configure hitsPerPage={HITS_PER_PAGE} />
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