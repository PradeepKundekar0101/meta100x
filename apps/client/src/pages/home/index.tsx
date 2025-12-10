import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <main style={{}} className=" h-screen hero">
      <div className=" flex w-full flex-col justify-center items-center h-[80vh] text-center space-y-6">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-1 rounded-full text-sm font-medium text-gray-600 mb-4">
          <div className="flex -space-x-2">
            <img
              className="w-6 h-6 rounded-full border-2 border-white"
              src="https://avatar.vercel.sh/1"
              alt="avatar"
            />
            <img
              className="w-6 h-6 rounded-full border-2 border-white"
              src="https://avatar.vercel.sh/2"
              alt="avatar"
            />
            <img
              className="w-6 h-6 rounded-full border-2 border-white"
              src="https://avatar.vercel.sh/3"
              alt="avatar"
            />
          </div>
          <span>Trusted by 500+ Virtual Explorers</span>
        </div>
        <h1 className=" text-6xl text-gray-800 font-bold max-w-4xl leading-tight font-orbitron">
          Connect in a <br />
          <span className="text-blue-500">Limitless 2D World</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Create your avatar, design your personal space, and interact with
          friends in real-time. Experience a new dimension of social connection.
        </p>
        <Button className="bg-primaryBlue text-white hover:bg-gray-800 px-8 py-6 rounded-full text-lg mt-4">
          Enter the Metaverse
        </Button>
      </div>
    </main>
  );
};

export default Home;
