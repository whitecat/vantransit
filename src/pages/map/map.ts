import { Component, ElementRef, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { TransitService } from '../../providers/transitservice'
import { RouteService } from '../../providers/routeservice'

declare const google

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef
  gMap: any
  currStop: any
  currBus: any
  infoWindow: any
  goImgPos: any
  refreshButton: any
  refreshClass: any
  refreshInterval: any
  autoRefresh
  minZoom = 9
  defaultZoom = 16
  maxZoom = 19
  options = { timeout: 10000, enableHighAccuracy: true }
  prevMap: any
  prevBounds: any
  stopMarkers = []
  busMarkers = []
  stopIcon = {
    url: 'assets/img/bus_stop.png'
  }
  stopIconSelected = {
    url: 'assets/img/bus_stop_h.png'
  }
  eastIcon = {
    url: 'assets/img/east_60.png',
    anchor: this.goImgPos
  }
  westIcon = {
    url: 'assets/img/west_60.png',
    anchor: this.goImgPos
  }
  northIcon = {
    url: 'assets/img/north_60.png',
    anchor: this.goImgPos
  }
  southIcon = {
    url: 'assets/img/south_60.png',
    anchor: this.goImgPos
  }
  eastIconSel = {
    url: 'assets/img/east_60s.png',
    anchor: this.goImgPos
  }
  westIconSel = {
    url: 'assets/img/west_60s.png',
    anchor: this.goImgPos
  }
  northIconSel = {
    url: 'assets/img/north_60s.png',
    anchor: this.goImgPos
  }
  southIconSel = {
    url: 'assets/img/south_60s.png',
    anchor: this.goImgPos
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transService: TransitService,
    private routeService: RouteService
  ) { }

  ionViewDidLoad() {
    this.goImgPos = new google.maps.Point(30, 30)
    this.loadMap()
  }

  setOptions(map) {
    // removes POIs and Transit features off the map
    const noFeatures = [
      {
        featureType: 'poi',
        // Comment out for grey map, green map otherwise.
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
      },
      {
        featureType: 'transit',
        stylers: [
          { visibility: 'off' }
        ]
      }
    ]
    // changes the style of the map so that the above is no longer visible
    map.setOptions({ styles: noFeatures })
  }

  async loadMap() {
    // start my map
    const center = await this.transService.loadMapZoom()

    const mapOptions = {
      center,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      disableDefaultUI: true,
      zoom: center.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom
    }

    this.gMap = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
    this.infoWindow = new google.maps.InfoWindow()
    this.setOptions(this.gMap)
    google.maps.event.addListener(this.gMap, 'idle', event => { this.centerChange() })
    google.maps.event.addListenerOnce(this.gMap, 'tilesloaded', event => { this.changeTermsOfUseClick() })


  }

  async loadMapOld() {
    const prevMapZoom = await this.transService.loadMapZoom()
    const center = { lat: prevMapZoom.lat, lng: prevMapZoom.lng }

    const mapOptions = {
      center,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      disableDefaultUI: true,
      zoom: prevMapZoom.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom
    }

    this.gMap = new google.maps.Map(document.getElementById('map'), mapOptions)
    this.infoWindow = new google.maps.InfoWindow()

    this.setOptions(this.gMap)

    google.maps.event.addListener(this.infoWindow, 'closeclick', this.closeClick())

    this.gMap.addListener('idle', this.centerChange())

    this.gMap.setMyLocationEnabled(true);
    // myLocationButton(map)

    google.maps.event.addListenerOnce(this.gMap, 'tilesloaded', this.changeTermsOfUseClick())
  }

  changeTermsOfUseClick() {
    // const a: any = document.getElementsByClassName('gmnoprint')
    // console.log(a);
    // a.setAttribute('href', "#/app/about/google-terms-and-conditions");
    // a.removeAttribute('target');

  }

  closeClick() {
    if (this.currStop) {
      this.currStop.setIcon(this.stopIcon)
      this.currStop = undefined
    }
    if (this.currBus) {
      this.currBus[0].setIcon(this.currBus[2])
      this.currBus[1].setIcon(this.currBus[3])
      this.currStop = undefined
    }
    this.infoWindow.close()
  }

  // Opens the Json file then for each stop in bounds it calls create marker.
  async populateStops(bounds) {
    if (typeof this.stopMarkers !== 'undefined' && this.stopMarkers.length > 0) {
      this.removeStopMarkers(bounds)
    }
    // Check if zoom is bigger than default, then put stops on the this.map.
    if (this.gMap.getZoom() >= this.defaultZoom) {
      const resp = await this.transService.loadAllStops()
      const stopMarkersJson = resp
      this.addStopMarkers(bounds, stopMarkersJson)
      this.prevBounds = bounds
    } else {
      this.prevBounds = undefined
    }
  }

  // Adds stop markers. If in bounds but not if already there.
  addStopMarkers(bounds, stopMarkersJson) {
    for (const marker of stopMarkersJson) {
      const lat = marker.Latitude
      const lng = marker.Longitude
      // If stop in bounds display
      if (lng >= bounds.west && lat >= bounds.south &&
        lng <= bounds.east && lat <= bounds.north) {
        // If stops in previous bound don't add more.
        if (!this.prevBounds || !(lng >= this.prevBounds.west && lat >= this.prevBounds.south
          && lng <= this.prevBounds.east && lat <= this.prevBounds.north))
          this.createStopMarker(marker)
      }
    }
  }

  // Removes markers from map if zoomed to far out or not on map any more.
  removeStopMarkers(bounds) {
    for (const marker of this.stopMarkers) {
      const latitude = marker.position.lat()
      const longitude = marker.position.lng()

      // if out of bounds delete, or if zoomed too far out delete
      if (latitude < bounds.south
        || latitude > bounds.north
        || longitude > bounds.east
        || longitude < bounds.west
        || this.gMap.getZoom() < this.defaultZoom) {
        marker.setMap(undefined)
      }
    }
  }

  centerChange() {
    const latlng = this.gMap.getCenter()
    const zoom = this.gMap.getZoom()
    const prevMap = {
      zoom,
      lat: latlng.lat(),
      lng: latlng.lng()
    }
    this.transService.saveMapZoom(prevMap)

    this.populateStops(this.gMap.getBounds().toJSON())
  }

  // this creates a marker for each stop on the map.
  createStopMarker(stop) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(stop.Latitude, stop.Longitude),
      map: this.gMap,
      icon: this.stopIcon
    })
    google.maps.event.addListener(marker, 'click', () => {
      this.closeClick()
      this.transService.loadStopEstimates(stop.StopNo).then(resp => {
        this.infoWindow.setContent(this.genStopWindowStr(stop.Name, stop.StopNo, resp))
        this.infoWindow.open(this.gMap, marker)
      }, error => {
        this.infoWindow.setContent('<div class="stopMapPage">' +
          `<div class="stopNameMap">${stop.Name}</div>` +
          `<div class="stopNoMap">${stop.StopNo}</div>` +
          '<div class="busScheduleMap">' +
          '<div class="busScheduleTitle">' +
          '<div id="noBusTitle">No Busses Scheduled</div>' +
          '</div>' +
          `<div class"recordedAt">Recorded at: ${(new Date()).toLocaleTimeString()}</div>` +
          '</div>' +
          '</div>')
        this.infoWindow.open(this.gMap, marker)
        console.log('Failed to get Stops data')
      })
      this.currStop = marker
      marker.setIcon(this.stopIconSelected)
    })
    this.stopMarkers.push(marker)
  }

  genStopWindowStr(name, no, routes) {
    // return '<div>nothing here</div>'
    let rows = ''
    for (let i = 0; i < routes.length; i++) {
      const routeNo = this.routeService.getSplitNo(routes[i].RouteNo)
      let routeTimes = ''
      for (let j = 0; j < routes[i].Schedules.length; j++) {
        routeTimes += this.routeService.departNow(routes[i].Schedules[j].ExpectedCountdown)
        if (j !== routes[i].Schedules.length - 1)
          routeTimes += ', '
      }
      if (i % 2 === 0) {
        rows += '<div class="busScheduleRow">' +
          `<div class="routeLink">${routeNo}</div>` +
          `<div class="busTime">${routeTimes}</div>` +
          '</div>'
      } else {
        rows += '<div class="busScheduleRowAlt">' +
          `<div class="routeLink">${routeNo}</div>` +
          `<div class="busTime">${routeTimes}</div>` +
          '</div>'
      }
    }

    return '<div class="stopMapPage">' +
      `<div class="stopNameMap">${name}</div>` +
      `<div class="stopNoMap">${no}</div>` +
      '<div class="busScheduleMap">' +
      '<div class="busScheduleTitle">' +
      '<div id="routeTitle">Route</div>' +
      '<div id="busTimeTitle">Departing In</div>' +
      '</div>' +
      `<div id="textSchedules">${rows}</div>` +
      `<div class"recordedAt">Recorded at: ${(new Date()).toLocaleTimeString()}</div>` +
      '</div>' +
      '</div>'
  }
  //   myLocationButton(map) {
  //     var locationDiv = document.createElement('div')

  //     var GeoMarker = new GeolocationMarker(map)

  //     var container = document.createElement('button')
  //     container.style.backgroundColor = 'rgba(255,255,255,1)'
  //     container.style.border = 'none'
  //     container.style.outline = 'none'
  //     container.style.width = '28px'
  //     container.style.height = '27px'
  //     container.style.borderRadius = '2px'
  //     container.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
  //     container.style.cursor = 'pointer'
  //     container.style.position = 'relative'
  //     container.style.verticalAlign = 'baseline'
  //     container.style.marginRight = '10px'
  //     container.style.padding = '0'
  //     locationDiv.appendChild(container)

  //     var button = document.createElement('div')
  //     button.style.margin = '5px'
  //     button.style.width = '18px'
  //     button.style.height = '18px'
  //     button.style.backgroundImage = 'url(assets/img/mylocation.png)'
  //     button.style.backgroundSize = '180px 18px'
  //     button.style.backgroundPosition = '0 0'
  //     button.style.backgroundRepeat = 'no-repeat'
  //     button.setAttribute('clicked', 0)
  //     container.appendChild(button)

  //     google.maps.event.addListener(map, 'center_changed', () => {
  //         button.setAttribute('clicked', 0)
  //         button.style['background-position'] = '0 0'
  //     })

  //     container.addEventListener('mouseenter', () => {
  //         if (button.getAttribute('clicked') === 0)
  //             button.style['background-position'] = '-36px 0'
  //     })

  //     container.addEventListener('mouseleave', () => {
  //         if (button.getAttribute('clicked') === 0)
  //             button.style['background-position'] = '0 0'
  //     })

  //     container.addEventListener('click', () => {
  //         // var imgX = '0',
  //         //     animationInterval = setInterval(function () {
  //         //         imgX = imgX === '-18' ? '0' : '-18';
  //         //         button.style['background-position'] = imgX+'px 0';
  //         //     }, 500);
  //         var lat = GeoMarker.position.lat()
  //         var lng = GeoMarker.position.lng()

  //         var latlng = new google.maps.LatLng(lat, lng)
  //         map.setCenter(latlng)
  //         button.setAttribute('clicked', 1)
  //         button.style['background-position'] = '-144px 0'
  //         //             clearInterval(animationInterval);
  //         //             button.style['background-position'] = '-144px 0';
  //         //
  //         //         });
  //         //     } else {
  //         //         clearInterval(animationInterval);
  //         //         button.style['background-position'] = '0 0';
  //         //     }
  //     })

  //     locationDiv.index = 1
  //     map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationDiv)
  // }
}
