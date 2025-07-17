"use server";
import { createHmac } from "crypto";
import { convertRoomData } from "@/app/api/convertRoomData";

const consid = process.env.consid;
const secretKey = process.env.secretKey;
const decrypt = process.env.decrypt;

export const generateToken = async () => {
  if (!secretKey || !decrypt) {
    throw new Error("Missing secretKey or decrypt environment variable");
  }
  const tStamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac(decrypt, secretKey)
    .update(tStamp + consid)
    .digest("base64");
  return {
    consid,
    tStamp,
    signature,
  };
};

export async function getAllBedInformation() {
  const url =
    //"http://172.17.12.33/medinfrasapi/rsses/api/bed/information/summary";
    "https://latu.rs-elisabeth.com/medinfrasapi/rsses/api/bed/information/summary";
  console.log(
    `[${new Date().toLocaleTimeString()}] Fetching data from URL: ${url}`
  );
  const token = await generateToken();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-cons-id": `${consid}`,
        "X-timestamp": token.tStamp,
        "X-signature": token.signature,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); // Log error status
    }

    const rawdata = await response.json();
    const data = JSON.parse(rawdata.Data);
    return convertRoomData(data);
  } catch (error) {
    console.error("Error fetching bed information:", error);
    return null;
  }
}

export async function getJKNBedInformation() {
  const url =
    //"http://172.17.12.33/medinfrasapi/rsses/api/v2/centerback/bpjs/aplicares/get/information";
    "https://latu.rs-elisabeth.com/medinfrasapi/rsses/api/v2/centerback/bpjs/aplicares/get/information";

  console.log(
    `[${new Date().toLocaleTimeString()}] Fetching data from URL: ${url}`
  );
  const token = await generateToken();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-cons-id": `${consid}`,
        "X-timestamp": token.tStamp,
        "X-signature": token.signature,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); // Log error status
    }

    const rawdata = await response.json();
    const data = JSON.parse(rawdata.Data);
    return convertRoomData(data);
  } catch (error) {
    console.error("Error fetching bed information:", error);
    return null;
  }
}
