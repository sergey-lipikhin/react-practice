import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { ProductTable } from './components/ProductTable';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(categoryFromServer => (
    categoryFromServer.id === product.categoryId
  )) || null;

  const user = usersFromServer.find(userFromServer => (
    userFromServer.id === category.ownerId
  )) || null;

  return {
    ...product,
    category,
    user,
  };
});

function filterProductsByUser(productsToFilter, isAllSelected, userId) {
  if (isAllSelected) {
    return productsToFilter;
  }

  return productsToFilter.filter(product => (
    product.user.id === userId
  ));
}

function filerProductsByQuery(productsToFilter, query) {
  return productsToFilter.filter(product => (
    product.name.toLowerCase().includes(query.trim().toLowerCase())
  ));
}

function getVisibleProducts(isAllSelected, userId, query) {
  let visibleProducts = [...products];

  visibleProducts
    = filterProductsByUser(visibleProducts, isAllSelected, userId);

  visibleProducts
    = filerProductsByQuery(visibleProducts, query);

  return visibleProducts;
}

export const App = () => {
  const [isAllUsersSelected, setIsAllUsersSelected] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');

  const visibleProducts
    = getVisibleProducts(isAllUsersSelected, selectedUserId, searchQuery);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames(
                  {
                    'is-active': isAllUsersSelected,
                  },
                )}
                onClick={() => {
                  setIsAllUsersSelected(true);
                }}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames(
                    {
                      'is-active': !isAllUsersSelected
                      && user.id === selectedUserId,
                    },
                  )}
                  onClick={() => {
                    setIsAllUsersSelected(false);
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={event => (
                    setSearchQuery(event.target.value)
                  )}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
              <ProductTable products={visibleProducts} />
            )}
        </div>
      </div>
    </div>
  );
};
