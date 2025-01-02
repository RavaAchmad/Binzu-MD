import axios from "axios";
import fs from "fs";
import FormData from "form-data"
import { fileTypeFromBuffer } from 'file-type';

export default async (buffer) {
const { ext, mime } = (await fileTypeFromBuffer(buffer)) || {};
  const form = new FormData();

  //const fileStream = fs.createReadStream(path);
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });
  try {
    const response = await axios.post("https://endpoint.web.id/server/upload", form, {
      headers: {
        ...form.getHeaders(), 
      },
    });

    return response.data
  } catch (error) {
    return error.message
  }
}