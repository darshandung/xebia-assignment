import React from 'react';
import PropTypes from 'prop-types';
import swAxiosInstance from '../../configs/axios-custom-instance';
import SearchBox from '../search/index';
import {
  randomColor,
  populationFormatConverter,
  getPlanets
} from './random-color';

class Planets extends React.Component {
    constructor() {
      super();
      this.state = {
        planets: [],
        maxPopulation: 0,
        searchKeyword: '',
      }
    }

    search = (searchTerm) => {
      this.setState({ searchKeyword: searchTerm });
    }

    async fetchPlanets() {
      let max = 0, pageNo = 1;
      let results = await getPlanets(pageNo);

      while(results && results.data && results.data.next != null) {
        this.setState({ planets: [ ...this.state.planets, ...results.data.results ] });
        results = await getPlanets(++pageNo);
      }

      this.state.planets.forEach(function (planet) {
        if (planet.population != "unknown") {
          if (parseInt(planet.population, 10) > max) {
            max = parseInt(planet.population, 10);
          }
        }
      });
      this.setState({ maxPopulation: max });
    }

    componentDidMount() {
      this.fetchPlanets();
    }

    render() {
      let state = this.state;
      let { store } = this.context;
      let storeData = store.getState();

      return (
        <div class='container'>
        <div class="row">
        <div class="col-md-12 col-sm-12 no-padding planets-component">
          <div class="row">
            <div class="col-md-4 col-md-offset-4">
              <SearchBox search={this.search} />
            </div>
          </div>
          

          <div class="loggedin-user">
            Logged In User - { storeData.loginReducer.userDetails.name }
          </div>

          <div class="col-md-12 col-sm-12 planets-container">
            {
              this.state.planets.map(function (planet, index) {
                if (planet.name.toLowerCase().indexOf(state.searchKeyword.toLowerCase()) != -1) {
                  return (
                    <div
                      style={{
                        width: planet.population === 'unknown' ? 100 : 100 + ( 350 * ( parseInt(planet.population, 10)  / state.maxPopulation ) ) + 'px',
                        background: randomColor(),
                      }}
                      class="planets"
                      title={ 'Planet Name: ' + planet.name + '; Planet Population: ' + planet.population }
                      key={index}
                    >
                      <span class="planet-name">
                        { planet.name }
                      </span>
                      <span class="planet-population">
                        { populationFormatConverter(planet.population) }
                      </span>
                    </div>
                  );
                } else {
                  return null;
                }
              }).filter(function (updatedPlanet) {
                if (updatedPlanet !== null) {
                  return true;
                }

                return false;
              })
            }
          </div>
           
        </div>
        </div>
        </div>
      )
    }
};

Planets.contextTypes = {
  store: PropTypes.object
};

export default Planets;
