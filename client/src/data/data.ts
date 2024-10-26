// First create mockedStars.json in your project:
// Make sure this file is in a location accessible to your code, like src/data/mockedStars.json

// Updated getTable.ts
import mockedStarsData from './mockedStars.json';
import emptyContent from './emptyContent.json';
import justText from './justText.json';
import justNumbers from './justNumbers.json';

export async function getTable(label: string): Promise<string[][]> {
  // Handle mocked data first
  if (label == "Star Data") {
    return mockedStarsData.content;  // Access the content array from the JSON
  }
  if (label == "Empty Dataset") {
    return emptyContent.content;
  }
  if (label == "Text Dataset") {
    return justText.content;  // Access the content array from the JSON
  }
  if (label == "Number Dataset") {
    return justNumbers.content;
  }

  try {
    const loadResponse = await fetch(
      "http://localhost:3232/getData?filepath=" + label
    );

    // Handle different response codes using switch
    switch(loadResponse.status) {
      case 200: // Success
        const loadJson = await loadResponse.json();
        return loadJson.content;
        
      case 400: // Bad Request
        const badRequestData = await loadResponse.json();
        throw new Error(`Bad request: ${badRequestData.message}`);
        
      case 404: // Not Found
        const notFoundData = await loadResponse.json();
        throw new Error(`Bad request: ${notFoundData.message}`);
        
      case 500: // Internal Server Error
        const errorData = await loadResponse.json();
        throw new Error(`Server error: ${errorData.message}`);
        
      default:
        throw new Error(`Unexpected response code: ${loadResponse.status}`);
    }

  } catch (error) {
    if (error instanceof Error) {
      throw error;  // Re-throw the error with its original message
    }
    throw new Error("Error in fetch");
  }
}