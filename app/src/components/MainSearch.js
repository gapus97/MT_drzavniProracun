import React from 'react';
import Autosuggest from 'react-autosuggest';

class MainSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            stateSuggestions: []
        };
    }

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.stateData.filter(state =>
          state.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    }

    renderSuggestion = (suggestion) => {
        return (
            <span>{ suggestion.name } </span>
        );
    }

    onChange = (event,  { newValue }) => {
        this.setState({
            value: newValue
        });
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            stateSuggestions: this.getSuggestions(value)
        });
    };

    onSearchControlChange = (event) => {
        if (event.target.value) {
            this.props.searchData(event.target.value);
        }
        
    }

    onSuggestionsClearRequested = () => {
        this.setState({
          stateSuggestions: []
        });
    };

    getSuggestionValue = ( suggestion ) => {
        return suggestion.name;
    }

    render() {   

        const { value, stateSuggestions } = this.state;
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Vpiši občino',
            onChange: this.onChange,
            value: value
        };

        if(stateSuggestions.length === 1) {
            // pass data to root (Main.js), to map to this location
            this.props.searchData(stateSuggestions);
        }

        return (
           
                this.props.stateData ?  
                <Autosuggest
                    suggestions={stateSuggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                /> : ""
           
 
        );
    }
}

export default MainSearch;