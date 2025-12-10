const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');

export async function fetchChargers() {
    const res = await fetch(`${API_BASE}/chargers`);
    if (!res.ok) throw new Error('Failed to fetch chargers');
    // ovde backend već vraća { ChargingStations: [...] }
    const data = await res.json();
    return data.ChargingStations || [];
}

// očekujem body tipa { connectorId, stationId ... }
export async function startCharging(connectorId) {
    const res = await fetch(`${API_BASE}/chargers/${connectorId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to start charging');
    return res.json();
}

// --- TRANSACTIONS ---
export async function fetchTransactions() {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
}

export async function stopTransaction(transactionId) {
    const res = await fetch(`${API_BASE}/transactions/${transactionId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to stop transaction');
    return res.json();
}
