// src/components/ChargingNavigationTabs.jsx
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation } from 'react-router-dom';

function ChargingNavigationTabs() {
    const location = useLocation();

    const linkStyle = (active) => ({
        fontWeight: 'bold',
        color: active ? '#000000ff' : '#495057',
        borderBottom: active ? '2px solid #3a676fff' : 'none',
    });

    return (
        <Navbar bg="light" className="px-3" style={{ borderBottom: '1px solid #dee2e6' }}>
            <Nav variant="underline" activeKey={location.pathname}>
                <Nav.Item>
                    <Nav.Link
                        href="/chargers"
                        style={linkStyle(location.pathname === '/chargers')}
                    >
                        Chargers
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link
                        href="/transactions"
                        style={linkStyle(location.pathname === '/transactions')}
                    >
                        Transactions
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default ChargingNavigationTabs;
