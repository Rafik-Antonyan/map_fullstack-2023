import { CoordinatesType } from '../../types/CoordinatesType'

export const getCountryNameByCoordinates = ({ lng, lat }: CoordinatesType): string => {
  new window.google.maps.Geocoder().geocode({ location: { lat, lng } }, function (results, status) {
    if (status === window.google.maps.GeocoderStatus.OK) {
      if (results?.[0]) {
        const adrs_comp = results[0].address_components
        let loc_name
        for (let i = 0; i < adrs_comp.length; i++) {
          if (adrs_comp[i].types[0] === 'locality') {
            loc_name = adrs_comp[i].long_name

            return loc_name
          }
        }
      }
    }
  })

  return ''
}
