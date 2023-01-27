const Formatter = {
  /** formaterer de givne koordinater på en pæn måde */
  formatCoordinates (_coords, _isMeters, _degrees, _minutes, _seconds, _is3D) {
    let formattedCoordinates = []

    if (_isMeters) {
      formattedCoordinates = this.toMeters(_coords)
    } else {
      if (_degrees) {
        formattedCoordinates = this.toDegrees(_coords, _degrees)
      } else if (_minutes) {
        formattedCoordinates = this.toDegreesAndMinutes(_coords, _degrees, _minutes)
      } else {
        formattedCoordinates = this.toDegreesMinutesAndSeconds(_coords, _degrees, _minutes, _seconds)
      }
    }
    if (_is3D) {
      this.appendThirdParameter(formattedCoordinates, _coords[2])
    } else {
      formattedCoordinates.push('')
    }
    return formattedCoordinates
  },

  toMeters (coords) {
    console.log('format meters')
    let formatted = []
    const degrees1 = coords[0].toFixed(4)
    const degrees2 = coords[1].toFixed(4)

    formatted = [degrees1 + ' m, ', degrees2 + ' m']

    return formatted
  },

  toDegrees (coords) {
    console.log('format degrees')
    const degrees1 = coords[0].toFixed(4)
    const degrees2 = coords[1].toFixed(4)
    const formatted = [degrees1 + ' °N, ', degrees2 + ' °E']

    return formatted
  },

  toDegreesAndMinutes (coords) {
    console.log('format degrees and minutes')
    const degrees1 = Math.floor(coords[0])
    const degrees2 = Math.floor(coords[1])
    const minutes1 = (parseFloat(coords[0] - degrees1) * 60).toFixed(4)
    const minutes2 = (parseFloat(coords[1] - degrees2) * 60).toFixed(4)

    const formatted = [degrees1 + ' ° ' + minutes1 + '\' N, ', degrees2 + ' ° ' + minutes2 + ' \' E']

    return formatted
  },

  toDegreesMinutesAndSeconds (_coords, _degrees, _minutes, _seconds) {
    console.log('format degrees, minutes and seconds')
    const degrees1 = Math.floor(_coords[0])
    const degrees2 = Math.floor(_coords[1])
    const minutes1 = Math.floor((_coords[0] - degrees1) * 60)
    const minutes2 = Math.floor((_coords[1] - degrees2) * 60)
    const seconds1 = ((_coords[0] - degrees1 - minutes1 / 60) * 3600).toFixed(4)
    const seconds2 = ((_coords[1] - degrees2 - minutes2 / 60) * 3600).toFixed(4)
    const formatted = [
      degrees1 + '° ' + minutes1 + '\' ' + seconds1 + '" N, ',
      degrees2 + '° ' + minutes2 + '\' ' + seconds2 + '" E'
    ]
    return formatted
  },

  appendThirdParameter (coordinates, parameter) {
    coordinates[1] += ', '
    coordinates.push(parameter + ' m')
  }
}
export default Formatter
