import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Gamepad2,
  Users,
  Shield,
  Zap,
  Globe,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="h-screen hero flex flex-col justify-center items-center text-center space-y-6 relative">
        <div className="flex w-full flex-col justify-center items-center h-[80vh] text-center space-y-6">
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
          <h1 className="text-6xl text-gray-800 font-bold max-w-4xl leading-tight font-orbitron">
            Connect in a <br />
            <span className="text-blue-500">Limitless 2D World</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Create your avatar, design your personal space, and interact with
            friends in real-time. Experience a new dimension of social
            connection.
          </p>
          <Button className="bg-primaryBlue text-white hover:bg-gray-800 px-8 py-6 rounded-full text-lg mt-4">
            Enter the Metaverse
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-orbitron">
              Why Choose Our Metaverse?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience features designed to bring people together in a fun,
              interactive, and secure environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-10 h-10 text-blue-500" />}
              title="Real-time Interaction"
              description="Connect with friends and meet new people instantly through voice, video, and chat."
            />
            <FeatureCard
              icon={<Gamepad2 className="w-10 h-10 text-purple-500" />}
              title="Immersive Gaming"
              description="Play mini-games, compete in challenges, and explore interactive worlds together."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-green-500" />}
              title="Safe & Secure"
              description="Your privacy is our priority. Enjoy a safe environment with robust moderation tools."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-orbitron">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Jump into the metaverse in just three
              simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Step
              number="01"
              title="Create Your Avatar"
              description="Customize your digital identity with unique outfits and accessories."
            />
            <Step
              number="02"
              title="Join a Space"
              description="Enter public squares or create private rooms for you and your friends."
            />
            <Step
              number="03"
              title="Start Exploring"
              description="Walk around, chat, play games, and attend virtual events."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-orbitron">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Is it free to join?"
              answer="Yes! You can join and explore the metaverse for free. Some premium items may require purchase."
            />
            <FAQItem
              question="Can I create my own room?"
              answer="Absolutely. You can create private rooms to hang out with friends or host meetings."
            />
            <FAQItem
              question="What devices are supported?"
              answer="Our platform is accessible via any modern web browser on desktop and mobile devices."
            />
            <FAQItem
              question="Is voice chat available?"
              answer="Yes, we support spatial audio so you can hear people closer to you louder, just like real life."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 font-orbitron">
            Ready to Dive In?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users already exploring the future of social
            interaction.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 rounded-full text-lg font-bold">
            Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-white text-xl font-bold mb-4 font-orbitron">
                Metaverse
              </h3>
              <p className="text-sm">
                Connecting people through immersive virtual experiences.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Mobile
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Safety Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Metaverse Inc. All rights
              reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Zap className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="mb-4 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
        {icon}
      </div>
      <CardTitle className="text-xl font-bold text-gray-900">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 text-base">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

const Step = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="text-4xl font-bold text-blue-100 mb-4 font-orbitron">
      {number}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <div className="border-b border-gray-200 pb-4 last:border-0">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default Home;
