import React, { Component } from 'react';

import './App.css';

import request from 'superagent';

import Home from './components/Home';
import About from './components/About';
import Terms from './components/Terms';
import Country from './components/Country';

import { Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();

     this.state = {
       cities: [{
         id: 1,
         name: ''
        }],
      show: false,
      timezone: 'Timezone',
      summary: 'Add a new city.',
      weekly: [],
      hourly: []
    };
  }

   showInput = () => {
    this.setState({
      show: true
    });
  }

  addCity = (e) => {
    //I.If ENTER was pressed
    const ENTER_KEY = 13;

    if (e.keyCode === ENTER_KEY) {
      //II. Save new city in 'cities'.
      this.setState({
        cities: [
          //III. Get past data
          ...this.state.cities,
          {
            id: this.state.cities.length + 1,
            name: e.target.value
          }
        ],
        show: false
      });

      //IV. Clean the input.
      e.target.value = '';
    }
  }
  

  render() {
    return (
      <div className='app'>
        <header className='app__header'>
          <button onClick={ this.showInput } className='app__add'>
            <i className='fa fa-plus-circle' /> New city
          </button>
          <div>
            <Link to='/about'>About</Link>
            <Link to='/terms'>Terms</Link>
            <Link to='/'>Home</Link>
          </div>
        </header>
        <div className='grid'>
          <aside className='app__aside'>
            <h1 className='app__title'>All countries</h1>
            { this.state.cities.map(city => {
              return  <Link
                        key={ city.id }
                        className='app__country'
                        to={ `/country/${ city.name.toLowerCase() }` }
                      >
                        { city.name }
                      </Link>
            }) }
            { this.state.show && <input onKeyUp={ this.addCity } autoFocus type='text' placeholder='Location' className='app__input' /> }
          </aside>
          <section className='app__view'>
            <div>
              <Switch>
                <Route exact path='/' component={ Home } />
                <Route exact path='/about' component={ About } />
                <Route exact path='/terms' component={ Terms } />
                <Route path='/country/:cityName' component={ Country } />
              </Switch>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

 export default App;
