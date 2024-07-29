import { AXRobot, AppMode } from "@autoxing/robot-js-sdk";
import axios from "axios";
import FormData from "form-data";

async function authenticate(): Promise<string> {
  const response = await axios.post(
    "https://poc.intrtl.com/api/v2/auth/login",
    {
      login: "efrobotics.poc", // required
      password: "efrobotics1" //required
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.token; // Assuming the token is returned in the response data
}

async function getImageStream(): Promise<Buffer> {
  const response = await axios.post(
    "http://localhost:8090/services/get_rgb_image",
    {
      topic: "/rgb_cameras/front/compressed",
    },
    {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return Buffer.from(response.data);
}

async function sendImageStream(token: string, imageStream: Buffer) {
  const form = new FormData();
  form.append("visit_id", "434"); //required
  form.append("photo_id", "4343"); //required
  form.append("task_id", "your_task_id"); // Replace with actual task_id
  form.append("photo_data", imageStream, {
    filename: "photo.jpg",
    contentType: "image/jpeg",
  });

  await axios.post("https://demo.intrtl.com/api/v2/photos/", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders(),
    },
  });
}

async function main() {
  try {
    const token = await authenticate();
    const imageStream = await getImageStream();
    await sendImageStream(token, imageStream);
    console.log("Image stream sent successfully");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
main().catch((error) => console.error(error));
