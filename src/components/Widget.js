import React, { Component } from "react";
import "./Widget.css";
import moment from "moment";
import { mockComponent } from "react-dom/test-utils";
import cardImg from "./images/4.jpg";
export default class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: undefined,
      lon: undefined,
      city: undefined,
      tempC: undefined,
      img: undefined,
      sunrise: undefined,
      sunset: undefined,
      err: undefined,
      date: undefined,
    };
  }
  // we need to find the geo location of the user
  getPosition() {
    // navigator.geolocation.getCurrentPosition(success[, error[, [options]])
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords);
        resolve(position);
      }, reject);
    });
  }

  async getWeather(latitude, longitude) {
    console.log(process.env.REACT_APP_WEATHER_API_KEY);
    const api_call = await fetch(
      `//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=998c901d34ec248477b5630b4fb3f7b9&units=metric`
    );

    // getting current date

    let curr = moment();
    let date_t = curr.format("dddd, MMMM Do YYYY");

    api_call.json().then((data) => {
      this.setState({
        lat: latitude,
        lon: longitude,
        city: data.name,
        tempC: Math.round(data.main.temp),
        img: data.weather[0].icon,
        date: date_t,
        sunrise: moment.unix(data.sys.sunrise).format("hh:mm a"),
        sunset: moment.unix(data.sys.sunset).format("hh:mm a"),
      });
      console.log("i have set the city to ", data.name);
      console.log(data);
    });
  }

  componentDidMount() {
    this.getPosition()
      .then((position) => {
        console.log("i have the position");
        this.getWeather(position.coords.latitude, position.coords.longitude);
      })
      .catch((error) => {
        console.log(error.message);
      });
    console.log(this.state);

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    if (this.state.city) {
      return (
        // we will be getting the weather data through geographic coordinates
        <div
          className="UserCard"
          style={{
            backgroundImage: "url(" + cardImg + ")",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="RowUser">
            <div className="UserCardTop">
              <h1>{this.state.date}</h1>
              <div>
                <img
                  alt="weather_icon"
                  src={`http://openweathermap.org/img/w/${this.state.img}.png`}
                />
              </div>
              <div className="data">{this.state.city}</div>
              <div className="data">Temperature: {this.state.tempC}°C</div>
              <div className="data">Sunrise: {this.state.sunrise}</div>
              <div className="data">Sunset: {this.state.sunset}</div>
            </div>
          </div>
        </div>
      );
    } else {
      console.log(this.state.city);
      return <div>Loading</div>;
    }
  }
}
