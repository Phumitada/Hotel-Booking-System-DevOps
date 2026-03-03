import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/hooks/useAuth'
import { Hotel, MapPin, Star, User, ArrowRight, CheckCircle, Shield } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register, isRegisterLoading } = useAuth()
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    register(data)
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left side - Hotel Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
        
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Hotel className="w-12 h-12" />
              <h1 className="text-4xl font-bold">Hotel Booking</h1>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold">
            Start Your Journey Today
          </h2>
          
          <p className="text-lg text-white/90 leading-relaxed">
            Join thousands of travelers who trust our platform for their perfect hotel bookings. Create your account and unlock exclusive deals.
          </p>
          
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                <MapPin className="w-8 h-8" />
              </div>
              <p className="text-sm">Global</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Star className="w-8 h-8" />
              </div>
              <p className="text-sm">Premium</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <p className="text-sm">Secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join us and start booking amazing hotels
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  disabled={isRegisterLoading}
                >
                  {isRegisterLoading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </div>
            
            <div className="w-full border-t pt-4">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <CheckCircle className="w-3 h-3" />
                <span>Free account • No credit card required</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
