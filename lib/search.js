'use strict';

const lunr = require('lunr');

class Search {
  constructor() {
    this.index = lunr(function() {
      this.field('name', {boost: 10});
      this.field('description', {boost: 4});
      this.field('author', {boost: 6});
      this.field('readme');
    });
  }

  query(q) {
	  return q === '*'
      ? this.storage.config.localList.get().map( function( pkg ) {
        return {ref: pkg, score: 1};
      }) : this.index.search(q);
  }

  add(pkg) {
    this.index.add({
      id: pkg.name,
      name: pkg.name,
      description: pkg.description,
      author: pkg._npmUser ? pkg._npmUser.name : '???',
    });
  }

  remove(name) {
    this.index.remove({id: name});
  }

  reindex() {
    let self = this;
    this.storage.get_local(function(err, packages) {
      if (err) throw err; // that function shouldn't produce any
      let i = packages.length;
      while (i--) {
        self.add(packages[i]);
      }
    });
  }

  configureStorage(storage) {
    this.storage = storage;
    this.reindex();
  }
}

module.exports = new Search();
