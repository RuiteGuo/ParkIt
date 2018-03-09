 /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var latitude;
var longtitude;
var parkedLatitude;
var parkedLongtitude;
var storage;

function init() {
    document.addEventListener("deviceready",onDeviceReady,false);
    storage = window.localStorage;

}

function onDeviceReady() {
    var node = document.createElement('link');
    node.setAttribute('rel','stylesheet');
    node.setAttribute('type','text/css');
    if (cordova.platformId =='ios') {
        node.setAttribute('href','parkitIOS.css');
        window.StatusBar.overlaysWebView(false);
        window.StatusBar.styleDefault();

    } else {
        node.setAttribute('href','parkitandroid.css');
        window.StatusBar.backgroundColorByHexString ('#1565C0');
    }
    document.getElementsByTagName('head')[0].appendChild(node);

}

function setCss (elm,prop, val) {
    var node = document.getElementById(elm).style;
    node.setProperty(prop,val);

}

function setParkingLocation () {
    navigator.geolocation.getCurrentPosition(setParkingLocationSuccess, locationError, {enableHighAccuracy:true});
}
function setParkingLocationSuccess(position) {
    latitude = position.coords.latitude;
    longtitude = position.coords.longitude;
    storage.setItem('parkedLatitude',latitude);
    storage.setItem('parkedLongtitude',longtitude);
    navigator.notification.alert("parking location was successfully saved");
    showParkingLocation();
}
function locationError(error) {
    navigator.notification.alert("Error Code: " + error.code + "\n Error Message: "+error.message);
}
 function showParkingLocation(){
     setCss('directions','visibility','hidden');
     setCss('instructions','display','none');
     var latLong = new google.maps.LatLng(latitude, longtitude);
     var map = new google.maps.Map(document.getElementById('map'));
     map.setZoom(16);
     map.setCenter(latLong);
     var marker = new google.maps.Marker({
         position: latLong,
         map: map
     });
     setCss('map','visibility','visible');
 }


 function getParkingLocation () {
     navigator.geolocation.getCurrentPosition(getParkingLocationSuccess, locationError, {enableHighAccuracy:true});
 }
 function getParkingLocationSuccess(position) {
     latitude = position.coords.latitude;
     longtitude = position.coords.longitude;
     // storage.setItem('parkedLatitude',latitude);
     // storage.setItem('parkedLongtitude',longtitude);

     parkedLatitude = storage.getItem('parkedLatitude');
     parkedLongtitude = storage.getItem('parkedLongtitude');

     navigator.notification.alert("parking location was successfully saved");
     showDirections();
 }

 function showDirections() {
     var dRenderer = new google.maps.DirectionsRenderer;
     var dService = new google.maps.DirectionsService;
     var currentLatLong = new google.maps.LatLng(latitude,longtitude);
     var parkedLatLong = new google.maps.LatLng(parkedLatitude,parkedLongtitude);
     var map = new google.maps.Map(document.getElementById('map'));
     map.setZoom(16);
     map.setCenter(currentLatLong);
     dRenderer.setMap(map);
     dService.route({
         origin: currentLatLong,
         destination: parkedLatLong,
         travelMode: 'DRIVING'
     }, function(response,status){
         if(status == 'OK') {
             dRenderer.setDirections(response);
             document.getElementById('directions').innerHTML='';
             dRenderer.setPanel(document.getElementById('directions'));

         } else {
             navigator.notification.alert("Directions failed due to : "+ status);
         }
     })
     setCss('map','visibility','visible');
     setCss('directions','visibility','visible');
     setCss('instructions','display','none');
 }