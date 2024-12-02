'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Cookies from 'js-cookie'

export function ProfileSetupForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    interests: '',
    bio: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Load profile data from cookies on component mount
    const savedProfile = Cookies.get('userProfile')
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save profile data to cookies
    Cookies.set('userProfile', JSON.stringify(formData), { expires: 365 }) // Expires in 1 year
    console.log('Profile saved:', formData)
    setIsSubmitted(true)
  }

  const genderOptions = [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'other', label: 'Other' }
  ]

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-green-100 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Profile Saved Successfully!</h2>
        <p className="text-green-700 mb-4">Thank you for setting up your profile, {formData.name}.</p>
        <Button onClick={() => setIsSubmitted(false)} className="bg-green-500 hover:bg-green-600 text-white">
          Edit Profile
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-ivory-100 bg-opacity-70 rounded-lg shadow-xl p-8">
      <h2 className="text-3xl font-bold text-earth-800 mb-6">Create Your Profile</h2>
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-ivory-200" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required className="bg-ivory-200" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={genderOptions}
          className="bg-ivory-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="occupation">Occupation</Label>
        <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} className="bg-ivory-200" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Input id="interests" name="interests" value={formData.interests} onChange={handleChange} className="bg-ivory-200" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          value={formData.bio} 
          onChange={handleChange} 
          className="bg-ivory-200" 
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>
      
      <Button type="submit" className="w-full bg-rose-600 text-ivory-100 hover:bg-rose-700">
        Save Profile
      </Button>
    </form>
  )
}

