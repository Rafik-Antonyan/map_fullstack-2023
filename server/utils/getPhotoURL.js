export const getPhotoURL = (photo_reference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&maxheight=300&photo_reference=${photo_reference}&key=${process.env.GOOGLE_MAP_API_KEY}`
}