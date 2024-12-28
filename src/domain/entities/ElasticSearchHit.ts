export default interface ElasticSearchHit {
  _id: string;
  _source: {
    title: string;
    author: string;
    description: string;
    image: string;
  };
}
