import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@sanity/ui";
import { ArrowUpIcon } from "@sanity/icons";

export default function ExcelExport({ data, fileName }) {
  const exportToExcel = async () => {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(data);

    const columnWidths = getColumnWidths(data);
    worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Påmeldinger");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const getColumnWidths = (data) => {
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
