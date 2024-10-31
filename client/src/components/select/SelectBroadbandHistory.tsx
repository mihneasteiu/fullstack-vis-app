import "../../styles/main.css";
import { histEntry } from "./Select";
import { getTable } from "../../data/data";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import React, { useEffect } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { Table } from "./Table";
import { BarChart } from "./BarChart";

/**
 * Props interface for the SelectBroadbandHistory component.
 */
interface SelectBroadbandHistoryProps {
  /** The US state to query broadband data for */
  state: string;
  /** The county within the state to query broadband data for */
  county: string;
}

/**
 * Component that displays broadband coverage information for a specific county and state.
 * Fetches data from a local API endpoint and handles loading, error, and success states.
 *
 * @component
 * @example
 * ```tsx
 * <SelectBroadbandHistory
 *   state="California"
 *   county="Los Angeles"
 * />
 * ```
 *
 * Features:
 * - Automatically fetches data when state and county props change
 * - Displays loading state while fetching
 * - Shows error messages if the fetch fails
 * - Cleanses input data by removing spaces and converting to lowercase
 * - Formats broadband percentage to 1 decimal place
 *
 * @param props - Component props
 * @param props.state - The state name to query
 * @param props.county - The county name to query
 * @returns A div containing either loading state, error message, or broadband coverage data
 */
export function SelectBroadbandHistory(props: SelectBroadbandHistoryProps) {
  const state = props.state;
  const county = props.county;
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state !== "" && county !== "") {
      const fetchBroadBandData = async () => {
        setLoading(true);
        setError(null);
        try {
          const broadbandResult = await getBroadBand(state, county);
          setResult(broadbandResult);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Error in fetch");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchBroadBandData();
    }
  }, [state, county]);

  if (loading) {
    return <div>Data is loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return <div>{result}</div>;
}

/**
 * Fetches broadband coverage data from the local API endpoint.
 *
 * @param state - The state name to query
 * @param county - The county name to query
 * @returns A formatted string containing the broadband coverage percentage
 * @throws Error with appropriate message if the request fails
 *
 * Response Status Codes:
 * - 200: Success - Returns formatted coverage data
 * - 400: Bad Request - Invalid state/county combination
 * - 404: Not Found - Data not found for state/county
 * - 500: Server Error - Internal API error
 *
 * @example
 * ```typescript
 * try {
 *   const result = await getBroadBand("California", "Los Angeles");
 *   console.log(result); // "Los Angeles county, California broadband coverage is 93.3%"
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export async function getBroadBand(state: string, county: string): Promise<string> {
  try {
    const cleanString = (input: string): string =>
      input.replace(/\s+/g, "").toLowerCase();
    const cleaned_state = cleanString(state);
    const cleaned_county = cleanString(county);
    const response = await fetch(
      `http://localhost:3232/broadband?state=${cleaned_state}&county=${cleaned_county}`
    );

    const query = `State ${state} and county ${county}`;
    // Handle different response codes using switch
    switch (response.status) {
      case 200: // Success
        const loadJson = await response.json();
        return `${county}, ${state} broadband coverage is ${loadJson.data.percentage.toFixed(
          1
        )}%`;

      case 400: // Bad Request
        const badRequestData = await response.json();
        throw new Error(
          `Bad request: ${badRequestData.message}. Query: ${query}`
        );

      case 404: // Not Found
        const notFoundData = await response.json();
        throw new Error(
          `Bad request: ${notFoundData.message}. Query: ${query}`
        );

      case 500: // Internal Server Error
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.message}. Query: ${query}`);

      default:
        throw new Error(
          `Unexpected response code: ${response.status}.  Query: ${query}`
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error in fetch");
  }
}
