import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@sanity/ui";
import { ArrowUpIcon } from "@sanity/icons";
import * as XLSX from "xlsx";

/**
 * This component generates an Excel file based on the inputted data.
 *
 * @param {ExcelObject[]} data An array of objects that should be shown the Excel table.
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
    return Object.keys(data[0]).map((key) => {
      return Math.max(10, ...data.map((row) => (row[key] ? row[key].toString().length : 0)));
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
