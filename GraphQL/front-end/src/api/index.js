import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = createHttpLink({
  uri: "http://localhost:4000"
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

// import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:3001",
//   responseType: "json"
// });