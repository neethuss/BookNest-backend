import ElasticSearchHit from "./ElasticSearchHit";

export default interface ElasticSearchResponse {
  hits: {
    hits: ElasticSearchHit[];
  }
}