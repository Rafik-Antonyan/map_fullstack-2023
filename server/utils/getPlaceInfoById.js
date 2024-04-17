import axios from "axios";

export const getPlaceInfoById = async (place_id) => {
    const data = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.GOOGLE_MAP_API_KEY}`)
    return data
} 