const Formatter = {
    toMetres (coords) {
        let formatted = []

        const degrees1 = coords[0].toFixed(4)
        const degrees2 = coords[1].toFixed(4)

        formatted = [degrees1 + ' m, ', degrees2 + ' m']

        return formatted
    },

    toDegrees (coords) {
        const degrees1 = coords[0].toFixed(4)
        const degrees2 = coords[1].toFixed(4)
        const formatted = [degrees1 + ' °N, ', degrees2 + ' °E']

        return formatted
    },

    toDegreesAndMinutes (coords) {
        const degrees1 = Math.floor(coords[0])
        const degrees2 = Math.floor(coords[1])
        const minutes1 = (parseFloat(coords[0] - degrees1) * 60).toFixed(4)
        const minutes2 = (parseFloat(coords[1] - degrees2) * 60).toFixed(4)

        const formatted = [degrees1 + ' ° ' + minutes1 + '\' N, ', degrees2 + ' ° ' + minutes2 + ' \' E']

        return formatted
    },

    toDegreesMinutesAndSeconds (coords) {
        const degrees1 = Math.floor(coords[0])
        const degrees2 = Math.floor(coords[1])
        const minutes1 = Math.floor((coords[0] - degrees1) * 60)
        const minutes2 = Math.floor((coords[1] - degrees2) * 60)
        const seconds1 = ((coords[0] - degrees1 - minutes1 / 60) * 3600).toFixed(4)
        const seconds2 = ((coords[1] - degrees2 - minutes2 / 60) * 3600).toFixed(4)

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
