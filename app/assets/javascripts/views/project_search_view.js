var SearchResultsBarView = require('./search_results_bar_view');
var StoryView = require('./story_view');

module.exports = Backbone.View.extend({

  initialize: function() {
  },

  events: {
    "submit": "doSearch"
  },

  addBar: function(column) {
    var view = new SearchResultsBarView({model: this.model}).render();
    this.appendViewToColumn(view, column);
  },

  addStory: function(story, column) {
    var view = new StoryView({model: story, isSearchResult: true}).render();
    this.appendViewToColumn(view, column);
    view.setFocus();
  },

  appendViewToColumn: function(view, columnName) {
    $(columnName).append(view.el);
  },

  addAll: function() {
    this.$('.loading-spin').addClass('show');
    var that = this;
    var searchedTerm = this.$el.find('input[type=text]').val();
    that.$ = $;
    that.$('#search_results').html("");
    that.$('.search_results_column').show();
    that.$('.search_results_column')
        .find('.toggle-title')
        .text(`\"${searchedTerm}\"`);

    this.addBar('#search_results');

    var search_results_ids = this.model.search.pluck("id");
    var stories = this.model.stories;
    _.each(search_results_ids, function(id) {
      var story = stories.get(id);
      if (!_.isUndefined(story)) {
        that.addStory(story, '#search_results');
      } else {
        // the search may return IDs that are not in the stories collection in the client-side
        // because of the STORIES_CEILING configuration
      }
    });

    this.$('.loading-spin').removeClass('show');
  },

  doSearch: function(e) {
    e.preventDefault();
    var that = this;
    this.model.search.fetch({
      data: {
        q: this.$el.find('input[type=text]').val()
      },
      reset: true,
      success: function() {
        that.addAll();
      },
      error: function(e) {
        window.projectView.notice({
          title: 'Search Error',
          text: e
        });
      }
    });
  },

});
