import { Link } from "react-router-dom";

const Notfound = () => {
  return <div className="flex flex-col items-center justify-center h-screen gap-3">
    <h1 className="text-4xl text-white">Notfound</h1>
    <p className="text-white/70">The page you are looking for does not exist.</p>
    <Link to="/" className="text-primaryBlue hover:text-primaryBlue/80">Go to home</Link>
  </div>

};

export default Notfound;
