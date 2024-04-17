import axios from "axios";
import { getPhotoURL } from "./getPhotoURL.js";

export const placesAround = async ({ radius, lat, lng, type, res }) => {
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
    const location = `location=${lat},${lng}`;
    const formatedRadius = `&radius=${radius}`;
    const formatedType = `&keyword=${type}`;
    const key = `&key=${process.env.GOOGLE_MAP_API_KEY}`;
    const searchedResult =
        url + location + formatedRadius + formatedType + key;
    const { data } = await axios.get(searchedResult)

    const promiseArray = []
    for (let i = 0; i < data.results.length; i++) {
        let promise = axios({
            url: getPhotoURL(data.results[i].photos?.[0].photo_reference),
            method: 'GET',
            responseType: 'arraybuffer'
        })
        promiseArray.push(promise)
    }

    Promise.all(promiseArray).then(resp => {
        data.results.forEach((result, index) => {
            result.photos = "data:image/jpeg;base64," + Buffer.from(resp[index].data, 'binary').toString('base64')
        })
        res.status(200).json({
            message: `${type} getted successfully.`,
            data: data.results
        })
    });

}