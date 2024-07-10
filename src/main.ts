import { AXRobot, AppMode } from "@autoxing/robot-js-sdk";
import axios from "axios";
import FormData from "form-data";

async function authenticate(): Promise<string> {
  const response = await axios.post(
    "https://dairy.intrtl.tech/api/v2/auth/login",
    {
      login: "your_login", // required
      password: "your_password", //required
      external_user_id: "your_external_user_id",
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

  await axios.post("https://dairy.intrtl.com/api/v2/photos/", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders(),
    },
  });
}

// async function main() {
//   // create an instance of AXRobot
//   const axRobot = new AXRobot(
//     "appid",
//     "appsecret",
//     AppMode.WAN_APP,
//     "https://apiglobal.autoxing.com/",
//     "wss://serviceglobal.autoxing.com/"
//   );

//   // Initialize the AXRobot instance
//   const success = await axRobot.init();
//   if (success) {
//     try {
//       // connect to the specified robot
//       const res = await axRobot.connectRobot({
//         robotId: "robotid",
//       });
//       console.log("connect success: " + res.robotId);
//       // do something with robot
//     } catch (err) {
//       console.log(err);
//     }
//   } else {
//     console.log("failed");
//     // initialization failed
//   }
// }
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
