// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertRoomData(data: any): any[] {
  // If data is already an array, return it as is
  if (Array.isArray(data)) {
    return data;
  }

  // If data is a string, parse it
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing room data:", error);
      return [];
    }
  }

  // If data is an object with a Data property that's a string, parse it
  if (
    data &&
    typeof data === "object" &&
    data.Data &&
    typeof data.Data === "string"
  ) {
    try {
      return JSON.parse(data.Data);
    } catch (error) {
      console.error("Error parsing room data from Data property:", error);
      return [];
    }
  }

  // Default case - return empty array
  return [];
}
