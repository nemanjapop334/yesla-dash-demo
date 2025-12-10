// src/pages/ChargersPage.jsx
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchChargers } from '../api';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function ChargersPage() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['chargers'],
        queryFn: fetchChargers,
    });

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'Station ID',
                field: 'stationId',
                sortable: true,
                filter: true,
                width: 170,
            },
            {
                headerName: 'Online',
                field: 'isOnline',
                width: 110,
                valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
                cellStyle: (p) => ({
                    color: p.value ? '#198754' : '#dc3545',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }),
            },
            {
                headerName: 'Location name',
                field: 'locationName',
                sortable: true,
                filter: true,
                width: 180,
            },
            {
                headerName: 'Address',
                field: 'address',
                flex: 1,
                minWidth: 220,
                filter: true,
            },
            {
                headerName: 'City',
                field: 'city',
                sortable: true,
                filter: true,
                width: 140,
            },
            {
                headerName: 'Connector ID',
                field: 'connectorId',
                width: 140,
                sortable: true,
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: 'Connector status',
                field: 'status',
                width: 170,
                sortable: true,
                filter: true,
                cellStyle: (p) => {
                    const s = p.value;
                    if (s === 'Preparing') {
                        return {
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            fontWeight: 'bold',
                        };
                    }
                    if (s === 'Available') {
                        return {
                            backgroundColor: '#d1e7dd',
                            color: '#0f5132',
                        };
                    }
                    if (s === 'Charging') {
                        return {
                            backgroundColor: '#cfe2ff',
                            color: '#084298',
                        };
                    }
                    return {};
                },
            },
        ],
        []
    );

    const rowData = useMemo(() => {
        if (!data) return [];
        return data.flatMap((station) =>
            station.Connectors.map((conn) => ({
                stationId: station.id,
                isOnline: station.isOnline,
                locationName: station.Location?.name ?? '',
                address: station.Location?.address ?? '',
                city: station.Location?.city ?? '',
                state: station.Location?.state ?? '',
                connectorId: conn.connectorId,
                status: conn.status,
            }))
        );
    }, [data]);

    if (isLoading) {
        return (
            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                <h3>Loading chargers...</h3>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ marginTop: '80px', textAlign: 'center', color: 'red' }}>
                Failed to load chargers: {error.message}
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '16px', fontStyle: 'italic' }}>Chargers & connectors</h2>

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
                    rowData={rowData}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={25}
                    animateRows={true}
                />
            </div>
        </div>
    );
}

export default ChargersPage;
