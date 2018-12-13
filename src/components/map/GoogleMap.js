import React from 'react';
import {Cacher } from '../../services/cacher';
import { withScriptjs, withGoogleMap, GoogleMap, Circle,
InfoWindow } from "react-google-maps"

function MapComponent(props){
const {coordinates, isError, isLocationLoaded} = props;
    return(
        <GoogleMap
            defaultZoom={13}
            defaultCenter={ coordinates }
            center={coordinates}
            options={{disableDefaultUI: isError ? true : false}}>
               {isLocationLoaded && !isError && <Circle center={coordinates} radius={500} />}
               {isLocationLoaded && isError && 
            <InfoWindow position={coordinates } options={{maxWidth:300}}>
                   <div>
                       There is an issue in the location
                   </div>
               </InfoWindow>}
        </GoogleMap>
    )
}

function withGeocode(WrappedComponent){
    return class extends React.Component{

        constructor(){
            super();
            this.Cacher = new Cacher();
            this.state = {
                coordinates: {
                    lat:0,
                    lng:0
                },
                isError : false,
                isLocationLoaded:false
            }
        }

        componentWillMount(){
            this.getGeocodedLocacation();
        }

        updateCoordinates(coordinates){
            this.setState({
                coordinates,
                isLocationLoaded:true
            })
        }

        geocodeLocation(location) {
            const geocoder = new window.google.maps.Geocoder();

            return new Promise( (resolve, reject) => {
                geocoder.geocode({'address': location}, (results, status) => {
                    console.log('inside geocode');
                    if (status === 'OK'){
                        const geometry = results[0].geometry.location;
                        const coordinates = {lat:geometry.lat(), lng:geometry.lng()};
                        this.Cacher.cacheValue(location, coordinates);
                        
                        resolve(coordinates);
                    }
                    else {
                        reject("Geocode was not successful for the following reason: " + status);
                      }
                })
            });
        }

        getGeocodedLocacation(){
            const location = this.props.location;
            //const location = 'sdfsdfsfslmkm123123';
            // if location is cached, return values
            if (this.Cacher.isValueCached(location)){
                this.updateCoordinates(this.Cacher.getCachedValue(location));
            // else geocode location
            } else {
                this.geocodeLocation(location).then(
                    (coordinates) => {
                        this.updateCoordinates(coordinates);
                    },
                    (error) => {
                        this.setState({isError:true, isLocationLoaded:true});
                    }
                );
            }
        }
        render(){
            return <WrappedComponent {...this.state}/>
        }
    }
}

export const MyMapGeocode= withScriptjs(withGoogleMap(withGeocode(MapComponent)));

