export const googleMapStyles = {
  draggableCursor: 'default',
  draggingCursor: 'grab',
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.business',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ],
}
