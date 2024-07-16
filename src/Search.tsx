import { useLayoutEffect, useState } from 'react';
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";
import { Hits, InstantSearch, SearchBox, Configure, Pagination } from "react-instantsearch";

import { Hit } from "./Hit";

const searchClient = algoliasearch("D3FGLXXB5K", "82284a40fadf34dccdcc9cfacb893d27");

export const Search = () => {
  const [query, setQuery] = useState('');
  useLayoutEffect(() => {
    const match = window.location.href.match(/salita\/(\w+)(#\w+)?/);
    if (match) {
      console.log(match);
      setQuery(match[1]);
    }

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
      <Configure hitsPerPage={20} />
      <div className="ais-InstantSearch">
        <SearchBox />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};