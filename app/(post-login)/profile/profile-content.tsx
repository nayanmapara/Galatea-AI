"use client"

import { useState } from "react"
import Image from "next/image"
import { Camera, Edit3, Save, X, Plus, Trash2, Crown, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserProfile {
  name: string
  age: number
  location: string
  bio: string
  interests: string[]
  personalityTraits: string[]
  lookingFor: string[]
  preferredAgeRange: [number, number]
  preferredPersonalities: string[]
  profileImage: string
  additionalImages: string[]
}

export function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Chen",
    age: 28,
    location: "San Francisco, CA",
    bio: "Tech enthusiast who loves deep conversations about AI, philosophy, and the future. Looking for an AI companion who can challenge my thinking and share in my curiosity about the world.",
    interests: ["Technology", "Philosophy", "Sci-Fi", "Gaming", "Art", "Music"],
    personalityTraits: ["Curious", "Analytical", "Creative", "Empathetic", "Adventurous"],
    lookingFor: ["Intellectual Conversations", "Emotional Support", "Creative Collaboration", "Daily Companionship"],
    preferredAgeRange: [22, 35],
    preferredPersonalities: ["Analytical", "Creative", "Supportive", "Witty"],
    profileImage: "/placeholder.svg?height=400&width=400",
    additionalImages: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const addInterest = (interest: string) => {
    if (interest && !editedProfile.interests.includes(interest)) {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, interest],
      })
    }
  }

  const removeInterest = (interest: string) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter((i) => i !== interest),
    })
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "preferences", label: "Preferences" },
    { id: "subscription", label: "Subscription" },
  ]

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-galatea-gray text-white rounded-lg hover:bg-galatea-gray-light transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-galatea-cyan text-galatea-darker rounded-lg hover:bg-galatea-cyan-light transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-galatea-cyan text-galatea-darker rounded-lg hover:bg-galatea-cyan-light transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-galatea-gray mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3 font-medium transition-colors",
              activeTab === tab.id
                ? "text-galatea-cyan border-b-2 border-galatea-cyan"
                : "text-gray-400 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-galatea-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 card-glow">
                  <Image src={profile.profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                {isEditing && <button className="text-galatea-cyan hover:text-galatea-cyan-light">Change Photo</button>}
              </div>

              {/* Basic Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full bg-galatea-gray border border-galatea-gray-light rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-galatea-cyan"
                      />
                    ) : (
                      <p className="text-white text-lg">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedProfile.age}
                        onChange={(e) => setEditedProfile({ ...editedProfile, age: Number.parseInt(e.target.value) })}
                        className="w-full bg-galatea-gray border border-galatea-gray-light rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-galatea-cyan"
                      />
                    ) : (
                      <p className="text-white text-lg">{profile.age}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      className="w-full bg-galatea-gray border border-galatea-gray-light rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-galatea-cyan"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.location}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      rows={4}
                      className="w-full bg-galatea-gray border border-galatea-gray-light rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-galatea-cyan resize-none"
                    />
                  ) : (
                    <p className="text-gray-300">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-galatea-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editedProfile.interests : profile.interests).map((interest, index) => (
                <span
                  key={index}
                  className="bg-galatea-cyan/20 text-galatea-cyan px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {interest}
                  {isEditing && (
                    <button onClick={() => removeInterest(interest)}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    const interest = prompt("Add new interest:")
                    if (interest) addInterest(interest)
                  }}
                  className="bg-galatea-gray text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-galatea-gray-light"
                >
                  <Plus className="w-3 h-3" />
                  Add Interest
                </button>
              )}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-galatea-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Personality Traits</h2>
            <div className="flex flex-wrap gap-2">
              {profile.personalityTraits.map((trait, index) => (
                <span
                  key={index}
                  className="bg-galatea-cyan/10 border border-galatea-cyan text-galatea-cyan px-3 py-1 rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Photos */}
          <div className="bg-galatea-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Additional Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.additionalImages.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden card-glow">
                  <Image src={image || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                  {isEditing && (
                    <div className="absolute top-2 right-2">
                      <button className="bg-red-500 text-white p-1 rounded-full">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="aspect-square border-2 border-dashed border-galatea-gray rounded-lg flex items-center justify-center">
                  <button className="text-galatea-cyan">
                    <Plus className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-8">
          <div className="bg-galatea-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">AI Companion Preferences</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">What are you looking for?</label>
                <div className="flex flex-wrap gap-2">
                  {profile.lookingFor.map((item, index) => (
                    <span key={index} className="bg-galatea-cyan/20 text-galatea-cyan px-3 py-1 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Age Range</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="18" max="50" value={profile.preferredAgeRange[0]} className="flex-1" />
                  <span className="text-white">
                    {profile.preferredAgeRange[0]} - {profile.preferredAgeRange[1]}
                  </span>
                  <input type="range" min="18" max="50" value={profile.preferredAgeRange[1]} className="flex-1" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Personalities</label>
                <div className="flex flex-wrap gap-2">
                  {profile.preferredPersonalities.map((personality, index) => (
                    <span
                      key={index}
                      className="bg-galatea-cyan/10 border border-galatea-cyan text-galatea-cyan px-3 py-1 rounded-full text-sm"
                    >
                      {personality}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === "subscription" && (
        <div className="space-y-8">
          <div className="bg-galatea-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Current Plan</h2>
            <div className="flex items-center justify-between p-4 bg-galatea-gray rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-white">Free Plan</h3>
                <p className="text-gray-400">5 matches per day, basic features</p>
              </div>
              <button className="bg-galatea-cyan text-galatea-darker px-4 py-2 rounded-lg font-medium hover:bg-galatea-cyan-light transition-colors">
                Upgrade
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-galatea-dark rounded-xl p-6 border border-galatea-cyan/30">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-galatea-cyan" />
                <h3 className="text-lg font-semibold text-white">Premium</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                $9.99<span className="text-sm text-gray-400">/month</span>
              </p>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>• Unlimited matches</li>
                <li>• Advanced AI personalities</li>
                <li>• Priority matching</li>
                <li>• Read receipts</li>
              </ul>
              <button className="w-full bg-galatea-cyan text-galatea-darker py-2 rounded-lg font-medium hover:bg-galatea-cyan-light transition-colors">
                Choose Premium
              </button>
            </div>

            <div className="bg-galatea-dark rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">Elite</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                $19.99<span className="text-sm text-gray-400">/month</span>
              </p>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>• Everything in Premium</li>
                <li>• Custom AI personalities</li>
                <li>• Voice conversations</li>
                <li>• Video calls</li>
                <li>• 24/7 priority support</li>
              </ul>
              <button className="w-full bg-yellow-500 text-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
                Choose Elite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
