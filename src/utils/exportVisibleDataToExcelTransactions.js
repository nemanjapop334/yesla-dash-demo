// src/utils/exportVisibleDataToExcelTransactions.js
import * as XLSX from "sheetjs-style";

export const exportVisibleDataToExcelTransactions = (gridRef) => {
    if (!gridRef.current) {
        console.warn("Grid reference not available.");
        return;
    }

    // Visible (displayed) columns in current grid state
    const visibleColumns = gridRef.current.api
        .getAllDisplayedColumns()
        .map((col) => col.getColId());

    // Map field/colId -> header label
    const columnDefsMap = {
        id: "ID",

        // ✅ NOVO
        userEmail: "User Email",
        companyName: "Company",
        companyPib: "Company PIB",
        companyMb: "Company MB",

        stationId: "Station ID",
        connectorId: "Connector ID",
        locationName: "Location",
        locationAddress: "Address",
        idToken: "IdToken",
        isActive: "Active",
        totalKwh: "Energy (kWh)",
        totalCost: "Total cost",
        startTimestamp: "Started at",
        stopTimestamp: "Stoped at",
        timeSpentCharging: "Time spent charging (min)",
        stoppedReason: "Stopped reason",
    };

    // Format dates for these columns (ako hoćeš i stopTimestamp - dodaj)
    const dateFields = ["startTimestamp", "stopTimestamp", "updatedAt"];

    const visibleRowData = [];

    // Iterate rows AFTER filter & sort
    gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
        const row = [];

        visibleColumns.forEach((col) => {
            let value;

            switch (col) {
                case "startTimestamp":
                    // same logic as in grid: startTimestamp || createdAt
                    value = node.data?.startTimestamp || node.data?.createdAt;
                    break;

                // ✅ NOVO: company valueGetter kolone
                case "companyName":
                    value = node.data?.company?.name ?? "";
                    break;
                case "companyPib":
                    value = node.data?.company?.pib ?? "";
                    break;
                case "companyMb":
                    value = node.data?.company?.mb ?? "";
                    break;

                default:
                    value = node.data?.[col];
            }

            // Format dates
            if (dateFields.includes(col) && value) {
                try {
                    value = new Date(value).toLocaleString("en-GB", { hour12: false });
                } catch (e) {
                    // fallback to raw value if parsing fails
                }
            }

            // Boolean formatting
            if (col === "isActive") {
                value = value ? "Yes" : "No";
            }

            // Numeric formatting
            if (col === "totalKwh" || col === "totalCost") {
                if (value != null && !Number.isNaN(Number(value))) {
                    value = Number(value).toFixed(2);
                }
            }

            row.push(value ?? "");
        });

        visibleRowData.push(row);
    });

    // Header row based on visible columns & mapping
    const headerRow = visibleColumns.map((col) => columnDefsMap[col] || col);

    const fullData = [headerRow, ...visibleRowData];

    const ws = XLSX.utils.aoa_to_sheet(fullData);

    // Style header row
    headerRow.forEach((_, colIdx) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIdx });
        if (!ws[cellAddress]) return;
        ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "000000" } },
            fill: { fgColor: { rgb: "D9D9D9" } },
            alignment: { horizontal: "center", vertical: "center" },
        };
    });

    // Auto column width
    const colWidths = headerRow.map((_, colIdx) => {
        const maxLength = fullData.reduce((max, row) => {
            const val = row[colIdx] ? row[colIdx].toString() : "";
            return Math.max(max, val.length);
        }, 10);
        return { wch: maxLength + 2 };
    });
    ws["!cols"] = colWidths;

    // Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
    const fileName = `Transactions_${formattedDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
};
