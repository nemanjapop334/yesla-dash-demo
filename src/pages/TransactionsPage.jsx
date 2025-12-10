// src/pages/TransactionsPage.jsx
import React, { useMemo, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchTransactions } from '../api';
import { exportVisibleDataToExcelTransactions } from '../utils/exportVisibleDataToExcelTransactions';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function TransactionsPage() {
    const [quickFilter, setQuickFilter] = useState('');
    const gridRef = useRef(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
    });

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            filter: true,
            floatingFilter: true,
            resizable: true,
        }),
        []
    );

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'ID',
                field: 'id',
                width: 90,
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: 'Station ID',
                field: 'stationId',
                width: 150,
            },
            {
                headerName: 'Connector ID',
                field: 'connectorId',
                width: 140,
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: 'Location',
                field: 'locationName',
                width: 160,
            },
            {
                headerName: 'Address',
                field: 'locationAddress',
                width: 220,
            },
            {
                headerName: 'IdToken',
                field: 'idToken',
                width: 120,
            },
            {
                headerName: 'Active',
                field: 'isActive',
                width: 110,
                valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
                cellStyle: (p) => ({
                    color: p.value ? '#198754' : '#6c757d',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }),
            },
            {
                headerName: 'Energy (kWh)',
                field: 'totalKwh',
                width: 140,
                filter: 'agNumberColumnFilter',
                valueFormatter: (p) => (p.value != null ? p.value.toFixed(2) : ''),
            },
            {
                headerName: 'Total cost',
                field: 'totalCost',
                width: 130,
                filter: 'agNumberColumnFilter',
                valueFormatter: (p) => (p.value != null ? p.value.toFixed(2) : ''),
            },
            {
                headerName: 'Started at',
                field: 'startTimestamp',
                width: 190,
                valueGetter: (p) => p.data.startTimestamp || p.data.createdAt,
                valueFormatter: (p) =>
                    p.value ? new Date(p.value).toLocaleString(undefined, { hour12: false }) : '',
                filter: 'agDateColumnFilter',
            },
            {
                headerName: 'Updated at',
                field: 'updatedAt',
                width: 190,
                valueFormatter: (p) =>
                    p.value ? new Date(p.value).toLocaleString(undefined, { hour12: false }) : '',
                filter: 'agDateColumnFilter',
            },
            {
                headerName: 'Stopped reason',
                field: 'stoppedReason',
                flex: 1,
                minWidth: 180,
            },
        ],
        []
    );

    const rowData = useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.transactions)) return data.transactions;
        return [];
    }, [data]);

    const handleExportExcel = () => {
        exportVisibleDataToExcelTransactions(gridRef);
    };

    if (isLoading) {
        return (
            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                <h3>Loading transactions...</h3>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ marginTop: '80px', textAlign: 'center', color: 'red' }}>
                Failed to load transactions: {error.message}
            </div>
        );
    }

    if (!rowData.length) {
        return (
            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                <h3>No transactions found.</h3>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '16px', fontStyle: 'italic' }}>Transactions</h2>

            <div
                style={{
                    marginBottom: '10px',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                }}
            >
                <input
                    type="text"
                    placeholder="Search in all columns..."
                    value={quickFilter}
                    onChange={(e) => setQuickFilter(e.target.value)}
                    style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        minWidth: '260px',
                    }}
                />
                <button
                    onClick={() => setQuickFilter('')}
                    style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        backgroundColor: '#f8f9fa',
                        cursor: 'pointer',
                    }}
                >
                    Clear
                </button>

                <button
                    onClick={handleExportExcel}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#198754',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginLeft: 'auto',
                    }}
                >
                    Export Excel
                </button>
            </div>

            <div
                className="ag-theme-quartz"
                style={{
                    height: '80vh',
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                <AgGridReact
                    ref={gridRef}
                    theme="legacy"
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    quickFilterText={quickFilter}
                    pagination={true}
                    paginationPageSize={25}
                    paginationPageSizeSelector={[10, 25, 50, 100]}
                    animateRows={true}
                    enableCellTextSelection={true}
                />
            </div>
        </div>
    );
}

export default TransactionsPage;
