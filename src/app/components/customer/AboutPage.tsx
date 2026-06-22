import { Target, Eye, Award, Users, Plane, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">About Tripie Travel & Tours</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Creating unforgettable travel experiences and turning your dream vacations into reality since 2017
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p> Tripie Travel and Tours was established and registered as a business in
              September 2017 due to growing demands. In 2019, we kept moving forward
              to support our partners and clients in surviving and growing their
              businesses amid the crisis.</p> 

              <p> As a growing travel agency, we cater to the needs of travelers who want to
              enjoy the natural beauty of other countries and tourist spots here in the
              Philippines. As well as catering for business purposes and companies.</p> 

              <p> Tripie Travel and Tours is a trusted partner for incentive activities with
              business partners. We are ready to serve our customers’ travel needs, both
              inbound and outbound tours. </p> 

              <p> It is a part of our commitment to keep maintaining and improving our
              services, customer satisfaction, and customer confidence.</p> 

            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-4xl text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Years of Excellence</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-4xl text-primary mb-2">15K+</div>
              <p className="text-muted-foreground">Happy Travelers</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-4xl text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Destinations</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-4xl text-primary mb-2">98%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-accent/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-chart-1/10 rounded-lg">
                  <Target className="w-8 h-8 text-chart-1" />
                </div>
                <h3 className="text-2xl">Our Mission</h3>
              </div>
              <p className="text-muted-foreground">
                We make great efforts to achieve or obtain to be the most professional and customer amenable travel consultants by using our knowledge, experience and contacts in order to serve our customers with tailormade solutions to all of your holiday needs. And be the world' s most trusted and innovative travel management company.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-chart-2/10 rounded-lg">
                  <Eye className="w-8 h-8 text-chart-2" />
                </div>
                <h3 className="text-2xl">Our Vision</h3>
              </div>
              <p className="text-muted-foreground">
                Helping people and companies travel smart and achieve more. Serving our customer, searching their entire satisfaction and providing touristic services of quality, committing to the social, cultural and environmental reality of our country.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Our Core Values</h2>
          <p className="text-xl text-muted-foreground">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-1/10 rounded-full mb-4">
              <Award className="w-8 h-8 text-chart-1" />
            </div>
            <h3 className="mb-3">Excellence</h3>
            <p className="text-muted-foreground">
              We're committed to delivering the highest quality service and attention to detail in every aspect of your journey.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
              <Users className="w-8 h-8 text-chart-2" />
            </div>
            <h3 className="mb-3">Customer Focus</h3>
            <p className="text-muted-foreground">
              Your satisfaction is our top priority. We listen, understand, and tailor every experience to your unique needs.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-3/10 rounded-full mb-4">
              <Plane className="w-8 h-8 text-chart-3" />
            </div>
            <h3 className="mb-3">Innovation</h3>
            <p className="text-muted-foreground">
              We continuously seek new destinations, technologies, and services to enhance your travel experience.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-4/10 rounded-full mb-4">
              <Heart className="w-8 h-8 text-chart-4" />
            </div>
            <h3 className="mb-3">Integrity</h3>
            <p className="text-muted-foreground">
              Honesty and transparency are at the heart of our business. We build trust through ethical practices.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-5/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-chart-5" />
            </div>
            <h3 className="mb-3">Reliability</h3>
            <p className="text-muted-foreground">
              Count on us to be there when you need us, with 24/7 support and expert guidance every step of the way.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-3">Sustainability</h3>
            <p className="text-muted-foreground">
              We promote responsible tourism that respects local cultures, environments, and communities.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let our expert team help you plan the perfect vacation tailored to your dreams and budget.
          </p>
          <a
            href="/#inquiry"
            className="inline-block px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Get Your Free Quote
          </a>
        </div>
      </div>
    </div>
  );
}
