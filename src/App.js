import React from 'react';
import {ApolloProvider} from 'react-apollo';
import client from './client';

function App() {
  return (
    <ApolloProvider client={client}>
      <div>Hello, GraphQL</div>
    </ApolloProvider>
  );
}

export default App;
