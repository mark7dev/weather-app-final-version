import React, { Component } from 'react';
import request from 'superagent';

class Country extends Component {

  constructor() {
    super();

     this.state = {
      timezone: '',
      summary: '',
      weekly: [],
      hourly: []
    };
  }

  componentDidMount () {
    this.fetchLocation();
  }

  componentDidUpdate() {
    this.fetchLocation();
  }

  getCoords = (ENDPOINT) => {
    return request.get(ENDPOINT);
  }
  
  fetchWeather = (response) => {
  const coords = response.body.results[0].geometry.location;
  
  const ENDPOINT = `https://api.darksky.net/forecast/012be0be9ed18413001495614a5fac78/${ coords.lat }, ${ coords.lng }`;
  
  request
    .get(ENDPOINT)
    .then(response => {
      console.log(response);
      this.setState({
        weekly: response.body.daily.data,
        hourly: response.body.hourly.data,
        timezone: response.body.timezone,
        summary: response.body.currently.summary
      });
    });
  }
  
  fetchLocation = (e) => {
    const KEY = 'AIzaSyDI1A2yX21EKfyAyso0QgyWOMxWBnBKSLc';
    const COUNTRY = this.props.match.params.cityName;
    const ENDPOINT = `https://maps.googleapis.com/maps/api/geocode/json?address=${ COUNTRY }&key=${ KEY }`;
  
    this
      .getCoords(ENDPOINT)
      .then(this.fetchWeather)
      .catch(error => {
        this.setState({
          timezone: 'Timezone',
          summary: 'Something went wrong. Try again.'
        });
      });
  }
  
  renderIcon = iconName => {
    const icons = {
      'clear-day': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/day.svg',
      'clear-night': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/night.svg',
      'rain': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-6.svg',
      'snow': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-5.svg',
      'sleet': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-7.svg',
      'wind': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/cloudy.svg',
      'fog': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/cloudy.svg',
      'cloudy': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-day-3.svg',
      'partly-cloudy-day': 'https://www.amcharts.com/wp-content/themes/amcharts2/css/img/icons/weather/animated/cloudy-day-1.svg',
      'partly-cloudy-night': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-night-1.svg',
    };
  
     return <img src={ icons[iconName] } />
  }
  
  dateToString = date => {
    return new Date(date * 1000).toLocaleString();
  }

  
  render() {
  return (
    <div>
      <h3>{ this.props.match.params.cityName.toUpperCase () }</h3>
      <h3>{ this.state.timezone }</h3>
      <p>{ this.state.summary }</p>
      <h5>Weekly</h5>
      <div className='week'>
        { this.state.weekly.map(day => {
          return (
            <div className='day'>
              <div className='day__icon'>
                { this.renderIcon(day.icon) }
              </div>
              <p className='day__temp'>{ this.dateToString(day.sunriseTime) }</p>
              <p className='day__temp'>{ this.dateToString(day.sunsetTime) }</p>
              <p className='day__wind'>{ day.windSpeed } m/s</p>
              <p className='day__press'>{ day.pressure } hpa</p>
            </div>
          );
        }) }
      </div>
      <h5>Hourly</h5>
      <table className=''>
        <thead>
          <tr>
            <th>{ new Date().toLocaleString().split(',')[0] }</th>
          </tr>
        </thead>
        <tbody>
          { this.state.hourly.map((hour, index) => {
            return (
              <tr>
                <td>
                  <small>{ index + 1 }</small>
                  <strong> { new Date(hour.time * 1000).getHours() }:00</strong>,
                  { hour.temperature } ºF,
                  <em>{ hour.summary.toLowerCase() }</em>,
                  { hour.windSpeed } m/s,
                  { hour.pressure }
                </td>
              </tr>
            );
          }) }
        </tbody>
      </table>
      </div>
    );
  }
}
export default Country;