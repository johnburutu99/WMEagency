import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Star,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  Shield,
} from "lucide-react";
import { cn } from "../lib/utils";

interface BookingFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  
  // Event Details
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: Date | undefined;
  eventLocation: string;
  eventDuration: string;
  
  // Artist/Talent
  artistName: string;
  artistCategory: string;
  specialRequests?: string;
  
  // Budget & Payment
  budgetRange: string;
  paymentMethod: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Additional Information
  hearAboutUs: string;
  additionalNotes?: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
}

const initialFormData: BookingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  eventType: "",
  eventTitle: "",
  eventDescription: "",
  eventDate: undefined,
  eventLocation: "",
  eventDuration: "",
  artistName: "",
  artistCategory: "",
  specialRequests: "",
  budgetRange: "",
  paymentMethod: "",
  billingAddress: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  },
  hearAboutUs: "",
  additionalNotes: "",
  termsAccepted: false,
  marketingConsent: false,
};

export default function BookingForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const updateBillingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        break;
      
      case 2: // Event Details
        if (!formData.eventType) newErrors.eventType = "Event type is required";
        if (!formData.eventTitle.trim()) newErrors.eventTitle = "Event title is required";
        if (!formData.eventDate) newErrors.eventDate = "Event date is required";
        if (!formData.eventLocation.trim()) newErrors.eventLocation = "Event location is required";
        if (!formData.eventDuration) newErrors.eventDuration = "Event duration is required";
        break;
      
      case 3: // Artist/Talent
        if (!formData.artistName.trim()) newErrors.artistName = "Artist/talent name is required";
        if (!formData.artistCategory) newErrors.artistCategory = "Artist category is required";
        break;
      
      case 4: // Budget & Payment
        if (!formData.budgetRange) newErrors.budgetRange = "Budget range is required";
        if (!formData.paymentMethod) newErrors.paymentMethod = "Payment method is required";
        if (!formData.billingAddress.street.trim()) newErrors["billingAddress.street"] = "Street address is required";
        if (!formData.billingAddress.city.trim()) newErrors["billingAddress.city"] = "City is required";
        if (!formData.billingAddress.state.trim()) newErrors["billingAddress.state"] = "State is required";
        if (!formData.billingAddress.zipCode.trim()) newErrors["billingAddress.zipCode"] = "ZIP code is required";
        break;
      
      case 5: // Review & Submit
        if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Prepare form data for submission
      const submissionData = {
        ...formData,
        eventDate: formData.eventDate?.toISOString() || "",
      };

      const response = await fetch("/api/booking/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to email verification page
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&bookingId=${data.data.bookingId}`);
      } else {
        setErrors({ submit: data.error || "Failed to submit booking request" });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-wme-gold mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Personal Information</h2>
              <p className="text-gray-400">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-200">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className="bg-black/20 border-gray-600 text-white"
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-200">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className="bg-black/20 border-gray-600 text-white"
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email Address *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="bg-black/20 border-gray-600 text-white pl-10"
                  placeholder="Enter your email address"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-200">Phone Number *</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="bg-black/20 border-gray-600 text-white pl-10"
                  placeholder="Enter your phone number"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-200">Company/Organization (Optional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => updateFormData("company", e.target.value)}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="Enter your company name"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-wme-gold mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Event Details</h2>
              <p className="text-gray-400">Tell us about your event</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-gray-200">Event Type *</Label>
              <Select value={formData.eventType} onValueChange={(value) => updateFormData("eventType", value)}>
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert/Live Performance</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="private-party">Private Party</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="awards-show">Awards Show</SelectItem>
                  <SelectItem value="film-tv">Film/TV Production</SelectItem>
                  <SelectItem value="commercial">Commercial/Advertisement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.eventType && <p className="text-red-400 text-sm">{errors.eventType}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventTitle" className="text-gray-200">Event Title *</Label>
              <Input
                id="eventTitle"
                value={formData.eventTitle}
                onChange={(e) => updateFormData("eventTitle", e.target.value)}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="Enter event title"
              />
              {errors.eventTitle && <p className="text-red-400 text-sm">{errors.eventTitle}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventDescription" className="text-gray-200">Event Description</Label>
              <Textarea
                id="eventDescription"
                value={formData.eventDescription}
                onChange={(e) => updateFormData("eventDescription", e.target.value)}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="Describe your event in detail..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-200">Event Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-black/20 border-gray-600 text-white",
                        !formData.eventDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.eventDate ? format(formData.eventDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.eventDate}
                      onSelect={(date) => updateFormData("eventDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.eventDate && <p className="text-red-400 text-sm">{errors.eventDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDuration" className="text-gray-200">Event Duration *</Label>
                <Select value={formData.eventDuration} onValueChange={(value) => updateFormData("eventDuration", value)}>
                  <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2-hours">1-2 hours</SelectItem>
                    <SelectItem value="3-4-hours">3-4 hours</SelectItem>
                    <SelectItem value="half-day">Half day (4-6 hours)</SelectItem>
                    <SelectItem value="full-day">Full day (8+ hours)</SelectItem>
                    <SelectItem value="multi-day">Multi-day event</SelectItem>
                  </SelectContent>
                </Select>
                {errors.eventDuration && <p className="text-red-400 text-sm">{errors.eventDuration}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventLocation" className="text-gray-200">Event Location *</Label>
              <div className="relative">
                <Input
                  id="eventLocation"
                  value={formData.eventLocation}
                  onChange={(e) => updateFormData("eventLocation", e.target.value)}
                  className="bg-black/20 border-gray-600 text-white pl-10"
                  placeholder="Enter event location (city, state, venue)"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              {errors.eventLocation && <p className="text-red-400 text-sm">{errors.eventLocation}</p>}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-wme-gold mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Artist & Talent</h2>
              <p className="text-gray-400">Who would you like to book?</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artistName" className="text-gray-200">Artist/Talent Name *</Label>
              <Input
                id="artistName"
                value={formData.artistName}
                onChange={(e) => updateFormData("artistName", e.target.value)}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="Enter artist or talent name"
              />
              {errors.artistName && <p className="text-red-400 text-sm">{errors.artistName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artistCategory" className="text-gray-200">Category *</Label>
              <Select value={formData.artistCategory} onValueChange={(value) => updateFormData("artistCategory", value)}>
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="musician">Musician/Band</SelectItem>
                  <SelectItem value="actor">Actor/Actress</SelectItem>
                  <SelectItem value="comedian">Comedian</SelectItem>
                  <SelectItem value="speaker">Speaker/Public Figure</SelectItem>
                  <SelectItem value="athlete">Athlete</SelectItem>
                  <SelectItem value="dj">DJ/Electronic Artist</SelectItem>
                  <SelectItem value="dancer">Dancer/Choreographer</SelectItem>
                  <SelectItem value="influencer">Social Media Influencer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.artistCategory && <p className="text-red-400 text-sm">{errors.artistCategory}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialRequests" className="text-gray-200">Special Requests or Requirements</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => updateFormData("specialRequests", e.target.value)}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="Any special requirements, technical needs, or requests..."
                rows={4}
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <DollarSign className="w-12 h-12 text-wme-gold mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Budget & Payment</h2>
              <p className="text-gray-400">Financial information</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budgetRange" className="text-gray-200">Budget Range *</Label>
              <Select value={formData.budgetRange} onValueChange={(value) => updateFormData("budgetRange", value)}>
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-10k">Under $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                  <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="over-1m">Over $1,000,000</SelectItem>
                </SelectContent>
              </Select>
              {errors.budgetRange && <p className="text-red-400 text-sm">{errors.budgetRange}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-gray-200">Preferred Payment Method *</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => updateFormData("paymentMethod", value)}>
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="financing">Financing Options</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && <p className="text-red-400 text-sm">{errors.paymentMethod}</p>}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Billing Address</h3>
              
              <div className="space-y-2">
                <Label htmlFor="street" className="text-gray-200">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.billingAddress.street}
                  onChange={(e) => updateBillingAddress("street", e.target.value)}
                  className="bg-black/20 border-gray-600 text-white"
                  placeholder="Enter street address"
                />
                {errors["billingAddress.street"] && <p className="text-red-400 text-sm">{errors["billingAddress.street"]}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-200">City *</Label>
                  <Input
                    id="city"
                    value={formData.billingAddress.city}
                    onChange={(e) => updateBillingAddress("city", e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                    placeholder="Enter city"
                  />
                  {errors["billingAddress.city"] && <p className="text-red-400 text-sm">{errors["billingAddress.city"]}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-200">State *</Label>
                  <Input
                    id="state"
                    value={formData.billingAddress.state}
                    onChange={(e) => updateBillingAddress("state", e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                    placeholder="Enter state"
                  />
                  {errors["billingAddress.state"] && <p className="text-red-400 text-sm">{errors["billingAddress.state"]}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-gray-200">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={(e) => updateBillingAddress("zipCode", e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                    placeholder="Enter ZIP code"
                  />
                  {errors["billingAddress.zipCode"] && <p className="text-red-400 text-sm">{errors["billingAddress.zipCode"]}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-200">Country</Label>
                  <Select value={formData.billingAddress.country} onValueChange={(value) => updateBillingAddress("country", value)}>
                    <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-wme-gold mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Review & Submit</h2>
              <p className="text-gray-400">Please review your information</p>
            </div>
            
            {/* Summary of all information */}
            <div className="space-y-4">
              <Card className="bg-black/20 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  {formData.company && <p><strong>Company:</strong> {formData.company}</p>}
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p><strong>Type:</strong> {formData.eventType}</p>
                  <p><strong>Title:</strong> {formData.eventTitle}</p>
                  <p><strong>Date:</strong> {formData.eventDate ? format(formData.eventDate, "PPP") : "Not selected"}</p>
                  <p><strong>Location:</strong> {formData.eventLocation}</p>
                  <p><strong>Duration:</strong> {formData.eventDuration}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Artist & Budget</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p><strong>Artist:</strong> {formData.artistName}</p>
                  <p><strong>Category:</strong> {formData.artistCategory}</p>
                  <p><strong>Budget:</strong> {formData.budgetRange}</p>
                  <p><strong>Payment:</strong> {formData.paymentMethod}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hearAboutUs" className="text-gray-200">How did you hear about us?</Label>
                <Select value={formData.hearAboutUs} onValueChange={(value) => updateFormData("hearAboutUs", value)}>
                  <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search-engine">Search Engine</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="industry-contact">Industry Contact</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes" className="text-gray-200">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData("additionalNotes", e.target.value)}
                  className="bg-black/20 border-gray-600 text-white"
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t border-gray-600 pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="termsAccepted" className="text-gray-200 text-sm">
                    I accept the <Link to="/terms" className="text-wme-gold hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-wme-gold hover:underline">Privacy Policy</Link> *
                  </Label>
                </div>
              </div>
              {errors.termsAccepted && <p className="text-red-400 text-sm">{errors.termsAccepted}</p>}

              {errors.submit && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => updateFormData("marketingConsent", checked)}
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="marketingConsent" className="text-gray-200 text-sm">
                    I would like to receive marketing communications from WME
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-wme-gold/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-wme-gold rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">WME</h1>
                <p className="text-xs text-wme-gold">Booking Request</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-wme-gold" />
                <span>Secure Form</span>
              </div>
              <Link to="/">
                <Button variant="outline" size="sm" className="border-wme-gold text-wme-gold hover:bg-wme-gold hover:text-black">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-10 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-white">Booking Request Form</h1>
              <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-wme-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <Card className="bg-white/5 backdrop-blur-sm border-wme-gold/20">
            <CardContent className="p-8">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-600">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    className="bg-wme-gold text-black hover:bg-wme-gold/90"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-wme-gold text-black hover:bg-wme-gold/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
