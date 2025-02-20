import { Instagram, Linkedin } from 'lucide-react';

function Footer() {
    return (
        <footer className="py-6 text-gray-700">
            <div className="container mx-auto flex justify-between px-6">
                <p className="text-sm">&copy; {new Date().getFullYear()} Spawn</p>
                <div className="flex space-x-6">
                    <a href="https://www.instagram.com/spawnapp/" target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-6 h-6" />
                    </a>
                    <a href="https://www.linkedin.com/company/spawnapp/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer