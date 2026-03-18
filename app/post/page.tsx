'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, Camera, Calendar, MapPin, DollarSign, Users, FileText, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EventCategory, AgeGroup } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import BottomNav from '@/components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

interface EventFormData {
  imageUrl: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  city: string;
  neighborhood: string;
  price: number | null;
  isFree: boolean;
  ageGroup: AgeGroup;
  description: string;
  maxGroupSize?: number;
  vibesTags: string[];
}

const categories: EventCategory[] = [
  'Food & Drink',
  'Nightlife',
  'Fitness',
  'Outdoors',
  'Arts & Culture',
  'Music',
  'Networking',
  'Wellness',
  'Sports',
  'Pop-ups & Markets',
];

const cities = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Miami',
  'Austin',
  'San Francisco',
  'Lexington',
];

const neighborhoods = {
  'New York': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
  'Los Angeles': ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'Downtown'],
  'Chicago': ['The Loop', 'Lincoln Park', 'Wicker Park', 'River North', 'Lakeview'],
  'Miami': ['South Beach', 'Wynwood', 'Brickell', 'Little Havana', 'Coral Gables'],
  'Austin': ['Downtown', 'South Austin', 'East Austin', 'West Lake Hills', 'Barton Hills'],
  'San Francisco': ['SOMA', 'Mission', 'Castro', 'Nob Hill', 'Haight-Ashbury'],
  'Lexington': ['Downtown', 'Chevy Chase', 'Aylesford', 'Bell Court', 'Hartland'],
};

const ageGroups: AgeGroup[] = ['All ages', '21+', '25+'];

const vibesOptions = [
  'Casual', 'Professional', 'Creative', 'Energetic', 'Relaxing', 'Social',
  'Educational', 'Interactive', 'Competitive', 'Collaborative', 'Intimate', 'Large Group'
];

export default function PostEventPage() {
  const router = useRouter();
  const { state, addEvent } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    imageUrl: '',
    title: '',
    category: 'Food & Drink',
    date: '',
    time: '',
    city: state.selectedCity || 'New York',
    neighborhood: '',
    price: null,
    isFree: true,
    ageGroup: 'All ages',
    description: '',
    maxGroupSize: undefined,
    vibesTags: [],
  });

  const totalSteps = 7;

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      // For now, we'll use a placeholder
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormData({ imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create event data in the format expected by addEvent
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        hostId: 'current', // Current user is the host
        imageUrl: formData.imageUrl,
        date: formData.date,
        time: formData.time,
        location: {
          city: formData.city,
          neighborhood: formData.neighborhood,
          coordinates: {
            lat: 40.7128, // Mock coordinates - in real app would geocode
            lng: -74.0060,
          },
        },
        price: formData.isFree ? null : formData.price,
        ageGroup: formData.ageGroup,
        vibesTags: formData.vibesTags,
      };

      // Add the event to the feed
      const newEvent = addEvent(eventData);
      console.log('Event created successfully:', newEvent);

      // Simulate brief loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to home page to see the new event
      router.push('/');
    } catch (error) {
      console.error('Error creating event:', error);
      // In a real app, would show error message to user
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.imageUrl !== '';
      case 2:
        return formData.title.trim() !== '';
      case 3:
        return formData.date !== '' && formData.time !== '' && formData.city !== '' && formData.neighborhood !== '';
      case 4:
        return true; // Price step is always valid (can be free)
      case 5:
        return true; // Age group is always valid (has default value)
      case 6:
        return formData.description.trim() !== '';
      case 7:
        return true; // Preview step
      default:
        return false;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : isCompleted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div className={`w-8 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Camera className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Add Event Photo</h2>
              <p className="text-muted">Choose a compelling photo that showcases your event</p>
            </div>

            {formData.imageUrl ? (
              <div className="relative w-full h-64 bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                  src={formData.imageUrl}
                  alt="Event preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <label className="bg-white/90 text-text px-4 py-2 rounded-xl cursor-pointer font-semibold">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <label className="block">
                  <span className="text-primary font-semibold text-lg cursor-pointer">Click to upload</span>
                  <span className="block text-muted mt-1">or drag and drop</span>
                  <span className="block text-muted text-sm mt-2">PNG, JPG, GIF up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Event Details</h2>
              <p className="text-muted">Give your event a catchy title and select the right category</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="e.g., Wine Tasting in SoHo"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Category *</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => updateFormData({ category })}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                        formData.category === category
                          ? 'bg-primary text-white border-primary'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Calendar className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">When & Where</h2>
              <p className="text-muted">Set the date, time, and location for your event</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormData({ date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateFormData({ time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value, neighborhood: '' })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Neighborhood *</label>
                <select
                  value={formData.neighborhood}
                  onChange={(e) => updateFormData({ neighborhood: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                  disabled={!formData.city}
                >
                  <option value="">Select neighborhood</option>
                  {formData.city && neighborhoods[formData.city as keyof typeof neighborhoods]?.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <DollarSign className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Pricing</h2>
              <p className="text-muted">Set your event price or make it free</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={(e) => updateFormData({
                    isFree: e.target.checked,
                    price: e.target.checked ? null : 0
                  })}
                  className="w-5 h-5 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="isFree" className="text-text font-semibold">
                  This is a free event
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Price per person</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Consider keeping prices reasonable to encourage attendance
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Maximum Group Size (optional)</label>
                <input
                  type="number"
                  value={formData.maxGroupSize || ''}
                  onChange={(e) => updateFormData({ maxGroupSize: parseInt(e.target.value) || undefined })}
                  placeholder="No limit"
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Leave blank for unlimited attendees
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Users className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Age Group</h2>
              <p className="text-muted">Who is this event designed for?</p>
            </div>

            <div className="space-y-4">
              {ageGroups.map((ageGroup) => (
                <button
                  key={ageGroup}
                  onClick={() => updateFormData({ ageGroup })}
                  className={`w-full px-6 py-4 rounded-2xl text-left font-semibold transition-all border ${
                    formData.ageGroup === ageGroup
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{ageGroup}</span>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      formData.ageGroup === ageGroup
                        ? 'border-white bg-white'
                        : 'border-gray-300'
                    }`}>
                      {formData.ageGroup === ageGroup && (
                        <div className="w-full h-full rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <label className="block text-sm font-semibold text-text mb-2">Event Vibes (optional)</label>
              <div className="grid grid-cols-3 gap-2">
                {vibesOptions.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => {
                      const newVibes = formData.vibesTags.includes(vibe)
                        ? formData.vibesTags.filter(v => v !== vibe)
                        : [...formData.vibesTags, vibe];
                      updateFormData({ vibesTags: newVibes });
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      formData.vibesTags.includes(vibe)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Description</h2>
              <p className="text-muted">Tell people what makes your event special</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Event Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Describe what attendees can expect, what to bring, meeting point, etc."
                rows={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all resize-none"
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Tips for a great description:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Include what attendees will do or learn</li>
                <li>• Mention what to bring or wear</li>
                <li>• Specify meeting location if needed</li>
                <li>• Add any special requirements</li>
              </ul>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Eye className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Preview & Publish</h2>
              <p className="text-muted">Review your event details before publishing</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Event Preview Card */}
              <div className="relative w-full h-48">
                <Image
                  src={formData.imageUrl || '/placeholder-event.jpg'}
                  alt={formData.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-primary/90 text-white rounded-xl text-xs font-semibold">
                    {formData.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1.5 bg-white/90 rounded-xl text-sm font-bold text-text">
                    {formData.isFree ? 'Free' : `$${formData.price}`}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-xl text-text mb-3">{formData.title}</h3>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">
                    {new Date(formData.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })} • {formData.time}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span>{formData.neighborhood}, {formData.city}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3">{formData.description}</p>

                {formData.vibesTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.vibesTags.map((vibe) => (
                      <span
                        key={vibe}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Ready to publish!</h4>
                  <p className="text-sm text-green-800">
                    Your event will be visible to Gaggle users in {formData.city} immediately after publishing.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="md:pl-72 pb-24 md:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => currentStep === 1 ? router.back() : prevStep()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-text" />
              </button>

              <div className="text-center">
                <h1 className="text-lg font-bold text-text">Create Event</h1>
                <p className="text-xs text-muted">Step {currentStep} of {totalSteps}</p>
              </div>

              <div className="w-10" /> {/* Spacer */}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <StepIndicator />

            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-12">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <button
                onClick={currentStep === totalSteps ? handleSubmit : nextStep}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                  canProceed()
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>{currentStep === totalSteps ? 'Publish Event' : 'Next'}</span>
                {currentStep < totalSteps && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}