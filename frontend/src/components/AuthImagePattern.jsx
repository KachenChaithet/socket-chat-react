import { Mail, Lock, User, Eye, Home, Phone, Calendar, Star, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const AuthImagePattern = ({ title, subtitle }) => {
    const iconsWithLinks = [
        { icon: Mail, url: "mailto:someone@example.com" },
        { icon: Lock, url: "#" },
        { icon: User, url: "https://www.instagram.com/yourprofile" },
        { icon: Eye, url: "#" },
        { icon: Home, url: "https://www.facebook.com/yourprofile" },
        { icon: Phone, url: "tel:+1234567890" },
        { icon: Calendar, url: "#" },
        { icon: Star, url: "#" },
        { icon: Settings, url: "#" }

    ];
    return (
        <>
            <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
                <div className="max-w-md text-center">
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {iconsWithLinks.map(({icon:Icon,url}, i) => (
                            <div
                                key={i}
                                className={`flex justify-center items-center aspect-square rounded-2xl bg-primary/10 ${i % 2 === 0 ? "animate-pulse" : ""
                                    }`}
                            >

                                <Link to={url}><Icon className="w-6 h-6 text-secondary" /></Link>

                            </div>
                        ))}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    <p className="text-base-content/60">{subtitle}</p>
                </div>
            </div>
        </>
    )
}
export default AuthImagePattern