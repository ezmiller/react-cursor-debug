/**
 * Search
 */
(function() {
	'use strict';

	var $ = require('jquery');

	var React = require('react');
	var moment = require('moment');

	var SearchResult = React.createClass({

		getDefaultProps: function () {
	    return {
	    	resultsBtnLabel: 'Label Not Defined'      
	    };
		},

		handleClick: function(e) {
			e.preventDefault();
			this.props.handler(this.props.data);
		},

		render: function() {
			var authors,
					source = this.props.data;

			authors = source.authors.map(function(author,key) {
				return <span key={key} className="author">{author.firstName} {author.lastName}</span>;
			});

			return (
				<li key={source.id} className="item">
					<img className="image" src={source.imageLinks ? source.imageLinks.thumbnail : 'images/book-icon.svg'} alt="Book Cover" />
					<div className="metadata">
						<h1 className="title">{source.title}</h1>
						<h2 className="subtitle">{source.subtitle}</h2>
						<p className="authors">{authors}</p>
					</div>
					<button onClick={this.handleClick}>{this.props.resultsBtnLabel}</button>
				</li>
			);
		}

	});

	var Search = React.createClass({

		propTypes: {
	    resultsBtnLabel: React.PropTypes.string.isRequired,
	    handler: React.PropTypes.func.isRequired
		},

		getDefaultProps: function () {
	    return {
        resultsBtnLabel: 'Label Not Defined',
        handler: null 
	    };
		},

		getInitialState: function () {
	    return {
        searchValue: '',
        searchResults: [],
        lastUpdate: moment().unix(),
        updating: false
	    };
		},

		handleChange: function(e) {
			var newValue = e.target.value;
			this.setState({searchValue: newValue});
			if (newValue.length > 5 && this.isTimeToUpdate()) {
				this.updateResults(newValue);
			} else if (newValue.length == 0) {
				this.setState({searchResults: []});
			}
		},

		handleKeyDown: function(e) {
			if (e.keyCode === 13) {  // Enter.
				e.preventDefault();
				this.updateResults(this.state.searchValue);
			}
		},

		isTimeToUpdate: function() {
			var now = moment(),
					last = moment.unix(this.state.lastUpdate);
			return now.isAfter(last.add(2,'seconds'));
		},

		updateResults: function(searchValue) {
			console.log('will update results for: ', searchValue);
			var self = this;

			if (this.state.updating) return;
			this.setState({updating: true});

			$.ajax({
				type: 'GET',
				url: 'https://www.googleapis.com/books/v1/volumes?q='+searchValue,
				dataType: 'JSON'
			})
			.done(function(data) {
				self.setState({
					searchResults: data.items, 
					lastUpdate: moment().unix(),
					updating: false
				});
			})
			.fail(function(jqXhr) {
				console.log('search request failed');
			});
		},

		render: function() {
			var result = [];

			result = this.state.searchResults.map(function(source, key) {
				source.volumeInfo.id = source.id;
				return <SearchResult 
									key={source.id} 
									data={source.volumeInfo}
									resultsBtnLabel={this.props.resultsBtnLabel} 
									handler={this.props.handler} />
			}.bind(this));

			return(
				<div className="search-form">
					<input 
						type="text" 
						className="search-field"
						onChange={this.handleChange} 
						onKeyDown={this.handleKeyDown} 
						value={this.state.searchValue} 
						placeholder="Search" />
					<ul className="search-results">
						{result}
					</ul>
				</div>
			);
		}

	});

	module.exports = Search;	

}());