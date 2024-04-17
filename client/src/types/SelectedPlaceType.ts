export interface SelectedPlaceType {
  address_components: AddressComponent[]
  adr_address: string
  business_status: string
  current_opening_hours: CurrentOpeningHours
  delivery: boolean
  dine_in: boolean
  formatted_address: string
  formatted_phone_number: string
  geometry: Geometry
  icon: string
  icon_background_color: string
  icon_mask_base_uri: string
  international_phone_number: string
  name: string
  opening_hours: OpeningHours
  photos: string[]
  place_id: string
  plus_code: PlusCode
  rating: number
  reference: string
  reservable: boolean
  reviews: Review[]
  serves_beer: boolean
  serves_breakfast: boolean
  serves_brunch: boolean
  serves_dinner: boolean
  serves_lunch: boolean
  serves_vegetarian_food: boolean
  serves_wine: boolean
  takeout: boolean
  types: string[]
  url: string
  user_ratings_total: number
  utc_offset: number
  vicinity: string
  website: string
}

export interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export interface CurrentOpeningHours {
  open_now: boolean
  periods: Period[]
  weekday_text: string[]
}

export interface Period {
  close: Close
  open: Open
}

export interface Close {
  date: string
  day: number
  time: string
  truncated?: boolean
}

export interface Open {
  date: string
  day: number
  time: string
}

export interface Geometry {
  location: Location
  viewport: Viewport
}

export interface Location {
  lat: number
  lng: number
}

export interface Viewport {
  northeast: Northeast
  southwest: Southwest
}

export interface Northeast {
  lat: number
  lng: number
}

export interface Southwest {
  lat: number
  lng: number
}

export interface OpeningHours {
  open_now: boolean
  periods: Period2[]
  weekday_text: string[]
}

export interface Period2 {
  close: Close2
  open: Open2
}

export interface Close2 {
  day: number
  time: string
}

export interface Open2 {
  day: number
  time: string
}

export interface PlusCode {
  compound_code: string
  global_code: string
}

export interface Review {
  author_name: string
  author_url: string
  language: string
  original_language: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
  translated: boolean
}
