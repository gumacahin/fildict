import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";
import { useInstantSearch, InstantSearch, SearchBox, Configure, InfiniteHits, } from "react-instantsearch";

import { Hit } from "./Hit";

const searchClient = algoliasearch("D3FGLXXB5K", "82284a40fadf34dccdcc9cfacb893d27");

const query = decodeURIComponent(window.location.href).match(/\/salita\/([^#]+)/)?.[1] || '';

export const Search = () => {
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
      <Configure hitsPerPage={100} />
      <div className="ais-InstantSearch">
        <SearchBox placeholder='Hanapin sa Diksiyonaryong Filipino' />
        <NoResultsBoundary fallback={<NoResults />}>
          <InfiniteHits hitComponent={Hit} showPrevious={false} />
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