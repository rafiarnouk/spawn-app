import logo from "../assets/spawnlogo.png"

function Navbar() {
    return (
        <div className="py-4">
            <div className="flex justify-center">
                <img
                    src={logo}
                    alt="Logo"
                    className="h-10"
                />
            </div>
        </div>
    )
}

export default Navbar
