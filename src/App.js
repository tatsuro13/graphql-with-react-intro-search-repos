import React, { Component } from 'react';
import { ApolloProvider, Mutation, Query } from 'react-apollo';
import client from './client';
import { ADD_STAR, SEARCH_REPOSITORIES } from './graphql';
//import { getNodeText } from '@testing-library/dom';
//import { node } from 'prop-types';

const StarButton = props => {
  const node = props.node
  const totalCount = props.node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`
  const StarStatus = ({addStar}) => {
    return (
      <button
        onClick={
          () => addStar({
            variables: { input: { starrableId: node.id } }
          })
        }
      >
        {starCount} | {viewerHasStarred ? 'starred' : '-'}
      </button>
    )
  }
    return(
      <Mutation mutation={ADD_STAR}>
        {
          addStar => <StarStatus addStar={addStar} />
        }
      </Mutation>
    )
}

const PER_PAGE = 5
const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    })
  }

  goNext(search){
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
  }

  goPrevious(search){
    this.setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    })
  }
    
  render() {
    const { query, first, last, before, after } = this.state;
    //console.log({query})
    return (
      <ApolloProvider client={client}>
        <form>
          <input value={query} onChange={this.handleChange} />
        </form>
        <Query
          query={SEARCH_REPOSITORIES}
          variables={{ query, first, last, before, after }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
            //console.log({ data });
            const search = data.search
            const repositoryCount = search.repositoryCount
            const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
            const title = `Github RepositoryCount Search Count - ${repositoryCount} ${repositoryUnit}`
          return(
            <>
            <h2>{title}</h2>
            <ul>
              {
                search.edges.map(edge => {
                  const node = edge.node
                  return(
                    <li key={node.id}>
                       <a href={node.url} rel="noopener noreferrer" target="_blank">{node.name}</a>
                       &nbsp;
                       <StarButton node={node} />
                    </li>
                  )
                })
              }
            </ul>

            {
              search.pageInfo.hasPreviousPage === true ?
                <button
                  onClick={this.goPrevious.bind(this,search)}
                >
                  Previous
                </button>
                :
                null
            }

            {
              search.pageInfo.hasNextPage === true ?
                <button
                  onClick={this.goNext.bind(this,search)}
                >
                  Next
                </button>
                :
                null
            }
            
            </>
          ) 
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
