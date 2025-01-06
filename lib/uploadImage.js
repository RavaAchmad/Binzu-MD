import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from 'file-type';

export default async buffer => {
  const { ext, mime } = (await fileTypeFromBuffer(buffer)) || {};
  const form = new FormData();

  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });

  try {
    const response = await axios.post("https://endpoint.web.id/server/upload", form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    if (response.data && response.data.result && response.data.result.url) {
      console.log(response.data.result.url);
      return response.data.result.url;
    } else {
      console.log("URL tidak ditemukan dalam response.");
      return { error: "EMROR." };
    }
  } catch (error) {
    console.log("Error uploading file:", error.message);
    return { error: error.message };
  }
}