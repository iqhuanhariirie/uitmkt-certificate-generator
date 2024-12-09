import Papa, { ParseResult } from "papaparse";
import { v4 as uuidv4 } from 'uuid';
import { Guest } from "./uploadToFirestore";
import { Timestamp } from "firebase/firestore";

export const parseCSV = (csvFile: File): Promise<Guest[]> => {
  console.log("Starting CSV parse with file:", csvFile);
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      complete: ({ data: csvData }: ParseResult<{ email: string, name: string, studentID: string, course: string, group: string, part: number }>) => {
        console.log("Raw CSV Data:", csvData);
        
        const nonEmptyRows = csvData
          .map(Object.entries)
          .filter(row => row.every(r => r[1]?.trim?.().length != 0))
          .map<typeof csvData[0]>(Object.fromEntries);
        
        console.log("Non-empty Rows:", nonEmptyRows);

        const guests: Guest[] = nonEmptyRows.map((row) => ({
          certId: uuidv4(),
          name: row.name,
          email: row.email,
          studentID: row.studentID,
          course: row.course,
          part: Number(row.part),
          group: row.group
        }));

        console.log("Parsed Guests:", guests);
        resolve(guests);
      },
      error: (error: any) => {
        console.error("CSV Parsing Error:", error);
        reject(error);
      },
    });
  });
};
