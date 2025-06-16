"use client"

import { ArrowRight, Calendar, ShoppingBag, Star, Users, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                    {" "}
                    Badminton{" "}
                  </span>
                  Game
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Professional coaching, premium equipment, and a community of passionate players. Elevate your
                  badminton skills at Baddy Sportz.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/lessons">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Book a Lesson
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-2 border-gray-300 hover:border-emerald-600 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Browse Products
                    <ShoppingBag className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <img
                src="/placeholder.svg?height=600&width=500"
                alt="Professional badminton player"
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why Choose Baddy Sportz?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to helping you achieve your badminton goals with expert coaching and premium equipment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Expert Coaching",
                description: "Learn from certified professionals with years of competitive experience.",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: Zap,
                title: "Premium Equipment",
                description: "Access to the latest badminton gear from top brands worldwide.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Star,
                title: "Proven Results",
                description: "Join hundreds of satisfied players who've improved their game with us.",
                color: "from-purple-500 to-purple-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "500+", label: "Happy Students" },
              { number: "10+", label: "Expert Coaches" },
              { number: "5", label: "Years Experience" },
              { number: "1000+", label: "Products Available" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl lg:text-5xl font-bold">{stat.number}</div>
                <div className="text-emerald-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Ready to Start Your Badminton Journey?</h2>
          <p className="text-xl text-gray-600">
            Book your first lesson today and discover what makes Baddy Sportz the premier badminton destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lessons">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-emerald-600 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
