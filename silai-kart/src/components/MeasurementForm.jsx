import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Save, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';

const MeasurementForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [measurements, setMeasurements] = useState({
    // Basic measurements
    bust: '',
    waist: '',
    hip: '',
    // Length measurements
    kurtiLength: '',
    sleeveLength: '',
    shoulderWidth: '',
    // Bottom measurements
    bottomLength: '',
    bottomWidth: '',
    // Additional measurements
    neckDepth: '',
    armhole: '',
    specialRequests: ''
  });

  const steps = [
    {
      id: 1,
      title: 'Basic Measurements',
      description: 'Bust, waist, and hip measurements',
      videoUrl: '/videos/basic-measurements.mp4',
      fields: ['bust', 'waist', 'hip']
    },
    {
      id: 2,
      title: 'Length Measurements',
      description: 'Kurti length, sleeve length, and shoulder width',
      videoUrl: '/videos/length-measurements.mp4',
      fields: ['kurtiLength', 'sleeveLength', 'shoulderWidth']
    },
    {
      id: 3,
      title: 'Bottom Measurements',
      description: 'Bottom length and width measurements',
      videoUrl: '/videos/bottom-measurements.mp4',
      fields: ['bottomLength', 'bottomWidth']
    },
    {
      id: 4,
      title: 'Additional Details',
      description: 'Neck depth, armhole, and special requests',
      videoUrl: '/videos/additional-measurements.mp4',
      fields: ['neckDepth', 'armhole', 'specialRequests']
    }
  ];

  const measurementLabels = {
    bust: 'Bust/Chest (inches)',
    waist: 'Waist (inches)',
    hip: 'Hip (inches)',
    kurtiLength: 'Kurti Length (inches)',
    sleeveLength: 'Sleeve Length (inches)',
    shoulderWidth: 'Shoulder Width (inches)',
    bottomLength: 'Bottom Length (inches)',
    bottomWidth: 'Bottom Width (inches)',
    neckDepth: 'Neck Depth (inches)',
    armhole: 'Armhole (inches)',
    specialRequests: 'Special Requests'
  };

  const measurementTips = {
    bust: 'Measure around the fullest part of your bust',
    waist: 'Measure around your natural waistline',
    hip: 'Measure around the fullest part of your hips',
    kurtiLength: 'Measure from shoulder to desired length',
    sleeveLength: 'Measure from shoulder to wrist',
    shoulderWidth: 'Measure from shoulder point to shoulder point',
    bottomLength: 'Measure from waist to desired bottom length',
    bottomWidth: 'Measure around the widest part of bottom',
    neckDepth: 'Measure from shoulder to desired neckline depth',
    armhole: 'Measure around the armpit area',
    specialRequests: 'Any specific requirements or modifications'
  };

  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('measurementDraft', JSON.stringify(measurements));
    alert('Measurements saved as draft!');
  };

  const handleSubmit = () => {
    console.log('Submitting measurements:', measurements);
    // Navigate to cart or checkout
  };

  const isStepComplete = () => {
    return currentStepData.fields.every(field => {
      if (field === 'specialRequests') return true; // Optional field
      return measurements[field] && measurements[field].trim() !== '';
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/product/1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Product
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Measurement Guide</h1>
          <p className="text-muted-foreground">
            Follow our step-by-step video guide to get accurate measurements for your perfect fit
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {steps.map((step) => (
            <Card
              key={step.id}
              className={`cursor-pointer transition-all ${
                currentStep === step.id
                  ? 'border-primary shadow-md'
                  : currentStep > step.id
                  ? 'border-accent bg-accent/10'
                  : 'border-muted'
              }`}
              onClick={() => setCurrentStep(step.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                  currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > step.id
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.id}
                </div>
                <div className="text-sm font-medium">{step.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Video Guide: {currentStepData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-white text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                    <p className="text-lg">Measurement Video Guide</p>
                    <p className="text-sm opacity-70">{currentStepData.description}</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  >
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1 bg-white/20 rounded-full h-1">
                    <div className="bg-white rounded-full h-1 w-1/3"></div>
                  </div>
                  <span className="text-white text-xs">2:30</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">📏 <strong>Tips for accurate measurements:</strong></p>
                <ul className="space-y-1 text-xs">
                  <li>• Use a flexible measuring tape</li>
                  <li>• Wear well-fitted undergarments</li>
                  <li>• Stand straight and relaxed</li>
                  <li>• Ask someone to help you measure</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Measurement Form */}
          <Card>
            <CardHeader>
              <CardTitle>{currentStepData.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStepData.fields.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-sm font-medium">
                    {measurementLabels[field]}
                  </Label>
                  {field === 'specialRequests' ? (
                    <Textarea
                      id={field}
                      placeholder="Any specific requirements or modifications..."
                      value={measurements[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      id={field}
                      type="number"
                      step="0.5"
                      placeholder="Enter measurement"
                      value={measurements[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    💡 {measurementTips[field]}
                  </p>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep === steps.length ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepComplete()}
                      className="flex-1 btn-traditional"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepComplete()}
                      className="flex-1 btn-traditional"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Use Saved Measurements
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Measurement Summary */}
        {currentStep === steps.length && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Measurement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(measurements).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-sm font-medium">{measurementLabels[key]}:</span>
                      <span className="text-sm">{key === 'specialRequests' ? value.substring(0, 20) + '...' : value + '"'}</span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MeasurementForm;

