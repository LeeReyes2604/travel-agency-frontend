import { Target, Eye, Award, Users, Plane, Heart } from 'lucide-react';
import sunsetImage from '../../../assets/images/sunset.jpg';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-brunson text-5xl font-semibold mb-4 text-[#145889] tracking-wide">About Tripie Travel & Tours</h1>
          <p className="font-poppins text-lg text-[#145889] max-w-3xl mx-auto">
            Creating unforgettable travel experiences and turning your dream vacations into reality since 2017
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-brunson text-4xl font-semibold mb-4 text-[#145889] tracking-wide">Our Story</h2>
            <div className="font-poppins text-justify text-[#145889]">
              <p> Tripie Travel and Tours was established and registered as a business in
              September 2017 due to growing demands. In 2019, we kept moving forward
              to support our partners and clients in surviving and growing their
              businesses amid the crisis.<br /><br /></p> 

              <p> As a growing travel agency, we cater to the needs of travelers who want to
              enjoy the natural beauty of other countries and tourist spots here in the
              Philippines. As well as catering for business purposes and companies.<br /><br /></p>  

              <p> Tripie Travel and Tours is a trusted partner for incentive activities with
              business partners. We are ready to serve our customers’ travel needs, both
              inbound and outbound tours. <br /><br /></p> 

              <p> It is a part of our commitment to keep maintaining and improving our
              services, customer satisfaction, and customer confidence.</p> 

            </div>
          </div>
          <div
            className="rounded-xl overflow-hidden shadow-lg h-[500px] bg-center bg-cover"
            style={{
              backgroundImage:`url(${sunsetImage})`,
            }}
          >
            <div className="w-full h-full bg-black/30 flex items-end p-8">
              <div className="text-white">
                <h3 className="text-3xl font-bold">Explore the World with Us</h3>
                <p className="mt-2 text-white/90">
                  Creating unforgettable travel experiences since 2017.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-accent/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#ffcc00] border border-[#e6b800] rounded-lg p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-poppins text-5xl font-bold mb-4 text-[#145889] tracking-wide">Our Mission</h3>
              </div>
              <p className="font-poppins text-justify text-[#145889]">
                We make great efforts to achieve or obtain to be the most professional and customer amenable travel consultants by using our knowledge, experience and contacts in order to serve our customers with tailormade solutions to all of your holiday needs. And be the world' s most trusted and innovative travel management company.
              </p>
            </div>
            <div className="bg-[#ffcc00] border border-[#e6b800] rounded-lg p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-poppins text-5xl font-bold mb-4 text-[#145889] tracking-wide">Our Vision</h3>
              </div>
              <p className="font-poppins text-justify text-[#145889]">
                Helping people and companies travel smart and achieve more. Serving our customer, searching their entire satisfaction and providing touristic services of quality, committing to the social, cultural and environmental reality of our country.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-brunson text-5xl font-bold mb-4 text-[#145889] tracking-wide">Our Core Values</h2>
          <p className="font-poppins space-y-4 text-[#145889]">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-1/10 rounded-full mb-4">
              <Award className="w-8 h-8 text-chart-1" />
            </div>
            <h3 className="font-poppins font-bold leading-8 text-[#145889]">Excellence</h3>
            <p className="font-poppins space-y-4 text-[#145889]">
              We're committed to delivering the highest quality service and attention to detail in every aspect of your journey.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
              <Users className="w-8 h-8 text-chart-2" />
            </div>
            <h3 className="font-poppins font-bold leading-8 text-[#145889]">Customer Focus</h3>
            <p className="font-poppins space-y-4 text-[#145889]">
              Your satisfaction is our top priority. We listen, understand, and tailor every experience to your unique needs.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-3/10 rounded-full mb-4">
              <Plane className="w-8 h-8 text-chart-3" />
            </div>
            <h3 className="font-poppins font-bold leading-8 text-[#145889]">Innovation</h3>
            <p className="font-poppins space-y-4 text-[#145889]">
              We continuously seek new destinations, technologies, and services to enhance your travel experience.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-4/10 rounded-full mb-4">
              <Heart className="w-8 h-8 text-chart-4" />
            </div>
            <h3 className="font-poppins font-bold leading-8 text-[#145889]">Integrity</h3>
            <p className="font-poppins space-y-4 text-[#145889]">
              Honesty and transparency are at the heart of our business. We build trust through ethical practices.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-5/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-chart-5" />
            </div>
            <h3 className="font-poppins font-bold leading-8 text-[#145889]">Reliability</h3>
            <p className="font-poppins space-y-4 text-[#145889]">
              Count on us to be there when you need us, with 24/7 support and expert guidance every step of the way.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-poppins font-bold leading-8 text-[#145889]">Sustainability</h3>
            <p className="font-poppins space-y-4 text-[#145889]">
              We promote responsible tourism that respects local cultures, environments, and communities.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#ffcc00] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins font-bold text-4xl text-[#145889] mb-8">Ready to Start Your Journey?</h2>
          <p className="font-poppins font-semibold text-lg text-[#145889] mb-8">
            Let our expert team help you plan the perfect vacation tailored to your dreams and budget.
          </p>
          <a
              href="#inquiry"
              className="font-poppins inline-block px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg shadow-md"
              style={{ textShadow: "0 4px 10px rgba(0, 0, 0, 0.6)" }}
            >
              Get Your Free Quote
            </a>
        </div>
      </div>
    </div>
  );
}
