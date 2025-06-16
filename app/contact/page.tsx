import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Contact Us</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Visit Us</h3>
            <p className="text-gray-600">
              123 Sports Avenue
              <br />
              Badminton City, BC 12345
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Call Us</h3>
            <p className="text-gray-600">(555) 123-4567</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Email Us</h3>
            <p className="text-gray-600">info@baddysportz.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
