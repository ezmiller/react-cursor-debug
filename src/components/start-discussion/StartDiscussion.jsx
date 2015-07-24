/**
 * StartDiscussion
 */

(function() {
  'use strict';

  var React = require('react');
  var Search = require('./Search.jsx');
  var Cursor = require('react-cursor').Cursor;
  var ImmutableOptimizations = require('react-cursor').ImmutableOptimizations;
  
  var Source = React.createClass({

    getDefaultProps: function () {
      return {
        source: null  
      };
    },

    handleClick: function(e) {
      e.preventDefault();
      // publish('/app/transitionTo', ['/source/'+this.props.source.get('id')]);
      this.props.onClick(e, this.props.source);
    },

    render: function() {
      var source, authors;

      source = this.props.source;

      authors = !source ? null : source.authors.map(function(author,key) {
        return <span key={key} className="author">{author.firstName} {author.lastName}</span>;
      });

      return(
        <article className="source book eight columns" onClick={this.handleClick}>
          <div className="cover">
            <img className="image" src={source.imageLinks.thumbnail} alt="Book Cover" />
          </div>
          <div className="info">
            <div className="meta">
              <h3 className="title">{source.title}</h3>
              <h5 className="subtitle">{source.subtitle}</h5>
              <span className="authors">by {authors}</span>
            </div>
          </div>
        </article>
      );
    }

  });

  var SourceSelector = React.createClass({

    propTypes: {
      selected: React.PropTypes.instanceOf(Cursor).isRequired
    },

    getDefaultProps: function () {
      return {
        selected: null  
      };
    },

    getInitialState: function () {
      return {
        addingSource: false  
      };
    },

    componentWillUpdate: function (nextProps, nextState) {
      console.log('SourceSelector::componentWillUpdate():', {nextState:nextState, nextProps:nextProps});
    },

    componentWillReceiveProps: function (nextProps) {
      console.log('SourceSelector::componentWillReceiveProps():', {nextProps:nextProps});
    },

    handleAddSourceClick: function() {
      this.setState({addingSource: true});
    },

    handleRemoveSourceClick: function(e, source) {
      var newSelected;

      console.log('before:', this.props.selected.value);
      
      newSelected = this.props.selected.value.filter(function(v) {
        return v.id !== source.id;
      });

      if (newSelected.length === 0) newSelected = [];

      console.log('after removing source, newSelected:', newSelected);

      this.props.selected.set(newSelected);
    },

    handleSearchFormClick: function(source) {
      var selected = this.props.selected.value;
      selected.push(source);
      this.props.selected.set(selected);
      this.setState({addingSource: false});
    },

    render: function() {
      var selected, selectedSourceItems;

      selected = this.props.selected.value;

      console.log('SourceSelector::render() called');

      selectedSourceItems = selected !== null && selected.length > 0 ? selected.map(function(item, i) {
        return <Source key={i} source={item} onClick={this.handleRemoveSourceClick} />;
      }.bind(this)) : null;

      return (
        <div className="source-selector">
          {selectedSourceItems}
          <div className="add-source" onClick={this.handleAddSourceClick}>Add Source</div>
          <Search resultsBtnLabel="Add" handler={this.handleSearchFormClick} />
        </div>
      );
    }

  });

  var StartDiscussion = React.createClass({

    // mixins: [ImmutableOptimizations(['sources'])],

    getInitialState: function () {
      return {
        title: '',
        prompt: '',
        private: true,
        visible: false,
        sources: []
      };
    },

    componentWillUpdate: function (nextProps, nextState) {
      console.log('StartDiscussion::componentWillUpdate():', {nextState:nextState, nextProps:nextProps});
    },

    componentWillReceiveProps: function (nextProps) {
      console.log('StartDiscussion::componentWillReceiveProps():', {nextProps:nextProps});
    },

    handleSubmit: function(e) {
      var data;

      e.preventDefault();

      data = this.state;
      data.owner = this.props.user.value.id;
      console.log('submitting new discussion: ', data);

      Actions.createDiscussion(data);
    },

    handleChange: function(e) {
      var target, nextState = {};
      target = e.target.name; 
      nextState[target] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      this.setState(nextState);
    },

    render: function() {
      var cursor = Cursor.build(this);

      console.log('StartDiscussion::render()', this.state);

      return (
        <div className="start-discussion eight columns offset-by-two">
          <div className="form-wrap">
            <form id="start-discussion" onSubmit={this.handleSubmit}>
              <h4>Start a Discussion</h4>
              <div>
                <input 
                  type="text" name="title" 
                  placeholder="Discussion Title" 
                  onChange={this.handleChange} 
                  value={this.state.title} />
              </div>
              <div>
                <input 
                  type="text" 
                  name="prompt" 
                  placeholder="Topic or Prompt" 
                  onChange={this.handleChange} 
                  value={this.state.prompt} />
              </div>
              <div>
                <input 
                  type="checkbox" 
                  id="private" 
                  name="private" 
                  onChange={this.handleChange} 
                  checked={this.state.private} />
                <label htmlFor="private">Private Discussion</label>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  id="visible" 
                  name="visible" 
                  onChange={this.handleChange} 
                  checked={this.state.visible} />
                <label htmlFor="visible">Visible to Public  </label>
              </div>
              <div>
                <SourceSelector selected={cursor.refine('sources')} />
              </div>
              <button id="cancel" name="cancel">Cancel</button>
              <button id="start" name="start">Start</button>
            </form>
          </div>
        </div>
      );
    },

    onSync: function(discussion) {
      console.log('StartDiscussion::onSync() called:', discussion);
    },

    onSyncError: function(err) {
      console.log('StartDiscussion::onSyncError() called:', error);
    }

  });

  React.render(<StartDiscussion />, document.getElementById('container'));

}());