#!/bin/bash

URL="http://192.168.12.1:8090/services/get_rgb_image"
PAYLOAD='{"topic": "/rgb_cameras/front/compressed"}'
RESPONSE_FILE="response.json"
IMAGE_FILE="image.jpg"

curl -X POST -H "Content-Type: application/json" -d "${PAYLOAD}" ${URL} -o ${RESPONSE_FILE}

# Check if the response file was created
if [ ! -f ${RESPONSE_FILE} ]; then
  echo "Failed to get response from the server."
  exit 1
fi

# Extract the base64-encoded image data from the JSON response
image_base64=$(jq -r '.data' ${RESPONSE_FILE})

# Check if the image data was extracted
if [ -z "${image_base64}" ]; then
  echo "Failed to extract image data from the response."
  exit 1
fi

# Decode the base64 data
echo "${image_base64}" | base64 --decode > ${IMAGE_FILE}

# Check if the image file was created
if [ ! -f ${IMAGE_FILE} ]; then
  echo "Failed to save the image."
  exit 1
fi

echo "Image saved successfully as ${IMAGE_FILE}"

# Clean up the temporary response file
rm ${RESPONSE_FILE}
