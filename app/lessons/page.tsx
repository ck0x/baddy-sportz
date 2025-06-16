"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const lessonTypes = [
    {
      id: "private",
      name: "Private Lesson",
      price: "$80/hour",
      description:
        "One-on-one coaching tailored to your specific needs and skill level.",
      features: [
        "Personalized training plan",
        "Technique analysis",
        "Flexible scheduling",
      ],
      duration: "60 minutes",
      image: "/images/IMG_8915.jpg?height=300&width=400",
    },
    {
      id: "group",
      name: "Group Class",
      price: "$30/person",
      description:
        "Learn with others in a fun, social environment with professional guidance.",
      features: [
        "Small groups (4-6 people)",
        "Social learning",
        "Cost effective",
      ],
      duration: "90 minutes",
      image: "/images/IMG_8915.jpg?height=300&width=400",
    },
    {
      id: "intensive",
      name: "Intensive Training",
      price: "$150/session",
      description:
        "Advanced training for competitive players looking to excel.",
      features: [
        "Advanced techniques",
        "Match strategy",
        "Performance analysis",
      ],
      duration: "2 hours",
      image: "/images/IMG_8915.jpg?height=300&width=400",
    },
  ];

  const coaches = [
    {
      name: "Uncle Jeff",
      specialty: "Very Professional",
      experience: "69 years",
      rating: 69,
      image: "/images/IMG_6922.jpg?height=200&width=200",
    },
    {
      name: "Bjorn the Beast",
      specialty: "The Beast",
      experience: "69 years",
      rating: 69,
      image: "/images/82723.jpg?height=200&width=200",
    },
    {
      name: "Eden Au",
      specialty: "WestLake girls ONLY",
      experience: "69 years",
      rating: 69,
      image: "/images/2.png?height=200&width=200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Professional Badminton
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              {" "}
              Lessons
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Take your badminton skills to the next level with our expert
            coaches. Choose from private lessons, group classes, or intensive
            training programs.
          </p>
        </div>
      </section>

      {/* Lesson Types */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Training Style
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {lessonTypes.map((lesson) => (
              <Card
                key={lesson.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={lesson.image || "/placeholder.svg"}
                    alt={lesson.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {lesson.price}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    {lesson.name}
                  </CardTitle>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {lesson.duration}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{lesson.description}</p>
                  <ul className="space-y-2">
                    {lesson.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full transition-all duration-300 transform hover:scale-105"
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    Book {lesson.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Expert Coaches
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {coaches.map((coach, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <img
                    src={coach.image || "/placeholder.svg"}
                    alt={coach.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {coach.name}
                    </h3>
                    <p className="text-emerald-600 font-medium">
                      {coach.specialty}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {coach.experience} experience
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-900 font-medium">
                      {coach.rating}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Book Your Lesson
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-type">Lesson Type</Label>
                  <Select>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select lesson type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private Lesson</SelectItem>
                      <SelectItem value="group">Group Class</SelectItem>
                      <SelectItem value="intensive">
                        Intensive Training
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" type="date" className="rounded-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9am">9:00 AM</SelectItem>
                      <SelectItem value="11am">11:00 AM</SelectItem>
                      <SelectItem value="2pm">2:00 PM</SelectItem>
                      <SelectItem value="4pm">4:00 PM</SelectItem>
                      <SelectItem value="6pm">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Notes</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your goals or any specific requirements..."
                  className="rounded-2xl"
                  rows={4}
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                <Calendar className="mr-2 h-5 w-5" />
                Book Lesson
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Visit Our Training Center
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">
                      123 Sports Avenue, Badminton City, BC 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Operating Hours
                    </p>
                    <p className="text-gray-600">
                      Monday - Friday: 6:00 AM - 10:00 PM
                    </p>
                    <p className="text-gray-600">
                      Saturday - Sunday: 8:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Training facility"
                className="w-full h-80 object-cover rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
