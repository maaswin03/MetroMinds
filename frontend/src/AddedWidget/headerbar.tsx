import './headerbar.css'

function Headerbar() {
    return (
        <div>
            <div className="headerbar1">
                <h1>Our Solution</h1>
                <div className='headerbar2'>
                    <li><a href="">Flood Monitoring</a></li>
                    <li><a href="">City Sound Monitoring</a></li>
                    <li><a href="">Traffic Monitoring</a></li>
                    <li><a href="">Disaster Management</a></li>
                    <li><a href="">Waste Management</a></li>
                </div>
            </div>
        </div>
    );
}

export default Headerbar;