import React, { useMemo, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchUsers } from '../api';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function UsersPage() {
    const [quickFilter, setQuickFilter] = useState('');
    const gridRef = useRef(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
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
            { headerName: 'ID', field: 'id', width: 90, filter: 'agNumberColumnFilter' },
            { headerName: 'Email', field: 'email', flex: 1, minWidth: 220 },
            { headerName: 'Full name', field: 'fullName', width: 180 },
            { headerName: 'Phone', field: 'phone', width: 140 },
            { headerName: 'User ref.', field: 'userReference', width: 130 },
            {
                headerName: 'Has Card',
                field: 'hasCard',
                width: 120,
                valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
                cellStyle: (p) => ({
                    color: p.value ? '#198754' : '#dc3545',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }),
            },
            {
                headerName: 'Onboarding',
                field: 'hasCompletedOnboarding',
                width: 130,
                valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
                cellStyle: (p) => ({
                    color: p.value ? '#198754' : '#6c757d',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }),
            },
            {
                headerName: 'Anonymized',
                field: 'isAnonymized',
                width: 130,
                valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
                cellStyle: (p) => ({
                    color: p.value ? '#dc3545' : '#198754',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }),
            },
            {
                headerName: 'Created',
                field: 'createdAt',
                width: 190,
                valueFormatter: (p) =>
                    p.value ? new Date(p.value).toLocaleString(undefined, { hour12: false }) : '',
                filter: 'agDateColumnFilter',
            },
        ],
        []
    );

    const rowData = useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data.users)) return data.users;
        if (Array.isArray(data)) return data;
        return [];
    }, [data]);

    if (isLoading) {
        return (
            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                <h3>Loading users...</h3>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ marginTop: '80px', textAlign: 'center', color: 'red' }}>
                Failed to load users: {error.message}
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '16px', fontStyle: 'italic' }}>Users</h2>

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
                    type="button"
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
                    pagination
                    paginationPageSize={50}
                    paginationPageSizeSelector={[25, 50, 100, 200]}
                    animateRows
                    enableCellTextSelection
                />
            </div>
        </div>
    );
}

export default UsersPage;
