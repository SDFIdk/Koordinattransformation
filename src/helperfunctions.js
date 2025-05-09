export const epsg25832proj = (proj4object) => {
  proj4object.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
  return proj4object
}
export const epsg32624proj = (proj4object) => {
  proj4object.defs('EPSG:32624', '+proj=utm +zone=24 +datum=WGS84 +units=m +no_defs')
  return proj4object
}

export const epsg3184proj = (proj4object) => {
  proj4object.defs('EPSG:3184','+proj=utm +zone=24 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs')
  return proj4object
}


export const mapCoorToList = (coorObject) => {
  const res = ['v1', 'v2', 'v3', 'v4']
    .map(key => coorObject[key])
    .filter(value => value !== null && value !== undefined)
  return res
}

export const mapListToCoor = (listObject) => {
  const keys = ['v1', 'v2', 'v3', 'v4']
  const res = keys.map((key, index) => ({
    [key]: listObject[index] || null,
  }))
  return res

}
export const extractEPSGCode = (crsString) => {
  return crsString.split(' ').at(-1).slice(1, -1)
}
import Polygon from 'ol/geom/Polygon'

export const getGSearchCenterPoint = (detail) => {
  let coord = {v1: 0.0, v2: 0.0, v3: 0.0, v4: 0.0}
  if (detail.type === 'MultiPolygon') {
    const poly = new Polygon(detail.coordinates[0])
    const interior_point = poly.getInteriorPoint().flatCoordinates
    coord = {v1: Number(interior_point[0].toFixed(5)), v2: Number(interior_point[1].toFixed(5)), v3 : 0.0, v4: 0.0}
  } 
  else if (detail.type === 'MultiLineString') {
    const middlePoint = Math.floor(detail.coordinates[0].length / 2)
    const middleCoords = detail.coordinates[0][middlePoint]
    coord = {v1: middleCoords[0], v2: middleCoords[1], v3: 0.0, v4: 0.0} 
  }
  else if(detail.type === 'MultiPoint') {
    coord = {v1: detail.coordinates[0][0], v2: detail.coordinates[0][1], v3: 0.0, v4: 0.0}
  }
  else {
    console.error(`Error: handling for input geometry of type ${detail.type} missing. Please contact developers.`)
  }
  return coord
}
