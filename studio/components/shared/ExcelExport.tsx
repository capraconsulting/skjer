import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@sanity/ui";
import { ArrowUpIcon } from "@sanity/icons";
import * as XLSX from "xlsx";

/**
 * This component generates an Excel file from the input data (an array of objects).
 *
 * @param {ExcelObject[]} data An array of objects to be shown the Excel table.
 * @param {string} fileName The name of the Excel file.
 * @returns {ReactNode} A React element that renders a button to the user.
 */

export type ExcelObject = {
  [key: string]: string;
};

export default function ExcelExport({ data, fileName }: { data: ExcelObject[]; fileName: string }) {
  const exportToExcel = async () => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const columnWidths = getColumnWidths(data);
    worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Påmeldinger");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const getColumnWidths = (data: ExcelObject[]) => {
    if (!data.length) return [];

    const keys = Object.keys(data[0]);

    return keys.map((key) => {
      const maxDataLength = Math.max(
        ...data.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      const columnHeaderLength = key.length;
      return Math.max(10, maxDataLength, columnHeaderLength);
    });
  };

  return (
    <Button
      icon={ArrowUpIcon}
      tone="positive"
      fontSize={1}
      onClick={exportToExcel}
      text="Eksporter til Excel"
    />
  );
}
