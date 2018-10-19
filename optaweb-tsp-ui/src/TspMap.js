/*
 * Copyright 2018 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @flow

import L from 'leaflet';
import React from 'react';
import { Map, Marker, Polygon, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import type { LatLng } from 'react-leaflet/lib/types';
import type { LocationHandler, LocationType } from './types.js.flow';

type Props = {
  center: LatLng,
  zoom: number,
  selectedId: number,
  route: Array<LocationType>,
  domicileId: number,
  clickHandler: (e: { latlng: number[] }) => void,
  removeHandler: LocationHandler,
};

function TspMap({
  center,
  zoom,
  selectedId,
  route,
  domicileId,
  clickHandler,
  removeHandler,
}: Props) {
  const homeIcon = L.icon({
    iconUrl: 'if_big_house-home_2222740.png',
    shadowUrl: 'if_big_house-home_2222740_shadow.png',

    iconSize: [24, 24],
    shadowSize: [50, 16],
    iconAnchor: [12, 12],
    shadowAnchor: [16, 2],
    popupAnchor: [0, -10],
  });

  const defaultIcon = new L.Icon.Default();

  return (
    <Map
      center={center}
      zoom={zoom}
      onClick={clickHandler}
      style={{ width: '100vw', height: '100vh' }}
      zoomControl={false} // hide the default zoom control which is on top left
    >
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      {
        route.map(location => (
          <Marker
            key={location.id}
            position={location}
            icon={location.id === domicileId ? homeIcon : defaultIcon}
            onClick={() => removeHandler(location.id)}
          >
            <Tooltip
              // The permanent and non-permanent tooltips are different components
              // and need to have different keys
              key={location.id + (location.id === selectedId ? 'T' : 't')}
              permanent={location.id === selectedId}
            >
              {`Location ${location.id} [Lat=${location.lat}, Lng=${location.lng}]`}
            </Tooltip>
          </Marker>
        ))
      }
      <Polygon
        positions={route}
        fill={false}
      />
    </Map>
  );
}

export default TspMap;
