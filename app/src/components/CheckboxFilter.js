import React from 'react';



class CheckboxFilter extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {}
        props.values.map((v, i) => {
            this.state[v] = false
        })
    }
    
    onChange(key, value) {
        this.setState({ [key]: value }, (state) => {
            console.log("CHild 2", value);
            this.props.onChange(this.state)
        })
    }
  
    render() {
        return (
            <div className="list-group-item form-group">
                  {this.props.values.map((value, i) => (
                      <div className="checkbox" key={i}>
                          <label>
                              <input 
                                  onChange={(e) => this.onChange(value, e.target.checked)} 
                                  type='checkbox' 
                                  value={this.state[value]}
                              />
                              {value}
                          </label>
                      </div>
                  ))}
            </div>
        )
    }
}

export default CheckboxFilter;