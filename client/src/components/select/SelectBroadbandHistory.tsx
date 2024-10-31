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
 * A interface for the props that are passed into SelectHistory.
 *
 * @params
 * history: an array holding the history entries that are to be
 *  outputted to the end-user in the main output area
 */
interface SelectBroadbandHistoryProps {
    state: string;
    county: string;
  }
  
  /**
   * Builds a SelectHistory component that displays the output area according
   *  to any commands inputted by the user.
   *
   * @param props the history entries (see SelectHistoryProps for more details)
   * @returns JSX that will print a tabular view of the passed in data
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

    async function getBroadBand(state: string, county: string): Promise<string> {
        try {
            const cleanString = (input: string): string => input.replace(/\s+/g, '').toLowerCase();
            const cleaned_state = cleanString(state);
            const cleaned_county = cleanString(county);
            const response = await fetch(
                `http://localhost:3232/broadband?state=${cleaned_state}&county=${cleaned_county}`
            );
            
            const query = `State ${state} and county ${county}`;
            // Handle different response codes using switch
            switch(response.status) {
              case 200: // Success
                const loadJson = await response.json();
                return `${county} county, ${state} broadband coverage is ${loadJson.data.percentage.toFixed(1)}%`;
                
              case 400: // Bad Request
                const badRequestData = await response.json();
                throw new Error(`Bad request: ${badRequestData.message}. Query: ${query}`);
                
              case 404: // Not Found
                const notFoundData = await response.json();
                throw new Error(`Bad request: ${notFoundData.message}. Query: ${query}`);
                
              case 500: // Internal Server Error
                const errorData = await response.json();
                throw new Error(`Server error: ${errorData.message}. Query: ${query}`);
                
              default:
                throw new Error(`Unexpected response code: ${response.status}.  Query: ${query}`);
            }
        
          } catch (error) {
            if (error instanceof Error) {
              throw error;
            }
            throw new Error("Error in fetch");
          }
    }